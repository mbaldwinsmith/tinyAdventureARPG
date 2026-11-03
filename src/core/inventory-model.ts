import { z } from 'zod';
import { itemInstanceIdSchema, slotIdSchema, entityIdSchema } from './ids';
export const selectedToolSchema = z.enum(['sword', 'shield', 'roll', 'bow']);
export type SelectedTool = z.infer<typeof selectedToolSchema>;
export const packStateSchema = z.strictObject({
  selectedTool: selectedToolSchema.default('sword'),
  starterClaimed: z.boolean().default(false),
});
const transaction = z.number().int().positive().safe();
const quantity = z.number().int().positive().max(999);
export const inventoryCommandSchemas = [
  z.strictObject({
    type: z.literal('inventory.split'),
    itemId: itemInstanceIdSchema,
    quantity,
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.merge'),
    itemId: itemInstanceIdSchema,
    targetId: itemInstanceIdSchema,
    quantity,
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.move'),
    itemId: itemInstanceIdSchema,
    position: z.number().int().nonnegative().max(499),
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.equip'),
    itemId: itemInstanceIdSchema,
    slot: slotIdSchema,
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.unequip'),
    itemId: itemInstanceIdSchema,
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.discard'),
    itemId: itemInstanceIdSchema,
    quantity,
    confirmed: z.literal(true),
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.supplies'),
    chestId: entityIdSchema,
    expectedTransaction: transaction,
  }),
  z.strictObject({
    type: z.literal('inventory.select'),
    tool: selectedToolSchema,
    expectedTransaction: transaction,
  }),
] as const;
export const inventoryCommandSchema = z.discriminatedUnion('type', inventoryCommandSchemas);
export type InventoryCommand = z.infer<typeof inventoryCommandSchema>;
export const selectedUseSchema = z.strictObject({ type: z.literal('tool.use') });
