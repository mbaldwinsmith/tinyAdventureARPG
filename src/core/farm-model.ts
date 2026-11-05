import { z } from 'zod';
import { cropIdSchema } from '../content/farm';
import { entityIdSchema } from './ids';

const target = {
  target: entityIdSchema,
  expectedTransaction: z.number().int().positive().safe(),
};
export const farmCommandSchemas = [
  z.strictObject({
    type: z.literal('farm.tend'),
    ...target,
    action: z.enum(['supplies', 'hoe', 'water', 'harvest', 'clear', 'refill']),
  }),
  z.strictObject({ type: z.literal('farm.plant'), ...target, crop: cropIdSchema }),
] as const;
export const farmCommandSchema = z.discriminatedUnion('type', farmCommandSchemas);
export type FarmCommand = z.infer<typeof farmCommandSchema>;
