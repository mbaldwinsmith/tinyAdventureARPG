import type { AssetManifest } from './definitions';
import type { SourceRect } from './terrain';
import { validateRect } from './terrain';
import type { Direction } from './hero-animations';

export const SCENERY_LAYERS = ['base', 'fitting', 'rider', 'roof', 'canopy'] as const;
export type SceneryLayer = (typeof SCENERY_LAYERS)[number];
export interface SceneryPart {
  id: string;
  rect: SourceRect;
  x: number;
  y: number;
  layer: SceneryLayer;
}
export interface SceneryDefinition {
  id: string;
  kind: 'tree' | 'building' | 'furniture' | 'boat' | 'prop';
  width: number;
  height: number;
  foot: { x: number; y: number };
  parts: SceneryPart[];
  note: string;
  sockets?: Readonly<Record<string, { x: number; y: number }>>;
}
const rect = (
  texture: string,
  x: number,
  y: number,
  width: number,
  height: number,
): SourceRect => ({ texture, x, y, width, height });
const part = (
  id: string,
  source: SourceRect,
  x: number,
  y: number,
  layer: SceneryLayer = 'base',
): SceneryPart => ({ id, rect: source, x, y, layer });
const definitions: SceneryDefinition[] = [];
function single(
  id: string,
  kind: SceneryDefinition['kind'],
  source: SourceRect,
  note = 'Inspected whole prop; foot is a presentation reference, not a collision body.',
) {
  definitions.push({
    id,
    kind,
    width: source.width,
    height: source.height,
    foot: { x: Math.floor(source.width / 2), y: Math.max(0, source.height - 2) },
    parts: [part('body', source, 0, 0)],
    note,
  });
}
definitions.push({
  id: 'tree-original',
  kind: 'tree',
  width: 48,
  height: 54,
  foot: { x: 24, y: 52 },
  parts: [
    part('trunk', rect('scenery-tree-trunk', 0, 0, 18, 16), 15, 38),
    part('canopy', rect('scenery-tree-canopy', 0, 0, 48, 46), 0, 0, 'canopy'),
  ],
  note: 'Separate supplied trunk and crown align at the original 48×54 full-tree footprint.',
});
for (let colour = 0; colour < 4; colour++) {
  for (let form = 0; form < 4; form++)
    definitions.push({
      id: `tree-broad-${colour + 1}-${form + 1}`,
      kind: 'tree',
      width: 48,
      height: 64,
      foot: { x: 24, y: 62 },
      parts: [
        part(
          'lower-silhouette',
          rect('scenery-broad-trees', form * 48, colour * 64 + 48, 48, 16),
          0,
          48,
        ),
        part('canopy', rect('scenery-broad-trees', form * 48, colour * 64, 48, 48), 0, 0, 'canopy'),
      ],
      note: '48×64 cells despite the 48x48 filename. Lower silhouette may include low foliage; collision stays independent.',
    });
  for (let snow = 0; snow < 2; snow++)
    for (let trunk = 0; trunk < 2; trunk++)
      definitions.push({
        id: `tree-pine-${colour + 1}-${snow + 1}-${trunk + 1}`,
        kind: 'tree',
        width: 32,
        height: 48,
        foot: { x: 16, y: 46 },
        parts: [
          part('trunk', rect('scenery-pines', (6 + trunk) * 32, colour * 48, 32, 48), 0, 0),
          part(
            'canopy',
            rect('scenery-pines', (4 + snow) * 32, colour * 48, 32, 48),
            0,
            0,
            'canopy',
          ),
        ],
        note: 'Compose separately supplied canopy and stump cells; snow and trunk colours are independent.',
      });
}
definitions.push({
  id: 'tree-palm',
  kind: 'tree',
  width: 48,
  height: 48,
  foot: { x: 24, y: 46 },
  parts: [
    part('trunk', rect('scenery-palms', 0, 32, 48, 16), 0, 32),
    part('canopy', rect('scenery-palms', 0, 0, 48, 32), 0, 0, 'canopy'),
  ],
  note: 'Palm silhouette split at y=32; fruits/stumps remain separate source objects.',
});
for (const material of ['plaster', 'wood'])
  for (const shape of [1, 2, 3, 4])
    for (const colour of ['blue', 'green', 'red']) {
      const width = shape > 2 ? 80 : 64,
        height = shape % 2 === 0 ? 80 : 64,
        roofHeight = shape === 4 ? 56 : 42;
      const texture = `scenery-house-${material}-${shape}-${colour}`;
      definitions.push({
        id: `house-${material}-${shape}-${colour}`,
        kind: 'building',
        width,
        height,
        foot: { x: width / 2, y: height - 2 },
        parts: [
          part('facade', rect(texture, 0, roofHeight, width, height - roofHeight), 0, roofHeight),
          part('roof', rect(texture, 0, 0, width, roofHeight), 0, 0, 'roof'),
        ],
        sockets: { door: { x: shape < 3 ? 21 : shape === 3 ? 40 : 56, y: height - 2 } },
        note:
          shape === 4
            ? 'Roof/upper-storey silhouette is grouped; facade and doorway remain distinct presentation layers.'
            : 'Roof and facade partition the supplied whole PNG without rescaling.',
      });
    }
const furniture: readonly (readonly [string, number, number])[] = [
  ['bedside-table', 16, 16],
  ['closet', 32, 32],
  ['bathtub-left', 32, 32],
  ['bathtub-right', 32, 32],
  ['bathroom-sink', 32, 32],
  ['toilet', 16, 32],
  ['bin', 16, 16],
  ['fridge', 16, 32],
  ['furnace', 16, 32],
  ['kitchen-sink', 16, 16],
  ['bookcase-large', 32, 32],
  ['bookcase-small', 16, 32],
  ['small-table', 16, 16],
  ['map', 16, 16],
  ['picture', 16, 16],
  ['window', 16, 16],
  ['window-double', 32, 16],
  ['plant-green', 16, 32],
  ['plant-pink', 16, 32],
  ['plant-dark', 16, 32],
  ['bed-blue', 32, 48],
  ['bed-brown', 32, 48],
  ['bed-green', 32, 48],
  ['bed-red', 32, 48],
  ['bench', 48, 16],
];
for (const [id, width, height] of furniture)
  single(id, 'furniture', rect(`scenery-${id}`, 0, 0, width, height));
for (let colour = 0; colour < 5; colour++)
  for (let direction = 0; direction < 4; direction++) {
    single(
      `sofa-big-${colour + 1}-${direction + 1}`,
      'furniture',
      rect('scenery-big-sofas', direction * 48, colour * 48, 48, 48),
    );
    single(
      `sofa-small-${colour + 1}-${direction + 1}`,
      'furniture',
      rect('scenery-small-sofas', direction * 32, colour * 32, 32, 32),
    );
  }
for (let colour = 0; colour < 4; colour++)
  for (let orientation = 0; orientation < 2; orientation++)
    single(
      `table-${colour + 1}-${orientation + 1}`,
      'furniture',
      rect('scenery-tables', orientation * 48, colour * 48, 48, 48),
    );
for (let direction = 0; direction < 4; direction++)
  single(`chair-${direction + 1}`, 'furniture', rect('scenery-chairs', direction * 32, 0, 32, 32));
for (let colour = 0; colour < 4; colour++)
  single(
    `trunk-${colour + 1}`,
    'furniture',
    rect('scenery-trunks', (colour % 2) * 32, Math.floor(colour / 2) * 16, 32, 16),
    'Four different closed chest colours; not an open/close animation.',
  );
for (let colour = 0; colour < 6; colour++) {
  single(
    `throne-${colour + 1}`,
    'prop',
    rect('scenery-thrones', (colour % 3) * 48, Math.floor(colour / 3) * 48, 48, 48),
  );
  for (let pose = 0; pose < 4; pose++)
    single(
      `treasure-chest-${colour + 1}-${pose + 1}`,
      'prop',
      rect('scenery-big-chests', pose * 32, colour * 32, 32, 32),
      'Closed, two transition poses and open chest; these are presentation states, not implemented storage.',
    );
}
const boatDirections: Record<
  Direction,
  {
    column: number;
    row: number;
    sailRow: number;
    mastX: number;
    riderX: number;
    riderY: number;
    anchorX: number;
    anchorY: number;
  }
> = {
  right: {
    column: 0,
    row: 0,
    sailRow: 0,
    mastX: 26,
    riderX: 24,
    riderY: 69,
    anchorX: 45,
    anchorY: 51,
  },
  up: {
    column: 1,
    row: 0,
    sailRow: 2,
    mastX: 16,
    riderX: 32,
    riderY: 74,
    anchorX: 24,
    anchorY: 38,
  },
  left: {
    column: 0,
    row: 1,
    sailRow: 1,
    mastX: 5,
    riderX: 40,
    riderY: 69,
    anchorX: 3,
    anchorY: 51,
  },
  down: {
    column: 1,
    row: 1,
    sailRow: 3,
    mastX: 16,
    riderX: 32,
    riderY: 61,
    anchorX: 24,
    anchorY: 75,
  },
};
for (let hull = 0; hull < 4; hull++)
  for (let sail = 0; sail < 4; sail++)
    for (const direction of ['down', 'left', 'up', 'right'] as const) {
      const layout = boatDirections[direction];
      const heroRow = { down: 0, left: 1, up: 2, right: 3 }[direction];
      definitions.push({
        id: `boat-${hull + 1}-${sail + 1}-${direction}`,
        kind: 'boat',
        width: 64,
        height: 96,
        foot: { x: 32, y: 80 },
        parts: [
          part(
            'hull',
            rect('scenery-boat-hulls', (hull * 2 + layout.column) * 64, layout.row * 64, 64, 64),
            0,
            32,
          ),
          part('hatch', rect('scenery-boat-fittings', 0, 32, 16, 16), 24, 53, 'fitting'),
          part(
            'anchor',
            rect('scenery-boat-fittings', 0, 0, 16, 16),
            layout.anchorX,
            layout.anchorY,
            'fitting',
          ),
          part(
            'rider',
            rect('hero-1-idle', 0, heroRow * 16, 16, 16),
            layout.riderX - 8,
            layout.riderY - 14,
            'rider',
          ),
          part(
            'sail',
            rect('scenery-boat-sails', sail * 32, layout.sailRow * 64, 32, 64),
            32 - layout.mastX,
            2,
            'canopy',
          ),
        ],
        sockets: { mast: { x: 32, y: 64 }, rider: { x: layout.riderX, y: layout.riderY } },
        note: 'Dry transparent hull row; mast, hull, fittings and reference rider use separate rectangles. These offsets are presentation defaults; no sailing or boarding behaviour.',
      });
    }
for (let hull = 0; hull < 4; hull++)
  for (const direction of ['down', 'left', 'up', 'right'] as const)
    for (const wet of [0, 1]) {
      const layout = boatDirections[direction];
      single(
        `boat-hull-${hull + 1}-${direction}-${wet ? 'baked-water' : 'transparent'}`,
        'prop',
        rect(
          'scenery-boat-hulls',
          (hull * 2 + layout.column) * 64,
          (layout.row + wet * 2) * 64,
          64,
          64,
        ),
        wet
          ? 'Alternative with baked blue water: do not overlay onto differently coloured water.'
          : 'Transparent hull alternative for separate water composition.',
      );
    }
for (let colour = 0; colour < 3; colour++)
  for (const [name, row] of [
    ['anchor', 0],
    ['chest', 1],
    ['hatch', 2],
    ['pipe', 3],
  ] as const)
    single(
      `boat-fitting-${name}-${colour + 1}`,
      'prop',
      rect('scenery-boat-fittings', colour * 16, row * 16, 16, 16),
    );
single('boat-rail', 'prop', rect('scenery-boat-fittings', 0, 64, 48, 16));
single(
  'boat-rope',
  'prop',
  rect('scenery-boat-fittings', 48, 0, 15, 80),
  'The source is 63px wide. Preserve the trimmed 15px final column rather than assuming four full 16px columns.',
);
export const sceneryDefinitions: readonly SceneryDefinition[] = definitions;
export function sceneryById(id: string): SceneryDefinition {
  const definition = sceneryDefinitions.find((d) => d.id === id);
  if (!definition) throw new Error(`Unknown scenery definition: ${id}`);
  return definition;
}
export function validateScenery(textures: AssetManifest['assets']): void {
  const ids = new Set<string>();
  for (const definition of sceneryDefinitions) {
    if (ids.has(definition.id)) throw new Error(`Duplicate scenery ID: ${definition.id}`);
    ids.add(definition.id);
    if (!definition.parts.length) throw new Error(`Empty scenery: ${definition.id}`);
    const partIds = new Set<string>();
    for (const piece of definition.parts) {
      if (partIds.has(piece.id)) throw new Error(`Duplicate scenery part: ${definition.id}`);
      partIds.add(piece.id);
      validateRect(piece.rect, textures);
      if (
        !Number.isInteger(piece.x) ||
        !Number.isInteger(piece.y) ||
        piece.x < 0 ||
        piece.y < 0 ||
        piece.x + piece.rect.width > definition.width ||
        piece.y + piece.rect.height > definition.height
      )
        throw new Error(`Scenery composition out of bounds: ${definition.id}`);
    }
    for (const point of [definition.foot, ...Object.values(definition.sockets ?? {})])
      if (point.x < 0 || point.y < 0 || point.x > definition.width || point.y > definition.height)
        throw new Error(`Scenery anchor outside composition: ${definition.id}`);
  }
}
