import { z } from 'zod';
import type { ContentRegistry } from '../content/schemas';
import { copyData, freezeData } from './data';
import { saveSchema, heroSchema, directionSchema, positionSchema } from './model';
import type { HeroId, Position, SaveState } from './model';
import { allocatedId } from './ids';
import { entityIdSchema } from './ids';
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
export type DomainEvent = (EventBody | WorldEvent) & { sequence: number; tick: number };
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
    if (
      !this.cached ||
      this.cached.hero !== this.state.player.hero ||
      this.cached.pauseReasons.join(',') !== reasons.join(',') ||
      this.cached.calendar.day !== calendar.day ||
      this.cached.calendar.minuteOfDay !== calendar.minuteOfDay ||
      this.cached.region.id !== this.state.player.regionId ||
      this.cached.nearby?.id !== target?.id ||
      this.cached.nearby?.label !== target?.label ||
      this.cached.message !== this.message ||
      this.cached.carrying !== !!this.state.player.carrying ||
      this.cached.swimming !== this.swimming
    )
      this.cached = freezeData({
        hero: this.state.player.hero,
        paused: this.pauses.paused,
        pauseReasons: reasons,
        calendar,
        region: {
          id: this.state.player.regionId,
          name: this.world?.region(this.state.player.regionId).name ?? 'Wayfarer’s clearing',
        },
        nearby: target ? { id: target.id, label: target.label, kind: target.kind } : null,
        message: this.message,
        carrying: !!this.state.player.carrying,
        swimming: this.swimming,
        transitionSequence: this.transitionSequence,
      });
    return this.cached;
  }
  get actor() {
    return freezeData(copyData(this.state.player.actor));
  }
  get tick() {
    return this.state.clock.tick;
  }
  private emit(event: EventBody | WorldEvent): void {
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
    if (command.type === 'pause.set') {
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
    } else {
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
          movementSpeedPixelsPerSecond: actor.stats.movementSpeedPixelsPerSecond,
          regionId: this.state.player.regionId,
        });
        const movement = movementSchema.parse(
          resolve ? resolve(context) : { position: context.position, facing: context.facing },
        );
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
  get regionDefinition() {
    if (!this.world) throw new Error('No authored world attached');
    return this.world.region(this.state.player.regionId);
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
  get solids() {
    if (!this.world) return [];
    const solids = this.world.solids(this.state.player.regionId, this.activeRegion());
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
  get worldPresentation() {
    const region = this.activeRegion();
    return freezeData({
      objects: copyData(region.geometry.objects),
      removed: [...region.changes.removedObjects],
      opened: [...region.changes.openedObjects],
      carrying: this.state.player.carrying,
    });
  }
  private targetPosition(target: Interaction) {
    return (
      this.activeRegion().geometry.objects.find((o) => o.id === target.id)?.position ??
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
      region = this.activeRegion();
    const targets = this.regionDefinition.interactions.filter(
      (t) =>
        !region.changes.removedObjects.includes(t.id) &&
        targetInReach(actor.position, actor.facing, this.targetPosition(t)) &&
        !this.world
          ?.solidEntries(this.state.player.regionId, region)
          .some(
            (s) =>
              s.owner !== t.id && segmentBlocked(actor.position, this.targetPosition(t), s.rect),
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
    const target = this.nearestTarget();
    if (!target || (requested !== null && target.id !== requested))
      return { ok: false, code: 'unavailable', message: 'Move closer and face the object.' };
    const region = this.activeRegion(),
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
    } else if (target.kind === 'door' && target.destination && this.world) {
      const destination = this.state.world.regions.find(
        (r) => r.id === target.destination?.regionId,
      );
      if (!destination || destination.kind !== 'surface' || destination.phase === 'unvisited')
        return { ok: false, code: 'unavailable', message: 'The destination is unavailable.' };
      const definition = this.world.region(destination.id),
        spawn = this.world.spawn(destination.id, target.destination.spawn);
      if (
        !freeFoot(
          spawn.position,
          definition.width,
          definition.height,
          this.world.solids(destination.id, destination),
        )
      )
        return { ok: false, code: 'unavailable', message: 'The destination doorway is blocked.' };
      region.phase = 'dormant';
      destination.phase = 'active';
      this.state.player.regionId = destination.id;
      this.state.player.instanceId = null;
      actor.position = { ...spawn.position };
      actor.facing = spawn.facing;
      if (!this.state.player.permanent.discoveredRegions.includes(destination.id))
        this.state.player.permanent.discoveredRegions.push(destination.id);
      this.state.clock.remainderMs = 0;
      this.transitionSequence++;
      this.emit({ type: 'world.region-entered', regionId: destination.id });
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
