import type { Geometry } from './model';
import type { RegionDefinition, Interaction } from './world';
import { entityIdSchema, regionIdSchema } from './ids';
import { roomCenter } from './generation';
import { EXPEDITIONS } from '../content/expeditions';
export function generatedDefinition(geometry: Geometry, regionId: string): RegionDefinition {
  const layout = geometry.generated,
    config = EXPEDITIONS.find((e) => e.id === regionId);
  if (!layout || !config) throw new Error('Unknown generated region');
  const entry = layout.rooms.find((r) => r.id === 0);
  if (!entry) throw new Error('Missing entry');
  const center = roomCenter(entry);
  const solids: RegionDefinition['solids'] = geometry.tiles.flatMap((tile, i) =>
    tile === 0
      ? [
          {
            id: `tile-${i}`,
            owner: null,
            rect: {
              x: (i % geometry.width) * 16,
              y: Math.floor(i / geometry.width) * 16,
              width: 16,
              height: 16,
            },
          },
        ]
      : [],
  );
  for (const p of layout.placements.filter(
    (p) => p.kind.startsWith('gate-') || p.kind === 'shortcut',
  )) {
    const edge = layout.edges.find(
      (e) =>
        e.from === p.room && (p.kind === 'shortcut' ? e.shortcut : `gate-${e.requires}` === p.kind),
    );
    if (!edge) throw new Error('Missing gate edge');
    const a = layout.rooms.find((r) => r.id === edge.from),
      b = layout.rooms.find((r) => r.id === edge.to);
    if (!a || !b) throw new Error('Missing gate room');
    const horizontal = a.row === b.row;
    solids.push({
      id: p.id,
      owner: p.id,
      rect: {
        x: p.position.x - (horizontal ? 8 : 24),
        y: p.position.y - (horizontal ? 24 : 8),
        width: horizontal ? 16 : 48,
        height: horizontal ? 48 : 16,
      },
    });
  }
  const labels: Record<string, string> = {
    entry: 'Trailhead',
    exit: 'Trail guide',
    key: 'Take brass key',
    switch: 'Activate sun switch',
    axe: 'Claim the trail axe',
    'gate-key': 'Unlock brass gate',
    'gate-switch': 'Open sun gate',
    'gate-axe': 'Clear fallen timber',
    shortcut: 'Open hidden shortcut',
    secret: 'Open hidden cache',
    landmark: 'The three stones',
    resource: 'Gather wild supplies',
    reward: 'Claim anchor reward',
    anchor: 'Anchor warden',
    encounter: 'Encounter',
  };
  const interactions: Interaction[] = layout.placements
    .filter((p) => p.kind !== 'anchor' && p.kind !== 'encounter' && p.kind !== 'entry')
    .map((p) => {
      const index = Number(p.id.split('-portal-')[1]);
      const destination = p.kind === 'portal' ? config.links[index] : undefined;
      return {
        id: p.id,
        position: p.position,
        kind: destination ? 'portal' : 'generated',
        label: destination
          ? `Travel to ${EXPEDITIONS.find((e) => e.id === destination)?.name ?? 'the village'}`
          : (labels[p.kind] ?? p.kind),
        text:
          p.kind === 'landmark'
            ? 'Three weathered stones mark this clearing. The trails will remain here when you return.'
            : p.kind === 'exit'
              ? 'Brass key → sun switch → trail axe → warden. Side trails hide supplies and a shortcut. Gates stay open; permanent tools survive every expedition.'
              : '',
        destination: destination
          ? {
              regionId: regionIdSchema.parse(destination),
              spawn: destination === 'region:clearing' ? 'start' : 'entry',
            }
          : null,
      };
    });
  return {
    id: regionIdSchema.parse(regionId),
    name: config.name,
    style: config.biome,
    width: geometry.width * 16,
    height: geometry.height * 16,
    spawns: [{ id: 'entry', position: { x: center.x, y: center.y + 24 }, facing: 'up' }],
    objects: geometry.objects,
    solids,
    water: [],
    interactions,
  };
}
export const EXPEDITION_PORTAL: Interaction = {
  id: entityIdSchema.parse('entity:clearing-expedition'),
  kind: 'portal',
  position: { x: 80, y: 240 },
  label: 'Enter the persistent forest',
  text: '',
  destination: { regionId: regionIdSchema.parse('region:forest'), spawn: 'entry' },
};
