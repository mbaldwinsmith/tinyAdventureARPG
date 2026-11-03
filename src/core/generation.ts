import { EXPEDITIONS } from '../content/expeditions';
import { geometrySchema } from './model';
import type { Geometry } from './model';
import { layoutSchema } from './generation-model';
import type { Biome, GeneratedLayout } from './generation-model';
import { entityIdSchema } from './ids';
import { RandomStreams } from './random';

export const GENERATOR_VERSION = 1;
export const GENERATION_ATTEMPTS = 4;
export const ROOM_TEMPLATES = {
  grove: {
    obstacles: [
      [2, 2],
      [6, 6],
    ],
  },
  pillars: {
    obstacles: [
      [2, 2],
      [6, 2],
      [2, 6],
      [6, 6],
    ],
  },
  camp: {
    obstacles: [
      [2, 6],
      [6, 2],
    ],
  },
} as const;
export const roomCenter = (room: GeneratedLayout['rooms'][number]) => ({
  x: (5 + room.column * 11) * 16 + 8,
  y: (5 + room.row * 11) * 16 + 8,
});
export function roomAt(layout: GeneratedLayout, position: { x: number; y: number }): number | null {
  const room = layout.rooms.find(
    (r) =>
      Math.abs(roomCenter(r).x - position.x) <= 72 && Math.abs(roomCenter(r).y - position.y) <= 72,
  );
  return room?.id ?? null;
}
// A compact stable hash keeps derived stream seeds bounded even with a 128-character world seed.
export function regionalSeed(seed: string, region: string, generation: number, attempt: number) {
  let hash = 2166136261;
  for (const c of JSON.stringify([seed, region, generation, attempt, GENERATOR_VERSION]))
    hash = Math.imul(hash ^ c.charCodeAt(0), 16777619) >>> 0;
  return `world-v1-${hash.toString(16)}`;
}
/** Explore inventory states, rather than assuming a connected graph is a solvable graph. */
export function validateLayout(layout: GeneratedLayout): void {
  layoutSchema.parse(layout);
  const rooms = new Map(layout.rooms.map((r) => [r.id, r]));
  if (rooms.size !== 9 || new Set(layout.rooms.map((r) => `${r.column},${r.row}`)).size !== 9)
    throw new Error('Duplicate room');
  const edges = new Set<string>();
  for (const e of layout.edges) {
    const a = rooms.get(e.from),
      b = rooms.get(e.to),
      key = [e.from, e.to].sort().join(':');
    if (!a || !b || Math.abs(a.column - b.column) + Math.abs(a.row - b.row) !== 1 || edges.has(key))
      throw new Error('Invalid room edge');
    edges.add(key);
  }
  for (const kind of ['entry', 'exit', 'key', 'switch', 'axe', 'anchor', 'reward'] as const)
    if (layout.placements.filter((p) => p.kind === kind).length !== 1)
      throw new Error(`Missing required ${kind}`);
  if (new Set(layout.placements.map((p) => p.id)).size !== layout.placements.length)
    throw new Error('Duplicate placement');
  for (const p of layout.placements) {
    const r = rooms.get(p.room);
    if (
      !r ||
      (p.kind.startsWith('gate-') || p.kind === 'shortcut'
        ? false
        : roomAt(layout, p.position) !== p.room)
    )
      throw new Error('Placement outside room');
  }
  const entry = layout.placements.find((p) => p.kind === 'entry');
  if (!entry) throw new Error('Missing entry');
  const queue = [{ room: entry.room, bits: 0 }],
    seen = new Set<string>(),
    reached = new Set<number>();
  const bit = (s: string) => (s === 'key' ? 1 : s === 'switch' ? 2 : s === 'axe' ? 4 : 0);
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    if (!item) throw new Error('Invalid queue');
    let bits = item.bits;
    for (const p of layout.placements.filter((p) => p.room === item.room)) bits |= bit(p.kind);
    const identity = `${item.room}:${bits}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    reached.add(item.room);
    for (const e of layout.edges) {
      const to = e.from === item.room ? e.to : e.to === item.room ? e.from : null;
      if (to !== null && (!e.requires || (bits & bit(e.requires)) !== 0))
        queue.push({ room: to, bits });
    }
    if (seen.size > 72) throw new Error('Unbounded dependency search');
  }
  if (reached.size !== 9) throw new Error('Unsolvable key/switch/tool dependency');
  const anchor = layout.placements.find((p) => p.kind === 'anchor'),
    reward = layout.placements.find((p) => p.kind === 'reward');
  if (anchor?.room !== reward?.room) throw new Error('Anchor reward must remain accessible');
}
function candidate(
  seed: string,
  region: string,
  biome: Biome,
  generation: number,
  attempt: number,
  fallback: boolean,
): Geometry {
  const random = new RandomStreams(regionalSeed(seed, region, generation, attempt));
  const orientation = fallback ? 0 : random.integer('terrain', 8);
  const transform = (column: number, row: number) => {
    let x = orientation >= 4 ? 2 - column : column,
      y = row;
    for (let n = 0; n < orientation % 4; n++) [x, y] = [2 - y, x];
    return { column: x, row: y };
  };
  const tags: GeneratedLayout['rooms'][number]['tag'][] = [
    'entry',
    'key',
    'trail',
    'switch',
    'trail',
    'tool',
    'anchor',
    'trail',
    'secret',
  ];
  const path = [0, 1, 2, 5, 4, 3, 6];
  const rooms = Array.from({ length: 9 }, (_, id) => ({
    id,
    ...transform(id % 3, Math.floor(id / 3)),
    template: (['grove', 'pillars', 'camp'] as const)[random.integer('terrain', 3)] ?? 'grove',
    tag: tags[path.indexOf(id)] ?? (id === 8 ? 'secret' : 'trail'),
  }));
  const edges: GeneratedLayout['edges'] = path.slice(1).map((to, i) => ({
    from: path[i] ?? 0,
    to,
    requires: i === 1 ? 'key' : i === 3 ? 'switch' : i === 5 ? 'axe' : null,
    shortcut: false,
  }));
  edges.push(
    { from: 4, to: 7, requires: null, shortcut: false },
    { from: 5, to: 8, requires: null, shortcut: false },
    { from: 7, to: 6, requires: 'axe', shortcut: true },
  );
  const placements: GeneratedLayout['placements'] = [];
  const prefix = `${region.slice(7)}-g${generation}`;
  const add = (
    kind: GeneratedLayout['placements'][number]['kind'],
    room: number,
    dx = 0,
    dy = 0,
  ) => {
    const r = rooms.find((r) => r.id === room);
    if (!r) throw new Error('Missing room');
    const center = roomCenter(r);
    placements.push({
      id: entityIdSchema.parse(`entity:${prefix}-${kind}`),
      kind,
      room,
      position: { x: center.x + dx, y: center.y + dy },
    });
  };
  add('entry', 0, -24, 0);
  add('exit', 0, 24, 0);
  add('key', 1, 24, 0);
  add('switch', 5, 24, 0);
  add('axe', 3, 24, 0);
  add('anchor', 6, 0, -24);
  add('reward', 6, 24, 16);
  add('landmark', 4, 24, -16);
  add('secret', 8, 24, 0);
  add('resource', 7, 24, 0);
  add('encounter', 2, -24, 16);
  for (const edge of edges.filter((e) => e.requires)) {
    if (!edge.requires) continue;
    const a = rooms.find((r) => r.id === edge.from),
      b = rooms.find((r) => r.id === edge.to);
    if (!a || !b) throw new Error('Missing gate room');
    const p = roomCenter(a),
      q = roomCenter(b),
      kind = edge.shortcut ? 'shortcut' : (`gate-${edge.requires}` as const);
    placements.push({
      id: entityIdSchema.parse(`entity:${prefix}-${kind}`),
      kind,
      room: edge.from,
      position: {
        x: Math.floor((p.x + q.x) / 32) * 16 + 8,
        y: Math.floor((p.y + q.y) / 32) * 16 + 8,
      },
    });
  }
  const links = EXPEDITIONS.find((e) => e.id === region)?.links ?? [];
  for (const [i] of links.entries()) {
    const r = rooms.find((r) => r.id === ([0, 1, 3, 8, 6][i] ?? 0));
    if (!r) throw new Error('Missing portal room');
    const c = roomCenter(r);
    placements.push({
      id: entityIdSchema.parse(`entity:${prefix}-portal-${i}`),
      kind: 'portal',
      room: r.id,
      position: { x: c.x - 24, y: c.y + 24 },
    });
  }
  const layout = layoutSchema.parse({
    version: 1,
    seed: regionalSeed(seed, region, generation, attempt),
    biome,
    generation,
    attempt,
    fallback,
    rooms,
    edges,
    placements,
  });
  validateLayout(layout);
  const width = 35,
    height = 35,
    tiles = Array<number>(width * height).fill(0);
  const floor = (x: number, y: number) => {
    if (x >= 0 && y >= 0 && x < width && y < height) tiles[y * width + x] = 1;
  };
  for (const r of rooms) {
    const ox = 1 + r.column * 11,
      oy = 1 + r.row * 11;
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) floor(ox + x, oy + y);
    for (const [x, y] of ROOM_TEMPLATES[r.template].obstacles) tiles[(oy + y) * width + ox + x] = 0;
  }
  for (const e of edges) {
    const a = rooms.find((r) => r.id === e.from),
      b = rooms.find((r) => r.id === e.to);
    if (!a || !b) throw new Error('Missing corridor');
    const p = roomCenter(a),
      q = roomCenter(b),
      x1 = Math.floor(p.x / 16),
      y1 = Math.floor(p.y / 16),
      x2 = Math.floor(q.x / 16),
      y2 = Math.floor(q.y / 16);
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
        for (let d = -1; d <= 1; d++) floor(x + (x1 === x2 ? d : 0), y + (y1 === y2 ? d : 0));
  }
  return geometrySchema.parse({
    version: 1,
    generated: layout,
    width,
    height,
    tilePixels: 16,
    tiles,
    objects: placements.map((p) => ({ id: p.id, position: p.position })),
  });
}
export function generateRegion(
  seed: string,
  region: string,
  biome: Biome,
  generation = 1,
  accept: (geometry: Geometry) => boolean = () => true,
): Geometry {
  for (let attempt = 0; attempt < GENERATION_ATTEMPTS - 1; attempt++) {
    let geometry: Geometry;
    try {
      geometry = candidate(seed, region, biome, generation, attempt, false);
      validateGeneratedGeometry(geometry);
    } catch {
      continue;
    }
    if (accept(geometry)) return geometry;
  }
  // The bounded fallback is validated too; caller rejection cannot cause an infinite retry.
  const geometry = candidate(seed, region, biome, generation, 3, true);
  validateGeneratedGeometry(geometry);
  if (!accept(geometry)) throw new Error('Safe fallback rejected');
  return geometry;
}

/** Check stored tiles as well as abstract dependencies; a valid graph cannot excuse a blocked exit. */
export function validateGeneratedGeometry(geometry: Geometry): void {
  const layout = geometry.generated;
  if (!layout) return;
  validateLayout(layout);
  if (geometry.width !== 35 || geometry.height !== 35 || geometry.tilePixels !== 16)
    throw new Error('Unsupported generated dimensions');
  for (const p of layout.placements) {
    const object = geometry.objects.find((o) => o.id === p.id);
    if (!object || object.position.x !== p.position.x || object.position.y !== p.position.y)
      throw new Error('Missing generated placement');
  }
  const entry = layout.placements.find((p) => p.kind === 'entry');
  if (!entry) throw new Error('Missing entrance');
  const start =
    Math.floor(entry.position.y / 16) * geometry.width + Math.floor(entry.position.x / 16);
  if (geometry.tiles[start] !== 1) throw new Error('Blocked generated entrance');
  const visited = new Set<number>([start]),
    queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const tile = queue[i];
    if (tile === undefined) throw new Error('Invalid geometry queue');
    for (const next of [
      tile - 35,
      tile + 35,
      ...(tile % 35 > 0 ? [tile - 1] : []),
      ...(tile % 35 < 34 ? [tile + 1] : []),
    ])
      if (geometry.tiles[next] === 1 && !visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
  }
  if (visited.size !== geometry.tiles.filter((t) => t === 1).length)
    throw new Error('Disconnected generated tiles');
  for (const p of layout.placements)
    if (!visited.has(Math.floor(p.position.y / 16) * 35 + Math.floor(p.position.x / 16)))
      throw new Error('Blocked generated placement');
  for (const r of layout.rooms) {
    const p = roomCenter(r);
    if (!visited.has(Math.floor(p.y / 16) * 35 + Math.floor(p.x / 16)))
      throw new Error('Blocked generated room');
  }
}
