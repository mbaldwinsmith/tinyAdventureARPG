export interface PixelEffectCell {
  x: number;
  y: number;
  width: number;
  height: number;
  colour: number;
  alpha: number;
}
export interface PixelEffectFrame {
  durationMs: number;
  cells: PixelEffectCell[];
}
export interface PixelEffect {
  id: string;
  width: number;
  height: number;
  pivot: { x: number; y: number };
  frames: PixelEffectFrame[];
}
const cell = (
  x: number,
  y: number,
  width: number,
  height: number,
  colour: number,
  alpha = 1,
): PixelEffectCell => ({ x, y, width, height, colour, alpha });
const fire = 0xff8933,
  light = 0xffcf70,
  white = 0xf5ffe8,
  red = 0xde4c48,
  smoke = 0x4b4c68;
export const bombExplosion: PixelEffect = {
  id: 'bomb-explosion',
  width: 64,
  height: 64,
  pivot: { x: 32, y: 32 },
  frames: [
    {
      durationMs: 80,
      cells: [cell(28, 24, 8, 16, light), cell(24, 28, 16, 8, light), cell(29, 29, 6, 6, white)],
    },
    {
      durationMs: 80,
      cells: [
        cell(20, 24, 24, 16, fire),
        cell(24, 20, 16, 24, fire),
        cell(24, 24, 16, 16, light),
        cell(28, 28, 8, 8, white),
      ],
    },
    {
      durationMs: 100,
      cells: [
        cell(16, 24, 32, 16, red),
        cell(24, 16, 16, 32, fire),
        cell(20, 24, 24, 16, light),
        cell(26, 26, 12, 12, white),
        cell(14, 14, 4, 4, fire),
        cell(46, 14, 4, 4, fire),
        cell(14, 46, 4, 4, fire),
        cell(46, 46, 4, 4, fire),
      ],
    },
    {
      durationMs: 100,
      cells: [
        cell(22, 12, 20, 8, fire),
        cell(12, 22, 8, 20, fire),
        cell(44, 22, 8, 20, red),
        cell(22, 44, 20, 8, fire),
        cell(8, 8, 4, 4, light),
        cell(52, 8, 4, 4, light),
        cell(8, 52, 4, 4, light),
        cell(52, 52, 4, 4, light),
      ],
    },
    {
      durationMs: 120,
      cells: [
        cell(24, 8, 12, 8, smoke, 0.75),
        cell(8, 24, 8, 12, smoke, 0.75),
        cell(48, 24, 8, 12, smoke, 0.6),
        cell(24, 48, 12, 8, smoke, 0.6),
        cell(8, 8, 3, 3, light),
        cell(53, 8, 3, 3, fire),
        cell(8, 53, 3, 3, fire),
        cell(53, 53, 3, 3, light),
      ],
    },
    {
      durationMs: 160,
      cells: [
        cell(26, 4, 6, 6, smoke, 0.35),
        cell(4, 26, 6, 6, smoke, 0.35),
        cell(54, 26, 6, 6, smoke, 0.3),
        cell(26, 54, 6, 6, smoke, 0.3),
      ],
    },
  ],
};
export function effectDurationMs(effect: PixelEffect): number {
  return effect.frames.reduce((sum, frame) => sum + frame.durationMs, 0);
}
export function effectFrameAt(
  effect: PixelEffect,
  elapsedMs: number,
): PixelEffectFrame | undefined {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return undefined;
  let offset = 0;
  for (const frame of effect.frames) {
    offset += frame.durationMs;
    if (elapsedMs < offset) return frame;
  }
  return undefined;
}
export function deathPreviewAlpha(elapsedMs: number): number {
  return Math.max(0, Math.min(1, 1 - Math.max(0, elapsedMs - 200) / 360));
}
export function validateEffects(): void {
  if (effectDurationMs(bombExplosion) > 1000)
    throw new Error('Explosion exceeds presentation lifetime budget.');
  for (const frame of bombExplosion.frames) {
    if (frame.durationMs <= 0 || frame.cells.length > 48)
      throw new Error('Invalid effect frame budget.');
    for (const c of frame.cells)
      if (
        ![c.x, c.y, c.width, c.height].every(Number.isInteger) ||
        c.x < 0 ||
        c.y < 0 ||
        c.width < 1 ||
        c.height < 1 ||
        c.x + c.width > bombExplosion.width ||
        c.y + c.height > bombExplosion.height ||
        c.alpha < 0 ||
        c.alpha > 1
      )
        throw new Error('Effect cell outside bounds.');
  }
}
