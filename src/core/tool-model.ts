import { z } from 'zod';
import { entityIdSchema, regionIdSchema } from './ids';
const position = z.strictObject({ x: z.number().finite(), y: z.number().finite() });
export const activeToolSchema = z.enum([
  'bow',
  'bomb',
  'boomerang',
  'hook',
  'magic',
  'push',
  'pull',
]);
export type ActiveTool = z.infer<typeof activeToolSchema>;
export const toolCommandSchemas = [
  z.strictObject({ type: z.literal('tool.action'), tool: activeToolSchema }),
  z.strictObject({ type: z.literal('tool.throw') }),
  z.strictObject({ type: z.literal('tool.lift-bomb') }),
] as const;
export const toolCommandSchema = z.discriminatedUnion('type', toolCommandSchemas);
export type ToolCommand = z.infer<typeof toolCommandSchema>;
export const toolEffectSchema = z.strictObject({
  id: z.number().int().positive().safe(),
  kind: z.enum(['arrow', 'bomb', 'boomerang', 'hook', 'magic', 'thrown', 'trap']),
  phase: z.enum(['windup', 'out', 'back', 'pull', 'fuse', 'blast', 'flight']),
  position,
  origin: position,
  target: position.nullable(),
  direction: z.enum(['down', 'left', 'up', 'right']),
  age: z.number().int().nonnegative().max(10000),
  hitIds: z.array(z.string().min(1)).max(256),
  cargo: z.string().nullable(),
  objectId: entityIdSchema.nullable(),
});
export type ToolEffect = z.infer<typeof toolEffectSchema>;
export const toolStateSchema = z.strictObject({
  nextId: z.number().int().positive().safe(),
  effects: z.array(toolEffectSchema).max(32),
  carriedBomb: z.number().int().positive().safe().nullable(),
  safe: z.strictObject({ regionId: regionIdSchema, position }).nullable(),
  feedback: z.string().max(500),
});
export const emptyToolState = () => ({
  nextId: 1,
  effects: [],
  carriedBomb: null,
  safe: null,
  feedback: '',
});
