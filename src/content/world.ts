import { EXPEDITION_PORTAL } from '../core/generated-world';
import { WorldRegistry } from '../core/world';
import { CLEARING } from './clearing';

const object = (id: string, x: number, y: number) => ({ id: `entity:${id}`, position: { x, y } });
const solid = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  owner: string | null = null,
) => ({ id, owner: owner ? `entity:${owner}` : null, rect: { x, y, width, height } });
const interaction = (
  id: string,
  kind: string,
  x: number,
  y: number,
  label: string,
  text: string,
  destination: { regionId: string; spawn: string } | null = null,
) => ({ ...object(id, x, y), kind, label, text, destination });
export const WOODLAND_TREES = Array.from({ length: 40 }, (_, i) => ({
  x: 64 + (i % 8) * 112,
  y: 72 + Math.floor(i / 8) * 96,
})).filter((p) => Math.abs(p.x - 480) > 40 && Math.abs(p.y - 256) > 30);
export const PRACTICE_BENCHES = [
  { x: 174, y: 119 },
  { x: 320, y: 160 },
] as const;
export const PREVIEW_WORLD = new WorldRegistry([
  {
    id: 'region:clearing',
    name: 'Wayfarer’s clearing',
    style: 'clearing',
    width: 480,
    height: 272,
    spawns: [
      { id: 'start', position: { ...CLEARING.spawn }, facing: 'down' },
      { id: 'cottage-return', position: { x: 117, y: 127 }, facing: 'down' },
      { id: 'woodland-return', position: { x: 248, y: 32 }, facing: 'down' },
    ],
    objects: [
      ...CLEARING.trees.map(([x, y], i) => object(`clearing-tree-${i}`, x, y)),
      ...CLEARING.bushes.map(([x, y], i) => object(`clearing-bush-${i}`, x, y)),
      ...CLEARING.rocks.map(([x, y], i) => object(`clearing-rock-${i}`, x, y)),
      object('clearing-house', 128, 112),
      object('clearing-bench', 174, 119),
      object('clearing-boat', 385, 208),
      object('clearing-sign', 277, 151),
      object('clearing-chest', 211, 155),
      object('clearing-door', 117, 112),
      object('clearing-gate', 248, 16),
      object('clearing-wayfarer', 310, 172),
      object('clearing-plot', 176, 202),
      object('clearing-box', 260, 198),
      { id: EXPEDITION_PORTAL.id, position: EXPEDITION_PORTAL.position },
    ],
    solids: [
      ...CLEARING.trees.map(([x, y], i) =>
        solid(`tree-${i}`, x - 6, y - 8, 12, 8, `clearing-tree-${i}`),
      ),
      ...CLEARING.bushes.map(([x, y], i) =>
        solid(`bush-${i}`, x - 6, y - 6, 12, 10, `clearing-bush-${i}`),
      ),
      ...CLEARING.rocks.map(([x, y], i) =>
        solid(`rock-${i}`, x - 6, y - 6, 12, 10, `clearing-rock-${i}`),
      ),
      solid('house', 98, 92, 60, 20, 'clearing-house'),
      solid('bench', 150, 111, 48, 8, 'clearing-bench'),
      solid('boat', 363, 192, 44, 16, 'clearing-boat'),
      solid('chest', 205, 145, 12, 10, 'clearing-chest'),
      solid('sign', 272, 141, 10, 10, 'clearing-sign'),
      solid('wayfarer', 306, 165, 8, 7, 'clearing-wayfarer'),
      solid('box', 254, 190, 12, 8, 'clearing-box'),
    ],
    water: [{ x: 336, y: 144, width: 96, height: 80 }],
    interactions: [
      EXPEDITION_PORTAL,
      interaction(
        'clearing-sign',
        'sign',
        277,
        151,
        'Read sign',
        'Welcome, wayfarer. The cottage is west of the chest; the woodland path leads north. E or the south face button lets you interact.',
      ),
      interaction(
        'clearing-chest',
        'chest',
        211,
        155,
        'Open travel chest',
        'An empty travel chest. Storage transactions will arrive with the inventory systems.',
      ),
      interaction('clearing-door', 'door', 117, 112, 'Enter cottage', '', {
        regionId: 'region:cottage',
        spawn: 'entry',
      }),
      interaction('clearing-gate', 'door', 248, 16, 'Enter woodland path', '', {
        regionId: 'region:woodland',
        spawn: 'entry',
      }),
      interaction(
        'clearing-wayfarer',
        'npc',
        310,
        172,
        'Talk to wayfarer',
        'A quiet place to start. Try carrying the small box, swimming in the pond, or following the path north. There is a whole Kingdom still to come.',
      ),
      interaction(
        'clearing-plot',
        'farm-plot',
        176,
        202,
        'Inspect soil',
        'A small prepared plot. Planting, watering and crop growth come with the farming milestone.',
      ),
      interaction('clearing-box', 'carryable', 260, 198, 'Lift small box', ''),
    ],
  },
  {
    id: 'region:cottage',
    name: 'Wayfarer’s cottage',
    style: 'cottage',
    width: 320,
    height: 192,
    spawns: [{ id: 'entry', position: { x: 160, y: 160 }, facing: 'up' }],
    objects: [
      object('cottage-door', 160, 184),
      object('cottage-chest', 230, 96),
      object('cottage-bench', 112, 88),
    ],
    solids: [
      solid('north-wall', 0, 0, 320, 24),
      solid('west-wall', 0, 0, 16, 192),
      solid('east-wall', 304, 0, 16, 192),
      solid('south-west-wall', 0, 176, 144, 16),
      solid('south-east-wall', 176, 176, 144, 16),
      solid('chest', 224, 86, 12, 10, 'cottage-chest'),
      solid('bench', 88, 80, 48, 8, 'cottage-bench'),
    ],
    water: [],
    interactions: [
      interaction('cottage-door', 'door', 160, 184, 'Leave cottage', '', {
        regionId: 'region:clearing',
        spawn: 'cottage-return',
      }),
      interaction(
        'cottage-chest',
        'chest',
        230,
        96,
        'Open cottage chest',
        'An empty local chest. Its location is separate from the travel chest outside.',
      ),
    ],
  },
  {
    id: 'region:woodland',
    name: 'The woodland path',
    style: 'woodland',
    width: 960,
    height: 544,
    spawns: [{ id: 'entry', position: { x: 480, y: 480 }, facing: 'up' }],
    objects: [
      ...WOODLAND_TREES.map((p, i) => object(`woodland-tree-${i}`, p.x, p.y)),
      object('woodland-gate', 480, 520),
      object('woodland-sign', 512, 272),
    ],
    solids: [
      ...WOODLAND_TREES.map((p, i) =>
        solid(`tree-${i}`, p.x - 6, p.y - 8, 12, 8, `woodland-tree-${i}`),
      ),
      solid('sign', 507, 262, 10, 10, 'woodland-sign'),
    ],
    water: [],
    interactions: [
      interaction('woodland-gate', 'door', 480, 520, 'Return to clearing', '', {
        regionId: 'region:clearing',
        spawn: 'woodland-return',
      }),
      interaction(
        'woodland-sign',
        'sign',
        512,
        272,
        'Read woodland sign',
        'The woodland continues beyond this first trail. This larger authored region demonstrates bounded camera follow; generated forests are still ahead.',
      ),
    ],
  },
  {
    id: 'region:practice',
    name: 'The practice field',
    style: 'practice',
    width: 480,
    height: 272,
    spawns: [{ id: 'entry', position: { x: 240, y: 220 }, facing: 'up' }],
    objects: [
      object('practice-door', 240, 256),
      ...PRACTICE_BENCHES.map((p, i) => object(`practice-bench-${i}`, p.x, p.y)),
    ],
    solids: PRACTICE_BENCHES.map((p, i) =>
      solid(`bench-${i}`, p.x - 24, p.y - 8, 48, 8, `practice-bench-${i}`),
    ),
    water: [],
    interactions: [
      interaction('practice-door', 'door', 240, 256, 'Leave practice field', '', {
        regionId: 'region:clearing',
        spawn: 'start',
      }),
    ],
  },
]);
export function woodlandPathAt(x: number, y: number): boolean {
  return (x >= 29 && x <= 30) || (y >= 15 && y <= 16);
}
