import {
  MERCHANT_ID,
  RESCUE_ID,
  SHOP_REGION,
  STOCK_QUEST,
  STORE_DOOR,
  VILLAGE_DIALOGUE,
} from '../content/village';
import type { VillageNode } from '../content/village';
import { villageCommandSchemas, villageCommandSchema } from './village-model';
import {
  applyVillageCommand,
  merchantRecruited,
  rescueInteraction,
  rescueRouteOpen,
  storefrontSolid,
  villageActor,
  villageView,
} from './village';
import { completedMixedTrial } from './build-model';
import {
  ABILITIES,
  ABILITY_COST,
  BUILD_REWARDS,
  rewardIdSchema,
  ENEMY_FAMILY,
} from '../content/builds';
import { TOOL_RULES } from '../content/tools';
import { TRAIL_ID } from '../content/tool-trail';
import { toolCommandSchemas, toolCommandSchema, activeToolSchema } from './tool-model';
import {
  toolCommand as applyToolCommand,
  interactTrail,
  toolSolidEntries,
  toolMovement,
  stepTools,
  toolWorldHit,
  toolsView,
  trailPresentation,
  hookPulling,
} from './tools';
import type { ToolContext } from './tools';
import type { BattleContext } from './combat';
import { COMBAT_RULES } from '../content/combat';
import {
  inventoryCommandSchemas,
  inventoryCommandSchema,
  selectedUseSchema,
} from './inventory-model';
import { inventoryTransaction, receiveItem } from './inventory';
import {
  effectiveStats,
  describeItem,
  buildEffects,
  swordFamilyBonus,
  toolEnergyCost,
} from './equipment';
import { readSaveState } from './save-state';
import { transferItem, transferMoney } from './transactions';
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
import {
  saveSchema,
  heroSchema,
  directionSchema,
  positionSchema,
  itemInstanceSchema,
} from './model';
import type { HeroId, Position, SaveState } from './model';
import { allocatedId } from './ids';
import { entityIdSchema, toolIdSchema, itemInstanceIdSchema } from './ids';
import type { WorldRegistry, Interaction } from './world';
import { targetInReach } from './world';
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
  z.strictObject({
    type: z.literal('storage.item'),
    chestId: entityIdSchema,
    direction: z.enum(['deposit', 'withdraw']),
    itemId: itemInstanceIdSchema,
    quantity: z.number().int().positive().max(999),
    expectedTransaction: z.number().int().positive().safe(),
  }),
  z.strictObject({
    type: z.literal('storage.money'),
    chestId: entityIdSchema,
    direction: z.enum(['deposit', 'withdraw']),
    amount: z.number().int().positive().safe(),
    expectedTransaction: z.number().int().positive().safe(),
  }),
  ...inventoryCommandSchemas,
  selectedUseSchema,
  ...toolCommandSchemas,
  ...villageCommandSchemas,
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
  | { type: 'world.region-entered'; regionId: string }
  | { type: 'interaction.changed' }
  | { type: 'storage.changed'; chestId: string }
  | { type: 'inventory.changed'; message: string }
  | { type: 'tools.changed'; message: string };
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
  readonly message: { title: string; body: string; villageNode?: VillageNode } | null;
  readonly village: GameSession['villageSnapshot'];
  readonly carrying: boolean;
  readonly swimming: boolean;
  readonly transitionSequence: number;
  readonly storage: GameSession['storageView'];
  readonly inventory: GameSession['inventoryView'];
  readonly tools: GameSession['toolsView'];
  readonly deathReport: GameSession['deathReport'];
  readonly lossPolicy: { materialChance: number; moneyFraction: number };
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
  private inventoryFeedback: string | null = null;
  private transitionSequence = 0;
  readonly content: ContentRegistry;
  constructor(
    input: unknown,
    content: ContentRegistry,
    private world?: WorldRegistry,
  ) {
    this.content = content;
    this.state = readSaveState(input, content);
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
      const solids = toolSolidEntries(this.state, definition, area).map((s) => s.rect);
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
    const expedition = this.expeditionView(),
      storage = this.storageView,
      deathReport = this.deathReport,
      inventory = this.inventoryView,
      tools = this.toolsView,
      village = this.villageSnapshot;
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
      JSON.stringify(this.cached.storage) !== JSON.stringify(storage) ||
      JSON.stringify(this.cached.inventory) !== JSON.stringify(inventory) ||
      JSON.stringify(this.cached.tools) !== JSON.stringify(tools) ||
      JSON.stringify(this.cached.village) !== JSON.stringify(village) ||
      (this.cached.deathReport !== deathReport &&
        JSON.stringify(this.cached.deathReport) !== JSON.stringify(deathReport)) ||
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
        storage,
        inventory,
        tools,
        village,
        deathReport,
        lossPolicy: {
          materialChance: this.state.deathRules.materialChance,
          moneyFraction: this.state.deathRules.moneyFraction,
        },
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
    if (command.type.startsWith('village.')) return this.villageCommand(command);
    if (command.type.startsWith('inventory.')) return this.inventoryCommand(command);
    if (command.type === 'tool.use') {
      if (this.state.player.carrying || this.state.tools.carriedBomb !== null)
        return this.toolCommand({ type: 'tool.throw' });
      const tool = this.state.pack.selectedTool;
      if (tool === 'shield')
        return {
          ok: false,
          code: 'unavailable',
          message: 'Hold the shield or selected-tool binding to guard.',
        };
      if (tool === 'sword' || tool === 'roll' || (tool === 'bow' && this.battleActive))
        return this.combatCommand({ type: 'combat.action', action: tool, facing: null });
      const parsed = activeToolSchema.safeParse(tool);
      return parsed.success
        ? this.toolCommand({ type: 'tool.action', tool: parsed.data })
        : { ok: false, code: 'unavailable', message: 'Select an available tool.' };
    }
    if (command.type.startsWith('tool.')) return this.toolCommand(command);
    if (command.type === 'storage.item' || command.type === 'storage.money')
      return this.storageCommand(command);
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
            effectiveStats(this.state.player, this.content).movementSpeedPixelsPerSecond *
            (this.battleActive && this.state.combat?.guard ? 0.35 : 1),
          regionId: this.state.player.regionId,
        });
        const desired = movementSchema.parse(
          resolve ? resolve(context) : { position: context.position, facing: context.facing },
        );
        const battle = this.battleContext(this.tick + 1);
        const toolResolved = this.world ? toolMovement(this.toolContext(), desired) : desired;
        const movement = battle ? combatMovement(battle, toolResolved) : toolResolved;
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
        if (this.world) stepTools(this.toolContext(this.state, battle));
        if (battle) stepBattle(battle);
        if (this.state.build.active && --this.state.build.active.remainingTicks === 0)
          this.state.build.active = null;
        if (battle && this.state.combat?.death?.phase === 'pending') {
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
      stats: effectiveStats(this.state.player, this.content),
      outgoingDamage: (kind: keyof typeof ENEMY_FAMILY, damage: number, sword: boolean) => {
        const bonus = sword
          ? swordFamilyBonus(this.state.player, this.content, ENEMY_FAMILY[kind])
          : 0;
        return (damage + bonus) * buildEffects(this.state, this.content).damageMultiplier;
      },
      tick,
      width: this.regionDefinition.width,
      height: this.regionDefinition.height,
      solids: this.solids,
      tracePlayerProjectile: (from: Position, to: Position) =>
        toolWorldHit(this.toolContext(), 'arrow', from, to),
      emit: (event: CombatEvent) => {
        if (event.type === 'combat.encounter-completed' && completedMixedTrial(state))
          this.state.build.mixedTrialCompleted = true;
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
      if (!Number.isSafeInteger(this.state.nextTransaction + 1))
        return unavailable('Transaction limit reached.');
      if (!s || s.death?.phase !== 'pending' || s.death.id !== command.deathId)
        return unavailable('That defeat was already resolved.');
      if (this.pauses.snapshot().some((r) => r !== 'death'))
        return unavailable('Close other menus before returning.');
      if (s.regionId !== 'region:practice' && this.world) {
        const draft = copyData(this.state),
          battle = draft.combat;
        if (!battle?.death) return unavailable('Missing defeat checkpoint.');
        draft.nextTransaction++;
        const deathRandom = new RandomStreams(this.state.world.seed, this.random.snapshot());
        const loss = resolveDeathLoss(draft.player, this.content, draft.deathRules, () =>
          deathRandom.next('death'),
        );
        draft.player.carried = loss.carried;
        battle.death = {
          ...battle.death,
          phase: 'resolved',
          lostItems: loss.lostItems,
          lostMoney: loss.lostMoney,
          losses: loss.losses,
        };
        draft.lastDeath = {
          deathId: battle.death.id,
          regionId: draft.player.regionId,
          instanceId: draft.player.instanceId,
          policy: 'materials-v1',
          losses: loss.losses,
          lostMoney: loss.lostMoney,
          retained: loss.carried.items.map((i) => ({
            id: i.id,
            templateId: i.templateId,
            quantity: i.quantity,
          })),
          retainedMoney: loss.carried.money,
        };
        draft.build.active = null;
        draft.player.actor.resources.health.current = draft.player.actor.resources.health.maximum;
        draft.player.actor.resources.energy.current = draft.player.actor.resources.energy.maximum;
        const carriedObject = draft.player.carrying;
        if (carriedObject) {
          const oldArea = retainedArea(draft);
          oldArea.changes.removedObjects = oldArea.changes.removedObjects.filter(
            (id) => id !== carriedObject,
          );
          draft.player.carrying = null;
        }
        draft.tools.carriedBomb = null;
        try {
          enterArea(draft, this.world, 'region:clearing', 'start');
          assertWorldInvariants(draft, this.content);
        } catch (error) {
          return unavailable(
            error instanceof Error ? error.message : 'The village entrance is blocked.',
          );
        }
        this.random = deathRandom;
        this.state = draft;
        this.transitionSequence++;
        this.pauses.set('death', false);
        this.emit({ type: 'world.region-entered', regionId: 'region:clearing' });
        this.emit({
          type: 'combat.player-respawned',
          subject: String(command.deathId),
          message: `Returned to the village. Lost ${loss.losses.reduce((n, l) => n + l.quantity, 0)} material units and ${loss.lostMoney} coins; equipment, deposits and permanent tools are protected.`,
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
      this.state.nextTransaction++;
      s.death = {
        ...s.death,
        phase: 'resolved',
        lostItems: loss.lostItems,
        lostMoney: loss.lostMoney,
        losses: loss.losses,
      };
      this.state.lastDeath = {
        deathId: s.death.id,
        regionId: this.state.player.regionId,
        instanceId: null,
        policy: 'practice',
        losses: [],
        lostMoney: 0,
        retained: loss.carried.items.map((i) => ({
          id: i.id,
          templateId: i.templateId,
          quantity: i.quantity,
        })),
        retainedMoney: loss.carried.money,
      };
      this.state.tools.effects = [];
      this.state.tools.carriedBomb = null;
      this.state.tools.safe = null;
      actor.position = { ...spawn.position };
      actor.facing = spawn.facing;
      this.state.build.active = null;
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
      if (
        this.state.player.instanceId ||
        this.activeArea().geometry.generated ||
        this.state.player.regionId === TRAIL_ID
      )
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
      this.state.tools.effects = [];
      this.state.tools.carriedBomb = null;
      this.state.tools.safe = null;
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
      if (hookPulling(this.state) || this.state.tools.effects.some((e) => e.phase === 'windup'))
        return unavailable('Finish the active tool first.');
      const error = beginAction(
        s,
        actor,
        command.action,
        this.tick,
        command.facing ?? actor.facing,
        buildEffects(this.state, this.content).cooldownFactor,
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
      if (!Number.isSafeInteger(this.state.nextTransaction + 1))
        return unavailable('Transaction limit reached.');
      if (this.state.player.carried.money > Number.MAX_SAFE_INTEGER - drop.money)
        return unavailable('Coin capacity reached.');
      drop.claimed = true;
      this.state.player.carried.money += drop.money;
      this.state.nextTransaction++;
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
    return [
      ...toolSolidEntries(this.state, this.regionDefinition, this.activeArea()),
      ...storefrontSolid(this.state),
    ];
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
  get villageSnapshot() {
    return villageView(this.state, this.content, this.message?.villageNode ?? null);
  }
  get villageNpc() {
    if (!this.world || !['region:forest', SHOP_REGION].includes(this.state.player.regionId))
      return null;
    const calendar = calendarView(this.state.calendar, this.state.timeRules);
    return villageActor(
      this.state,
      this.activeArea().geometry,
      this.regionDefinition,
      calendar.minuteOfDay,
    );
  }
  get worldPresentation() {
    const region = this.activeArea();
    const npc = this.villageNpc;
    const objects = copyData(region.geometry.objects);
    if (npc?.id === RESCUE_ID) objects.push({ id: npc.id, position: { ...npc.position } });
    if (npc?.id === MERCHANT_ID) {
      const object = objects.find((entry) => entry.id === MERCHANT_ID);
      if (object) object.position = { ...npc.position };
    }
    return freezeData({
      passages: [...region.changes.openedPassages],
      claimed: [...region.changes.claimedRewards],
      objects,
      removed: [...region.changes.removedObjects],
      opened: [...region.changes.openedObjects],
      carrying: this.state.player.carrying,
    });
  }
  private targetPosition(target: Interaction) {
    if (target.id === MERCHANT_ID) return this.villageNpc?.position ?? target.position;
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
      return target
        ? {
            ...target,
            label:
              target.id === 'entity:clearing-box'
                ? 'Set down small box'
                : 'Set down carried object',
          }
        : null;
    }
    const actor = this.state.player.actor,
      region = this.activeArea();
    const targets = [
      ...this.regionDefinition.interactions,
      ...rescueInteraction(this.villageNpc),
    ].filter(
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
    const closest = targets[0];
    if (closest?.id === STORE_DOOR && !merchantRecruited(this.state))
      return {
        ...closest,
        kind: 'sign',
        label: 'Inspect merchant plot',
        text: 'This plot is reserved for a general store. Find Tessa in Whispering Forest.',
        destination: null,
      };
    return closest ?? null;
  }
  private interact(requested: EntityId | null): CoreResult {
    if (this.pauses.paused)
      return { ok: false, code: 'paused', message: 'Close the current menu first.' };
    if (
      this.battleActive &&
      (this.state.combat?.action || this.tick < (this.state.combat?.hurtUntil ?? 0))
    )
      return { ok: false, code: 'unavailable', message: 'Recover before interacting.' };
    if (hookPulling(this.state) || this.state.tools.effects.some((e) => e.phase === 'windup'))
      return { ok: false, code: 'unavailable', message: 'Finish the active tool first.' };
    if (requested === null && this.state.tools.carriedBomb !== null)
      return this.toolCommand({ type: 'tool.throw' });
    if (
      requested === null &&
      this.state.tools.effects.some(
        (e) =>
          e.kind === 'bomb' &&
          e.phase === 'fuse' &&
          Math.hypot(
            e.position.x - this.state.player.actor.position.x,
            e.position.y - this.state.player.actor.position.y,
          ) <= 26,
      )
    )
      return this.toolCommand({ type: 'tool.lift-bomb' });
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
    } else if (target.kind === 'mechanism') {
      const candidate = copyData(this.state);
      try {
        const text = interactTrail(this.toolContext(candidate), target.id);
        assertWorldInvariants(candidate, this.content);
        this.state = candidate;
        this.state.tools.feedback = text;
        this.emit({ type: 'tools.changed', message: text });
      } catch (error) {
        return {
          ok: false,
          code: 'unavailable',
          message: error instanceof Error ? error.message : 'This mechanism could not change.',
        };
      }
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
    } else if (target.kind === 'village') {
      this.openVillageNode(target.id === RESCUE_ID ? 'rescue' : 'welcome');
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
  private openVillageNode(node: VillageNode) {
    const dialogue = VILLAGE_DIALOGUE[node];
    const stocked =
      node === 'stock' &&
      this.state.domains.quests.some((quest) => quest.id === STOCK_QUEST && quest.rewardClaimed);
    this.message = freezeData({
      title: dialogue.title,
      body: stocked
        ? 'The shelves are stocked. Thank you for bringing the wood.'
        : node === 'rescue' && rescueRouteOpen(this.state)
          ? 'The brass gate is open. I can bring my supplies to the clearing now.'
          : dialogue.body,
      villageNode: node,
    });
    if (this.pauses.set('interaction', true))
      this.emit({ type: 'pause.changed', paused: true, reasons: this.pauses.snapshot() });
  }
  private villageCommand(input: CoreCommand): CoreResult {
    const fail = (message: string): CoreResult => ({ ok: false, code: 'unavailable', message });
    const parsed = villageCommandSchema.safeParse(input);
    const node = this.message?.villageNode;
    if (
      !parsed.success ||
      !node ||
      this.pauses.snapshot().some((reason) => reason !== 'interaction')
    )
      return fail('Speak with Tessa before continuing.');
    const command = parsed.data;
    if (command.expectedTransaction !== this.state.nextTransaction)
      return {
        ok: false,
        code: 'stale-command',
        message: 'The conversation or stock has changed.',
      };
    if (!Number.isSafeInteger(this.state.nextTransaction + 1))
      return fail('Transaction limit reached.');
    const draft = copyData(this.state);
    try {
      const next = applyVillageCommand(draft, this.content, node, command);
      draft.nextTransaction++;
      assertWorldInvariants(draft, this.content);
      this.state = draft;
      this.openVillageNode(next);
      this.emit({ type: 'interaction.changed' });
      return { ok: true };
    } catch (error) {
      return fail(error instanceof Error ? error.message : 'The village transaction failed.');
    }
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
      if (p.kind === 'resource') {
        if (this.state.player.carried.money === Number.MAX_SAFE_INTEGER)
          return fail('Coin capacity reached.');
        if (
          !Number.isSafeInteger(this.state.nextTransaction + 1) ||
          !Number.isSafeInteger(this.state.world.nextId + 1)
        )
          return fail('Transaction or item identity limit reached.');
        try {
          const item = itemInstanceSchema.parse({
            id: allocatedId(this.state.world.id, this.state.world.nextId, 'item-instance'),
            templateId: 'item:wood',
            quantity: 2,
            enchantments: [],
          });
          const next = receiveItem(this.state.player.carried, item, this.content);
          this.state.player.carried = next;
          this.state.world.nextId++;
          this.state.nextTransaction++;
          this.inventoryFeedback = 'Collected 2 Wood and one coin.';
          this.emit({ type: 'inventory.changed', message: this.inventoryFeedback });
        } catch (error) {
          return fail(
            error instanceof Error ? error.message : 'These supplies could not be collected.',
          );
        }
      }
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
          'Gathered 2 wood and one coin. Wild supplies renew offscreen on the first visit of a later day.';
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
      if (!Number.isSafeInteger(this.state.nextTransaction + 1))
        return fail('Transaction limit reached.');
      area.changes.claimedRewards.push(p.id);
      this.state.player.carried.money += 5;
      this.state.nextTransaction++;
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
  get storageView() {
    if (!this.world || this.state.player.carrying) return null;
    const target = this.nearestTarget();
    if (target?.kind !== 'chest') return null;
    const chest = this.state.player.deposits.find(
      (d) =>
        d.chestId === target.id &&
        d.regionId === this.state.player.regionId &&
        d.instanceId === this.state.player.instanceId,
    );
    const view = (inventory: SaveState['player']['carried'], deposited = false) => ({
      capacity: inventory.capacity,
      money: inventory.money,
      items: inventory.items.map((i) =>
        describeItem(
          i,
          this.state.player,
          this.content,
          this.state.deathRules.materialChance,
          deposited,
        ),
      ),
    });
    return freezeData({
      id: target.id,
      name: target.label,
      expectedTransaction: this.state.nextTransaction,
      carried: view(this.state.player.carried),
      deposited: view(chest?.inventory ?? { capacity: 20, items: [], money: 0 }, true),
    });
  }
  private toolContext(
    state: SaveState = this.state,
    battle: BattleContext | null = null,
  ): ToolContext {
    if (!this.world) throw new Error('Tool world is unavailable.');
    const definition = areaDefinition(state, this.world),
      area = retainedArea(state);
    return {
      state,
      definition,
      area,
      battle,
      modifiers: buildEffects(state, this.content),
      solids: () =>
        [...toolSolidEntries(state, definition, area), ...storefrontSolid(state)].map(
          (s) => s.rect,
        ),
      changed: (message) => this.emit({ type: 'tools.changed', message }),
    };
  }
  private toolCommand(input: unknown): CoreResult {
    if (this.pauses.paused)
      return { ok: false, code: 'paused', message: 'Close the current menu before using a tool.' };
    const parsed = toolCommandSchema.safeParse(input);
    if (!parsed.success)
      return { ok: false, code: 'invalid-command', message: 'Invalid tool command.' };
    if (parsed.data.type === 'tool.action' && parsed.data.tool === 'bow' && this.battleActive)
      return this.combatCommand({ type: 'combat.action', action: 'bow', facing: null });
    const draft = copyData(this.state);
    try {
      applyToolCommand(this.toolContext(draft), parsed.data);
      assertWorldInvariants(draft, this.content);
      this.state = draft;
      this.cached = undefined;
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        code: 'unavailable',
        message: error instanceof Error ? error.message : 'The tool could not be used.',
      };
    }
  }
  get toolsView() {
    return this.world ? toolsView(this.state, this.regionDefinition, this.activeArea()) : null;
  }
  get trailPresentation() {
    return this.world
      ? freezeData(trailPresentation(this.state, this.regionDefinition, this.activeArea()))
      : [];
  }
  get toolsPresentation() {
    return freezeData(copyData(this.state.tools));
  }
  get selectedTool() {
    return this.state.pack.selectedTool;
  }
  private buildRewardAvailable(reward: keyof typeof BUILD_REWARDS) {
    if (this.state.build.claims.includes(reward)) return false;
    switch (reward) {
      case 'chest':
        return (
          this.state.pack.starterClaimed &&
          !!this.world &&
          !this.state.player.carrying &&
          this.nearestTarget()?.id === 'entity:clearing-chest'
        );
      case 'encounter':
        return this.state.build.mixedTrialCompleted || completedMixedTrial(this.state.combat);
      case 'boss':
        return this.state.world.dungeons.some((dungeon) =>
          dungeon.geometry.generated?.placements.some(
            (placement) =>
              placement.kind === 'reward' && dungeon.changes.claimedRewards.includes(placement.id),
          ),
        );
      case 'quest':
        return this.state.world.regions.some(
          (region) =>
            region.id === TRAIL_ID &&
            region.kind === 'surface' &&
            region.phase !== 'unvisited' &&
            region.changes.openedPassages.some((id) => id === 'entity:trail-shortcut'),
        );
    }
  }
  get inventoryView() {
    const battle = this.state.combat;
    const build = this.state.build;
    const effects = buildEffects(this.state, this.content);
    const cooldown = (ready: number) => Math.ceil(Math.max(0, ready - this.tick) / 5) / 10;
    return freezeData({
      build: {
        rewards: rewardIdSchema.options.map((id) => ({
          id,
          name: BUILD_REWARDS[id].name,
          requirement: BUILD_REWARDS[id].requirement,
          claimed: build.claims.includes(id),
          available: this.buildRewardAvailable(id),
        })),
        unlocked: build.unlocked.map((id) => ({
          id,
          name: ABILITIES[id].name,
          description: ABILITIES[id].description,
        })),
        selected: build.selected,
        active: build.active ? ABILITIES[build.active.id].name : null,
        activeSeconds: build.active ? Math.ceil(build.active.remainingTicks / 50) : 0,
        cooldownSeconds: cooldown(build.readyTick),
        energyCost: ABILITY_COST,
      },
      hotbar: [
        {
          id: 'sword' as const,
          name: 'Sword',
          energyCost: 0,
          cooldownSeconds: cooldown(battle?.attackReadyTick ?? 0),
        },
        {
          id: 'shield' as const,
          name: 'Shield',
          energyCost: COMBAT_RULES.guardEnergy,
          cooldownSeconds: 0,
        },
        {
          id: 'roll' as const,
          name: 'Roll',
          energyCost: COMBAT_RULES.rollEnergy,
          cooldownSeconds: cooldown(battle?.rollReadyTick ?? 0),
        },
        {
          id: 'bow' as const,
          name: 'Bow',
          energyCost: COMBAT_RULES.bowEnergy,
          cooldownSeconds: Math.max(
            cooldown(battle?.bowReadyTick ?? 0),
            Math.ceil(
              (this.state.player.actor.cooldowns.find((c) => c.toolId === 'tool:bow')
                ?.remainingTicks ?? 0) / 5,
            ) / 10,
          ),
        },
        ...(['bomb', 'boomerang', 'hook', 'magic', 'push', 'pull'] as const).map((id) => ({
          id,
          name: {
            bomb: 'Bomb',
            boomerang: 'Boomerang',
            hook: 'Hook',
            magic: 'Magic rod',
            push: 'Push',
            pull: 'Pull',
          }[id],
          energyCost: toolEnergyCost(
            id === 'bomb' ? TOOL_RULES.bombEnergy : id === 'magic' ? TOOL_RULES.magicEnergy : 0,
            effects.energyDiscount,
          ),
          cooldownSeconds:
            Math.ceil(
              (this.state.player.actor.cooldowns.find((c) => c.toolId === `tool:${id}`)
                ?.remainingTicks ?? 0) / 5,
            ) / 10,
        })),
      ],
      expectedTransaction: this.state.nextTransaction,
      capacity: this.state.player.carried.capacity,
      money: this.state.player.carried.money,
      items: this.state.player.carried.items.map((i) =>
        describeItem(i, this.state.player, this.content, this.state.deathRules.materialChance),
      ),
      slots: this.content.data.slots.map((slot) => ({
        ...slot,
        itemId: this.state.player.equipment.find((e) => e.slot === slot.id)?.itemId ?? null,
      })),
      stats: effectiveStats(this.state.player, this.content),
      baseStats: copyData(this.state.player.actor.stats),
      tools: this.state.player.permanent.tools.map((id) => ({
        id,
        name: this.content.tool(id).name,
      })),
      selectedTool: this.state.pack.selectedTool,
      suppliesAvailable:
        !this.state.pack.starterClaimed && this.storageView?.id === 'entity:clearing-chest',
      starterClaimed: this.state.pack.starterClaimed,
      feedback: this.inventoryFeedback,
      statuses: this.state.player.actor.statuses.map((s) => ({
        name: this.content.status(s.id).name,
        stacks: s.stacks,
      })),
    });
  }
  private inventoryCommand(input: CoreCommand): CoreResult {
    const fail = (message: string): CoreResult => ({ ok: false, code: 'unavailable', message });
    const parsed = inventoryCommandSchema.safeParse(input);
    if (!parsed.success) return fail('Invalid inventory command.');
    const command = parsed.data;
    if (this.pauses.snapshot().some((r) => r !== 'inventory' && r !== 'storage'))
      return fail('Close other menus before changing your pack.');
    if (command.expectedTransaction !== this.state.nextTransaction)
      return fail('Your pack changed. Select the item again.');
    if (command.type === 'inventory.build-claim' && !this.buildRewardAvailable(command.reward))
      return fail('This build prize is unavailable.');
    if (
      command.type === 'inventory.ability-use' &&
      (this.pauses.paused ||
        this.state.player.actor.resources.health.current <= 0 ||
        (this.battleActive &&
          (this.state.combat?.action || this.tick < (this.state.combat?.hurtUntil ?? 0))) ||
        hookPulling(this.state) ||
        this.state.tools.effects.some((effect) => effect.phase === 'windup'))
    )
      return fail('Resume play and finish your action before activating an ability.');
    if (!Number.isSafeInteger(this.state.nextTransaction + 1))
      return fail('Transaction limit reached.');
    if (
      command.type === 'inventory.supplies' &&
      (command.chestId !== 'entity:clearing-chest' || this.storageView?.id !== command.chestId)
    )
      return fail('Stand near the travel chest to collect the starter supplies.');
    if (
      (command.type === 'inventory.equip' || command.type === 'inventory.unequip') &&
      this.battleActive &&
      (this.state.combat?.action || this.tick < (this.state.combat?.hurtUntil ?? 0))
    )
      return fail('Finish the action or recover before changing equipment.');
    try {
      const next = inventoryTransaction(
        { ...this.state, random: this.random.snapshot() },
        this.content,
        command,
      );
      this.state.player = next.player;
      this.state.pack = next.pack;
      this.state.build = next.build;
      if (next.random) this.random = next.random;
      this.state.world.nextId = next.nextId;
      this.state.nextTransaction++;
      this.inventoryFeedback = next.message;
      this.emit({ type: 'inventory.changed', message: next.message });
      this.cached = undefined;
      return { ok: true };
    } catch (error) {
      return fail(
        error instanceof Error ? error.message : 'The inventory action could not be applied.',
      );
    }
  }
  get deathReport() {
    const report = this.state.lastDeath;
    if (!report) return null;
    const view = (list: typeof report.losses) =>
      list.map((l) => ({ ...copyData(l), name: this.content.item(l.templateId).name }));
    return freezeData({
      ...copyData(report),
      losses: view(report.losses),
      retained: view(report.retained),
    });
  }
  private storageCommand(
    command: Extract<CoreCommand, { type: 'storage.item' | 'storage.money' }>,
  ): CoreResult {
    const fail = (message: string): CoreResult => ({ ok: false, code: 'unavailable', message });
    if (this.pauses.snapshot().some((r) => r !== 'storage'))
      return fail('Close other menus before using the chest.');
    if (command.expectedTransaction !== this.state.nextTransaction)
      return fail('That transfer was already applied or the chest changed.');
    const view = this.storageView;
    if (!view || view.id !== command.chestId) return fail('Stand nearby and face this chest.');
    if (!Number.isSafeInteger(this.state.nextTransaction + 1))
      return fail('Transaction limit reached.');
    let chest = this.state.player.deposits.find(
      (d) =>
        d.chestId === command.chestId &&
        d.regionId === this.state.player.regionId &&
        d.instanceId === this.state.player.instanceId,
    );
    const empty = {
      chestId: command.chestId,
      regionId: this.state.player.regionId,
      instanceId: this.state.player.instanceId,
      inventory: { capacity: 20, items: [], money: 0 },
    };
    const current = chest ?? empty,
      depositing = command.direction === 'deposit';
    if (
      command.type === 'storage.item' &&
      depositing &&
      this.state.player.equipment.some((e) => e.itemId === command.itemId)
    )
      return fail('Unequip that item before depositing it.');
    let nextItemId = this.state.world.nextId;
    try {
      const source = depositing ? this.state.player.carried : current.inventory,
        destination = depositing ? current.inventory : this.state.player.carried;
      const moved =
        command.type === 'storage.money'
          ? transferMoney(source, destination, command.amount)
          : transferItem(
              source,
              destination,
              command.itemId,
              command.quantity,
              this.content,
              () => {
                if (!Number.isSafeInteger(nextItemId + 1))
                  throw new Error('Item identity limit reached.');
                return itemInstanceIdSchema.parse(
                  allocatedId(this.state.world.id, nextItemId++, 'item-instance'),
                );
              },
            );
      if (!chest) {
        chest = empty;
        this.state.player.deposits.push(chest);
      }
      this.state.player.carried = depositing ? moved.source : moved.destination;
      chest.inventory = depositing ? moved.destination : moved.source;
      this.state.world.nextId = nextItemId;
      this.state.nextTransaction++;
      this.emit({ type: 'storage.changed', chestId: chest.chestId });
      return { ok: true };
    } catch (error) {
      return fail(error instanceof Error ? error.message : 'The transfer could not be applied.');
    }
  }
  /** A detached candidate is never read by the renderer or UI before its durable commit. */
  stage(input: CoreCommand) {
    const draft = new GameSession(this.export(), this.content, this.world);
    for (const reason of this.pauses.snapshot())
      if (reason !== 'saving') draft.pauses.set(reason, true);
    draft.message = this.message;
    draft.inventoryFeedback = this.inventoryFeedback;
    draft.transitionSequence = this.transitionSequence;
    const result = draft.dispatch(input);
    return { draft, result };
  }
  adopt(draft: GameSession, forceScene = false) {
    if (this.busy || draft.content !== this.content || draft.world !== this.world)
      throw new Error('Invalid state adoption');
    const data = draft.export(),
      events = draft.consumeEvents();
    const sequence = this.state.clock.eventSequence,
      transition = this.transitionSequence;
    this.state = data;
    this.state.clock.eventSequence = Math.max(sequence, data.clock.eventSequence);
    this.random = new RandomStreams(data.world.seed, data.random);
    this.message = draft.message;
    this.inventoryFeedback = draft.inventoryFeedback;
    for (const reason of ['death', 'interaction'] as const)
      this.pauses.set(reason, draft.pauses.snapshot().includes(reason));
    this.transitionSequence = forceScene
      ? Math.max(transition, draft.transitionSequence) + 1
      : draft.transitionSequence;
    for (const event of events) {
      const { sequence: ignoredSequence, tick: ignoredTick, ...body } = event;
      void ignoredSequence;
      void ignoredTick;
      this.emit(body);
    }
    if (forceScene)
      this.emit({ type: 'world.region-entered', regionId: this.state.player.regionId });
    this.cached = undefined;
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
