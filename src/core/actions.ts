import { z } from 'zod';

export const ACTIONS = [
  'up',
  'left',
  'down',
  'right',
  'interact',
  'attack',
  'guard',
  'roll',
  'bow',
  'pause',
  'inventory',
  'map',
  'use',
  'ability',
] as const;
export type Action = (typeof ACTIONS)[number];
export const actionSchema = z.enum(ACTIONS);
export const KEY_CODES = [
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyE',
  'KeyF',
  'KeyI',
  'KeyJ',
  'KeyK',
  'KeyL',
  'KeyM',
  'KeyP',
  'KeyQ',
  'KeyR',
  'KeyZ',
  'KeyX',
  'Space',
  'Enter',
  'Escape',
] as const;
export const keyCodeSchema = z.enum(KEY_CODES);
export type KeyCode = (typeof KEY_CODES)[number];
export type KeyBindings = Record<Action, KeyCode>;
export const DEFAULT_KEYS: KeyBindings = {
  up: 'KeyW',
  left: 'KeyA',
  down: 'KeyS',
  right: 'KeyD',
  interact: 'KeyE',
  attack: 'Space',
  guard: 'KeyQ',
  roll: 'KeyR',
  bow: 'KeyF',
  pause: 'Escape',
  inventory: 'KeyI',
  map: 'KeyM',
  use: 'KeyX',
  ability: 'KeyZ',
};
export const ARROW_ACTIONS: Readonly<Record<string, Action>> = {
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowDown: 'down',
  ArrowRight: 'right',
};
export type InputDevice = 'keyboard' | 'xbox' | 'playstation' | 'switch' | 'generic';
export interface InputView {
  device: InputDevice;
  connected: boolean;
  keys: Readonly<KeyBindings>;
  interactButton: number;
  attackButton: number;
  pauseButton: number;
  guardButton: number;
  rollButton: number;
  bowButton: number;
  inventoryButton: number;
  mapButton: number;
  useButton: number;
  abilityButton: number;
}
export const DEFAULT_INPUT: InputView = {
  device: 'keyboard',
  connected: false,
  keys: DEFAULT_KEYS,
  interactButton: 0,
  attackButton: 2,
  pauseButton: 9,
  guardButton: 4,
  rollButton: 3,
  bowButton: 5,
  inventoryButton: 8,
  mapButton: 11,
  useButton: 7,
  abilityButton: 6,
};
export type Navigation = 'up' | 'down' | 'left' | 'right' | 'confirm' | 'cancel';
export interface PadSample {
  index: number;
  id: string;
  standard: boolean;
  axes: readonly number[];
  buttons: readonly boolean[];
}
export function padDevice(id: string): InputDevice {
  if (/nintendo|switch|057e/i.test(id)) return 'switch';
  if (/054c|sony|dualshock|dualsense|playstation/i.test(id)) return 'playstation';
  if (/xbox|xinput|045e/i.test(id)) return 'xbox';
  return 'generic';
}
export function stickVector(x: number, y: number, deadZone = 0.2) {
  if (![x, y, deadZone].every(Number.isFinite) || deadZone < 0 || deadZone >= 1)
    return { x: 0, y: 0 };
  const length = Math.hypot(x, y);
  if (length <= deadZone) return { x: 0, y: 0 };
  const amount = (Math.min(1, length) - deadZone) / (1 - deadZone);
  return { x: (x / length) * amount, y: (y / length) * amount };
}
export function normalizedVector(x: number, y: number) {
  const length = Math.max(1, Math.hypot(x, y));
  return { x: x / length, y: y / length };
}
/** Neutral arming is mandatory after connect, pause, blur, transition or disconnect. */
export class PadReader {
  private index: number | null = null;
  private identity: string | null = null;
  private armed = false;
  private previous: readonly boolean[] = [];
  reset() {
    this.armed = false;
    this.previous = [];
    this.previousStickX = 0;
    this.previousStickY = 0;
  }
  read(
    samples: readonly PadSample[],
    bindings: Pick<
      InputView,
      | 'interactButton'
      | 'attackButton'
      | 'pauseButton'
      | 'guardButton'
      | 'rollButton'
      | 'bowButton'
      | 'inventoryButton'
      | 'mapButton'
      | 'useButton'
      | 'abilityButton'
    >,
  ) {
    const pad =
      samples.find((p) => p.standard && p.index === this.index) ?? samples.find((p) => p.standard);
    if (!pad) {
      this.index = null;
      this.identity = null;
      this.reset();
      return {
        connected: false,
        device: 'keyboard' as InputDevice,
        guard: false,
        useHeld: false,
        x: 0,
        y: 0,
        pressed: [] as Action[],
        navigation: [] as Navigation[],
        active: false,
      };
    }
    if (pad.index !== this.index || pad.id !== this.identity) {
      this.index = pad.index;
      this.identity = pad.id;
      this.reset();
    }
    const stick = stickVector(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
    const neutral = stick.x === 0 && stick.y === 0 && !pad.buttons.some(Boolean);
    if (!this.armed) {
      this.armed = neutral;
      this.previous = [...pad.buttons];
      return {
        connected: true,
        device: padDevice(pad.id),
        guard: false,
        useHeld: false,
        x: 0,
        y: 0,
        pressed: [] as Action[],
        navigation: [] as Navigation[],
        active: false,
      };
    }
    const rising = (i: number) => !!pad.buttons[i] && !this.previous[i];
    const pressed: Action[] = [],
      navigation: Navigation[] = [];
    if (rising(bindings.interactButton)) pressed.push('interact');
    if (rising(bindings.attackButton)) pressed.push('attack');
    if (rising(bindings.pauseButton)) pressed.push('pause');
    if (rising(bindings.rollButton)) pressed.push('roll');
    if (rising(bindings.bowButton)) pressed.push('bow');
    if (rising(bindings.inventoryButton)) pressed.push('inventory');
    if (rising(bindings.mapButton)) pressed.push('map');
    if (rising(bindings.useButton)) pressed.push('use');
    if (rising(bindings.abilityButton)) pressed.push('ability');
    for (const [button, direction] of [
      [12, 'up'],
      [13, 'down'],
      [14, 'left'],
      [15, 'right'],
    ] as const)
      if (rising(button)) navigation.push(direction);
    // Stick menu navigation uses edge transitions rather than a render-rate repeat timer.
    const previousStick = stickVector(this.previousStickX, this.previousStickY);
    if (stick.y < -0.5 && previousStick.y >= -0.5) navigation.push('up');
    if (stick.y > 0.5 && previousStick.y <= 0.5) navigation.push('down');
    if (stick.x < -0.5 && previousStick.x >= -0.5) navigation.push('left');
    if (stick.x > 0.5 && previousStick.x <= 0.5) navigation.push('right');
    if (rising(bindings.interactButton)) navigation.push('confirm');
    if (rising(1) || rising(bindings.pauseButton) || rising(bindings.inventoryButton))
      navigation.push('cancel');
    const digital = normalizedVector(
      Number(!!pad.buttons[15]) - Number(!!pad.buttons[14]),
      Number(!!pad.buttons[13]) - Number(!!pad.buttons[12]),
    );
    this.previous = [...pad.buttons];
    this.previousStickX = pad.axes[0] ?? 0;
    this.previousStickY = pad.axes[1] ?? 0;
    const vector = Math.hypot(digital.x, digital.y) > 0 ? digital : stick;
    return {
      connected: true,
      device: padDevice(pad.id),
      ...vector,
      guard: !!pad.buttons[bindings.guardButton],
      useHeld: !!pad.buttons[bindings.useButton],
      pressed,
      navigation,
      active:
        Math.hypot(vector.x, vector.y) > 0 ||
        pressed.length > 0 ||
        navigation.length > 0 ||
        !!pad.buttons[bindings.guardButton] ||
        !!pad.buttons[bindings.useButton],
    };
  }
  private previousStickX = 0;
  private previousStickY = 0;
}

export const BUTTON_ACTIONS = [
  'interact',
  'attack',
  'guard',
  'roll',
  'bow',
  'pause',
  'inventory',
  'map',
  'use',
  'ability',
] as const;
export type ButtonAction = (typeof BUTTON_ACTIONS)[number];
export const BUTTON_PROPERTIES = {
  interact: 'interactButton',
  attack: 'attackButton',
  guard: 'guardButton',
  roll: 'rollButton',
  bow: 'bowButton',
  pause: 'pauseButton',
  inventory: 'inventoryButton',
  map: 'mapButton',
  use: 'useButton',
  ability: 'abilityButton',
} as const;
