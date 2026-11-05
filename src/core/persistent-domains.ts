import { cropIdSchema, WATER_CAPACITY } from '../content/farm';
import { z } from 'zod';
import { entityIdSchema, regionIdSchema } from './ids';
const uint = z.number().int().nonnegative().safe();
/** Persisted farm, village and quest records. */
export const persistentDomainsSchema = z.strictObject({
  farm: z
    .strictObject({
      suppliesClaimed: z.boolean().default(false),
      water: z.number().int().min(0).max(WATER_CAPACITY).default(0),
      plots: z
        .array(
          z.strictObject({
            id: entityIdSchema,
            regionId: regionIdSchema,
            prepared: z.boolean(),
            crop: z
              .strictObject({ id: cropIdSchema, growth: uint, withered: z.boolean() })
              .nullable()
              .default(null),
            wateredDay: z.number().int().positive().safe().nullable(),
          }),
        )
        .max(1000),
    })
    .default(() => ({ plots: [], suppliesClaimed: false, water: 0 })),
  village: z
    .strictObject({
      dialogueFlags: z.array(z.literal('heard-about-stock')).max(1).default([]),
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
    .default(() => ({ residents: [], dialogueFlags: [] })),
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
