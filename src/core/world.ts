import { z } from 'zod';
import { entityIdSchema, regionIdSchema } from './ids';
import { directionSchema, positionSchema } from './model';
import type { Region, Position, RetainedArea } from './model';
import { rectSchema, freeFoot } from './motion';
import type { Rect } from './motion';
import { freezeData } from './data';

const interactionSchema = z.strictObject({
  id: entityIdSchema,
  kind: z.enum([
    'door',
    'sign',
    'npc',
    'chest',
    'farm-plot',
    'carryable',
    'portal',
    'generated',
    'mechanism',
    'village',
  ]),
  position: positionSchema,
  label: z.string().min(1).max(80),
  text: z.string().max(1000),
  destination: z.strictObject({ regionId: regionIdSchema, spawn: z.string().min(1) }).nullable(),
});
export const worldDefinitionSchema = z
  .array(
    z.strictObject({
      id: regionIdSchema,
      name: z.string().min(1),
      style: z.enum([
        'clearing',
        'cottage',
        'woodland',
        'practice',
        'forest',
        'desert',
        'winter',
        'coast',
        'crypt',
      ]),
      width: z.number().int().min(64).max(4096),
      height: z.number().int().min(64).max(4096),
      spawns: z
        .array(
          z.strictObject({
            id: z.string().min(1),
            position: positionSchema,
            facing: directionSchema,
          }),
        )
        .min(1),
      objects: z.array(z.strictObject({ id: entityIdSchema, position: positionSchema })),
      solids: z.array(
        z.strictObject({
          id: z.string().min(1),
          owner: entityIdSchema.nullable(),
          rect: rectSchema,
        }),
      ),
      water: z.array(rectSchema),
      interactions: z.array(interactionSchema),
    }),
  )
  .min(1);
export type WorldDefinition = z.infer<typeof worldDefinitionSchema>;
export type RegionDefinition = WorldDefinition[number];
export type Interaction = z.infer<typeof interactionSchema>;
export class WorldRegistry {
  readonly regions: Readonly<WorldDefinition>;
  constructor(input: unknown) {
    const regions = worldDefinitionSchema.parse(input);
    if (new Set(regions.map((r) => r.id)).size !== regions.length)
      throw new Error('Duplicate authored region');
    this.regions = freezeData(regions);
    const objects = new Set<string>();
    for (const region of regions) {
      for (const object of region.objects) {
        if (objects.has(object.id)) throw new Error('Duplicate authored object');
        objects.add(object.id);
      }
      if (new Set(region.spawns.map((s) => s.id)).size !== region.spawns.length)
        throw new Error('Duplicate spawn');
      if (new Set(region.solids.map((s) => s.id)).size !== region.solids.length)
        throw new Error('Duplicate solid');
      if (new Set(region.interactions.map((s) => s.id)).size !== region.interactions.length)
        throw new Error('Duplicate interaction');
      for (const solid of region.solids)
        if (solid.owner !== null && !region.objects.some((o) => o.id === solid.owner))
          throw new Error('Unknown solid owner');
      for (const target of region.interactions) {
        if (!region.objects.some((o) => o.id === target.id))
          throw new Error('Unknown interaction object');
        if (target.kind === 'door') {
          if (!target.destination) throw new Error('Door needs a destination');
          this.spawn(target.destination.regionId, target.destination.spawn);
        } else if (target.kind !== 'portal' && target.destination !== null)
          throw new Error('Non-door destination');
      }
      for (const spawn of region.spawns)
        if (
          !freeFoot(
            spawn.position,
            region.width,
            region.height,
            region.solids.map((s) => s.rect),
          )
        )
          throw new Error(`Blocked spawn: ${region.id}/${spawn.id}`);
    }
  }
  region(id: string): RegionDefinition {
    const r = this.regions.find((r) => r.id === id);
    if (!r) throw new Error(`Unknown authored region: ${id}`);
    return r;
  }
  spawn(regionId: string, id: string) {
    const spawn = this.region(regionId).spawns.find((s) => s.id === id);
    if (!spawn) throw new Error(`Unknown spawn: ${regionId}/${id}`);
    return spawn;
  }
  solidEntries(id: string, state: Region) {
    if (state.kind !== 'surface' || state.phase === 'unvisited')
      throw new Error('Missing active geometry');
    return solidEntriesFor(this.region(id), state);
  }
  solids(id: string, state: Region): Rect[] {
    return this.solidEntries(id, state).map((s) => s.rect);
  }
}
export function targetInReach(
  position: Readonly<Position>,
  facing: z.infer<typeof directionSchema>,
  target: Position,
  reach = 26,
): boolean {
  const dx = target.x - position.x,
    dy = target.y - position.y;
  if (Math.hypot(dx, dy) > reach) return false;
  return facing === 'up'
    ? dy <= 4
    : facing === 'down'
      ? dy >= -4
      : facing === 'left'
        ? dx <= 4
        : dx >= -4;
}

export function solidEntriesFor(region: RegionDefinition, state: RetainedArea) {
  return region.solids.flatMap((s) => {
    if (
      s.owner !== null &&
      (state.changes.removedObjects.includes(s.owner) ||
        state.changes.openedPassages.includes(s.owner))
    )
      return [];
    const original = region.objects.find((o) => o.id === s.owner),
      current = state.geometry.objects.find((o) => o.id === s.owner);
    return [
      {
        owner: s.owner,
        rect: {
          ...s.rect,
          x: s.rect.x + (current && original ? current.position.x - original.position.x : 0),
          y: s.rect.y + (current && original ? current.position.y - original.position.y : 0),
        },
      },
    ];
  });
}
