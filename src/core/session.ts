import { retainedArea, areaDefinition, enterArea } from './expeditions';
import { roomAt } from './generation';
import { z } from 'zod';
import { trialSchema } from './combat-model';
import type { CombatEvent } from './combat-model';
import {
  createBattle,
  beginAction,
  combatMovement,
  stepBattle,
  combatView,
  nearestDrop,
} from './combat';
import { resolveDeathLoss, PRACTICE_LOSS_POLICY } from './death-loss';
import type { ContentRegistry } from '../content/schemas';
import { copyData, freezeData } from './data';
import { saveSchema, heroSchema, directionSchema, positionSchema } from './model';
import type { HeroId, Position, SaveState } from './model';
import { allocatedId } from './ids';
import { entityIdSchema, toolIdSchema } from './ids';
import type { WorldRegistry, Interaction } from './world';
import { targetInReach, solidEntriesFor } from './world';
import { footRect, freeFoot, overlaps, segmentBlocked } from './motion';
import type { Region } from './model';
import type { EntityId, InstanceId, ItemInstanceId } from './ids';
import { RandomStreams } from './random';
import type { RandomStream } from './random';
import { assertWorldInvariants } from './invariants';
import { PauseReasons, pauseReasonSchema, calendarView, frameBudget, STEP_MS } from './time';
import type { PauseReason } from './time';

export const coreCommandSchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('pause.set'), reason: pauseReasonSchema, active: z.boolean() }),
  z.strictObject({ type: z.literal('appearance.set'), hero: heroSchema }),
  z.strictObject({ type: z.literal('calendar.sleep'), expectedDay: z.number().int().positive() }),
  z.strictObject({ type: z.literal('world.interact'), target: entityIdSchema.nullable() }),
  z.strictObject({ type: z.literal('interaction.dismiss') }),
  z.strictObject({ type: z.literal('combat.start'), trial: trialSchema }),
  z.strictObject({
    type: z.literal('combat.action'),
    action: z.enum(['sword', 'roll', 'bow']),
    facing: directionSchema.nullable(),
  }),
  z.strictObject({ type: z.literal('combat.guard'), active: z.boolean() }),
  z.strictObject({ type: z.literal('combat.collect'), dropId: z.string() }),
  z.strictObject({ type: z.literal('combat.respawn'), deathId: z.number().int().positive() }),
]);
export type CoreCommand = z.infer<typeof coreCommandSchema>;
export type CoreResult =
  | { ok: true }
  | {
      ok: false;
      code: 'invalid-command' | 'paused' | 'stale-command' | 'busy' | 'unavailable';
      message: string;
    };
type EventBody =
  | { type: 'pause.changed'; paused: boolean; reasons: readonly PauseReason[] }
  | { type: 'player.appearance-changed'; hero: HeroId }
  | { type: 'calendar.day-started'; day: number; cause: 'rollover' | 'sleep' };
type WorldEvent =
  { type: 'world.region-entered'; regionId: string } | { type: 'interaction.changed' };
export type DomainEvent = (EventBody | WorldEvent | CombatEvent) & {
  sequence: number;
  tick: number;
};
export interface StepContext {
  readonly tick: number;
  readonly stepMs: number;
  readonly position: Readonly<Position>;
  readonly facing: z.infer<typeof directionSchema>;
  readonly movementSpeedPixelsPerSecond: number;
  readonly regionId: string;
}
export interface ResolvedMovement {
  position: Position;
  facing: z.infer<typeof directionSchema>;
}
export type MovementResolver = (context: StepContext) => ResolvedMovement;
const movementSchema = z.strictObject({ position: positionSchema, facing: directionSchema });
interface CoreSnapshot {
  readonly hero: HeroId;
  readonly paused: boolean;
  readonly pauseReasons: readonly PauseReason[];
  readonly calendar: Readonly<ReturnType<typeof calendarView>>;
  readonly region: { id: string; name: string };
  readonly nearby: { id: EntityId; label: string; kind: string } | null;
  readonly message: { title: string; body: string } | null;
  readonly carrying: boolean;
  readonly swimming: boolean;
  readonly transitionSequence: number;
  readonly expedition: ReturnType<GameSession['expeditionView']>;
  readonly combat: ReturnType<typeof combatView> | null;
}
/** The sole owner of serializable state, random streams and gameplay time. */
export class GameSession {
  private state: SaveState;
  private random: RandomStreams;
  private pauses = new PauseReasons();
  private events: DomainEvent[] = [];
  private cached: CoreSnapshot | undefined;
  private busy = false;
  private message: CoreSnapshot['message'] = null;
  private transitionSequence = 0;
  readonly content: ContentRegistry;
  constructor(
    input: unknown,
    content: ContentRegistry,
    private world?: WorldRegistry,
  ) {
    this.content = content;
    this.state = saveSchema.parse(input);
    assertWorldInvariants(this.state, content);
    this.random = new RandomStreams(this.state.world.seed, this.state.random);
    if (this.state.combat?.death?.phase === 'pending') this.pauses.set('death', true);
    for (const combat of [
      ...this.state.world.savedCombats,
      ...(this.state.combat ? [this.state.combat] : []),
    ]) {
      if (!world) throw new Error('Combat checkpoints require collision geometry');
      const definition = areaDefinition(this.state, world, combat.regionId, combat.instanceId);
      const area = retainedArea(this.state, combat.regionId, combat.instanceId);
      // Opened gates can close neither around actors nor at checkpoint continuation.
      const solids = solidEntriesFor(definition, area).map((s) => s.rect);
      for (const enemy of combat.enemies)
        if (
          ![enemy.position, enemy.home].every((p) =>
            freeFoot(p, definition.width, definition.height, solids),
          )
        )
          throw new Error('Combat actor spawned inside a solid');
    }
    if (
      world &&
      !freeFoot(
        this.state.player.actor.position,
        this.regionDefinition.width,
        this.regionDefinition.height,
        this.solids,
      )
    )
      throw new Error('Player spawned inside a solid');
  }
  get snapshot(): CoreSnapshot {
    const calendar = calendarView(this.state.calendar, this.state.timeRules),
      reasons = this.pauses.snapshot();
    const target = this.nearestTarget();
    const expedition = this.expeditionView();
    const combat = this.state.combat
      ? combatView(
          this.state.combat,
          this.state.player.actor,
          this.tick,
          this.battleActive,
          this.state.player.carried.money,
        )
      : null;
    if (
      !this.cached ||
      JSON.stringify(this.cached.expedition) !== JSON.stringify(expedition) ||
      this.cached.hero !== this.state.player.hero ||
      this.cached.pauseReasons.join(',') !== reasons.join(',') ||
      this.cached.calendar.day !== calendar.day ||
      this.cached.calendar.minuteOfDay !== calendar.minuteOfDay ||
      this.cached.region.id !== this.state.player.regionId ||
      this.cached.transitionSequence !== this.transitionSequence ||
      this.cached.nearby?.id !== target?.id ||
      this.cached.nearby?.label !== target?.label ||
      this.cached.message !== this.message ||
      this.cached.carrying !== !!this.state.player.carrying ||
      this.cached.swimming !== this.swimming ||
      JSON.stringify(this.cached.combat) !== JSON.stringify(combat)
    )
      this.cached = freezeData({
        hero: this.state.player.hero,
        paused: this.pauses.paused,
        pauseReasons: reasons,
        calendar,
        region: {
          id: this.state.player.regionId,
          name: this.world ? this.regionDefinition.name : 'Wayfarer’s clearing',
        },
        nearby: target ? { id: target.id, label: target.label, kind: target.kind } : null,
        message: this.message,
        carrying: !!this.state.player.carrying,
        swimming: this.swimming,
        transitionSequence: this.transitionSequence,
        combat,
        expedition,
      });
    return this.cached;
  }
  get actor() {
    return freezeData(copyData(this.state.player.actor));
  }
  get tick() {
    return this.state.clock.tick;
  }
  private emit(event: EventBody | WorldEvent | CombatEvent): void {
    this.events.push(
      freezeData({
        ...event,
        sequence: ++this.state.clock.eventSequence,
        tick: this.state.clock.tick,
      }),
    );
  }
  consumeEvents(): readonly DomainEvent[] {
    const events = Object.freeze(this.events);
    this.events = [];
    return events;
  }
  dispatch(input: unknown): CoreResult {
    if (this.busy) return { ok: false, code: 'busy', message: 'A gameplay step is in progress.' };
    const parsed = coreCommandSchema.safeParse(input);
    if (!parsed.success)
      return { ok: false, code: 'invalid-command', message: 'The command has invalid fields.' };
    const command = parsed.data;
    if (command.type.startsWith('combat.')) return this.combatCommand(command);
    if (command.type === 'pause.set') {
      if (command.active && this.state.combat) this.state.combat.guard = false;
      if (this.pauses.set(command.reason, command.active))
        this.emit({
          type: 'pause.changed',
          paused: this.pauses.paused,
          reasons: this.pauses.snapshot(),
        });
    } else if (command.type === 'appearance.set') {
      if (this.state.player.hero !== command.hero) {
        this.state.player.hero = command.hero;
        this.emit({ type: 'player.appearance-changed', hero: command.hero });
      }
    } else if (command.type === 'interaction.dismiss') {
      this.message = null;
      if (this.pauses.set('interaction', false))
        this.emit({
          type: 'pause.changed',
          paused: this.pauses.paused,
          reasons: this.pauses.snapshot(),
        });
      this.emit({ type: 'interaction.changed' });
    } else if (command.type === 'world.interact') {
      return this.interact(command.target);
    } else if (command.type === 'calendar.sleep') {
      if (this.battleActive)
        return { ok: false, code: 'unavailable', message: 'Return to the village before resting.' };
      if (this.pauses.paused)
        return { ok: false, code: 'paused', message: 'Resume the clearing before resting.' };
      if (command.expectedDay !== this.state.calendar.day)
        return { ok: false, code: 'stale-command', message: 'The day has already changed.' };
      if (this.state.calendar.day >= 1000000)
        return {
          ok: false,
          code: 'invalid-command',
          message: 'The calendar has reached its supported limit.',
        };
      this.startDay('sleep');
      // A prior fractional gameplay step must not spill into a fresh day.
      this.state.clock.remainderMs = 0;
    }
    return { ok: true };
  }
  private startDay(cause: 'sleep' | 'rollover') {
    this.state.calendar = { day: this.state.calendar.day + 1, elapsedTicks: 0 };
    this.emit({ type: 'calendar.day-started', day: this.state.calendar.day, cause });
  }
  advance(
    elapsedMs: number,
    resolve?: MovementResolver,
  ): { steps: number; simulatedMs: number; droppedMs: number } {
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0) throw new Error('Invalid frame duration');
    if (this.busy) throw new Error('Reentrant gameplay step');
    if (this.pauses.paused) return { steps: 0, simulatedMs: 0, droppedMs: elapsedMs };
    const budget = frameBudget(elapsedMs, this.state.clock.remainderMs);
    this.busy = true;
    try {
      for (let i = 0; i < budget.steps; i++) {
        const actor = this.state.player.actor;
        const context = freezeData({
          tick: this.state.clock.tick + 1,
          stepMs: STEP_MS,
          position: { ...actor.position },
          facing: actor.facing,
          movementSpeedPixelsPerSecond:
            actor.stats.movementSpeedPixelsPerSecond *
            (this.battleActive && this.state.combat?.guard ? 0.35 : 1),
          regionId: this.state.player.regionId,
        });
        const desired = movementSchema.parse(
          resolve ? resolve(context) : { position: context.position, facing: context.facing },
        );
        const battle = this.battleContext(this.tick + 1);
        const movement = battle ? combatMovement(battle, desired) : desired;
        const region = this.state.world.regions.find((r) => r.id === this.state.player.regionId);
        const geometry =
          region?.kind === 'surface' && region.phase !== 'unvisited'
            ? region.geometry
            : this.state.world.dungeons.find((d) => d.id === this.state.player.instanceId)
                ?.geometry;
        if (
          !geometry ||
          movement.position.x < 0 ||
          movement.position.y < 0 ||
          movement.position.x > geometry.width * geometry.tilePixels ||
          movement.position.y > geometry.height * geometry.tilePixels
        )
          throw new Error('Resolved movement outside active region');
        if (
          this.world &&
          !freeFoot(
            movement.position,
            this.regionDefinition.width,
            this.regionDefinition.height,
            this.solids,
          )
        )
          throw new Error('Resolved movement overlaps a solid');
        if (
          this.state.calendar.day >= 1000000 &&
          this.state.calendar.elapsedTicks + 1 === this.state.timeRules.ticksPerDay
        )
          throw new Error('Calendar limit reached');
        if (this.state.clock.tick === Number.MAX_SAFE_INTEGER)
          throw new Error('Gameplay tick limit reached');
        // Movement is committed once. Core never integrates an adapter's velocity again.
        actor.position = movement.position;
        actor.facing = movement.facing;
        this.discover();
        this.state.clock.tick++;
        actor.cooldowns = actor.cooldowns
          .map((c) => ({ ...c, remainingTicks: c.remainingTicks - 1 }))
          .filter((c) => c.remainingTicks > 0);
        actor.statuses = actor.statuses
          .map((s) => ({ ...s, remainingTicks: s.remainingTicks - 1 }))
          .filter((s) => s.remainingTicks > 0);
        this.state.calendar.elapsedTicks++;
        if (this.state.calendar.elapsedTicks === this.state.timeRules.ticksPerDay)
          this.startDay('rollover');
        if (battle) {
          stepBattle(battle);
          if (this.state.combat?.death?.phase === 'pending') {
            this.pauses.set('death', true);
            this.emit({ type: 'pause.changed', paused: true, reasons: this.pauses.snapshot() });
            this.state.clock.remainderMs = 0;
            return {
              steps: i + 1,
              simulatedMs: (i + 1) * STEP_MS,
              droppedMs: Math.max(0, elapsedMs - (i + 1) * STEP_MS),
            };
          }
        }
      }
      this.state.clock.remainderMs = budget.remainderMs;
    } finally {
      this.busy = false;
    }
    return {
      steps: budget.steps,
      simulatedMs: budget.steps * STEP_MS,
      droppedMs: budget.droppedMs,
    };
  }
  get battleActive() {
    return (
      !!this.state.combat &&
      this.state.combat.regionId === this.state.player.regionId &&
      this.state.combat.instanceId === this.state.player.instanceId
    );
  }
  get battlePresentation() {
    return this.battleActive ? freezeData(copyData(this.state.combat)) : null;
  }
  private battleContext(tick: number) {
    const state = this.state.combat;
    if (!state || !this.battleActive) return null;
    return {
      state,
      actor: this.state.player.actor,
      tick,
      width: this.regionDefinition.width,
      height: this.regionDefinition.height,
      solids: this.solids,
      emit: (event: CombatEvent) => {
        if (event.type === 'combat.enemy-defeated') {
          const dungeon = this.state.world.dungeons.find(
            (d) => d.id === this.state.player.instanceId,
          );
          if (
            dungeon?.anchor.phase === 'living' &&
            event.subject === `${dungeon.anchor.bossId}-actor`
          )
            dungeon.anchor.phase = 'defeated';
        }
        this.emit(event);
      },
    };
  }
  private combatCommand(command: CoreCommand): CoreResult {
    const s = this.state.combat,
      actor = this.state.player.actor;
    const unavailable = (message: string): CoreResult => ({
      ok: false,
      code: 'unavailable',
      message,
    });
    if (command.type === 'combat.respawn') {
      if (!s || s.death?.phase !== 'pending' || s.death.id !== command.deathId)
        return unavailable('That defeat was already resolved.');
      if (this.pauses.snapshot().some((r) => r !== 'death'))
        return unavailable('Close other menus before returning.');
      if (s.regionId !== 'region:practice' && this.world) {
        const draft = copyData(this.state),
          battle = draft.combat;
        if (!battle?.death) return unavailable('Missing defeat checkpoint.');
        battle.death.phase = 'resolved';
        draft.player.actor.resources.health.current = draft.player.actor.resources.health.maximum;
        draft.player.actor.resources.energy.current = draft.player.actor.resources.energy.maximum;
        enterArea(draft, this.world, 'region:clearing', 'start');
        assertWorldInvariants(draft, this.content);
        this.state = draft;
        this.transitionSequence++;
        this.pauses.set('death', false);
        this.emit({ type: 'world.region-entered', regionId: 'region:clearing' });
        this.emit({
          type: 'combat.player-respawned',
          subject: String(command.deathId),
          message:
            'Returned to the village with possessions retained. The dungeon instance remains anchored.',
        });
        this.emit({
          type: 'pause.changed',
          paused: this.pauses.paused,
          reasons: this.pauses.snapshot(),
        });
        return { ok: true };
      }
      const spawn = this.world?.spawn(s.regionId, 'entry');
      if (!spawn) return unavailable('The practice entrance is unavailable.');
      if (
        !freeFoot(
          spawn.position,
          this.regionDefinition.width,
          this.regionDefinition.height,
          this.solids,
        )
      )
        return unavailable('The practice entrance is blocked.');
      const loss = resolveDeathLoss(this.state.player, this.content, PRACTICE_LOSS_POLICY, () =>
        this.random.next('death'),
      );
      this.state.player.carried = loss.carried;
      s.death = {
        ...s.death,
        phase: 'resolved',
        lostItems: loss.lostItems,
        lostMoney: loss.lostMoney,
      };
      actor.position = { ...spawn.position };
      actor.facing = spawn.facing;
      actor.resources.health.current = actor.resources.health.maximum;
      actor.resources.energy.current = actor.resources.energy.maximum;
      s.action = null;
      s.guard = false;
      s.projectiles = [];
      s.invulnerableUntil = this.tick + 100;
      s.hurtUntil = 0;
      s.lastDamageTick = this.tick;
      for (const e of s.enemies)
        if (e.health > 0) {
          e.position = { ...e.home };
          e.phase = 'idle';
          e.phaseTicks = 0;
          e.path = [];
        }
      s.feedback = 'Returned to the practice entrance. Possessions retained.';
      s.feedbackUntil = this.tick + 150;
      this.state.clock.remainderMs = 0;
      this.pauses.set('death', false);
      this.emit({
        type: 'pause.changed',
        paused: this.pauses.paused,
        reasons: this.pauses.snapshot(),
      });
      this.emit({
        type: 'combat.player-respawned',
        subject: String(s.death.id),
        message: s.feedback,
      });
      return { ok: true };
    }
    if (this.pauses.paused)
      return { ok: false, code: 'paused', message: 'Close the current menu first.' };
    if (command.type === 'combat.start') {
      if (this.state.player.instanceId || this.activeArea().geometry.generated)
        return unavailable('Return to the village before starting practice.');
      if (!this.world || this.state.player.carrying)
        return unavailable('Set down the box before entering practice.');
      const destination = this.state.world.regions.find((r) => r.id === 'region:practice');
      if (!destination || destination.kind !== 'surface' || destination.phase === 'unvisited')
        return unavailable('Practice is unavailable.');
      const spawn = this.world.spawn(destination.id, 'entry');
      const definition = this.world.region(destination.id);
      const solids = this.world.solids(destination.id, destination);
      const battles = [...this.state.world.savedCombats, ...(s ? [s] : [])];
      const next = createBattle(
        command.trial,
        Math.max(
          0,
          ...battles.filter((c) => c.regionId === 'region:practice').map((c) => c.generation),
        ) + 1,
        this.tick,
      );
      next.nextSequence = Math.max(1, ...battles.map((c) => c.nextSequence));
      if (
        !freeFoot(spawn.position, definition.width, definition.height, solids) ||
        next.enemies.some(
          (enemy) => !freeFoot(enemy.position, definition.width, definition.height, solids),
        )
      )
        return unavailable('The practice entrance is blocked.');
      this.activeRegion().phase = 'dormant';
      destination.phase = 'active';
      this.state.player.regionId = destination.id;
      actor.position = { ...spawn.position };
      actor.facing = spawn.facing;
      if (!this.state.player.permanent.discoveredRegions.includes(destination.id))
        this.state.player.permanent.discoveredRegions.push(destination.id);
      actor.resources.health.current = actor.resources.health.maximum;
      actor.resources.energy.current = actor.resources.energy.maximum;
      this.state.world.savedCombats = this.state.world.savedCombats.filter(
        (c) => c.regionId !== 'region:practice',
      );
      this.state.combat = next;
      this.state.clock.remainderMs = 0;
      this.transitionSequence++;
      this.emit({ type: 'world.region-entered', regionId: destination.id });
      return { ok: true };
    }
    if (!s || !this.battleActive) return unavailable('Enter a practice trial first.');
    if (command.type === 'combat.action') {
      const error = beginAction(
        s,
        actor,
        command.action,
        this.tick,
        command.facing ?? actor.facing,
      );
      return error ? unavailable(error) : { ok: true };
    }
    if (command.type === 'combat.guard') {
      if (command.active && (s.action || this.tick < s.hurtUntil))
        return unavailable('Recover before raising the shield.');
      s.guard = command.active;
      return { ok: true };
    }
    if (command.type === 'combat.collect') {
      const drop = nearestDrop(s, actor.position);
      if (!drop || drop.id !== command.dropId || drop.claimed)
        return unavailable('Move closer to an unclaimed coin.');
      if (this.state.player.carried.money > Number.MAX_SAFE_INTEGER - drop.money)
        return unavailable('Coin capacity reached.');
      drop.claimed = true;
      this.state.player.carried.money += drop.money;
      this.emit({ type: 'combat.drop-claimed', subject: drop.id, message: 'Collected one coin.' });
      return { ok: true };
    }
    return unavailable('Unknown combat command.');
  }
  get regionDefinition() {
    if (!this.world) throw new Error('No authored world attached');
    return areaDefinition(this.state, this.world);
  }
  get regionState(): Region {
    const state = this.state.world.regions.find((r) => r.id === this.state.player.regionId);
    if (!state) throw new Error('Missing region');
    return freezeData(copyData(state));
  }
  private activeRegion() {
    const region = this.state.world.regions.find((r) => r.id === this.state.player.regionId);
    if (!region || region.kind !== 'surface' || region.phase === 'unvisited')
      throw new Error('Missing authored surface');
    return region;
  }
  private activeArea() {
    return retainedArea(this.state);
  }
  private solidEntries() {
    return solidEntriesFor(this.regionDefinition, this.activeArea());
  }
  get solids() {
    if (!this.world) return [];
    const solids = this.solidEntries().map((s) => s.rect);
    return this.state.player.carrying ? [...solids, ...this.regionDefinition.water] : solids;
  }
  get swimming(): boolean {
    return (
      !!this.world &&
      this.regionDefinition.water.some((w) =>
        overlaps(footRect(this.state.player.actor.position), w),
      )
    );
  }
  get geometry() {
    return freezeData(copyData(this.activeArea().geometry));
  }
  get worldPresentation() {
    const region = this.activeArea();
    return freezeData({
      passages: [...region.changes.openedPassages],
      claimed: [...region.changes.claimedRewards],
      objects: copyData(region.geometry.objects),
      removed: [...region.changes.removedObjects],
      opened: [...region.changes.openedObjects],
      carrying: this.state.player.carrying,
    });
  }
  private targetPosition(target: Interaction) {
    return (
      this.activeArea().geometry.objects.find((o) => o.id === target.id)?.position ??
      target.position
    );
  }
  private nearestTarget(): Interaction | null {
    if (!this.world) return null;
    if (this.state.player.carrying) {
      const target = this.regionDefinition.interactions.find(
        (t) => t.id === this.state.player.carrying,
      );
      return target ? { ...target, label: 'Set down small box' } : null;
    }
    const actor = this.state.player.actor,
      region = this.activeArea();
    const targets = this.regionDefinition.interactions.filter(
      (t) =>
        !region.changes.removedObjects.includes(t.id) &&
        targetInReach(actor.position, actor.facing, this.targetPosition(t)) &&
        !this.solidEntries().some(
          (s) => s.owner !== t.id && segmentBlocked(actor.position, this.targetPosition(t), s.rect),
        ),
    );
    targets.sort(
      (a, b) =>
        Math.hypot(
          this.targetPosition(a).x - actor.position.x,
          this.targetPosition(a).y - actor.position.y,
        ) -
          Math.hypot(
            this.targetPosition(b).x - actor.position.x,
            this.targetPosition(b).y - actor.position.y,
          ) || a.id.localeCompare(b.id, 'en'),
    );
    return targets[0] ?? null;
  }
  private interact(requested: EntityId | null): CoreResult {
    if (this.pauses.paused)
      return { ok: false, code: 'paused', message: 'Close the current menu first.' };
    if (
      this.battleActive &&
      (this.state.combat?.action || this.tick < (this.state.combat?.hurtUntil ?? 0))
    )
      return { ok: false, code: 'unavailable', message: 'Recover before interacting.' };
    const target = this.nearestTarget();
    if (!target || (requested !== null && target.id !== requested))
      return { ok: false, code: 'unavailable', message: 'Move closer and face the object.' };
    const region = this.activeArea(),
      actor = this.state.player.actor;
    if (this.state.player.carrying) {
      const dx = actor.facing === 'right' ? 18 : actor.facing === 'left' ? -18 : 0,
        dy = actor.facing === 'down' ? 18 : actor.facing === 'up' ? -18 : 0;
      const position = { x: actor.position.x + dx, y: actor.position.y + dy };
      const shape = this.regionDefinition.solids.find((s) => s.owner === target.id)?.rect;
      const original = this.regionDefinition.objects.find((o) => o.id === target.id)?.position;
      const dropped =
        shape && original
          ? { ...shape, x: shape.x + position.x - original.x, y: shape.y + position.y - original.y }
          : footRect(position);
      if (
        dropped.x < 0 ||
        dropped.y < 0 ||
        dropped.x + dropped.width > this.regionDefinition.width ||
        dropped.y + dropped.height > this.regionDefinition.height ||
        this.solids.some((s) => overlaps(dropped, s))
      )
        return {
          ok: false,
          code: 'unavailable',
          message: 'There is no clear space to set down the box.',
        };
      const object = region.geometry.objects.find((o) => o.id === target.id);
      if (!object) throw new Error('Missing carried object');
      object.position = position;
      region.changes.removedObjects = region.changes.removedObjects.filter(
        (id) => id !== target.id,
      );
      this.state.player.carrying = null;
    } else if (target.kind === 'carryable') {
      if (this.swimming)
        return {
          ok: false,
          code: 'unavailable',
          message: 'Step onto dry ground before lifting the heavy box.',
        };
      region.changes.removedObjects.push(target.id);
      this.state.player.carrying = target.id;
    } else if (
      (target.kind === 'door' || target.kind === 'portal') &&
      target.destination &&
      this.world
    ) {
      const draft = copyData(this.state);
      try {
        enterArea(draft, this.world, target.destination.regionId, target.destination.spawn);
        assertWorldInvariants(draft, this.content);
      } catch (error) {
        return {
          ok: false,
          code: 'unavailable',
          message: error instanceof Error ? error.message : 'Travel failed.',
        };
      }
      this.state = draft;
      this.discover();
      this.transitionSequence++;
      this.emit({ type: 'world.region-entered', regionId: this.state.player.regionId });
    } else if (target.kind === 'generated') {
      return this.interactGenerated(target);
    } else {
      if (target.kind === 'chest' && !region.changes.openedObjects.includes(target.id))
        region.changes.openedObjects.push(target.id);
      this.message = freezeData({ title: target.label, body: target.text });
      this.pauses.set('interaction', true);
      this.emit({ type: 'pause.changed', paused: true, reasons: this.pauses.snapshot() });
    }
    this.emit({ type: 'interaction.changed' });
    return { ok: true };
  }
  private discover() {
    const area = this.activeArea(),
      layout = area.geometry.generated;
    if (!layout) return;
    const room = roomAt(layout, this.state.player.actor.position);
    if (room !== null && !area.changes.exploredRooms.includes(room))
      area.changes.exploredRooms.push(room);
    for (const p of layout.placements)
      if (
        p.room === room &&
        ['portal', 'shortcut', 'landmark', 'secret'].includes(p.kind) &&
        !area.changes.discoveredMarkers.includes(p.id)
      )
        area.changes.discoveredMarkers.push(p.id);
  }
  expeditionView() {
    if (!this.world) return null;
    const area = this.activeArea(),
      layout = area.geometry.generated;
    if (!layout) return null;
    const instance = this.state.world.dungeons.find((d) => d.id === this.state.player.instanceId);
    return {
      seed: this.state.world.seed,
      regionalSeed: layout.seed,
      region: this.state.player.regionId,
      instance: instance?.id ?? null,
      generation: layout.generation,
      attempt: layout.attempt,
      fallback: layout.fallback,
      anchor: instance?.anchor.phase ?? null,
      tools: [...this.state.player.permanent.tools],
      rooms: layout.rooms.map((r) => ({
        id: r.id,
        column: r.column,
        row: r.row,
        explored: area.changes.exploredRooms.includes(r.id),
        tag: area.changes.exploredRooms.includes(r.id) ? r.tag : 'unknown',
      })),
      edges: layout.edges.filter(
        (e) =>
          area.changes.exploredRooms.includes(e.from) && area.changes.exploredRooms.includes(e.to),
      ),
      markers: layout.placements
        .filter((p) => area.changes.discoveredMarkers.includes(p.id))
        .map((p) => ({
          id: p.id,
          kind: p.kind,
          room: p.room,
          opened: area.changes.openedPassages.includes(p.id),
        })),
    };
  }
  private interactGenerated(target: Interaction): CoreResult {
    const area = this.activeArea(),
      layout = area.geometry.generated,
      p = layout?.placements.find((p) => p.id === target.id);
    const fail = (message: string): CoreResult => ({ ok: false, code: 'unavailable', message });
    if (!layout || !p) return fail('Missing exploration object.');
    const has = (kind: string) =>
      layout.placements.some((p) => p.kind === kind && area.changes.openedObjects.includes(p.id));
    let text: string;
    if (p.kind.startsWith('gate-') || p.kind === 'shortcut') {
      if (area.changes.openedPassages.includes(p.id)) return fail('This passage is already open.');
      const required = p.kind === 'gate-key' ? 'key' : p.kind === 'gate-switch' ? 'switch' : 'axe';
      if (
        required === 'axe'
          ? !this.state.player.permanent.tools.includes(toolIdSchema.parse('tool:axe'))
          : !has(required)
      )
        return fail(`Find the ${required} before opening this passage.`);
      area.changes.openedPassages.push(p.id);
      text =
        p.kind === 'shortcut'
          ? 'A hidden trail now joins the clearings. This shortcut will stay open.'
          : 'Passage opened. It will remain open when you return.';
    } else if (['key', 'switch', 'axe', 'resource'].includes(p.kind)) {
      if (area.changes.openedObjects.includes(p.id)) return fail('Already collected or activated.');
      if (p.kind === 'resource' && this.state.player.carried.money === Number.MAX_SAFE_INTEGER)
        return fail('Coin capacity reached.');
      area.changes.openedObjects.push(p.id);
      if (p.kind === 'axe') {
        const tool = this.content.tool(toolIdSchema.parse('tool:axe'));
        if (!tool) throw new Error('Missing route tool');
        if (!this.state.player.permanent.tools.includes(tool.id))
          this.state.player.permanent.tools.push(tool.id);
        text =
          'Trail axe acquired permanently. Fallen timber can now be cleared on every expedition.';
      } else if (p.kind === 'resource') {
        this.state.player.carried.money++;
        text =
          'Gathered supplies worth one coin. Wild supplies renew offscreen on the first visit of a later day.';
      } else
        text =
          p.kind === 'key'
            ? 'Brass key found. It opens this region’s brass gate without being consumed.'
            : 'Sun switch activated. The sun gate can now be opened.';
    } else if (p.kind === 'reward' || p.kind === 'secret') {
      if (area.changes.claimedRewards.includes(p.id))
        return fail('This reward has already been collected.');
      if (
        p.kind === 'reward' &&
        this.state.combat?.enemies.some((e) => e.kind === 'skeleton' && e.health > 0)
      )
        return fail('Defeat the anchor warden before claiming its reward.');
      if (this.state.player.carried.money > Number.MAX_SAFE_INTEGER - 5)
        return fail('Coin capacity reached.');
      area.changes.claimedRewards.push(p.id);
      this.state.player.carried.money += 5;
      text =
        p.kind === 'reward'
          ? this.state.player.instanceId
            ? 'Anchor reward collected: five coins. The occupied dungeon remains intact. After you exit, its successor can appear on your next entry.'
            : 'Warden reward collected: five coins. This surface reward stays claimed; its geography and warden remain unchanged.'
          : 'Hidden cache: five coins. This one-time discovery remains claimed.';
    } else text = target.text;
    this.message = freezeData({ title: target.label, body: text });
    this.pauses.set('interaction', true);
    this.emit({ type: 'pause.changed', paused: true, reasons: this.pauses.snapshot() });
    this.emit({ type: 'interaction.changed' });
    return { ok: true };
  }
  nextRandom(stream: RandomStream): number {
    if (this.busy) throw new Error('Random draws must be requested outside movement resolution');
    return this.random.next(stream);
  }
  allocateId(kind: 'entity'): EntityId;
  allocateId(kind: 'instance'): InstanceId;
  allocateId(kind: 'item-instance'): ItemInstanceId;
  allocateId(kind: 'entity' | 'instance' | 'item-instance') {
    if (this.busy || this.state.world.nextId === Number.MAX_SAFE_INTEGER)
      throw new Error('Cannot allocate an ID');
    const id = allocatedId(this.state.world.id, this.state.world.nextId, kind);
    this.state.world.nextId++;
    return id;
  }
  export(): SaveState {
    if (this.busy) throw new Error('Cannot checkpoint during a gameplay step');
    const data = { ...copyData(this.state), random: this.random.snapshot() };
    assertWorldInvariants(data, this.content);
    return saveSchema.parse(data);
  }
  serialize(): string {
    return JSON.stringify(this.export());
  }
}
