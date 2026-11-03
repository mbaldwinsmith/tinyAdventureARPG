import { freeFoot, moveFoot, segmentBlocked } from './motion';
import type { Rect } from './motion';
import type { Position } from './model';
/** Bounded local-room requests, at most once per enemy per 25 ticks; no full-world search per frame. */
export function roomPath(
  start: Position,
  goal: Position,
  width: number,
  height: number,
  solids: readonly Rect[],
): Position[] {
  const size = 8,
    cols = Math.floor(width / size),
    rows = Math.floor(height / size),
    cell = (p: Position) => ({
      x: Math.max(0, Math.min(cols - 1, Math.floor(p.x / size))),
      y: Math.max(0, Math.min(rows - 1, Math.floor(p.y / size))),
    }),
    point = (n: number) => ({ x: (n % cols) * size + 4, y: Math.floor(n / cols) * size + 8 });
  const a = cell(start),
    b = cell(goal),
    first = a.y * cols + a.x,
    last = b.y * cols + b.x;
  const queue = [first],
    parent = new Map<number, number>([[first, -1]]);
  let cursor = 0,
    found = -1;
  while (cursor < queue.length && cursor < 2048) {
    const n = queue[cursor++];
    if (n === undefined) break;
    if (n === last) {
      found = n;
      break;
    }
    const x = n % cols,
      y = Math.floor(n / cols);
    for (const [dx, dy] of [
      [0, -1],
      [-1, 0],
      [1, 0],
      [0, 1],
    ] as const) {
      const nx = x + dx,
        ny = y + dy,
        k = ny * cols + nx;
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= cols ||
        ny >= rows ||
        parent.has(k) ||
        !freeFoot(point(k), width, height, solids)
      )
        continue;
      parent.set(k, n);
      queue.push(k);
    }
  }
  if (found < 0) return [];
  const path: Position[] = [];
  while (found !== first && path.length < 256) {
    path.push(point(found));
    const previous = parent.get(found);
    if (previous === undefined || previous < 0) return [];
    found = previous;
  }
  return path.reverse();
}
export function clearFootRoute(
  from: Position,
  to: Position,
  width: number,
  height: number,
  solids: readonly Rect[],
): boolean {
  const distance = Math.hypot(to.x - from.x, to.y - from.y),
    result = moveFoot(from, to.x - from.x, to.y - from.y, width, height, solids);
  return (
    !solids.some((s) =>
      segmentBlocked(from, to, { x: s.x - 4, y: s.y, width: s.width + 8, height: s.height + 6 }),
    ) &&
    Math.hypot(result.x - to.x, result.y - to.y) < 0.01 &&
    distance < 1024
  );
}
