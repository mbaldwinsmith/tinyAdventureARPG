import { z } from 'zod';
import { entityIdSchema, regionIdSchema, itemInstanceIdSchema } from './ids';
const ticks = z.number().int().nonnegative().safe();
const point = z.strictObject({ x: z.number().finite(), y: z.number().finite() });
const facing = z.enum(['up', 'down', 'left', 'right']);
export const enemyKindSchema = z.enum(['skeleton', 'zombie', 'goblin', 'bat', 'rat', 'slime']);
export type EnemyKind = z.infer<typeof enemyKindSchema>;
export const trialSchema = z.enum(['melee', 'archer', 'swarm', 'mixed']);
export type Trial = z.infer<typeof trialSchema>;
export const enemySchema = z.strictObject({
  id: entityIdSchema,
  kind: enemyKindSchema,
  position: point,
  home: point,
  facing,
  health: z.number().nonnegative().finite(),
  maximumHealth: z.number().positive().finite(),
  phase: z.enum(['idle', 'detect', 'pursuit', 'windup', 'active', 'recovery', 'return', 'dead']),
  phaseTicks: ticks,
  attackFacing: facing,
  aim: point,
  hitPlayer: z.boolean(),
  released: z.boolean(),
  hurtUntil: ticks,
  invulnerableUntil: ticks,
  path: z.array(point).max(256),
  nextPathTick: ticks,
  deathTick: ticks.nullable(),
});
export type CombatEnemy = z.infer<typeof enemySchema>;
export const combatStateSchema = z.strictObject({
  version: z.literal(1),
  regionId: regionIdSchema,
  trial: trialSchema,
  generation: ticks,
  nextSequence: ticks,
  action: z
    .strictObject({
      kind: z.enum(['sword', 'roll', 'bow']),
      facing,
      elapsedTicks: ticks,
      hitIds: z.array(entityIdSchema).max(16),
      released: z.boolean(),
    })
    .nullable(),
  guard: z.boolean(),
  attackReadyTick: ticks,
  rollReadyTick: ticks,
  bowReadyTick: ticks,
  invulnerableUntil: ticks,
  hurtUntil: ticks,
  lastDamageTick: ticks,
  feedback: z.string().max(120),
  feedbackUntil: ticks,
  enemies: z.array(enemySchema).max(16),
  projectiles: z
    .array(
      z.strictObject({
        id: z.string().min(1),
        owner: entityIdSchema,
        faction: z.enum(['player', 'enemy']),
        position: point,
        velocity: point,
        damage: z.number().positive().finite(),
        remainingTicks: ticks,
      }),
    )
    .max(128),
  drops: z
    .array(
      z.strictObject({
        id: z.string().min(1),
        position: point,
        money: ticks,
        claimed: z.boolean(),
      }),
    )
    .max(32),
  completed: z.boolean(),
  death: z
    .strictObject({
      id: ticks,
      phase: z.enum(['pending', 'resolved']),
      lostItems: z.array(itemInstanceIdSchema),
      lostMoney: ticks,
    })
    .nullable(),
});
export type CombatState = z.infer<typeof combatStateSchema>;
export type CombatAction = NonNullable<CombatState['action']>['kind'];
export type CombatEvent = {
  type:
    | 'combat.feedback'
    | 'combat.enemy-defeated'
    | 'combat.drop-claimed'
    | 'combat.encounter-completed'
    | 'combat.player-defeated'
    | 'combat.player-respawned';
  subject: string;
  message: string;
};
