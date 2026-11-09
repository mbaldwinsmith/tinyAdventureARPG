import type { SourceRect } from './terrain';

const frame = (texture: string, x: number, y: number, width = 16, height = 16): SourceRect => ({
  texture,
  x,
  y,
  width,
  height,
});
const menu = (column: number, row: number) => frame('gui-menu-icons', column * 16, row * 16);
export const adventureIcons = {
  pack: menu(1, 4),
  map: menu(1, 6),
  blade: frame('hud-sword', 0, 0, 9, 16),
  shield: frame('hud-shield', 0, 0, 14, 16),
  bow: frame('hud-bow', 0, 0, 16, 9),
  roll: frame('gui-status', 16, 256),
  bomb: frame('gui-item-icons', 16, 208),
  boomerang: frame('gui-item-icons', 16, 192),
  hook: frame('tool-hook-pole', 0, 0),
  magic: frame('gui-status', 16, 384),
  push: frame('gui-status', 16, 32),
  pull: frame('gui-status', 48, 32),
  coin: frame('gui-coin-icons', 16, 32),
  clock: frame('gui-clock-icons', 16, 16),
};
export const fieldArt = {
  arrow: frame('dungeon-arrow', 0, 0, 12, 5),
  crate: frame('dungeon-crate', 0, 0, 15, 14),
  weight: frame('world-small-box', 0, 0, 12, 14),
  vessel: frame('dungeon-vessel', 0, 0, 14, 15),
  key: frame('dungeon-golden-key', 0, 0, 11, 6),
  coin: frame('dungeon-coin', 0, 0, 5, 5),
  switchUp: frame('dungeon-switch', 0, 0, 14, 14),
  switchDown: frame('dungeon-switch', 14, 0, 14, 14),
  stairsDown: frame('dungeon-stairs-down', 0, 0),
  stairsGrass: frame('dungeon-stairs-grass', 0, 0),
  stairsUp: frame('dungeon-stairs-up', 0, 0),
  treasureClosed: frame('dungeon-treasure', 0, 0),
  treasureOpen: frame('dungeon-treasure', 64, 0),
  stone: frame('dungeon-room-gray', 160, 30),
  floor: frame('dungeon-room-gray', 16, 0),
  gateClosed: frame('dungeon-room-gray', 106, 103, 28, 24),
  gateOpen: frame('dungeon-room-gray', 154, 103, 28, 24),
  torches: [0, 1, 2, 3, 4, 5].map((index) => frame('dungeon-torch', index * 8, 0, 8, 10)),
};
export const adventureFrames = [
  ...Object.values(adventureIcons),
  ...Object.values(fieldArt).flat(),
];
