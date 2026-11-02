import { describe, it, expect } from 'vitest';
import {
  createBattle,
  beginAction,
  actionPhase,
  attackBox,
  inFront,
  damagePlayer,
  stepBattle,
  combatMovement,
} from './combat';
import type { BattleContext } from './combat';
import type { CombatEvent, EnemyKind } from './combat-model';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { enemyDefinitionFor } from '../content/combat';
import { GameSession } from './session';
import { freeFoot, footRect, overlaps } from './motion';
import { roomPath } from './combat-path';
import { resolveDeathLoss, lossPolicySchema, PRACTICE_LOSS_POLICY } from './death-loss';
import { itemInstanceSchema } from './model';
function fixture(kind: EnemyKind = 'skeleton') {
  const state = createBattle('mixed', 1, 0),
    actor = createPreviewSave().player.actor,
    events: CombatEvent[] = [];
  const enemy = state.enemies.find((e) => e.kind === kind);
  if (!enemy) throw new Error('Missing fixture enemy');
  state.enemies = [enemy];
  state.invulnerableUntil = 0;
  actor.position = { x: 240, y: 220 };
  actor.facing = 'up';
  const context: BattleContext = {
    state,
    actor,
    tick: 0,
    width: 480,
    height: 272,
    solids: [],
    emit: (e) => events.push(e),
  };
  const advance = (ticks: number) => {
    for (let i = 0; i < ticks; i++) {
      context.tick++;
      stepBattle(context);
    }
  };
  return { state, actor, enemy, events, context, advance };
}
function trialSession() {
  const game = new GameSession(createPreviewSave(), PREVIEW_CONTENT, PREVIEW_WORLD);
  expect(game.dispatch({ type: 'combat.start', trial: 'melee' })).toEqual({ ok: true });
  return game;
}
describe('cardinal phases, contacts, shielding and evasion', () => {
  it('uses explicit directional boundaries and excludes rear and lateral contacts', () => {
    for (const facing of ['up', 'down', 'left', 'right'] as const) {
      const box = attackBox({ x: 100, y: 100 }, facing);
      const front = {
        x: facing === 'left' ? 82 : facing === 'right' ? 118 : 100,
        y: facing === 'up' ? 82 : facing === 'down' ? 118 : 100,
      };
      expect(overlaps(box, footRect(front))).toBe(true);
      expect(inFront({ x: 100, y: 100 }, facing, front)).toBe(true);
      const rear = { x: 200 - front.x, y: 200 - front.y };
      expect(overlaps(box, footRect(rear))).toBe(false);
      expect(inFront({ x: 100, y: 100 }, facing, rear)).toBe(false);
    }
    const up = attackBox({ x: 100, y: 100 }, 'up');
    expect(overlaps(up, { x: 110, y: 75, width: 8, height: 6 })).toBe(false);
    expect(overlaps(up, { x: 96, y: 64, width: 8, height: 6 })).toBe(false);
  });
  it('waits through windup, hits once across repeated active overlap and locks movement/facing', () => {
    const f = fixture();
    f.enemy.position = { x: 240, y: 200 };
    f.enemy.hurtUntil = 1000;
    expect(beginAction(f.state, f.actor, 'sword', 0, 'up')).toBeNull();
    expect(combatMovement(f.context, { position: { x: 260, y: 220 }, facing: 'right' })).toEqual({
      position: { x: 240, y: 220 },
      facing: 'up',
    });
    f.advance(6);
    expect(f.enemy.health).toBe(6);
    expect(actionPhase(f.state)).toBe('active');
    f.advance(1);
    expect(f.enemy.health).toBe(3);
    f.advance(5);
    expect(f.enemy.health).toBe(3);
    expect(f.state.action?.hitIds).toEqual([f.enemy.id]);
    f.advance(12);
    expect(f.state.action).toBeNull();
  });
  it('does not strike through an intervening solid', () => {
    const f = fixture();
    f.enemy.position = { x: 240, y: 200 };
    f.enemy.hurtUntil = 1000;
    f.context.solids = [{ x: 230, y: 205, width: 20, height: 2 }];
    beginAction(f.state, f.actor, 'sword', 0, 'up');
    f.advance(12);
    expect(f.enemy.health).toBe(6);
  });
  it('blocks only the forward cone and spends energy once per contact', () => {
    const f = fixture();
    f.state.guard = true;
    expect(damagePlayer(f.context, 3, { x: 240, y: 200 })).toBe('blocked');
    expect(f.actor.resources.health.current).toBe(10);
    expect(f.actor.resources.energy.current).toBe(9);
    expect(damagePlayer(f.context, 3, { x: 240, y: 240 })).toBe('hit');
    expect(f.actor.resources.health.current).toBe(7);
    expect(f.state.guard).toBe(false);
    const exhausted = fixture();
    exhausted.state.guard = true;
    exhausted.actor.resources.energy.current = 0;
    expect(damagePlayer(exhausted.context, 2, { x: 240, y: 200 })).toBe('hit');
  });
  it('bounds hurt invulnerability and sweeps knockback against walls', () => {
    const f = fixture();
    f.context.solids = [{ x: 250, y: 180, width: 2, height: 80 }];
    expect(damagePlayer(f.context, 2, { x: 220, y: 220 })).toBe('hit');
    expect(f.actor.position.x).toBe(246);
    expect(damagePlayer(f.context, 2, { x: 220, y: 220 })).toBe('immune');
    f.context.tick = 35;
    expect(damagePlayer(f.context, 2, { x: 220, y: 220 })).toBe('hit');
    expect(f.actor.resources.health.current).toBe(6);
  });
  it('limits roll invulnerability to its active window, costs energy and clips against solids', () => {
    const f = fixture();
    expect(beginAction(f.state, f.actor, 'roll', 0, 'right')).toBeNull();
    expect(f.actor.resources.energy.current).toBe(8);
    if (!f.state.action) throw new Error('No roll');
    f.state.action.elapsedTicks = 3;
    expect(damagePlayer(f.context, 4, { x: 260, y: 220 })).toBe('immune');
    f.context.solids = [{ x: 245, y: 180, width: 2, height: 80 }];
    expect(
      combatMovement(f.context, { position: { x: 270, y: 220 }, facing: 'down' }).position.x,
    ).toBe(241);
    f.state.action.elapsedTicks = 12;
    expect(damagePlayer(f.context, 4, { x: 260, y: 220 })).toBe('hit');
    f.state.hurtUntil = 0;
    expect(beginAction(f.state, f.actor, 'roll', 20, 'up')).toContain('recovering');
  });
});
describe('projectiles and readable enemy behaviours', () => {
  it('releases a player arrow once after windup, without ammunition, and observes recovery', () => {
    const f = fixture();
    f.enemy.position = { x: 20, y: 20 };
    f.enemy.hurtUntil = 1000;
    expect(beginAction(f.state, f.actor, 'bow', 0, 'up')).toBeNull();
    f.advance(12);
    expect(f.state.projectiles).toHaveLength(0);
    f.advance(1);
    expect(f.state.projectiles).toHaveLength(1);
    f.advance(12);
    expect(f.state.projectiles).toHaveLength(1);
    expect(f.state.projectiles[0]?.faction).toBe('player');
    expect(beginAction(f.state, f.actor, 'bow', f.context.tick, 'up')).not.toBeNull();
  });
  it('removes hostile arrows on first contact and rejects same-faction damage', () => {
    const f = fixture();
    f.enemy.hurtUntil = 1000;
    f.state.projectiles.push({
      id: 'hostile',
      owner: f.enemy.id,
      faction: 'enemy',
      position: { x: 240, y: 210 },
      velocity: { x: 0, y: 200 },
      damage: 2,
      remainingTicks: 40,
    });
    f.advance(1);
    expect(f.actor.resources.health.current).toBe(8);
    expect(f.state.projectiles).toHaveLength(0);
    f.advance(20);
    expect(f.actor.resources.health.current).toBe(8);
    const friendly = fixture();
    friendly.enemy.hurtUntil = 1000;
    friendly.state.projectiles.push({
      id: 'friendly',
      owner: friendly.actor.id,
      faction: 'player',
      position: { x: 240, y: 210 },
      velocity: { x: 0, y: 200 },
      damage: 2,
      remainingTicks: 2,
    });
    friendly.advance(2);
    expect(friendly.actor.resources.health.current).toBe(10);
    expect(friendly.state.projectiles).toHaveLength(0);
  });
  it('sweeps fast projectiles into thin walls and stops their lifetime at a fixed tick', () => {
    const f = fixture();
    f.enemy.hurtUntil = 1000;
    f.context.solids = [{ x: 230, y: 180, width: 20, height: 1 }];
    f.state.projectiles.push({
      id: 'fast',
      owner: f.actor.id,
      faction: 'player',
      position: { x: 240, y: 220 },
      velocity: { x: 0, y: -3000 },
      damage: 3,
      remainingTicks: 20,
    });
    f.advance(1);
    expect(f.state.projectiles).toHaveLength(0);
  });
  for (const kind of ['skeleton', 'zombie', 'goblin', 'bat', 'rat', 'slime'] as const)
    it(`${kind} exposes detection, committed windup, active attack, recovery and disengagement`, () => {
      const f = fixture(kind),
        d = enemyDefinitionFor(kind);
      f.enemy.position = { x: 240, y: 150 };
      f.enemy.home = { ...f.enemy.position };
      f.actor.position = { x: 240, y: 150 + (kind === 'goblin' ? 90 : Math.min(18, d.reach - 2)) };
      f.state.invulnerableUntil = 10000;
      const phases = new Set([f.enemy.phase]);
      let shots = 0;
      for (let i = 0; i < 160; i++) {
        f.advance(1);
        phases.add(f.enemy.phase);
        shots = Math.max(shots, f.state.projectiles.length);
      }
      expect([...phases]).toEqual(
        expect.arrayContaining(['detect', 'pursuit', 'windup', 'active', 'recovery']),
      );
      if (kind === 'goblin') expect(shots).toBeGreaterThan(0);
      f.enemy.phase = 'pursuit';
      f.enemy.position = { x: 240, y: 180 };
      f.actor.position = { x: 470, y: 260 };
      f.advance(1);
      expect(f.enemy.phase).toBe('return');
    });
  it('requests bounded obstacle routes and follows them without walking through a bench', () => {
    const f = fixture();
    f.context.width = 160;
    f.context.height = 160;
    f.context.solids = [{ x: 70, y: 0, width: 8, height: 100 }];
    f.enemy.position = { x: 40, y: 80 };
    f.enemy.home = { ...f.enemy.position };
    f.enemy.phase = 'pursuit';
    f.actor.position = { x: 120, y: 80 };
    f.state.invulnerableUntil = 10000;
    const path = roomPath(f.enemy.position, f.actor.position, 160, 160, f.context.solids);
    expect(path.length).toBeGreaterThan(0);
    expect(path.every((p) => freeFoot(p, 160, 160, f.context.solids))).toBe(true);
    f.advance(1);
    const next = f.enemy.nextPathTick;
    f.advance(10);
    expect(f.enemy.nextPathTick).toBe(next);
    for (let i = 0; i < 300; i++) {
      f.advance(1);
      expect(f.context.solids.some((s) => overlaps(footRect(f.enemy.position), s))).toBe(false);
    }
    expect(f.enemy.position.x).toBeGreaterThan(80);
  });
  it('does not recompute an impossible route forever', () => {
    expect(
      roomPath({ x: 24, y: 24 }, { x: 120, y: 24 }, 160, 160, [
        { x: 70, y: 0, width: 8, height: 160 },
      ]),
    ).toEqual([]);
  });
});
describe('session-owned rewards, pause, death and checkpoint continuation', () => {
  it('emits one death/drop/completion per enemy and claims a coin only once', () => {
    const f = fixture();
    f.enemy.health = 3;
    f.enemy.position = { x: 240, y: 200 };
    f.enemy.hurtUntil = 1000;
    beginAction(f.state, f.actor, 'sword', 0, 'up');
    f.advance(24);
    expect(f.state.drops).toHaveLength(1);
    expect(f.events.filter((e) => e.type === 'combat.enemy-defeated')).toHaveLength(1);
    expect(f.events.filter((e) => e.type === 'combat.encounter-completed')).toHaveLength(1);
    f.advance(100);
    expect(f.state.drops).toHaveLength(1);
    const base = trialSession().export();
    base.combat = f.state;
    base.player.actor.position = { ...f.enemy.position };
    base.clock.tick = f.context.tick;
    const game = new GameSession(base, PREVIEW_CONTENT, PREVIEW_WORLD);
    const drop = f.state.drops[0];
    if (!drop) throw new Error('Missing drop');
    expect(game.dispatch({ type: 'combat.collect', dropId: drop.id })).toEqual({ ok: true });
    expect(game.export().player.carried.money).toBe(1);
    expect(game.dispatch({ type: 'combat.collect', dropId: drop.id }).ok).toBe(false);
    expect(game.export().player.carried.money).toBe(1);
  });
  it('freezes action, enemies, projectiles, regeneration and cooldowns under composed pauses', () => {
    const game = trialSession();
    game.dispatch({ type: 'combat.action', action: 'bow', facing: 'up' });
    game.advance(100);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: true });
    game.dispatch({ type: 'pause.set', reason: 'background', active: true });
    const before = game.serialize();
    game.advance(1000);
    expect(game.serialize()).toBe(before);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: false });
    const stillPaused = game.serialize();
    game.advance(200);
    expect(game.serialize()).toBe(stillPaused);
    expect(game.export().combat).toEqual(JSON.parse(before).combat);
    game.dispatch({ type: 'pause.set', reason: 'background', active: false });
    game.advance(200);
    expect(game.serialize()).not.toBe(before);
  });
  it('produces the same combat/regeneration/projectiles at 30/60/144 render rates', () => {
    const results = [30, 60, 144].map((fps) => {
      const base = trialSession().export();
      base.player.actor.resources.energy.current = 2;
      base.combat?.enemies.forEach((e) => (e.hurtUntil = 100000));
      const game = new GameSession(base, PREVIEW_CONTENT, PREVIEW_WORLD);
      game.dispatch({ type: 'combat.action', action: 'bow', facing: 'up' });
      for (let n = 0; n < fps * 3; n++) game.advance(1000 / fps);
      return game.export();
    });
    for (const value of results.slice(1)) {
      expect(value.combat).toEqual(results[0]?.combat);
      expect(value.player.actor.resources.energy.current).toBeCloseTo(
        results[0]?.player.actor.resources.energy.current ?? 0,
      );
      expect(value.clock.tick).toBe(results[0]?.clock.tick);
    }
  });
  it('persists committed action contacts and exact combat continuation across checkpoints', () => {
    const game = trialSession();
    game.dispatch({ type: 'combat.action', action: 'sword', facing: 'up' });
    game.advance(180);
    const checkpoint = game.serialize(),
      restored = new GameSession(JSON.parse(checkpoint), PREVIEW_CONTENT, PREVIEW_WORLD);
    for (let n = 0; n < 20; n++) {
      game.advance(20);
      restored.advance(20);
    }
    expect(restored.serialize()).toBe(game.serialize());
  });
  it('enters defeat once, restores a pending-death checkpoint paused, and resolves respawn only once', () => {
    const initial = trialSession().export();
    if (!initial.combat) throw new Error('Missing battle');
    initial.player.actor.resources.health.current = 1;
    initial.combat.invulnerableUntil = 0;
    const e = initial.combat.enemies[0];
    if (!e) throw new Error('Missing attacker');
    e.position = { x: 240, y: 204 };
    e.phase = 'active';
    e.attackFacing = 'down';
    initial.combat.enemies = initial.combat.enemies.filter((enemy) => enemy.id === e.id);
    const game = new GameSession(initial, PREVIEW_CONTENT, PREVIEW_WORLD);
    game.advance(20);
    expect(game.snapshot.combat?.phase).toBe('defeated');
    const deathId = game.snapshot.combat?.death?.id;
    if (!deathId) throw new Error('Missing defeat');
    expect(game.consumeEvents().filter((e) => e.type === 'combat.player-defeated')).toHaveLength(1);
    const before = game.serialize();
    game.advance(200);
    expect(game.serialize()).toBe(before);
    const restored = new GameSession(JSON.parse(before), PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(restored.snapshot.pauseReasons).toContain('death');
    expect(restored.dispatch({ type: 'combat.respawn', deathId })).toEqual({ ok: true });
    const resolved = restored.serialize();
    expect(restored.dispatch({ type: 'combat.respawn', deathId }).ok).toBe(false);
    expect(restored.serialize()).toBe(resolved);
    expect(restored.actor.resources.health.current).toBe(10);
    expect(restored.export().player.permanent).toEqual(initial.player.permanent);
    restored.dispatch({ type: 'combat.start', trial: 'melee' });
    expect(restored.export().combat?.nextSequence).toBeGreaterThan(deathId);
  });
  it('keeps practice possessions safe and can resolve configured material loss without touching permanent/deposited domains', () => {
    const state = createPreviewSave();
    state.player.carried.items.push(
      itemInstanceSchema.parse({
        id: 'item-instance:wood-1',
        templateId: 'item:wood',
        quantity: 5,
        enchantments: [],
      }),
    );
    state.player.carried.money = 11;
    const before = JSON.stringify(state.player);
    expect(
      resolveDeathLoss(state.player, PREVIEW_CONTENT, PRACTICE_LOSS_POLICY, () => {
        throw new Error('Practice must not consume death RNG');
      }).carried,
    ).toEqual(state.player.carried);
    const result = resolveDeathLoss(
      state.player,
      PREVIEW_CONTENT,
      lossPolicySchema.parse({ materialChance: 0.4, moneyFraction: 0.25 }),
      () => 0.2,
    );
    expect(result.lostItems).toEqual(['item-instance:wood-1']);
    expect(result.lostMoney).toBe(2);
    expect(JSON.stringify(state.player)).toBe(before);
  });
  it('rejects contradictory enemy, projectile-owner and defeat checkpoint state', () => {
    const bad = trialSession().export();
    if (!bad.combat) throw new Error('Missing battle');
    const enemy = bad.combat.enemies[0];
    if (!enemy) throw new Error('Missing enemy');
    enemy.health = 0;
    expect(() => new GameSession(bad, PREVIEW_CONTENT, PREVIEW_WORLD)).toThrow('health/death');
    const invalid = trialSession().export();
    if (!invalid.combat) throw new Error('Missing battle');
    invalid.combat.projectiles.push({
      id: 'wrong-owner',
      owner: invalid.player.actor.id,
      faction: 'enemy',
      position: { x: 200, y: 200 },
      velocity: { x: 0, y: 1 },
      damage: 1,
      remainingTicks: 10,
    });
    expect(() => new GameSession(invalid, PREVIEW_CONTENT, PREVIEW_WORLD)).toThrow('owner/faction');
    const blocked = trialSession().export();
    const target = blocked.combat?.enemies[0];
    if (!target) throw new Error('Missing actor');
    target.position = { x: 174, y: 115 };
    expect(() => new GameSession(blocked, PREVIEW_CONTENT, PREVIEW_WORLD)).toThrow(
      'inside a solid',
    );
  });
});
