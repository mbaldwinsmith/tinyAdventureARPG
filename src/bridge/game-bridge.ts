import { toolCommandSchemas } from '../core/tool-model';
import { inventoryCommandSchemas, selectedUseSchema } from '../core/inventory-model';
import { EXPEDITION_LOSS_POLICY } from '../core/death-loss';
import type { SaveView } from '../game/save-manager';
import { MAX_SAVE_BYTES } from '../platform/saves/codec';
import type { HeroAction } from '../assets/hero-animations';
import { HERO_ACTIONS } from '../assets/hero-animations';
import { z } from 'zod';
import type { HeroId } from '../core/model';
import type { combatView } from '../core/combat';
import type { EntityId } from '../core/ids';
import type { PauseReason } from '../core/time';
import { pauseReasonSchema } from '../core/time';
import type { DomainEvent, CoreResult, GameSession } from '../core/session';
import { coreCommandSchema } from '../core/session';
import { freezeData } from '../core/data';
import { DEFAULT_INPUT, actionSchema, BUTTON_ACTIONS } from '../core/actions';
import type { InputView, Navigation } from '../core/actions';

export interface GameSnapshot {
  saves: Readonly<SaveView> | null;
  storage: GameSession['storageView'];
  inventory: GameSession['inventoryView'] | null;
  tools: GameSession['toolsView'];
  deathReport: GameSession['deathReport'];
  lossPolicy: typeof EXPEDITION_LOSS_POLICY;
  status: 'loading' | 'ready' | 'failed';
  paused: boolean;
  pauseReasons: readonly PauseReason[];
  hero: HeroId;
  error: string | null;
  animationRequest: { action: HeroAction; sequence: number } | null;
  calendar: { day: number; dayOfSeason: number; season: string; year: number; minuteOfDay: number };
  region: { id: string; name: string };
  nearby: { id: EntityId; label: string; kind: string } | null;
  message: { title: string; body: string } | null;
  carrying: boolean;
  swimming: boolean;
  transitionSequence: number;
  input: InputView;
  debug: boolean;
  notice: string | null;
  expedition: ReturnType<GameSession['expeditionView']>;
  combat: ReturnType<typeof combatView> | null;
  screenShake: boolean;
}
export const gameCommandSchema = z.discriminatedUnion('type', [
  coreCommandSchema.options[0].extend({
    reason: pauseReasonSchema.exclude([
      'loading',
      'failure',
      'interaction',
      'death',
      'saving',
      'saves',
    ]),
  }),
  coreCommandSchema.options[1],
  coreCommandSchema.options[2],
  coreCommandSchema.options[3],
  coreCommandSchema.options[4],
  coreCommandSchema.options[5],
  coreCommandSchema.options[6],
  coreCommandSchema.options[7],
  coreCommandSchema.options[8],
  coreCommandSchema.options[9],
  coreCommandSchema.options[10],
  coreCommandSchema.options[11],
  ...inventoryCommandSchemas,
  ...toolCommandSchemas,
  selectedUseSchema,
  z.strictObject({ type: z.literal('save.open'), open: z.boolean() }),
  z.strictObject({ type: z.literal('save.write') }),
  z.strictObject({
    type: z.literal('save.load'),
    id: z.string().min(1).max(160),
    revision: z.number().int().positive().safe(),
  }),
  z.strictObject({
    type: z.literal('save.new'),
    name: z.string().trim().min(1).max(48),
    seed: z.string().max(128),
    hero: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ]),
  }),
  z.strictObject({ type: z.literal('save.import'), text: z.string().max(MAX_SAVE_BYTES) }),
  z.strictObject({ type: z.literal('save.export'), id: z.string().min(1).max(160).nullable() }),
  z.strictObject({ type: z.literal('save.recover'), id: z.string().min(1).max(160) }),
  z.strictObject({ type: z.literal('save.retry') }),
  z.strictObject({ type: z.literal('save.cancel') }),
  z.strictObject({ type: z.literal('save.copy') }),
  z.strictObject({ type: z.literal('save.session-only') }),
  z.strictObject({ type: z.literal('save.retry-storage') }),
  z.strictObject({ type: z.literal('animation.preview'), action: z.enum(HERO_ACTIONS) }),
  z.strictObject({ type: z.literal('input.key.set'), action: actionSchema, code: z.string() }),
  z.strictObject({
    type: z.literal('input.button.set'),
    action: z.enum(BUTTON_ACTIONS),
    button: z.number().int(),
  }),
  z.strictObject({ type: z.literal('debug.set'), enabled: z.boolean() }),
  z.strictObject({ type: z.literal('settings.shake'), enabled: z.boolean() }),
]);
export type GameCommand = z.infer<typeof gameCommandSchema>;
export type CommandResult =
  CoreResult | { ok: false; code: 'not-ready' | 'unavailable'; message: string };
export type GameEvent =
  | { type: 'snapshot.changed'; snapshot: GameSnapshot }
  | { type: 'input.navigate'; action: Navigation }
  | { type: 'domain.event'; event: DomainEvent };
type CommandHandler = (command: GameCommand) => CommandResult;

export const INITIAL_SNAPSHOT: GameSnapshot = freezeData({
  saves: null,
  storage: null,
  inventory: null,
  tools: null,
  deathReport: null,
  lossPolicy: EXPEDITION_LOSS_POLICY,
  status: 'loading',
  paused: false,
  pauseReasons: [],
  hero: 1,
  error: null,
  animationRequest: null,
  calendar: { day: 1, dayOfSeason: 1, season: 'Spring', year: 1, minuteOfDay: 360 },
  region: { id: 'region:clearing', name: 'Wayfarer’s clearing' },
  nearby: null,
  message: null,
  carrying: false,
  swimming: false,
  transitionSequence: 0,
  input: DEFAULT_INPUT,
  debug: false,
  notice: null,
  combat: null,
  expedition: null,
  screenShake: false,
});

/** Transport only. The runtime owns state and attaches a single command handler. */
export class GameBridge {
  private listeners = new Set<(event: GameEvent) => void>();
  private handler: CommandHandler | null = null;
  private current: GameSnapshot = INITIAL_SNAPSHOT;
  private sending = false;
  private notifying = false;

  get snapshot(): GameSnapshot {
    return this.current;
  }

  subscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    return this.onEvent((event) => {
      if (event.type === 'snapshot.changed') listener(event.snapshot);
    });
  }

  onEvent(listener: (event: GameEvent) => void): () => void {
    this.listeners.add(listener);
    listener({ type: 'snapshot.changed', snapshot: this.current });
    return () => {
      this.listeners.delete(listener);
    };
  }
  navigate(action: Navigation): void {
    for (const listener of this.listeners) listener({ type: 'input.navigate', action });
  }

  publish(snapshot: GameSnapshot, events: readonly DomainEvent[] = []): void {
    const changed = snapshot !== this.current;
    this.current = freezeData(snapshot);
    this.notifying = true;
    try {
      // Subscribers read committed state throughout the ordered event batch.
      for (const event of events)
        for (const listener of this.listeners) listener({ type: 'domain.event', event });
      if (changed)
        for (const listener of this.listeners) listener({ type: 'snapshot.changed', snapshot });
    } finally {
      this.notifying = false;
    }
  }

  attach(handler: CommandHandler): () => void {
    if (this.handler) throw new Error('A game runtime is already attached to this bridge.');
    this.handler = handler;
    return () => {
      if (this.handler === handler) this.handler = null;
    };
  }

  send(command: GameCommand): CommandResult {
    if (this.sending || this.notifying)
      return { ok: false, code: 'busy', message: 'Wait for the current state change to finish.' };
    if (!this.handler)
      return { ok: false, code: 'not-ready', message: 'The clearing is still loading.' };
    this.sending = true;
    try {
      return this.handler(command);
    } finally {
      this.sending = false;
    }
  }
}
