import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createAtlasLookup } from '../src/assets/atlas';
import { manifestSchema } from '../src/assets/definitions';
import {
  normalizeTerrainMask,
  terrainFrame,
  terrainMaskAt,
  terrainProfiles,
  biomeGround,
  validateTerrain,
} from '../src/assets/terrain';
import { sceneryDefinitions, validateScenery, sceneryById } from '../src/assets/scenery';
const manifest = manifestSchema.parse(
  JSON.parse(readFileSync('public/generated/manifest.json', 'utf8')),
);
const textures = manifest.assets;

describe('terrain topology contract', () => {
  it('resolves every promoted biome plain ground frame from the runtime atlas, beyond adjacency patches', () => {
    const lookup = createAtlasLookup(manifest);
    for (const palette of ['grasslands', 'desert', 'snow'] as const)
      expect(lookup(biomeGround(palette)).id).toBeTruthy();
    for (const id of ['tree-original', 'tree-palm'])
      for (const part of sceneryById(id).parts) expect(lookup(part.rect).id).toBeTruthy();
  });

  it('normalizes all neighbour inputs to 47 stable cases and removes disconnected diagonal claims', () => {
    const masks = new Set<number>();
    for (let mask = 0; mask < 256; mask++) {
      const normalized = normalizeTerrainMask(mask);
      masks.add(normalized);
      expect(normalizeTerrainMask(normalized)).toBe(normalized);
      for (const [diagonal, sides] of [
        [16, 3],
        [32, 6],
        [64, 12],
        [128, 9],
      ] as const)
        if ((normalized & diagonal) !== 0) expect(normalized & sides).toBe(sides);
    }
    expect(masks.size).toBe(47);
    expect(normalizeTerrainMask(240)).toBe(0);
    for (const value of [-1, 256, 1.5, NaN])
      expect(() => normalizeTerrainMask(value)).toThrow('integer');
  });
  it('handles isolated cells, open borders and inward corners while keeping Old Style limitations explicit', () => {
    const grid = ['.....', '.###.', '.##..', '.###.', '.....'];
    const has = (x: number, y: number) => grid[y]?.[x] === '#';
    const profile = terrainProfiles.find((p) => p.id === 'new-grasslands-dirt');
    const old = terrainProfiles.find((p) => p.id === 'old-grasslands-dirt');
    if (!profile || !old) throw new Error('Missing terrain fixture');
    expect(terrainMaskAt(has, 2, 2)).toBe(205);
    expect(terrainFrame(profile, terrainMaskAt(has, 2, 2))).not.toBeNull();
    expect(terrainFrame(old, 5)).toBeNull(); // A one-cell vertical path has no supplied Old Style cap/edge.
    expect(terrainFrame(profile, 5)).not.toBeNull();
    expect(terrainFrame(profile, 16)).toEqual(terrainFrame(profile, 0));
  });
  it('validates all selected source bounds and rejects the obsolete shoreline dimensions', () => {
    validateTerrain(textures);
    expect(() =>
      validateTerrain(
        textures.map((t) => (t.id === 'terrain-shore-updated' ? { ...t, height: 80 } : t)),
      ),
    ).toThrow('Updated shoreline');
  });
});
describe('layered scenery contract', () => {
  it('keeps all parts and attachment points in bounds without forcing props onto a 16px grid', () => {
    validateScenery(textures);
    expect(
      sceneryDefinitions.some((d) =>
        d.parts.some((p) => p.rect.width === 15 && p.rect.height === 80),
      ),
    ).toBe(true);
    expect(() => validateScenery(textures.filter((t) => t.id !== 'scenery-boat-sails'))).toThrow(
      'Source rectangle',
    );
  });
  it('partitions every selected building into nonoverlapping roof and facade with no missing pixels', () => {
    for (const definition of sceneryDefinitions.filter((d) => d.kind === 'building')) {
      const occupancy = new Uint8Array(definition.width * definition.height);
      for (const piece of definition.parts)
        for (let y = 0; y < piece.rect.height; y++)
          for (let x = 0; x < piece.rect.width; x++) {
            const index = (piece.y + y) * definition.width + piece.x + x;
            occupancy[index] = (occupancy[index] ?? 0) + 1;
          }
      expect(occupancy.every((n) => n === 1)).toBe(true);
      expect(definition.sockets?.door?.y).toBe(definition.foot.y);
    }
  });
});
