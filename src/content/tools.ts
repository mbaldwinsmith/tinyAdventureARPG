import { z } from 'zod';
/** Authored integration balances; no ammunition or campaign acquisition order is implied. */
export const TOOL_RULES = z
  .strictObject({
    version: z.literal(1),
    bombEnergy: z.number().positive(),
    magicEnergy: z.number().positive(),
    bombFuse: z.number().int().positive(),
    blastTicks: z.number().int().positive(),
    blastRadius: z.number().positive(),
    bombDamage: z.number().positive(),
    magicDamage: z.number().positive(),
    boomerangDamage: z.number().positive(),
    range: z.number().positive(),
    arrowWindup: z.number().int().positive(),
    castWindup: z.number().int().positive(),
    energyPerSecond: z.number().positive(),
    cooldown: z.strictObject({
      bow: z.number().int().positive(),
      bomb: z.number().int().positive(),
      boomerang: z.number().int().positive(),
      hook: z.number().int().positive(),
      magic: z.number().int().positive(),
      push: z.number().int().positive(),
      pull: z.number().int().positive(),
    }),
  })
  .parse({
    version: 1,
    bombEnergy: 3,
    magicEnergy: 2,
    bombFuse: 100,
    blastTicks: 12,
    blastRadius: 40,
    bombDamage: 4,
    magicDamage: 3,
    boomerangDamage: 1,
    range: 224,
    arrowWindup: 12,
    castWindup: 6,
    energyPerSecond: 2,
    cooldown: { bow: 50, bomb: 50, boomerang: 15, hook: 20, magic: 25, push: 8, pull: 8 },
  });
