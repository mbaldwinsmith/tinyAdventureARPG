import { z } from 'zod';
import type { CombatState } from './combat-model';
import { abilityIdSchema, rewardIdSchema } from '../content/builds';

export const emptyBuild = () => ({
  mixedTrialCompleted: false,
  claims: [],
  unlocked: [],
  selected: null,
  active: null,
  readyTick: 0,
});
export const buildStateSchema = z.strictObject({
  mixedTrialCompleted: z.boolean(),
  claims: z.array(rewardIdSchema).max(4),
  unlocked: z.array(abilityIdSchema).max(2),
  selected: abilityIdSchema.nullable(),
  active: z
    .strictObject({ id: abilityIdSchema, remainingTicks: z.number().int().min(1).max(200) })
    .nullable(),
  readyTick: z.number().int().nonnegative().safe(),
});

export function completedMixedTrial(battle: CombatState | null) {
  return battle?.regionId === 'region:practice' && battle.trial === 'mixed' && battle.completed;
}
