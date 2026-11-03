import type { AssetManifest } from './definitions';

export interface SourceRect {
  texture: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export const TILE_PIXELS = 16;
/** N/E/S/W are bits 0–3; NE/SE/SW/NW are bits 4–7. Diagonals require both adjoining sides. */
export function normalizeTerrainMask(mask: number): number {
  if (!Number.isInteger(mask) || mask < 0 || mask > 255)
    throw new Error('Terrain mask must be an integer from 0 to 255.');
  let result = mask & 15;
  for (const [bit, sides] of [
    [16, 3],
    [32, 6],
    [64, 12],
    [128, 9],
  ])
    if (bit !== undefined && sides !== undefined && (mask & bit) !== 0 && (mask & sides) === sides)
      result |= bit;
  return result;
}
// Reviewed 47-case layout: do not infer this from a tileset filename or share it with Old Style.
const newStyleCells: Readonly<Record<number, readonly [number, number]>> = {
  0: [4, 2],
  1: [1, 4],
  2: [1, 3],
  3: [5, 2],
  4: [2, 4],
  5: [0, 4],
  6: [5, 0],
  7: [5, 1],
  8: [2, 3],
  9: [7, 2],
  10: [0, 3],
  11: [6, 2],
  12: [7, 0],
  13: [7, 1],
  14: [6, 0],
  15: [6, 1],
  19: [0, 2],
  23: [5, 3],
  27: [8, 4],
  31: [10, 0],
  38: [0, 0],
  39: [5, 4],
  46: [8, 3],
  47: [10, 2],
  55: [0, 1],
  63: [10, 1],
  76: [2, 0],
  77: [6, 4],
  78: [7, 3],
  79: [8, 2],
  95: [10, 3],
  110: [1, 0],
  111: [9, 2],
  127: [4, 1],
  137: [2, 2],
  139: [7, 4],
  141: [6, 3],
  143: [8, 0],
  155: [1, 2],
  159: [9, 0],
  175: [9, 3],
  191: [4, 0],
  205: [2, 1],
  207: [8, 1],
  223: [3, 0],
  239: [3, 1],
  255: [1, 1],
};
export const BIOME_PALETTES = ['original', 'grasslands', 'fall', 'desert', 'snow'] as const;
export type BiomePalette = (typeof BIOME_PALETTES)[number];
export const TERRAIN_SURFACES = ['dirt', 'water', 'chasm'] as const;
export type TerrainSurface = (typeof TERRAIN_SURFACES)[number];
export interface TerrainProfile {
  id: string;
  texture: string;
  style: 'new-47' | 'old-patch';
  palette: BiomePalette;
  surface: TerrainSurface | 'masonry-pit';
  row: number;
  columns: number;
  background: string;
}
const backgrounds: Record<BiomePalette, string> = {
  original: '#c8d45d',
  grasslands: '#63ab3f',
  fall: '#ff8933',
  desert: '#ffcf70',
  snow: '#f5ffe8',
};
export const terrainProfiles: readonly TerrainProfile[] = BIOME_PALETTES.flatMap((palette) => [
  ...TERRAIN_SURFACES.map((surface, index) => ({
    id: `new-${palette}-${surface}`,
    texture: `terrain-new-${palette}`,
    style: 'new-47' as const,
    palette,
    surface,
    row: index * 5,
    columns: palette === 'snow' ? 11 : 14,
    background: backgrounds[palette],
  })),
  ...(['dirt', 'masonry-pit', 'water', 'chasm'] as const).map((surface, index) => ({
    id: `old-${palette}-${surface}`,
    texture: `terrain-old-${palette}`,
    style: 'old-patch' as const,
    palette,
    surface,
    row: 1 + index * 3,
    columns: 5,
    background: backgrounds[palette],
  })),
]);
export function terrainFrame(profile: TerrainProfile, mask: number): SourceRect | null {
  const canonical = normalizeTerrainMask(mask);
  if (profile.style === 'new-47') {
    const cell = newStyleCells[canonical];
    if (!cell) throw new Error(`Missing terrain case ${canonical}`);
    return {
      texture: profile.texture,
      x: cell[0] * 16,
      y: (profile.row + cell[1]) * 16,
      width: 16,
      height: 16,
    };
  }
  // Old Style has 3×3 patches, one island and four concave corners, but no supplied thin caps/crosses.
  const oldCells: Readonly<Record<number, readonly [number, number]>> = {
    0: [3, 0],
    38: [0, 0],
    110: [1, 0],
    76: [2, 0],
    55: [0, 1],
    255: [1, 1],
    205: [2, 1],
    19: [0, 2],
    155: [1, 2],
    137: [2, 2],
    127: [4, 2],
    191: [4, 1],
    223: [3, 1],
    239: [3, 2],
  };
  const cell = oldCells[canonical];
  return cell
    ? {
        texture: profile.texture,
        x: cell[0] * 16,
        y: (profile.row + cell[1]) * 16,
        width: 16,
        height: 16,
      }
    : null;
}
export function terrainMaskAt(
  hasTile: (x: number, y: number) => boolean,
  x: number,
  y: number,
): number {
  let mask = 0;
  for (const [dx, dy, bit] of [
    [0, -1, 1],
    [1, 0, 2],
    [0, 1, 4],
    [-1, 0, 8],
    [1, -1, 16],
    [1, 1, 32],
    [-1, 1, 64],
    [-1, -1, 128],
  ] as const)
    if (hasTile(x + dx, y + dy)) mask |= bit;
  return normalizeTerrainMask(mask);
}
export function shoreFrame(
  column: 0 | 1 | 2,
  row: 0 | 1 | 2,
  phase: number,
  mode: 'water-patch' | 'land-cutout' = 'water-patch',
): SourceRect {
  if (!Number.isInteger(phase) || phase < 0 || phase > 3)
    throw new Error('Shore phase must be 0–3.');
  return {
    texture: 'terrain-shore-updated',
    x: (phase * 3 + column) * 16,
    y: ((mode === 'water-patch' ? 3 : 0) + row) * 16,
    width: 16,
    height: 16,
  };
}
export function validateRect(rect: SourceRect, textures: AssetManifest['assets']): void {
  const source = textures.find((t) => t.id === rect.texture);
  if (
    !source ||
    ![rect.x, rect.y, rect.width, rect.height].every(Number.isInteger) ||
    rect.x < 0 ||
    rect.y < 0 ||
    rect.width < 1 ||
    rect.height < 1 ||
    rect.x + rect.width > source.width ||
    rect.y + rect.height > source.height
  )
    throw new Error(
      `Source rectangle missing or out of bounds: ${rect.texture} (${rect.x},${rect.y},${rect.width},${rect.height})`,
    );
}
export function validateTerrain(textures: AssetManifest['assets']): void {
  if (new Set(terrainProfiles.map((p) => p.id)).size !== terrainProfiles.length)
    throw new Error('Duplicate terrain profile ID');
  for (const profile of terrainProfiles) {
    const texture = textures.find((t) => t.id === profile.texture);
    if (
      !texture ||
      texture.width !== profile.columns * 16 ||
      texture.height !== (profile.style === 'new-47' ? 240 : 208)
    )
      throw new Error(`Terrain profile no longer matches its source: ${profile.id}`);
    for (let mask = 0; mask < 256; mask++) {
      const rect = terrainFrame(profile, mask);
      if (rect) validateRect(rect, textures);
    }
  }
  const shore = textures.find((t) => t.id === 'terrain-shore-updated');
  if (!shore || shore.width !== 192 || shore.height !== 96)
    throw new Error(
      'Updated shoreline source must be 192×96, excluding its older 192×80 alternative.',
    );
  for (const mode of ['water-patch', 'land-cutout'] as const)
    for (let phase = 0; phase < 4; phase++)
      for (const x of [0, 1, 2] as const)
        for (const y of [0, 1, 2] as const) validateRect(shoreFrame(x, y, phase, mode), textures);
}

export function biomeGround(palette: BiomePalette): SourceRect {
  return { texture: `terrain-new-${palette}`, x: 48, y: 32, width: 16, height: 16 };
}
export const clearingGrass: SourceRect = biomeGround('grasslands');
export const clearingGrassDetails: readonly SourceRect[] = [176, 192, 208].map((x) => ({
  texture: 'terrain-new-grasslands',
  x,
  y: 96,
  width: 16,
  height: 16,
}));
