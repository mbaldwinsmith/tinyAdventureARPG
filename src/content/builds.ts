import { z } from 'zod';
import type { EnemyKind } from '../core/combat-model';
import { itemIdSchema } from '../core/ids';

export const enemyFamilySchema = z.enum(['animals', 'undead', 'slimes']);
export type EnemyFamily = z.infer<typeof enemyFamilySchema>;
export const ENEMY_FAMILY: Record<EnemyKind, EnemyFamily | null> = {
  bat: 'animals',
  rat: 'animals',
  skeleton: 'undead',
  zombie: 'undead',
  slime: 'slimes',
  goblin: null,
};
export const abilityIdSchema = z.enum(['battle-focus', 'tool-focus']);
export const rewardIdSchema = z.enum(['chest', 'encounter', 'boss', 'quest']);
export const lootTierSchema = z.enum(['trail', 'warden']);
const tier = z.strictObject({
  level: z.number().int().positive(),
  budget: z.number().int().positive(),
  maxAffixes: z.number().int().min(1).max(2),
});
export const LOOT_TIERS = z.record(lootTierSchema, tier).parse({
  trail: { level: 1, budget: 3, maxAffixes: 1 },
  warden: { level: 2, budget: 5, maxAffixes: 2 },
});
const ability = z.strictObject({
  name: z.string().min(1),
  description: z.string().min(1),
  ticks: z.number().int().positive(),
  damageMultiplier: z.number().min(1).max(1.5).default(1),
  recovery: z.number().min(0).max(0.4).default(0),
  energyDiscount: z.number().int().min(0).max(1).default(0),
});
export const ABILITIES = z.record(abilityIdSchema, ability).parse({
  'battle-focus': {
    name: 'Battle Focus',
    description: 'Deal 25% more damage for four seconds.',
    ticks: 200,
    damageMultiplier: 1.25,
  },
  'tool-focus': {
    name: 'Tool Focus',
    description:
      'For four seconds, shorten bow, bomb, boomerang, hook and magic cooldowns by 25% and reduce bomb and magic energy costs by one.',
    ticks: 200,
    recovery: 0.25,
    energyDiscount: 1,
  },
});
export const ABILITY_COST = 2;
export const ABILITY_COOLDOWN = 500;
export const ELEMENTS = [
  { id: 'enchantment:fire', name: 'Fire', enemyFamily: 'animals' },
  { id: 'enchantment:holy', name: 'Holy', enemyFamily: 'undead' },
  { id: 'enchantment:ice', name: 'Ice', enemyFamily: 'slimes' },
] as const;
const reward = z
  .strictObject({
    name: z.string().min(1),
    requirement: z.string().min(1),
    gear: itemIdSchema.nullable(),
    tier: lootTierSchema.nullable(),
    relic: itemIdSchema.nullable(),
    ability: abilityIdSchema.nullable(),
  })
  .refine((value) => (value.gear === null) === (value.tier === null), 'Rolled gear needs a tier');
export const BUILD_REWARDS = z.record(rewardIdSchema, reward).parse({
  chest: {
    name: 'Travel chest heirloom',
    requirement: 'Collect starter supplies and face the travel chest.',
    gear: 'item:iron-sword',
    tier: 'trail',
    relic: null,
    ability: 'battle-focus',
  },
  encounter: {
    name: 'Mixed trial prize',
    requirement: 'Complete the mixed practice trial.',
    gear: null,
    tier: null,
    relic: 'item:swift-coil',
    ability: 'tool-focus',
  },
  boss: {
    name: 'Crypt warden heirloom',
    requirement: 'Defeat the crypt warden and claim its anchor reward.',
    gear: 'item:iron-sword',
    tier: 'warden',
    relic: 'item:bastion-stone',
    ability: null,
  },
  quest: {
    name: 'Trailblazer challenge prize',
    requirement: 'Blast open the tool trail’s forest shortcut.',
    gear: 'item:shield',
    tier: 'warden',
    relic: 'item:ember-lens',
    ability: null,
  },
});
