import { z } from 'zod';
import { entityIdSchema, regionIdSchema } from './ids';
const uint = z.number().int().nonnegative().safe();
/** Storage contracts for later gameplay systems; these records do not run growth/recruitment/quests. */
export const persistentDomainsSchema = z.strictObject({
  farm: z
    .strictObject({
      plots: z
        .array(
          z.strictObject({
            id: entityIdSchema,
            regionId: regionIdSchema,
            prepared: z.boolean(),
            wateredDay: z.number().int().positive().safe().nullable(),
          }),
        )
        .max(1000),
    })
    .default({ plots: [] }),
  village: z
    .strictObject({
      residents: z
        .array(
          z.strictObject({
            id: entityIdSchema,
            recruited: z.boolean(),
            service: z.string().min(1).max(80).nullable(),
          }),
        )
        .max(1000),
    })
    .default({ residents: [] }),
  quests: z
    .array(
      z.strictObject({
        id: z
          .string()
          .regex(/^quest:[a-z0-9._-]+$/)
          .max(160),
        phase: z.enum(['active', 'completed']),
        progress: uint,
        rewardClaimed: z.boolean(),
      }),
    )
    .max(1000)
    .default([]),
});
