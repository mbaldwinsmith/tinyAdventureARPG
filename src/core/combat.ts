import {
  COMBAT_RULES as R,
  enemyDefinitionFor,
  PRACTICE_SPAWNS,
  TRIAL_KINDS,
} from '../content/combat';
import { combatStateSchema } from './combat-model';
import type { CombatState, CombatEnemy, CombatAction, CombatEvent, Trial } from './combat-model';
import type { Position, SaveState } from './model';
import { cardinal, footRect, moveFoot, overlaps, segmentBlocked } from './motion';
import type { Rect } from './motion';
import { clearFootRoute, roomPath } from './combat-path';
import { STEP_MS } from './time';
type Direction = SaveState['player']['actor']['facing'];
type Actor = SaveState['player']['actor'];
export interface BattleContext {
  state: CombatState;
  actor: Actor;
  stats?: Actor['stats'];
  outgoingDamage?: (enemy: CombatEnemy['kind'], base: number, sword: boolean) => number;
  tracePlayerProjectile?: (from: Position, to: Position) => void;
  tick: number;
  width: number;
  height: number;
  solids: readonly Rect[];
  emit: (event: CombatEvent) => void;
}
export const directionVector = (facing: Direction) => ({
  x: facing === 'right' ? 1 : facing === 'left' ? -1 : 0,
  y: facing === 'down' ? 1 : facing === 'up' ? -1 : 0,
});
export function attackBox(
  position: Position,
  facing: Direction,
  reach = R.swordReach,
  width = R.swordWidth,
): Rect {
  const p = position;
  return facing === 'up'
    ? { x: p.x - width / 2, y: p.y - 6 - reach, width, height: reach }
    : facing === 'down'
      ? { x: p.x - width / 2, y: p.y, width, height: reach }
      : facing === 'left'
        ? { x: p.x - 4 - reach, y: p.y - 6 - width / 2, width: reach, height: width }
        : { x: p.x + 4, y: p.y - 6 - width / 2, width: reach, height: width };
}
export function inFront(defender: Position, facing: Direction, source: Position): boolean {
  const v = directionVector(facing),
    dx = source.x - defender.x,
    dy = source.y - defender.y;
  return dx * v.x + dy * v.y >= Math.abs(dx * v.y - dy * v.x);
}
export function actionPhase(state: CombatState): 'idle' | 'windup' | 'active' | 'recovery' {
  const a = state.action;
  if (!a) return 'idle';
  if (a.kind === 'roll')
    return a.elapsedTicks < R.rollInvulnerableStart
      ? 'windup'
      : a.elapsedTicks < R.rollInvulnerableEnd
        ? 'active'
        : 'recovery';
  const timing = R[a.kind];
  return a.elapsedTicks < timing.windup
    ? 'windup'
    : a.elapsedTicks < timing.windup + timing.active
      ? 'active'
      : 'recovery';
}
export function createBattle(trial: Trial, generation: number, tick: number): CombatState {
  return combatStateSchema.parse({
    version: 1,
    regionId: 'region:practice',
    trial,
    generation,
    nextSequence: 1,
    action: null,
    guard: false,
    attackReadyTick: tick,
    rollReadyTick: tick,
    bowReadyTick: tick,
    invulnerableUntil: tick + 50,
    hurtUntil: 0,
    lastDamageTick: tick,
    feedback: 'Practice field — watch the windup, then strike or evade.',
    feedbackUntil: tick + 150,
    enemies: TRIAL_KINDS[trial].map((kind) => {
      const home = { ...PRACTICE_SPAWNS[kind] };
      return {
        id: `entity:practice-${generation}-${kind}`,
        kind,
        position: { ...home },
        home,
        facing: 'down',
        health: enemyDefinitionFor(kind).health,
        maximumHealth: enemyDefinitionFor(kind).health,
        phase: 'idle',
        phaseTicks: 0,
        attackFacing: 'down',
        aim: { x: 0, y: 0 },
        hitPlayer: false,
        released: false,
        hurtUntil: 0,
        invulnerableUntil: 0,
        path: [],
        nextPathTick: 0,
        deathTick: null,
      };
    }),
    projectiles: [],
    drops: [],
    completed: false,
    death: null,
  });
}
export function beginAction(
  state: CombatState,
  actor: Actor,
  kind: CombatAction,
  tick: number,
  facing: Direction,
  bowCooldownFactor = 1,
): string | null {
  if (actor.resources.health.current <= 0) return 'Return to the practice entrance first.';
  if (state.action || tick < state.hurtUntil) return 'Recover before acting again.';
  if (state.guard) return 'Lower your shield before attacking or rolling.';
  const ready =
    kind === 'sword'
      ? state.attackReadyTick
      : kind === 'roll'
        ? state.rollReadyTick
        : state.bowReadyTick;
  if (tick < ready) return 'That action is still recovering.';
  const cost = kind === 'roll' ? R.rollEnergy : kind === 'bow' ? R.bowEnergy : 0;
  if (actor.resources.energy.current < cost) return 'Wait for energy to recover.';
  actor.resources.energy.current -= cost;
  actor.facing = facing;
  state.action = { kind, facing, elapsedTicks: 0, hitIds: [], released: false };
  if (kind === 'sword')
    state.attackReadyTick = tick + R.sword.windup + R.sword.active + R.sword.recovery;
  if (kind === 'roll') state.rollReadyTick = tick + R.rollCooldown;
  if (kind === 'bow') state.bowReadyTick = tick + Math.ceil(R.bowCooldown * bowCooldownFactor);
  return null;
}
function feedback(c: BattleContext, message: string, subject = 'player') {
  c.state.feedback = message;
  c.state.feedbackUntil = c.tick + 90;
  c.emit({ type: 'combat.feedback', subject, message });
}
function visible(c: BattleContext, a: Position, b: Position) {
  return !c.solids.some((s) => segmentBlocked(a, b, s));
}
function knock(c: BattleContext, position: Position, from: Position, amount: number): Position {
  const dx = position.x - from.x,
    dy = position.y - from.y,
    length = Math.hypot(dx, dy) || 1;
  return moveFoot(
    position,
    (dx / length) * amount,
    (dy / length) * amount,
    c.width,
    c.height,
    c.solids,
  );
}
export function damagePlayer(
  c: BattleContext,
  damage: number,
  source: Position,
): 'immune' | 'blocked' | 'hit' {
  const { state: s, actor: a, tick } = c,
    action = s.action;
  if (
    a.resources.health.current <= 0 ||
    tick < s.invulnerableUntil ||
    (action?.kind === 'roll' &&
      action.elapsedTicks >= R.rollInvulnerableStart &&
      action.elapsedTicks < R.rollInvulnerableEnd)
  )
    return 'immune';
  if (
    s.guard &&
    inFront(a.position, a.facing, source) &&
    a.resources.energy.current >= R.guardEnergy
  ) {
    a.resources.energy.current -= R.guardEnergy;
    feedback(c, 'Blocked — shield held.');
    return 'blocked';
  }
  const resistance = a.resistances.find((r) => r.type === 'physical')?.multiplier ?? 1;
  const amount = Math.max(0, Math.max(1, damage - (c.stats ?? a.stats).defence) * resistance);
  if (amount === 0) return 'immune';
  a.resources.health.current = Math.max(0, a.resources.health.current - amount);
  a.position = knock(c, a.position, source, 12);
  s.action = null;
  s.guard = false;
  s.lastDamageTick = tick;
  s.hurtUntil = tick + 10;
  s.invulnerableUntil = tick + R.hurtInvulnerability;
  feedback(
    c,
    `Hit for ${amount}${a.resources.energy.current < R.guardEnergy ? ' — shield energy is low.' : '.'}`,
  );
  if (a.resources.health.current === 0 && s.death?.phase !== 'pending') {
    s.death = { id: s.nextSequence++, phase: 'pending', lostItems: [], lostMoney: 0, losses: [] };
    s.projectiles = [];
    c.emit({
      type: 'combat.player-defeated',
      subject: String(s.death.id),
      message: 'Defeated. Return to the practice entrance.',
    });
  }
  return 'hit';
}
export function damageEnemy(
  c: BattleContext,
  enemy: CombatEnemy,
  damage: number,
  from: Position,
  sword = false,
): boolean {
  if (enemy.health <= 0 || c.tick < enemy.invulnerableUntil) return false;
  damage = c.outgoingDamage?.(enemy.kind, damage, sword) ?? damage;
  enemy.health = Math.max(0, enemy.health - damage);
  enemy.position = knock(c, enemy.position, from, 8);
  enemy.hurtUntil = c.tick + 10;
  enemy.invulnerableUntil = c.tick + 12;
  enemy.path = [];
  enemy.phase = 'recovery';
  enemy.phaseTicks = 0;
  feedback(c, `${enemy.kind} −${damage}`, enemy.id);
  if (enemy.health === 0) {
    enemy.phase = 'dead';
    enemy.deathTick = c.tick;
    c.state.projectiles = c.state.projectiles.filter((p) => p.owner !== enemy.id);
    c.state.drops.push({
      id: `${enemy.id}:drop`,
      position: { ...enemy.position },
      money: 1,
      claimed: false,
    });
    c.emit({
      type: 'combat.enemy-defeated',
      subject: enemy.id,
      message: `${enemy.kind} defeated — one coin dropped.`,
    });
  }
  return true;
}
function projectile(
  c: BattleContext,
  owner: Actor['id'],
  faction: 'player' | 'enemy',
  position: Position,
  aim: Position,
  damage: number,
) {
  if (c.state.projectiles.length >= 128) return;
  const dx = aim.x - position.x,
    dy = aim.y - position.y,
    length = Math.hypot(dx, dy) || 1,
    speed = faction === 'player' ? R.projectileSpeed : 90;
  c.state.projectiles.push({
    id: `shot:${c.state.generation}:${c.state.nextSequence++}`,
    owner,
    faction,
    position: { ...position },
    velocity: { x: (dx / length) * speed, y: (dy / length) * speed },
    damage,
    remainingTicks: R.projectileLifetime,
  });
}
/** Core action overrides are resolved before the sole position commit; no second velocity integration. */
export function combatMovement(
  c: BattleContext,
  desired: { position: Position; facing: Direction },
) {
  const { state: s, actor: a } = c,
    action = s.action;
  if (a.resources.health.current <= 0 || c.tick < s.hurtUntil)
    return { position: { ...a.position }, facing: a.facing };
  if (action) {
    if (action.kind !== 'roll') return { position: { ...a.position }, facing: action.facing };
    const v = directionVector(action.facing);
    return {
      position: moveFoot(
        a.position,
        (v.x * R.rollSpeed * STEP_MS) / 1000,
        (v.y * R.rollSpeed * STEP_MS) / 1000,
        c.width,
        c.height,
        c.solids,
      ),
      facing: action.facing,
    };
  }
  return desired;
}
function steer(c: BattleContext, e: CombatEnemy, target: Position, speed: number) {
  let goal = target;
  if (!clearFootRoute(e.position, target, c.width, c.height, c.solids)) {
    if (c.tick >= e.nextPathTick) {
      e.path = roomPath(e.position, target, c.width, c.height, c.solids);
      e.nextPathTick = c.tick + 25;
    }
    while (e.path[0] && Math.hypot(e.path[0].x - e.position.x, e.path[0].y - e.position.y) < 3)
      e.path.shift();
    if (!e.path[0]) return;
    goal = e.path[0];
  } else e.path = [];
  const dx = goal.x - e.position.x,
    dy = goal.y - e.position.y,
    length = Math.hypot(dx, dy);
  if (length < 0.1) return;
  const distance = Math.min(length, (speed * STEP_MS) / 1000);
  e.position = moveFoot(
    e.position,
    (dx / length) * distance,
    (dy / length) * distance,
    c.width,
    c.height,
    c.solids,
  );
  e.facing = cardinal(dx, dy, e.facing);
}
function enemyStep(c: BattleContext, e: CombatEnemy) {
  if (e.health <= 0 || c.tick < e.hurtUntil) return;
  const d = enemyDefinitionFor(e.kind),
    dx = c.actor.position.x - e.position.x,
    dy = c.actor.position.y - e.position.y,
    distance = Math.hypot(dx, dy),
    homeDistance = Math.hypot(e.home.x - c.actor.position.x, e.home.y - c.actor.position.y);
  e.phaseTicks++;
  if (c.actor.resources.health.current <= 0) return;
  if (
    !['windup', 'active', 'recovery'].includes(e.phase) &&
    (distance > d.detect + 65 || homeDistance > 230)
  ) {
    e.phase = 'return';
    e.phaseTicks = 0;
  }
  if (e.phase === 'idle') {
    if (distance <= d.detect && visible(c, e.position, c.actor.position)) {
      e.phase = 'detect';
      e.phaseTicks = 0;
    }
    return;
  }
  if (e.phase === 'detect') {
    if (e.phaseTicks >= 15) {
      e.phase = 'pursuit';
      e.phaseTicks = 0;
    }
    return;
  }
  if (e.phase === 'return') {
    steer(c, e, e.home, d.speed);
    if (Math.hypot(e.position.x - e.home.x, e.position.y - e.home.y) < 3) {
      e.phase = 'idle';
      e.phaseTicks = 0;
    }
    return;
  }
  if (e.phase === 'pursuit') {
    e.facing = cardinal(dx, dy, e.facing);
    if (e.kind === 'goblin' && distance < 60) {
      const length = distance || 1;
      steer(
        c,
        e,
        {
          x: Math.max(12, Math.min(c.width - 12, e.position.x - (dx / length) * 32)),
          y: Math.max(16, Math.min(c.height - 12, e.position.y - (dy / length) * 32)),
        },
        d.speed,
      );
      return;
    }
    if (distance <= d.reach && visible(c, e.position, c.actor.position)) {
      e.phase = 'windup';
      e.phaseTicks = 0;
      e.attackFacing = cardinal(dx, dy, e.facing);
      e.aim = { ...c.actor.position };
      e.hitPlayer = false;
      e.released = false;
      return;
    }
    let speed = d.speed;
    if (e.kind === 'rat' && e.phaseTicks % 45 > 24) speed = 0;
    if (e.kind === 'slime' && e.phaseTicks % 40 > 12) speed = 0;
    const target =
      e.kind === 'bat' && distance > 55
        ? {
            x: c.actor.position.x + Math.sin(c.tick / 24) * 24,
            y: c.actor.position.y + Math.cos(c.tick / 24) * 18,
          }
        : c.actor.position;
    if (distance > 12) steer(c, e, target, speed);
    return;
  }
  if (e.phase === 'windup') {
    e.facing = e.attackFacing;
    if (e.phaseTicks >= d.timing.windup) {
      e.phase = 'active';
      e.phaseTicks = 0;
    }
    return;
  }
  if (e.phase === 'active') {
    if (e.kind === 'goblin') {
      if (!e.released) {
        projectile(c, e.id, 'enemy', { ...e.position }, e.aim, d.damage);
        e.released = true;
      }
    } else {
      if (e.kind === 'bat' || e.kind === 'slime') {
        const v = directionVector(e.attackFacing),
          speed = e.kind === 'bat' ? 130 : 70;
        e.position = moveFoot(
          e.position,
          (v.x * speed * STEP_MS) / 1000,
          (v.y * speed * STEP_MS) / 1000,
          c.width,
          c.height,
          c.solids,
        );
      }
      if (
        !e.hitPlayer &&
        overlaps(
          attackBox(
            e.position,
            e.attackFacing,
            e.kind === 'bat' || e.kind === 'slime' ? 12 : d.reach,
            16,
          ),
          footRect(c.actor.position),
        ) &&
        visible(c, e.position, c.actor.position)
      ) {
        // Every attack consumes its single contact, including blocks and invulnerable overlaps.
        e.hitPlayer = true;
        damagePlayer(c, d.damage, e.position);
      }
    }
    if (e.phaseTicks >= d.timing.active) {
      e.phase = 'recovery';
      e.phaseTicks = 0;
    }
    return;
  }
  if (e.phase === 'recovery' && e.phaseTicks >= d.timing.recovery) {
    e.phase = 'pursuit';
    e.phaseTicks = 0;
  }
}
function projectileStep(c: BattleContext) {
  const survivors: CombatState['projectiles'] = [];
  for (const p of c.state.projectiles) {
    if (p.remainingTicks <= 0) continue;
    const from = { ...p.position },
      to = {
        x: from.x + (p.velocity.x * STEP_MS) / 1000,
        y: from.y + (p.velocity.y * STEP_MS) / 1000,
      };
    if (p.faction === 'player') c.tracePlayerProjectile?.(from, to);
    p.remainingTicks--;
    if (
      to.x < 0 ||
      to.y < 0 ||
      to.x > c.width ||
      to.y > c.height ||
      c.solids.some((s) =>
        segmentBlocked(from, to, {
          x: s.x - 1,
          y: s.y - 1,
          width: s.width + 2,
          height: s.height + 2,
        }),
      )
    )
      continue;
    let hit = false;
    if (
      p.faction === 'enemy' &&
      p.owner !== c.actor.id &&
      segmentBlocked(from, to, {
        x: c.actor.position.x - 5,
        y: c.actor.position.y - 8,
        width: 10,
        height: 10,
      })
    ) {
      damagePlayer(c, p.damage, from);
      hit = true;
    }
    if (p.faction === 'player')
      for (const e of c.state.enemies)
        if (
          e.health > 0 &&
          e.id !== p.owner &&
          segmentBlocked(from, to, {
            x: e.position.x - 5,
            y: e.position.y - 8,
            width: 10,
            height: 10,
          })
        ) {
          damageEnemy(c, e, p.damage, from);
          hit = true;
          break;
        }
    if (!hit && p.remainingTicks > 0) {
      p.position = to;
      survivors.push(p);
    }
  }
  c.state.projectiles =
    c.actor.resources.health.current > 0
      ? survivors.filter(
          (p) =>
            p.faction === 'player' || c.state.enemies.some((e) => e.id === p.owner && e.health > 0),
        )
      : [];
}
export function stepBattle(c: BattleContext) {
  const { state: s, actor: a } = c,
    action = s.action;
  if (a.resources.health.current <= 0) return;
  if (action) {
    if (action.kind === 'sword' && actionPhase(s) === 'active')
      for (const e of s.enemies) {
        if (action.hitIds.includes(e.id) || e.health <= 0) continue;
        if (
          overlaps(attackBox(a.position, action.facing), footRect(e.position)) &&
          visible(c, a.position, e.position) &&
          damageEnemy(c, e, R.swordDamage + (c.stats ?? a.stats).attack - 1, a.position, true)
        )
          action.hitIds.push(e.id);
      }
    if (action.kind === 'bow' && action.elapsedTicks >= R.bow.windup && !action.released) {
      const v = directionVector(action.facing);
      projectile(
        c,
        a.id,
        'player',
        { x: a.position.x, y: a.position.y - 3 },
        { x: a.position.x + v.x * 100, y: a.position.y - 3 + v.y * 100 },
        R.swordDamage,
      );
      action.released = true;
    }
    action.elapsedTicks++;
    const duration =
      action.kind === 'roll'
        ? R.rollTicks
        : R[action.kind].windup + R[action.kind].active + R[action.kind].recovery;
    if (action.elapsedTicks >= duration) s.action = null;
  }
  for (const enemy of s.enemies) {
    enemyStep(c, enemy);
    if (a.resources.health.current <= 0) break;
  }
  if (a.resources.health.current > 0) projectileStep(c);
  if (a.resources.health.current > 0) {
    const seconds = STEP_MS / 1000;
    if (!s.guard)
      a.resources.energy.current = Math.min(
        a.resources.energy.maximum,
        a.resources.energy.current + R.energyPerSecond * seconds,
      );
    if (c.tick - s.lastDamageTick >= R.healthDelay)
      a.resources.health.current = Math.min(
        a.resources.health.maximum,
        a.resources.health.current + R.healthPerSecond * seconds,
      );
  }
  if (!s.completed && s.enemies.every((e) => e.health <= 0)) {
    s.completed = true;
    c.emit({
      type: 'combat.encounter-completed',
      subject: String(s.generation),
      message: 'Encounter cleared. Collect the dropped coins or try another trial.',
    });
    feedback(c, 'Encounter cleared — well fought.');
  }
}
export function nearestDrop(s: CombatState, position: Position) {
  return (
    s.drops
      .filter(
        (d) => !d.claimed && Math.hypot(d.position.x - position.x, d.position.y - position.y) <= 20,
      )
      .sort(
        (a, b) =>
          Math.hypot(a.position.x - position.x, a.position.y - position.y) -
            Math.hypot(b.position.x - position.x, b.position.y - position.y) ||
          a.id.localeCompare(b.id),
      )[0] ?? null
  );
}
export function combatView(s: CombatState, actor: Actor, tick: number, active: boolean, coins = 0) {
  return {
    active,
    regionId: s.regionId,
    coins,
    trial: s.trial,
    health: Math.round(actor.resources.health.current * 10) / 10,
    maximumHealth: actor.resources.health.maximum,
    energy: Math.round(actor.resources.energy.current * 10) / 10,
    maximumEnergy: actor.resources.energy.maximum,
    phase: s.death?.phase === 'pending' ? 'defeated' : actionPhase(s),
    guard: s.guard,
    remaining: s.enemies.filter((e) => e.health > 0).length,
    completed: s.completed,
    feedback: tick < s.feedbackUntil ? s.feedback : '',
    swordCooldown: Math.ceil(Math.max(0, s.attackReadyTick - tick) / 5) / 10,
    rollCooldown: Math.ceil(Math.max(0, s.rollReadyTick - tick) / 5) / 10,
    bowCooldown: Math.ceil(Math.max(0, s.bowReadyTick - tick) / 5) / 10,
    drop: active ? (nearestDrop(s, actor.position)?.id ?? null) : null,
    death: s.death ? { ...s.death, lostItems: [...s.death.lostItems] } : null,
  };
}
