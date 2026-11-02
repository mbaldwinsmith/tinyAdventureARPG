import { z } from 'zod';
import type { ContentRegistry } from '../content/schemas';
import { copyData, freezeData } from './data';
import { saveSchema, heroSchema, directionSchema, positionSchema } from './model';
import type { HeroId, Position, SaveState } from './model';
import { allocatedId } from './ids';
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
]);
export type CoreCommand = z.infer<typeof coreCommandSchema>;
export type CoreResult =
  | { ok: true }
  | { ok: false; code: 'invalid-command' | 'paused' | 'stale-command' | 'busy'; message: string };
type EventBody =
  | { type: 'pause.changed'; paused: boolean; reasons: readonly PauseReason[] }
  | { type: 'player.appearance-changed'; hero: HeroId }
  | { type: 'calendar.day-started'; day: number; cause: 'rollover' | 'sleep' };
export type DomainEvent = EventBody & { sequence: number; tick: number };
export interface StepContext {
  readonly tick: number;
  readonly stepMs: number;
  readonly position: Readonly<Position>;
  readonly facing: z.infer<typeof directionSchema>;
  readonly movementSpeedPixelsPerSecond: number;
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
}
/** The sole owner of serializable state, random streams and gameplay time. */
export class GameSession {
  private state: SaveState;
  private random: RandomStreams;
  private pauses = new PauseReasons();
  private events: DomainEvent[] = [];
  private cached: CoreSnapshot | undefined;
  private busy = false;
  readonly content: ContentRegistry;
  constructor(input: unknown, content: ContentRegistry) {
    this.content = content;
    this.state = saveSchema.parse(input);
    assertWorldInvariants(this.state, content);
    this.random = new RandomStreams(this.state.world.seed, this.state.random);
  }
  get snapshot(): CoreSnapshot {
    const calendar = calendarView(this.state.calendar, this.state.timeRules),
      reasons = this.pauses.snapshot();
    if (
      !this.cached ||
      this.cached.hero !== this.state.player.hero ||
      this.cached.pauseReasons.join(',') !== reasons.join(',') ||
      this.cached.calendar.day !== calendar.day ||
      this.cached.calendar.minuteOfDay !== calendar.minuteOfDay
    )
      this.cached = freezeData({
        hero: this.state.player.hero,
        paused: this.pauses.paused,
        pauseReasons: reasons,
        calendar,
      });
    return this.cached;
  }
  get actor() {
    return freezeData(copyData(this.state.player.actor));
  }
  get tick() {
    return this.state.clock.tick;
  }
  private emit(event: EventBody): void {
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
