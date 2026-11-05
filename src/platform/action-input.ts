import {
  ARROW_ACTIONS,
  DEFAULT_INPUT,
  DEFAULT_KEYS,
  BUTTON_PROPERTIES,
  BUTTON_ACTIONS,
  PadReader,
  keyCodeSchema,
  normalizedVector,
} from '../core/actions';
import type { Action, InputView, Navigation, PadSample, ButtonAction } from '../core/actions';
import type { CommandResult } from '../bridge/game-bridge';
import { copyData, freezeData } from '../core/data';

export interface InputPort {
  readonly view: InputView;
  reset(): void;
  setPaused(active: boolean): void;
  remapKey(action: Action, code: string): CommandResult;
  remapButton(action: ButtonAction, button: number): CommandResult;
}
/** Owns device state/preferences, never player/world state. One instance per game mount. */
export class ActionInput implements InputPort {
  private keys = new Set<string>();
  private pressed = new Set<Action>();
  private pad = new PadReader();
  private current: InputView = freezeData(copyData(DEFAULT_INPUT));
  private paused = true;
  private focused = false;
  private disposers: (() => void)[] = [];
  constructor(
    private host: HTMLElement,
    private changed: () => void,
    private navigate: (action: Navigation) => void,
    private samplePads: () => readonly PadSample[] = () =>
      Array.from(navigator.getGamepads?.() ?? []).flatMap((p) =>
        p
          ? [
              {
                index: p.index,
                id: p.id,
                standard: p.mapping === 'standard',
                axes: [...p.axes],
                buttons: p.buttons.map((b) => b.pressed || b.value > 0.5),
              },
            ]
          : [],
      ),
  ) {
    const listen = (type: 'keydown' | 'keyup', listener: (event: KeyboardEvent) => void) => {
      window.addEventListener(type, listener);
      this.disposers.push(() => window.removeEventListener(type, listener));
    };
    listen('keydown', (event) => {
      if (!this.hasFocus() || this.paused) return;
      const action =
        ARROW_ACTIONS[event.code] ??
        (Object.keys(this.current.keys) as Action[]).find(
          (action) => this.current.keys[action] === event.code,
        );
      if (!action) return;
      event.preventDefault();
      if (event.repeat) return;
      if (!this.keys.has(event.code)) this.pressed.add(action);
      this.keys.add(event.code);
      this.update({ device: 'keyboard' });
    });
    listen('keyup', (event) => this.keys.delete(event.code));
    const blur = () => this.reset();
    window.addEventListener('blur', blur);
    this.disposers.push(() => window.removeEventListener('blur', blur));
    const focus = () => {
      this.reset();
      this.focused = true;
    };
    const unfocus = () => {
      this.reset();
      this.focused = false;
    };
    host.addEventListener('focus', focus);
    host.addEventListener('blur', unfocus);
    this.disposers.push(
      () => host.removeEventListener('focus', focus),
      () => host.removeEventListener('blur', unfocus),
    );
    const disconnected = () => {
      this.reset();
      this.update({ device: 'keyboard', connected: false });
    };
    window.addEventListener('gamepaddisconnected', disconnected);
    this.disposers.push(() => window.removeEventListener('gamepaddisconnected', disconnected));
  }
  get view() {
    return this.current;
  }
  private hasFocus() {
    return document.activeElement === this.host || this.host.contains(document.activeElement);
  }
  private update(patch: Partial<InputView>) {
    const next = { ...this.current, ...patch };
    if (JSON.stringify(next) !== JSON.stringify(this.current)) {
      this.current = freezeData(copyData(next));
      this.changed();
    }
  }
  reset() {
    this.keys.clear();
    this.pressed.clear();
    this.pad.reset();
  }
  setPaused(active: boolean) {
    if (active !== this.paused) {
      this.reset();
      this.paused = active;
    }
  }
  dispose() {
    for (const dispose of this.disposers) dispose();
    this.reset();
  }
  remapKey(action: Action, code: string): CommandResult {
    const parsed = keyCodeSchema.safeParse(code);
    if (!parsed.success)
      return { ok: false, code: 'invalid-command', message: 'Choose a supported key.' };
    if (
      Object.entries(this.current.keys).some(([other, value]) => other !== action && value === code)
    )
      return {
        ok: false,
        code: 'unavailable',
        message: 'That key is already assigned. Choose a different key first.',
      };
    this.reset();
    this.update({ keys: { ...this.current.keys, [action]: parsed.data } });
    return { ok: true };
  }
  remapButton(action: ButtonAction, button: number): CommandResult {
    if (![0, 2, 3, 4, 5, 6, 7, 8, 9].includes(button))
      return { ok: false, code: 'invalid-command', message: 'Choose a supported standard button.' };
    const property = BUTTON_PROPERTIES[action];
    if (
      BUTTON_ACTIONS.some(
        (other) => other !== action && this.current[BUTTON_PROPERTIES[other]] === button,
      )
    )
      return { ok: false, code: 'unavailable', message: 'That button is already assigned.' };
    this.reset();
    this.update({ [property]: button });
    return { ok: true };
  }
  resetBindings() {
    this.reset();
    this.update({
      keys: { ...DEFAULT_KEYS },
      interactButton: 0,
      attackButton: 2,
      pauseButton: 9,
      guardButton: 4,
      rollButton: 3,
      bowButton: 5,
      inventoryButton: 8,
      useButton: 7,
    });
  }
  poll(paused: boolean) {
    const focused = this.hasFocus();
    if (paused !== this.paused || focused !== this.focused) this.reset();
    this.paused = paused;
    this.focused = focused;
    const sampled = this.pad.read(this.samplePads(), this.current);
    if (this.current.connected && !sampled.connected) this.reset();
    this.update({
      connected: sampled.connected,
      ...(!sampled.connected
        ? { device: 'keyboard' as const }
        : sampled.active
          ? { device: sampled.device }
          : {}),
    });
    if (paused) {
      for (const action of sampled.navigation) this.navigate(action);
      return { x: 0, y: 0, guard: false, useHeld: false, pressed: [] as Action[] };
    }
    if (sampled.active && !focused) {
      this.host.focus();
      this.reset();
      return { x: 0, y: 0, guard: false, useHeld: false, pressed: [] as Action[] };
    }
    if (!focused) return { x: 0, y: 0, guard: false, useHeld: false, pressed: [] as Action[] };
    const down = (action: Action) =>
      this.keys.has(this.current.keys[action]) ||
      Object.entries(ARROW_ACTIONS).some(
        ([code, value]) => value === action && this.keys.has(code),
      );
    const keyboard = normalizedVector(
      Number(down('right')) - Number(down('left')),
      Number(down('down')) - Number(down('up')),
    );
    const vector = this.current.device === 'keyboard' ? keyboard : { x: sampled.x, y: sampled.y };
    const pressed = [...this.pressed, ...sampled.pressed];
    this.pressed.clear();
    return {
      ...vector,
      guard: this.current.device === 'keyboard' ? down('guard') : sampled.guard,
      useHeld: this.current.device === 'keyboard' ? down('use') : sampled.useHeld,
      pressed,
    };
  }
}
