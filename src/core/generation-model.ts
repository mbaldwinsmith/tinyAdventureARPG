import { z } from 'zod';
import { entityIdSchema } from './ids';
const point = z.strictObject({ x: z.number().finite(), y: z.number().finite() });
export const biomeSchema = z.enum(['forest', 'desert', 'winter', 'coast', 'crypt']);
export const placementKindSchema = z.enum([
  'entry',
  'exit',
  'portal',
  'key',
  'switch',
  'axe',
  'gate-key',
  'gate-switch',
  'gate-axe',
  'shortcut',
  'secret',
  'landmark',
  'resource',
  'reward',
  'anchor',
  'encounter',
]);
export const layoutSchema = z.strictObject({
  version: z.literal(1),
  seed: z.string().min(1).max(128),
  biome: biomeSchema,
  generation: z.number().int().positive(),
  attempt: z.number().int().min(0).max(3),
  fallback: z.boolean(),
  rooms: z
    .array(
      z.strictObject({
        id: z.number().int().min(0).max(8),
        column: z.number().int().min(0).max(2),
        row: z.number().int().min(0).max(2),
        template: z.enum(['grove', 'pillars', 'camp']),
        tag: z.enum(['entry', 'key', 'switch', 'tool', 'anchor', 'trail', 'secret']),
      }),
    )
    .length(9),
  edges: z
    .array(
      z.strictObject({
        from: z.number().int().min(0).max(8),
        to: z.number().int().min(0).max(8),
        requires: z.enum(['key', 'switch', 'axe']).nullable(),
        shortcut: z.boolean(),
      }),
    )
    .min(8)
    .max(12),
  placements: z
    .array(
      z.strictObject({
        id: entityIdSchema,
        kind: placementKindSchema,
        room: z.number().int().min(0).max(8),
        position: point,
      }),
    )
    .max(64),
});
export type GeneratedLayout = z.infer<typeof layoutSchema>;
export type Biome = z.infer<typeof biomeSchema>;
