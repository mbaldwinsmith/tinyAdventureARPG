import { z } from 'zod';

const id = <P extends string>(prefix: P) =>
  z
    .string()
    .max(160)
    .regex(new RegExp(`^${prefix}:[a-z0-9][a-z0-9._-]*$`))
    .brand<P>();
export const entityIdSchema = id('entity');
export const regionIdSchema = id('region');
export const instanceIdSchema = id('instance');
export const worldIdSchema = id('world');
export const itemInstanceIdSchema = id('item-instance');
export const itemIdSchema = id('item');
export const toolIdSchema = id('tool');
export const unlockIdSchema = id('unlock');
export const enchantmentIdSchema = id('enchantment');
export const statusIdSchema = id('status');
export const slotIdSchema = id('slot');
export type EntityId = z.infer<typeof entityIdSchema>;
export type RegionId = z.infer<typeof regionIdSchema>;
export type InstanceId = z.infer<typeof instanceIdSchema>;
export type ItemId = z.infer<typeof itemIdSchema>;
export type ItemInstanceId = z.infer<typeof itemInstanceIdSchema>;
export type ToolId = z.infer<typeof toolIdSchema>;

/** A persisted monotonic sequence, scoped to a world, never a clock or random draw. */
export function allocatedId(
  worldId: string,
  sequence: number,
  kind: 'entity' | 'instance' | 'item-instance',
) {
  if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error('Invalid ID sequence');
  const world = worldIdSchema.parse(worldId);
  const value = `${kind}:${world.slice('world:'.length)}-${sequence}`;
  if (kind === 'entity') return entityIdSchema.parse(value);
  if (kind === 'instance') return instanceIdSchema.parse(value);
  return itemInstanceIdSchema.parse(value);
}
