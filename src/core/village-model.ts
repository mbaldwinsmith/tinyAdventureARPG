import { z } from 'zod';
import { villageChoiceSchema, villageNodeSchema } from '../content/village';
import { itemIdSchema, itemInstanceIdSchema } from './ids';

const expectedTransaction = z.number().int().positive().safe();
const quantity = z.number().int().min(1).max(99);
export const villageCommandSchemas = [
  z.strictObject({
    type: z.literal('village.choose'),
    node: villageNodeSchema,
    choice: villageChoiceSchema,
    expectedTransaction,
  }),
  z.strictObject({
    type: z.literal('village.buy'),
    item: itemIdSchema,
    quantity,
    expectedTransaction,
  }),
  z.strictObject({
    type: z.literal('village.sell'),
    itemId: itemInstanceIdSchema,
    quantity,
    expectedTransaction,
  }),
] as const;
export const villageCommandSchema = z.discriminatedUnion('type', villageCommandSchemas);
export type VillageCommand = z.infer<typeof villageCommandSchema>;
