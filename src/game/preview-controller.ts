import { SaveManager, DURABLE_COMMANDS } from './save-manager';
import type { SaveRepository } from '../platform/saves/contracts';
import type { SaveState, HeroId } from '../core/model';
import type { DomainEvent } from '../core/session';
import { worldIdSchema } from '../core/ids';
import { GameSession, coreCommandSchema } from '../core/session';
import type { MovementResolver } from '../core/session';
import { PREVIEW_CONTENT, createPreviewSave } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { DEFAULT_INPUT } from '../core/actions';
import type { InputPort } from '../platform/action-input';
import { gameCommandSchema } from '../bridge/game-bridge';
import type { GameBridge } from '../bridge/game-bridge';
import type { GameSnapshot, CommandResult, GameCommand } from '../bridge/game-bridge';

/** Authoritative owner for this integration preview, separate from the transport/UI. */
export class PreviewController {
  readonly session = new GameSession(createPreviewSave(), PREVIEW_CONTENT, PREVIEW_WORLD);
  private status: GameSnapshot['status'] = 'loading';
  private error: string | null = null;
  private animationRequest: GameSnapshot['animationRequest'] = null;
  private animationSequence = 0;
  private detach: () => void;
  private lastCore: GameSession['snapshot'] | undefined;
  private lastSnapshot: GameSnapshot | undefined;
  private input: InputPort | undefined;
  private debug = false;
  private screenShake = false;
  private notice: string | null = null;
  private saves: SaveManager | null = null;
  private stepping = false;
  async initialize() {
    await this.saves?.initialize();
  }
  attachInput(input: InputPort) {
    this.input = input;
    this.publish();
  }
  inputChanged() {
    this.publish();
  }
  loading() {
    this.status = 'loading';
    this.session.dispatch({ type: 'pause.set', reason: 'loading', active: true });
    this.publish();
  }

  constructor(
    private bridge: GameBridge,
    options?: { repository: SaveRepository; download: (name: string, text: string) => void },
  ) {
    if (options)
      this.saves = new SaveManager(
        this.session,
        options.repository,
        PREVIEW_CONTENT,
        (state: SaveState) => new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD),
        (seed: string, hero: HeroId) => {
          const state = createPreviewSave(seed);
          state.world.id = worldIdSchema.parse(`world:${crypto.randomUUID()}`);
          state.player.hero = hero;
          return state;
        },
        () => {
          if (!this.stepping) this.publish();
        },
        options.download,
      );
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
    this.saves?.dispose();
  }
  advance(elapsedMs: number, resolve: MovementResolver) {
    this.stepping = true;
    try {
      const result = this.session.advance(elapsedMs, resolve),
        events = this.session.consumeEvents();
      this.saves?.afterAdvance(result.steps, events);
      this.stepping = false;
      this.publish(events);
      return result;
    } finally {
      this.stepping = false;
    }
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
    else if (command.type.startsWith('save.')) return this.saveCommand(command);
    else {
      if (this.status !== 'ready')
        return {
          ok: false,
          code: 'not-ready',
          message: 'Wait for the clearing to finish loading.',
        };
      if (command.type === 'animation.preview') {
        if (this.session.battleActive)
          return {
            ok: false,
            code: 'unavailable',
            message: 'Leave practice before playing cosmetic previews.',
          };
        if (this.session.snapshot.paused)
          return { ok: false, code: 'paused', message: 'Resume before previewing an animation.' };
        this.animationRequest = { action: command.action, sequence: ++this.animationSequence };
      } else if (command.type === 'input.key.set')
        result = this.input?.remapKey(command.action, command.code) ?? {
          ok: false,
          code: 'unavailable',
          message: 'The input service is not ready.',
        };
      else if (command.type === 'input.button.set')
        result = this.input?.remapButton(command.action, command.button) ?? {
          ok: false,
          code: 'unavailable',
          message: 'The input service is not ready.',
        };
      else if (command.type === 'settings.shake') this.screenShake = command.enabled;
      else if (command.type === 'debug.set') {
        if (!import.meta.env.DEV)
          return {
            ok: false,
            code: 'unavailable',
            message: 'Debug overlays are development-only.',
          };
        this.debug = command.enabled;
      } else if (this.saves && DURABLE_COMMANDS.has(command.type)) {
        const core = coreCommandSchema.safeParse(command);
        result = core.success
          ? this.saves.command(core.data)
          : { ok: false, code: 'invalid-command', message: 'Invalid core command.' };
      } else if (this.saves?.blocked)
        result = { ok: false, code: 'busy', message: 'Wait for or retry the pending checkpoint.' };
      else result = this.session.dispatch(command);
    }
    this.notice = result.ok ? null : result.message;
    this.publish();
    return result;
  }

  private saveCommand(command: GameCommand): CommandResult {
    const saves = this.saves;
    if (!saves)
      return {
        ok: false,
        code: 'unavailable',
        message: 'This runtime has no browser save adapter.',
      };
    let result: CommandResult;
    switch (command.type) {
      case 'save.open':
        result = saves.setOpen(command.open);
        break;
      case 'save.write':
        result = saves.checkpoint();
        break;
      case 'save.new':
        result = saves.newGame(command.name, command.seed, command.hero);
        break;
      case 'save.load':
        result = saves.load(command.id, command.revision);
        break;
      case 'save.import':
        result = saves.importBackup(command.text);
        break;
      case 'save.export':
        result = saves.exportBackup(command.id);
        break;
      case 'save.recover':
        result = saves.recover(command.id);
        break;
      case 'save.retry':
        result = saves.retry();
        break;
      case 'save.cancel':
        result = saves.cancel();
        break;
      case 'save.copy':
        result = saves.saveCopy();
        break;
      case 'save.session-only':
        result = saves.sessionOnly();
        break;
      case 'save.retry-storage':
        result = saves.retryStorage();
        break;
      default:
        result = { ok: false, code: 'invalid-command', message: 'Unknown save command.' };
    }
    this.notice = result.ok ? null : result.message;
    this.publish();
    return result;
  }
  private publish(priorEvents: readonly DomainEvent[] = []): void {
    const core = this.session.snapshot;
    if (this.lastCore && this.lastCore.nearby?.id !== core.nearby?.id) this.notice = null;
    if (this.lastCore && this.lastCore.pauseReasons.join(',') !== core.pauseReasons.join(','))
      this.input?.reset();
    this.input?.setPaused(core.paused);
    if (
      !this.lastSnapshot ||
      core !== this.lastCore ||
      this.lastSnapshot.status !== this.status ||
      this.lastSnapshot.error !== this.error ||
      this.lastSnapshot.animationRequest !== this.animationRequest ||
      this.lastSnapshot.input !== (this.input?.view ?? DEFAULT_INPUT) ||
      this.lastSnapshot.debug !== this.debug ||
      this.lastSnapshot.screenShake !== this.screenShake ||
      this.lastSnapshot.notice !== this.notice ||
      this.lastSnapshot.saves !== (this.saves?.view ?? null)
    ) {
      this.lastCore = core;
      this.lastSnapshot = {
        ...core,
        saves: this.saves?.view ?? null,
        status: this.status,
        error: this.error,
        animationRequest: this.animationRequest,
        input: this.input?.view ?? DEFAULT_INPUT,
        debug: this.debug,
        screenShake: this.screenShake,
        notice: this.notice,
      };
    }
    this.bridge.publish(this.lastSnapshot, [...priorEvents, ...this.session.consumeEvents()]);
  }
}
