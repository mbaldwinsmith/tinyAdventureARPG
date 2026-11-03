import { z } from 'zod';
import { enemyKindSchema } from '../core/combat-model';
import type { EnemyKind, Trial } from '../core/combat-model';
import { freezeData } from '../core/data';
const attackTiming = z.strictObject({
  windup: z.number().int().positive(),
  active: z.number().int().positive(),
  recovery: z.number().int().positive(),
});
/** Versioned practice balance; no campaign tool ownership or final M00 balances are implied. Units are 20ms ticks. */
export const COMBAT_RULES = freezeData(
  z
    .strictObject({
      version: z.literal(1),
      sword: attackTiming,
      bow: attackTiming,
      swordReach: z.number().positive(),
      swordWidth: z.number().positive(),
      swordDamage: z.number().positive(),
      rollTicks: z.number().int().positive(),
      rollInvulnerableStart: z.number().int().nonnegative(),
      rollInvulnerableEnd: z.number().int().positive(),
      rollCooldown: z.number().int().positive(),
      rollSpeed: z.number().positive(),
      rollEnergy: z.number().positive(),
      bowCooldown: z.number().int().positive(),
      bowEnergy: z.number().nonnegative(),
      projectileSpeed: z.number().positive(),
      projectileLifetime: z.number().int().positive(),
      hurtInvulnerability: z.number().int().positive(),
      healthDelay: z.number().int().positive(),
      healthPerSecond: z.number().nonnegative(),
      energyPerSecond: z.number().nonnegative(),
      guardEnergy: z.number().positive(),
    })
    .parse({
      version: 1,
      sword: { windup: 6, active: 6, recovery: 12 },
      bow: { windup: 12, active: 1, recovery: 14 },
      swordReach: 24,
      swordWidth: 20,
      swordDamage: 3,
      rollTicks: 18,
      rollInvulnerableStart: 3,
      rollInvulnerableEnd: 12,
      rollCooldown: 45,
      rollSpeed: 150,
      rollEnergy: 2,
      bowCooldown: 50,
      bowEnergy: 0,
      projectileSpeed: 130,
      projectileLifetime: 100,
      hurtInvulnerability: 35,
      healthDelay: 250,
      healthPerSecond: 0.5,
      energyPerSecond: 1.25,
      guardEnergy: 1,
    }),
);
const enemyDefinition = z.strictObject({
  kind: enemyKindSchema,
  health: z.number().positive(),
  speed: z.number().positive(),
  damage: z.number().positive(),
  detect: z.number().positive(),
  reach: z.number().positive(),
  timing: attackTiming,
});
export const ENEMIES = freezeData(
  z.array(enemyDefinition).parse([
    {
      kind: 'skeleton',
      health: 6,
      speed: 38,
      damage: 2,
      detect: 160,
      reach: 20,
      timing: { windup: 25, active: 6, recovery: 30 },
    },
    {
      kind: 'zombie',
      health: 9,
      speed: 20,
      damage: 3,
      detect: 160,
      reach: 22,
      timing: { windup: 32, active: 8, recovery: 40 },
    },
    {
      kind: 'goblin',
      health: 5,
      speed: 36,
      damage: 2,
      detect: 220,
      reach: 125,
      timing: { windup: 35, active: 1, recovery: 40 },
    },
    {
      kind: 'bat',
      health: 3,
      speed: 58,
      damage: 1,
      detect: 170,
      reach: 48,
      timing: { windup: 18, active: 12, recovery: 40 },
    },
    {
      kind: 'rat',
      health: 3,
      speed: 70,
      damage: 1,
      detect: 155,
      reach: 18,
      timing: { windup: 12, active: 5, recovery: 35 },
    },
    {
      kind: 'slime',
      health: 5,
      speed: 36,
      damage: 2,
      detect: 155,
      reach: 38,
      timing: { windup: 30, active: 15, recovery: 45 },
    },
  ]),
);
export function enemyDefinitionFor(kind: EnemyKind) {
  const definition = ENEMIES.find((e) => e.kind === kind);
  if (!definition) throw new Error('Missing enemy definition');
  return definition;
}
export const PRACTICE_SPAWNS: Readonly<Record<EnemyKind, { x: number; y: number }>> = freezeData({
  skeleton: { x: 240, y: 174 },
  zombie: { x: 308, y: 130 },
  goblin: { x: 354, y: 70 },
  bat: { x: 140, y: 80 },
  rat: { x: 96, y: 188 },
  slime: { x: 380, y: 202 },
});
export const TRIAL_KINDS: Readonly<Record<Trial, readonly EnemyKind[]>> = freezeData({
  melee: ['skeleton', 'zombie'],
  archer: ['goblin'],
  swarm: ['bat', 'rat', 'slime'],
  mixed: ['skeleton', 'zombie', 'goblin', 'bat', 'rat', 'slime'],
});
