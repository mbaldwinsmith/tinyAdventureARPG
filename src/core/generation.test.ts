import { describe, it, expect } from 'vitest';
import {
  generateRegion,
  validateLayout,
  roomCenter,
  regionalSeed,
  GENERATION_ATTEMPTS,
  ROOM_TEMPLATES,
  validateGeneratedGeometry,
} from './generation';
import { generatedDefinition } from './generated-world';
import { freeFoot, segmentBlocked } from './motion';
import { EXPEDITIONS } from '../content/expeditions';
import { RandomStreams } from './random';
import { copyData } from './data';
function connected(tiles: readonly number[], width: number, start: number) {
  const seen = new Set<number>([start]),
    queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (current === undefined) throw new Error('Missing tile');
    for (const next of [
      current - width,
      current + width,
      ...(current % width > 0 ? [current - 1] : []),
      ...(current % width < width - 1 ? [current + 1] : []),
    ])
      if (tiles[next] === 1 && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
  }
  return seen;
}
describe('stored regional geometry and bounded capability validation', () => {
  it('reproduces layouts without consuming the session loot, encounter or death streams', () => {
    const random = new RandomStreams('repro'),
      before = random.snapshot();
    const a = generateRegion('repro', 'region:forest', 'forest');
    expect(generateRegion('repro', 'region:forest', 'forest')).toEqual(a);
    expect(generateRegion('other', 'region:forest', 'forest')).not.toEqual(a);
    expect(random.snapshot()).toEqual(before);
    expect(regionalSeed('x'.repeat(128), 'region:forest', 1, 0)).toBe('world-v1-4db89c82');
    expect(a.generated?.placements.some((p) => p.kind === 'secret')).toBe(true);
  });
  it('checks 500 seed/biome fixtures for physical routes, legal gates, exits and clear template entrances', () => {
    const orientations = new Set<string>(),
      start = performance.now();
    for (let seed = 0; seed < 100; seed++)
      for (const config of EXPEDITIONS) {
        const geometry = generateRegion(`corpus-${seed}`, config.id, config.biome),
          layout = geometry.generated;
        if (!layout) throw new Error('Missing layout');
        validateLayout(layout);
        orientations.add(JSON.stringify(layout.rooms.map((r) => [r.column, r.row])));
        const definition = generatedDefinition(geometry, config.id);
        for (const spawn of definition.spawns)
          expect(
            freeFoot(
              spawn.position,
              definition.width,
              definition.height,
              definition.solids.map((s) => s.rect),
            ),
          ).toBe(true);
        const first = geometry.tiles.indexOf(1),
          reachable = connected(geometry.tiles, geometry.width, first);
        expect(reachable.size).toBe(geometry.tiles.filter((t) => t === 1).length);
        for (const room of layout.rooms) {
          const center = roomCenter(room);
          expect(
            reachable.has(Math.floor(center.y / 16) * geometry.width + Math.floor(center.x / 16)),
          ).toBe(true);
        }
        for (const p of layout.placements.filter(
          (p) => !p.kind.startsWith('gate-') && p.kind !== 'shortcut',
        ))
          expect(
            reachable.has(
              Math.floor(p.position.y / 16) * geometry.width + Math.floor(p.position.x / 16),
            ),
          ).toBe(true);
        for (const p of layout.placements.filter(
          (p) => !['anchor', 'encounter', 'entry'].includes(p.kind),
        )) {
          const solids = definition.solids.filter((s) => s.owner !== p.id).map((s) => s.rect);
          expect(
            [
              { x: p.position.x + 20, y: p.position.y },
              { x: p.position.x - 20, y: p.position.y },
              { x: p.position.x, y: p.position.y + 20 },
              { x: p.position.x, y: p.position.y - 20 },
            ].some(
              (q) =>
                freeFoot(
                  q,
                  definition.width,
                  definition.height,
                  definition.solids.map((s) => s.rect),
                ) && !solids.some((s) => segmentBlocked(q, p.position, s)),
            ),
          ).toBe(true);
        }
        expect(layout.attempt).toBeLessThan(GENERATION_ATTEMPTS);
      }
    expect(orientations.size).toBe(8);
    // A coarse regression ceiling, not a benchmark. The attempt bound is the hard guarantee.
    expect(performance.now() - start).toBeLessThan(15000);
    for (const template of Object.values(ROOM_TEMPLATES))
      for (const [x, y] of template.obstacles)
        expect([0, 4, 8].includes(x) || [0, 4, 8].includes(y)).toBe(false);
  });
  it('rejects self-locked key, switch, tool and disconnected/invalid entrance graphs', () => {
    const layout = generateRegion('bad-gates', 'region:crypt', 'crypt').generated;
    if (!layout) throw new Error('Missing fixture');
    for (const [kind, room] of [
      ['key', 2],
      ['switch', 4],
      ['axe', 6],
    ] as const) {
      const bad = copyData(layout),
        placement = bad.placements.find((p) => p.kind === kind),
        target = bad.rooms.find((r) => r.id === room);
      if (!placement || !target) throw new Error('Missing dependency');
      placement.room = room;
      placement.position = roomCenter(target);
      expect(() => validateLayout(bad)).toThrow('Unsolvable');
    }
    const disconnected = copyData(layout);
    disconnected.edges = disconnected.edges.filter((e) => e.to !== 8);
    expect(() => validateLayout(disconnected)).toThrow();
    const invalid = copyData(layout);
    const edge = invalid.edges[0];
    if (edge) edge.to = 8;
    expect(() => validateLayout(invalid)).toThrow('Invalid room edge');
  });
  it('rejects retained geometry whose physical entrance or placements were blocked after generation', () => {
    const geometry = generateRegion('blocked', 'region:forest', 'forest');
    const entry = geometry.generated?.placements.find((p) => p.kind === 'entry');
    if (!entry) throw new Error('Missing entry');
    geometry.tiles[Math.floor(entry.position.y / 16) * 35 + Math.floor(entry.position.x / 16)] = 0;
    expect(() => validateGeneratedGeometry(geometry)).toThrow('Blocked generated entrance');
    const changed = generateRegion('objects', 'region:forest', 'forest'),
      object = changed.objects[0];
    if (!object) throw new Error('Missing object');
    object.position.x++;
    expect(() => validateGeneratedGeometry(changed)).toThrow('Missing generated placement');
  });
  it('uses a reproducible safe fallback and terminates when even the fallback is rejected', () => {
    let attempts = 0;
    const fallback = generateRegion('retry', 'region:crypt', 'crypt', 1, () => ++attempts === 4);
    expect(attempts).toBe(4);
    expect(fallback.generated).toMatchObject({ attempt: 3, fallback: true });
    expect(() => generateRegion('retry', 'region:crypt', 'crypt', 1, () => false)).toThrow(
      'Safe fallback rejected',
    );
  });
});
