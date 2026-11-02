import { z } from 'zod';
import {
  entityIdSchema,
  regionIdSchema,
  instanceIdSchema,
  worldIdSchema,
  itemInstanceIdSchema,
  itemIdSchema,
  toolIdSchema,
  unlockIdSchema,
  enchantmentIdSchema,
  statusIdSchema,
  slotIdSchema,
} from './ids';
import { calendarSchema, clockSchema, timeRulesSchema } from './time';
import { randomStateSchema } from './random';
import { damageTypeSchema } from '../content/schemas';

const uint = z.number().int().nonnegative().safe();
export const directionSchema = z.enum(['down', 'left', 'up', 'right']);
export const heroSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
export type HeroId = z.infer<typeof heroSchema>;
export const HERO_IDS = [1, 2, 3, 4, 5, 6] as const;
export const positionSchema = z.strictObject({ x: z.number().finite(), y: z.number().finite() });
export type Position = z.infer<typeof positionSchema>;
export const itemInstanceSchema = z.strictObject({
  id: itemInstanceIdSchema,
  templateId: itemIdSchema,
  quantity: z.number().int().min(1).max(999),
  enchantments: z
    .array(z.strictObject({ id: enchantmentIdSchema, magnitude: z.number().finite() }))
    .max(16),
});
export type ItemInstance = z.infer<typeof itemInstanceSchema>;
export const inventorySchema = z.strictObject({
  capacity: z.number().int().min(1).max(500),
  items: z.array(itemInstanceSchema).max(500),
  money: uint,
});
const pool = z
  .strictObject({
    current: z.number().nonnegative().finite(),
    maximum: z.number().positive().finite(),
  })
  .refine((v) => v.current <= v.maximum, 'Resource exceeds maximum');
export const actorSchema = z.strictObject({
  id: entityIdSchema,
  position: positionSchema,
  facing: directionSchema,
  stats: z.strictObject({
    attack: z.number().nonnegative().finite(),
    defence: z.number().nonnegative().finite(),
    movementSpeedPixelsPerSecond: z.number().positive().finite(),
  }),
  resources: z.strictObject({ health: pool, energy: pool }),
  resistances: z
    .array(z.strictObject({ type: damageTypeSchema, multiplier: z.number().min(0).max(10) }))
    .max(5),
  statuses: z
    .array(
      z.strictObject({
        id: statusIdSchema,
        source: entityIdSchema.nullable(),
        remainingTicks: z.number().int().positive().safe(),
        stacks: z.number().int().positive(),
      }),
    )
    .max(64),
  cooldowns: z
    .array(
      z.strictObject({ toolId: toolIdSchema, remainingTicks: z.number().int().positive().safe() }),
    )
    .max(64),
});
const geometrySchema = z
  .strictObject({
    version: z.literal(1),
    width: z.number().int().min(1).max(256),
    height: z.number().int().min(1).max(256),
    tilePixels: z.number().int().min(1).max(128),
    tiles: z.array(z.number().int().nonnegative().max(65535)).max(65536),
    objects: z.array(z.strictObject({ id: entityIdSchema, position: positionSchema })).max(10000),
  })
  .refine((g) => g.tiles.length === g.width * g.height, 'Geometry tile count mismatch');
const changesSchema = z.strictObject({
  removedObjects: z.array(entityIdSchema),
  openedPassages: z.array(entityIdSchema),
  claimedRewards: z.array(entityIdSchema),
});
export const regionSchema = z.union([
  z.strictObject({ id: regionIdSchema, kind: z.literal('surface'), phase: z.literal('unvisited') }),
  z.strictObject({
    id: regionIdSchema,
    kind: z.literal('surface'),
    phase: z.enum(['active', 'dormant']),
    generatorVersion: z.literal(1),
    geometry: geometrySchema,
    changes: changesSchema,
  }),
  z.strictObject({
    id: regionIdSchema,
    kind: z.literal('dungeon'),
    currentInstance: instanceIdSchema.nullable(),
  }),
]);
export type Region = z.infer<typeof regionSchema>;
export const dungeonSchema = z.strictObject({
  id: instanceIdSchema,
  regionId: regionIdSchema,
  generation: z.number().int().positive(),
  generatorVersion: z.literal(1),
  geometry: geometrySchema,
  changes: changesSchema,
  anchor: z.strictObject({
    bossId: entityIdSchema,
    phase: z.enum(['living', 'defeated', 'pending-regeneration', 'retired']),
  }),
});
export type Dungeon = z.infer<typeof dungeonSchema>;
export const saveSchema = z.strictObject({
  schemaVersion: z.literal(1),
  contentVersion: z.literal(1),
  world: z.strictObject({
    id: worldIdSchema,
    seed: z.string().min(1).max(128),
    generatorVersions: z.strictObject({
      terrain: z.literal(1),
      dungeon: z.literal(1),
      loot: z.literal(1),
    }),
    nextId: z.number().int().positive().safe(),
    regions: z.array(regionSchema).max(1000),
    dungeons: z.array(dungeonSchema).max(1000),
  }),
  player: z.strictObject({
    actor: actorSchema,
    hero: heroSchema,
    regionId: regionIdSchema,
    instanceId: instanceIdSchema.nullable(),
    permanent: z.strictObject({
      tools: z.array(toolIdSchema),
      unlocks: z.array(unlockIdSchema),
      discoveredRegions: z.array(regionIdSchema),
      kingDefeated: z.boolean(),
      kingdomRestored: z.boolean(),
    }),
    carried: inventorySchema,
    equipment: z
      .array(z.strictObject({ slot: slotIdSchema, itemId: itemInstanceIdSchema }))
      .max(16),
    deposits: z
      .array(
        z.strictObject({
          chestId: entityIdSchema,
          regionId: regionIdSchema,
          instanceId: instanceIdSchema.nullable(),
          inventory: inventorySchema,
        }),
      )
      .max(1000),
  }),
  clock: clockSchema,
  calendar: calendarSchema,
  timeRules: timeRulesSchema,
  random: randomStateSchema,
});
export type SaveState = z.infer<typeof saveSchema>;
