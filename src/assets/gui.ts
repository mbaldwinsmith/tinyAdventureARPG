import fontTemplates from './font-glyphs.json';
import type { AssetManifest } from './definitions';
import type { SourceRect } from './terrain';
import { validateRect } from './terrain';
export interface GuiSprite {
  id: string;
  rect: SourceRect;
  label: string;
  kind: 'panel' | 'button' | 'icon' | 'prompt';
}
export interface GuiPanel {
  id: string;
  rect: SourceRect;
  borderPixels: number;
  slices: SourceRect[];
}
const sprites: GuiSprite[] = [],
  panels: GuiPanel[] = [];
const rect = (texture: string, x: number, y: number, width = 16, height = 16): SourceRect => ({
  texture,
  x,
  y,
  width,
  height,
});
function add(id: string, source: SourceRect, label: string, kind: GuiSprite['kind'] = 'icon') {
  sprites.push({ id, rect: source, label, kind });
}
for (const colour of ['dark', 'brown', 'gray', 'green']) {
  const texture = `gui-panel-${colour}`,
    whole = rect(texture, 0, 0, 48, 48),
    slices: SourceRect[] = [];
  for (const [y, h] of [
    [0, 4],
    [4, 40],
    [44, 4],
  ] as const)
    for (const [x, w] of [
      [0, 4],
      [4, 40],
      [44, 4],
    ] as const)
      slices.push(rect(texture, x, y, w, h));
  panels.push({ id: `panel-${colour}`, rect: whole, borderPixels: 4, slices });
  add(`panel-${colour}`, whole, `${colour} panel`, 'panel');
}
for (let colour = 0; colour < 11; colour++)
  for (let state = 0; state < 2; state++)
    for (const [shape, width] of [
      ['square', 16],
      ['rectangle', 48],
    ] as const)
      add(
        `button-${shape}-${colour + 1}-${state}`,
        rect(`gui-${shape}-buttons`, state * width, colour * 16, width, 16),
        `${shape} colour ${colour + 1}, ${state ? 'pressed' : 'normal'}`,
        'button',
      );
for (const [family, offset] of [
  ['heart', 0],
  ['drop', 5],
  ['star', 10],
] as const)
  for (const [colour, tint] of ['red', 'blue', 'gold', 'green', 'purple'].entries())
    for (let state = 0; state < 6; state++) {
      add(
        `vital-${family}-${tint}-${state}`,
        rect('gui-vitals', state * 16, (offset + colour) * 16),
        `${tint} ${family}, ${['full', 'half', 'empty', 'full outlined', 'half outlined', 'empty outlined'][state]}`,
      );
    }
const tints = ['red', 'blue', 'gold', 'green', 'purple'];
for (let row = 0; row < 28; row++)
  for (let col = 0; col < (row < 20 ? 4 : 2); col++) {
    const name =
      row < 5
        ? `${tints[row]}-${col < 2 ? 'up' : 'down'}-arrow`
        : row < 10
          ? `${tints[row - 5]}-cross`
          : row < 15
            ? `${tints[row - 10]}-${col < 2 ? 'crossed-blade' : 'skull'}`
            : row < 19
              ? `${['white', 'gold', 'green', 'red'][row - 15]}-wing`
              : row === 19
                ? 'green-clover'
                : row === 20
                  ? 'gray-shield'
                  : row === 21
                    ? 'blue-square'
                    : row === 22
                      ? 'red-temperature'
                      : `${tints[row - 23]}-sparks`;
    add(
      `status-${row}-${col}`,
      rect('gui-status', col * 16, row * 16),
      `${name}, ${col % 2 ? 'outlined' : 'solid'}. Symbol only; gameplay status is not assigned.`,
    );
  }
export type PromptDevice =
  'keyboard-light' | 'keyboard-dark' | 'xbox' | 'playstation' | 'switch' | 'mouse';
export interface DevicePrompt extends GuiSprite {
  device: PromptDevice;
  control: string;
  state: number;
}
const prompts: DevicePrompt[] = [];
function prompt(
  device: PromptDevice,
  control: string,
  column: number,
  row: number,
  label: string,
  state = 0,
  height = 16,
) {
  const id = `prompt-${device}-${control.toLowerCase()}-${state}`;
  const value: DevicePrompt = {
    id,
    rect: rect(`gui-prompts-${device}`, column * 16, row * 16, 16, height),
    label,
    kind: 'prompt',
    device,
    control,
    state,
  };
  prompts.push(value);
  sprites.push(value);
}
for (const device of ['keyboard-light', 'keyboard-dark'] as const)
  for (let state = 0; state < 4; state++) {
    for (let i = 0; i < 26; i++)
      prompt(
        device,
        `Key${String.fromCharCode(65 + i)}`,
        state,
        i,
        String.fromCharCode(65 + i),
        state,
      );
    for (let i = 0; i < 10; i++)
      prompt(device, `Digit${(i + 1) % 10}`, 4 + state, 12 + i, String((i + 1) % 10), state);
    for (let i = 0; i < 12; i++) prompt(device, `F${i + 1}`, 4 + state, i, `F${i + 1}`, state);
    for (const [control, column, row, label, height] of [
      ['Escape', 8, 0, 'Esc', 16],
      ['Tab', 8, 2, 'Tab', 16],
      ['ShiftLeft', 8, 5, 'Shift', 16],
      ['ControlLeft', 8, 6, 'Ctrl', 16],
      ['AltLeft', 8, 7, 'Alt', 16],
      ['Space', 8, 8, 'Space', 16],
      ['ArrowUp', 12, 12, 'Up', 16],
      ['ArrowLeft', 12, 13, 'Left', 16],
      ['ArrowDown', 12, 14, 'Down', 16],
      ['ArrowRight', 12, 15, 'Right', 16],
      ['Enter', 8, 24, 'Enter', 32],
    ] as const)
      prompt(device, control, column + state, row, label, state, height);
  }
for (const device of ['xbox', 'playstation', 'switch'] as const)
  for (let state = 0; state < 7; state++) {
    for (const [control, row] of [
      ['north', 0],
      ['west', 2],
      ['south', 4],
      ['east', 6],
    ] as const) {
      const label = {
        xbox: { north: 'Y', west: 'X', south: 'A', east: 'B' },
        playstation: { north: 'Triangle', west: 'Square', south: 'Cross', east: 'Circle' },
        switch: { north: 'X', west: 'Y', south: 'B', east: 'A' },
      }[device][control];
      prompt(device, control, state, row, label, state);
    }
  }
for (const [control, col] of [
  ['left', 1],
  ['right', 2],
  ['middle', 3],
] as const)
  prompt('mouse', control, col, 0, `${control} mouse button`);
export const guiSprites: readonly GuiSprite[] = sprites;
export const guiPanels: readonly GuiPanel[] = panels;
export const devicePrompts: readonly DevicePrompt[] = prompts;
export function promptFor(
  device: PromptDevice,
  control: string,
  state = 0,
): DevicePrompt | undefined {
  return prompts.find((p) => p.device === device && p.control === control && p.state === state);
}
export const PREVIEW_KEYBOARD_PROMPTS = {
  moveUp: ['KeyW', 'ArrowUp'],
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveDown: ['KeyS', 'ArrowDown'],
  moveRight: ['KeyD', 'ArrowRight'],
  pause: ['Escape'],
} as const;
export interface BitmapGlyph {
  char: string;
  rect: SourceRect;
  offsetX: number;
  offsetY: number;
  advance: number;
}
export interface BitmapFont {
  id: string;
  texture: string;
  lineHeight: number;
  spaceAdvance: number;
  glyphs: BitmapGlyph[];
}
export const bitmapFonts: readonly BitmapFont[] = [
  'blue',
  'brown',
  'dark',
  'gold',
  'green',
  'light',
  'red',
].flatMap((colour) =>
  fontTemplates.map((template) => ({
    id: `font-${colour}-${template.size}`,
    texture: `gui-font-${colour}-${template.size}`,
    lineHeight: template.lineHeight,
    spaceAdvance: template.spaceAdvance,
    glyphs: template.glyphs.map((g) => ({
      char: g.char,
      rect: rect(`gui-font-${colour}-${template.size}`, g.x, g.y, g.width, g.height),
      offsetX: g.offsetX,
      offsetY: g.offsetY,
      advance: g.advance,
    })),
  })),
);
export function layoutBitmapText(font: BitmapFont, text: string) {
  if (text.length > 512) throw new Error('Bitmap text exceeds the 512-character preview budget.');
  let x = 0,
    y = 0,
    width = 0;
  const glyphs: { glyph: BitmapGlyph; x: number; y: number }[] = [],
    unsupported = new Set<string>();
  for (const char of text) {
    if (char === '\n') {
      width = Math.max(width, x);
      x = 0;
      y += font.lineHeight;
      continue;
    }
    if (char === ' ') {
      x += font.spaceAdvance;
      continue;
    }
    let glyph = font.glyphs.find((g) => g.char === char);
    if (!glyph) {
      unsupported.add(char);
      glyph = font.glyphs.find((g) => g.char === '?');
    }
    if (!glyph) throw new Error(`Missing fallback glyph: ${font.id}`);
    glyphs.push({ glyph, x: x + glyph.offsetX, y: y + glyph.offsetY });
    x += glyph.advance;
  }
  width = Math.max(width, x);
  return {
    glyphs,
    width: Math.max(1, width),
    height: y + font.lineHeight,
    unsupported: [...unsupported],
  };
}
export function validateGui(textures: AssetManifest['assets']): void {
  const ids = new Set<string>();
  for (const sprite of sprites) {
    if (ids.has(sprite.id)) throw new Error(`Duplicate GUI ID: ${sprite.id}`);
    ids.add(sprite.id);
    validateRect(sprite.rect, textures);
  }
  for (const panel of panels) for (const slice of panel.slices) validateRect(slice, textures);
  for (const font of bitmapFonts) {
    if (
      new Set(font.glyphs.map((g) => g.char)).size !== 88 ||
      !font.glyphs.some((g) => g.char === '?')
    )
      throw new Error(`Invalid font mapping: ${font.id}`);
    for (const glyph of font.glyphs) {
      validateRect(glyph.rect, textures);
      if (
        glyph.offsetY < 0 ||
        glyph.offsetY + glyph.rect.height > font.lineHeight ||
        glyph.advance <= 0
      )
        throw new Error(`Invalid glyph metrics: ${font.id}`);
    }
  }
  for (const controls of Object.values(PREVIEW_KEYBOARD_PROMPTS))
    for (const control of controls)
      if (!promptFor('keyboard-light', control))
        throw new Error(`Missing actual preview binding prompt: ${control}`);
}
