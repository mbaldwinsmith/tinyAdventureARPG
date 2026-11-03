import { z } from 'zod';
import type { Position } from './model';

export const rectSchema = z.strictObject({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().positive().finite(),
  height: z.number().positive().finite(),
});
export type Rect = z.infer<typeof rectSchema>;
export const FOOT = { width: 8, height: 6 } as const;
export function footRect(position: Readonly<Position>): Rect {
  return {
    x: position.x - FOOT.width / 2,
    y: position.y - FOOT.height,
    width: FOOT.width,
    height: FOOT.height,
  };
}
export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
export function freeFoot(
  position: Readonly<Position>,
  width: number,
  height: number,
  solids: readonly Rect[],
): boolean {
  const body = footRect(position);
  return (
    body.x >= 0 &&
    body.y >= 0 &&
    body.x + body.width <= width &&
    body.y + body.height <= height &&
    !solids.some((s) => overlaps(body, s))
  );
}
/** Swept axis clipping permits sliding and cannot tunnel through a thin wall at large deltas. */
export function moveFoot(
  position: Readonly<Position>,
  dx: number,
  dy: number,
  width: number,
  height: number,
  solids: readonly Rect[],
): Position {
  if (![position.x, position.y, dx, dy, width, height].every(Number.isFinite))
    throw new Error('Invalid movement');
  const body = footRect(position);
  let x = Math.max(-body.x, Math.min(width - body.x - body.width, dx));
  for (const wall of solids)
    if (body.y < wall.y + wall.height && body.y + body.height > wall.y) {
      if (x > 0 && body.x + body.width <= wall.x) x = Math.min(x, wall.x - body.x - body.width);
      if (x < 0 && body.x >= wall.x + wall.width) x = Math.max(x, wall.x + wall.width - body.x);
    }
  body.x += x;
  let y = Math.max(-body.y, Math.min(height - body.y - body.height, dy));
  for (const wall of solids)
    if (body.x < wall.x + wall.width && body.x + body.width > wall.x) {
      if (y > 0 && body.y + body.height <= wall.y) y = Math.min(y, wall.y - body.y - body.height);
      if (y < 0 && body.y >= wall.y + wall.height) y = Math.max(y, wall.y + wall.height - body.y);
    }
  return { x: position.x + x, y: position.y + y };
}
export function cardinal(x: number, y: number, previous: 'up' | 'down' | 'left' | 'right') {
  if (x === 0 && y === 0) return previous;
  return Math.abs(y) >= Math.abs(x) ? (y > 0 ? 'down' : 'up') : x > 0 ? 'right' : 'left';
}
export function segmentBlocked(from: Position, to: Position, rect: Rect): boolean {
  let first = 0,
    last = 1;
  for (const [start, delta, min, max] of [
    [from.x, to.x - from.x, rect.x, rect.x + rect.width],
    [from.y, to.y - from.y, rect.y, rect.y + rect.height],
  ] as const) {
    if (delta === 0) {
      if (start <= min || start >= max) return false;
      continue;
    }
    const a = (min - start) / delta,
      b = (max - start) / delta;
    first = Math.max(first, Math.min(a, b));
    last = Math.min(last, Math.max(a, b));
    if (first >= last) return false;
  }
  return first < 1 - 1e-6 && last > 1e-6;
}
