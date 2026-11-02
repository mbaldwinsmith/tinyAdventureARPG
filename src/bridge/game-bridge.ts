import type { HeroAction } from '../assets/hero-animations';
import type { HeroId, PauseReason } from '../core/preview-session';

export interface GameSnapshot {
  status: 'loading' | 'ready' | 'failed';
  paused: boolean;
  pauseReasons: readonly PauseReason[];
  hero: HeroId;
  error: string | null;
  animationRequest: { action: HeroAction; sequence: number } | null;
}
export type GameCommand =
  | { type: 'pause.set'; reason: PauseReason; active: boolean }
  | { type: 'appearance.set'; hero: HeroId }
  | { type: 'animation.preview'; action: HeroAction };
export type CommandResult =
  { ok: true } | { ok: false; code: 'not-ready' | 'unavailable'; message: string };
export type GameEvent = { type: 'snapshot.changed'; snapshot: GameSnapshot };
type CommandHandler = (command: GameCommand) => CommandResult;

export const INITIAL_SNAPSHOT: GameSnapshot = {
  status: 'loading',
  paused: false,
  pauseReasons: [],
  hero: 1,
  error: null,
  animationRequest: null,
};

/** Transport only. The runtime owns state and attaches a single command handler. */
export class GameBridge {
  private listeners = new Set<(event: GameEvent) => void>();
  private handler: CommandHandler | null = null;
  private current: GameSnapshot = INITIAL_SNAPSHOT;

  get snapshot(): GameSnapshot {
    return this.current;
  }

  subscribe(listener: (snapshot: GameSnapshot) => void): () => void {
    return this.onEvent((event) => listener(event.snapshot));
  }

  onEvent(listener: (event: GameEvent) => void): () => void {
    this.listeners.add(listener);
    listener({ type: 'snapshot.changed', snapshot: this.current });
    return () => {
      this.listeners.delete(listener);
    };
  }

  publish(snapshot: GameSnapshot): void {
    this.current = snapshot;
    for (const listener of this.listeners) listener({ type: 'snapshot.changed', snapshot });
  }

  attach(handler: CommandHandler): () => void {
    if (this.handler) throw new Error('A game runtime is already attached to this bridge.');
    this.handler = handler;
    return () => {
      if (this.handler === handler) this.handler = null;
    };
  }

  send(command: GameCommand): CommandResult {
    if (!this.handler)
      return { ok: false, code: 'not-ready', message: 'The clearing is still loading.' };
    return this.handler(command);
  }
}
