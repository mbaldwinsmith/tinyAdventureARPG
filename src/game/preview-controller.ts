import { GameSession } from '../core/session';
import type { MovementResolver } from '../core/session';
import { PREVIEW_CONTENT, createPreviewSave } from '../content/preview';
import { gameCommandSchema } from '../bridge/game-bridge';
import type { GameBridge } from '../bridge/game-bridge';
import type { GameSnapshot, CommandResult, GameCommand } from '../bridge/game-bridge';

/** Authoritative owner for this integration preview, separate from the transport/UI. */
export class PreviewController {
  readonly session = new GameSession(createPreviewSave(), PREVIEW_CONTENT);
  private status: GameSnapshot['status'] = 'loading';
  private error: string | null = null;
  private animationRequest: GameSnapshot['animationRequest'] = null;
  private animationSequence = 0;
  private detach: () => void;
  private lastCore: GameSession['snapshot'] | undefined;
  private lastSnapshot: GameSnapshot | undefined;

  constructor(private bridge: GameBridge) {
    this.session.dispatch({ type: 'pause.set', reason: 'loading', active: true });
    this.detach = bridge.attach((command) => this.handle(command));
    this.publish();
  }

  ready(): void {
    this.status = 'ready';
    this.session.dispatch({ type: 'pause.set', reason: 'loading', active: false });
    this.publish();
  }
  fail(message: string): void {
    this.status = 'failed';
    this.error = message;
    this.session.dispatch({ type: 'pause.set', reason: 'failure', active: true });
    this.publish();
  }
  dispose(): void {
    this.detach();
  }
  advance(elapsedMs: number, resolve: MovementResolver) {
    const result = this.session.advance(elapsedMs, resolve);
    this.publish();
    return result;
  }

  private handle(command: GameCommand): CommandResult {
    const parsed = gameCommandSchema.safeParse(command);
    if (!parsed.success)
      return {
        ok: false,
        code: 'invalid-command',
        message: 'The game command has invalid fields.',
      };
    command = parsed.data;
    // Background/menu ownership must also work while the texture loader is running.
    let result: CommandResult = { ok: true };
    if (command.type === 'pause.set') result = this.session.dispatch(command);
    else {
      if (this.status !== 'ready')
        return {
          ok: false,
          code: 'not-ready',
          message: 'Wait for the clearing to finish loading.',
        };
      if (command.type === 'animation.preview') {
        if (this.session.snapshot.paused)
          return { ok: false, code: 'paused', message: 'Resume before previewing an animation.' };
        this.animationRequest = { action: command.action, sequence: ++this.animationSequence };
      } else result = this.session.dispatch(command);
    }
    this.publish();
    return result;
  }

  private publish(): void {
    const core = this.session.snapshot;
    if (
      !this.lastSnapshot ||
      core !== this.lastCore ||
      this.lastSnapshot.status !== this.status ||
      this.lastSnapshot.error !== this.error ||
      this.lastSnapshot.animationRequest !== this.animationRequest
    ) {
      this.lastCore = core;
      this.lastSnapshot = {
        ...core,
        status: this.status,
        error: this.error,
        animationRequest: this.animationRequest,
      };
    }
    this.bridge.publish(this.lastSnapshot, this.session.consumeEvents());
  }
}
