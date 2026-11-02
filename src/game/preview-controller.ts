import { PreviewSession } from '../core/preview-session';
import type { GameBridge } from '../bridge/game-bridge';
import type { GameSnapshot, CommandResult, GameCommand } from '../bridge/game-bridge';

/** Authoritative owner for this integration preview, separate from the transport/UI. */
export class PreviewController {
  readonly session = new PreviewSession();
  private status: GameSnapshot['status'] = 'loading';
  private error: string | null = null;
  private detach: () => void;

  constructor(private bridge: GameBridge) {
    this.detach = bridge.attach((command) => this.handle(command));
    this.publish();
  }

  ready(): void {
    this.status = 'ready';
    this.publish();
  }
  fail(message: string): void {
    this.status = 'failed';
    this.error = message;
    this.publish();
  }
  dispose(): void {
    this.detach();
  }

  private handle(command: GameCommand): CommandResult {
    // Background/menu ownership must also work while the texture loader is running.
    if (command.type === 'pause.set') this.session.setPause(command.reason, command.active);
    else {
      if (this.status !== 'ready')
        return {
          ok: false,
          code: 'not-ready',
          message: 'Wait for the clearing to finish loading.',
        };
      this.session.setHero(command.hero);
    }
    this.publish();
    return { ok: true };
  }

  private publish(): void {
    this.bridge.publish({ ...this.session.snapshot, status: this.status, error: this.error });
  }
}
