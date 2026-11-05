import { describe, it, expect } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { enterArea, retainedArea } from './expeditions';
import { GameSession } from './session';
import { copyData } from './data';
import { roomCenter } from './generation';
import { freeFoot } from './motion';
import { assertWorldInvariants } from './invariants';
import { toolIdSchema } from './ids';
import type { SaveState } from './model';
import { itemInstanceSchema } from './model';
function enter(state: SaveState, region: string) {
  enterArea(state, PREVIEW_WORLD, region, region === 'region:clearing' ? 'start' : 'entry');
  assertWorldInvariants(state, PREVIEW_CONTENT);
  return state;
}
function fresh(region = 'region:forest') {
  return enter(createPreviewSave('m06-lifecycle'), region);
}
function near(state: SaveState, kind: string) {
  const area = retainedArea(state),
    p = area.geometry.generated?.placements.find((p) => p.kind === kind);
  if (!p) throw new Error('Missing object');
  // Fixture positions isolate command semantics; browser tests walk the real geometry.
  const definition = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD).regionDefinition;
  const positions = [
    { x: p.position.x, y: p.position.y + 20, facing: 'up' as const },
    { x: p.position.x + 20, y: p.position.y, facing: 'left' as const },
    { x: p.position.x - 20, y: p.position.y, facing: 'right' as const },
    { x: p.position.x, y: p.position.y - 20, facing: 'down' as const },
  ];
  const chosen = positions.find((q) =>
    freeFoot(
      q,
      definition.width,
      definition.height,
      new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD).solids,
    ),
  );
  if (!chosen) throw new Error(`No approach: ${kind}`);
  state.player.actor.position = { x: chosen.x, y: chosen.y };
  state.player.actor.facing = chosen.facing;
  const game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
  expect(game.dispatch({ type: 'world.interact', target: p.id })).toEqual({ ok: true });
  expect(game.dispatch({ type: 'interaction.dismiss' })).toEqual({ ok: true });
  return game.export();
}
function checkpoint(state: SaveState) {
  return new GameSession(
    JSON.parse(new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD).serialize()),
    PREVIEW_CONTENT,
    PREVIEW_WORLD,
  ).export();
}
function beatAnchor(state: SaveState) {
  const area = retainedArea(state),
    slot = area.geometry.generated?.placements.find((p) => p.kind === 'anchor'),
    enemy = state.combat?.enemies.find((e) => e.kind === 'skeleton');
  if (!slot || !enemy) throw new Error('Missing anchor');
  state.player.actor.position = { x: slot.position.x, y: slot.position.y + 22 };
  state.player.actor.facing = 'up';
  const game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
  for (let hit = 0; hit < 3; hit++) {
    expect(game.dispatch({ type: 'combat.action', action: 'sword', facing: 'up' })).toEqual({
      ok: true,
    });
    for (let tick = 0; tick < 30; tick++) game.advance(20);
  }
  expect(game.export().combat?.enemies.find((e) => e.kind === 'skeleton')?.health).toBe(0);
  return game.export();
}
describe('persistent expedition transitions and anchored successor boundaries', () => {
  it('retains surface geography, discoveries, opened gates and one-time caches over three village round trips and checkpoints', () => {
    let state = fresh();
    const geometry = copyData(retainedArea(state).geometry);
    state = near(state, 'key');
    state = near(state, 'gate-key');
    state = near(state, 'switch');
    state = near(state, 'gate-switch');
    state = near(state, 'axe');
    state = near(state, 'gate-axe');
    state = near(state, 'secret');
    state = near(state, 'shortcut');
    const game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD),
      room = geometry.generated?.rooms.find((r) => r.id === 8);
    if (!room) throw new Error('Missing secret');
    game.advance(20, (context) => ({ position: roomCenter(room), facing: context.facing }));
    state = game.export();
    const changes = copyData(retainedArea(state).changes);
    for (let visit = 0; visit < 3; visit++) {
      enter(state, 'region:clearing');
      state = checkpoint(state);
      enter(state, 'region:forest');
      expect(retainedArea(state).geometry).toEqual(geometry);
      expect(retainedArea(state).changes).toEqual(changes);
      expect(state.player.permanent.tools).toContain('tool:axe');
    }
    const p = geometry.generated?.placements.find((p) => p.kind === 'secret');
    if (!p) throw new Error('Missing cache');
    state.player.actor.position = { x: p.position.x, y: p.position.y + 20 };
    state.player.actor.facing = 'up';
    const duplicate = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD),
      money = state.player.carried.money;
    expect(duplicate.dispatch({ type: 'world.interact', target: p.id })).toMatchObject({
      ok: false,
    });
    expect(duplicate.export().player.carried.money).toBe(money);
  });
  it('preserves a living anchor, enemy damage and instance identity through travel, pending defeat, village respawn and reload', () => {
    let state = fresh('region:crypt');
    const instance = copyData(state.world.dungeons[0]);
    if (!instance) throw new Error('Missing instance');
    const enemy = state.combat?.enemies.find((e) => e.kind === 'skeleton');
    if (!enemy) throw new Error('Missing boss');
    enemy.health = 2;
    enter(state, 'region:forest');
    state = checkpoint(state);
    enter(state, 'region:clearing');
    enter(state, 'region:crypt');
    expect(state.player.instanceId).toBe(instance.id);
    expect(state.combat?.enemies.find((e) => e.kind === 'skeleton')?.health).toBe(2);
    for (let defeat = 0; defeat < 2; defeat++) {
      const boss = state.combat?.enemies.find((e) => e.kind === 'skeleton');
      if (!boss || !state.combat) throw new Error('Missing combat');
      state.player.actor.position = { x: boss.position.x, y: boss.position.y + 18 };
      state.player.actor.resources.health.current = 1;
      state.combat.invulnerableUntil = 0;
      let game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
      for (let tick = 0; tick < 500 && !game.snapshot.paused; tick++) game.advance(20);
      const death = game.snapshot.combat?.death;
      expect(death?.phase).toBe('pending');
      if (!death) throw new Error('Missing death');
      game = new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD);
      expect(game.snapshot.pauseReasons).toContain('death');
      expect(game.dispatch({ type: 'combat.respawn', deathId: death.id })).toEqual({ ok: true });
      expect(game.snapshot.region.id).toBe('region:clearing');
      expect(game.dispatch({ type: 'combat.respawn', deathId: death.id })).toMatchObject({
        ok: false,
      });
      state = checkpoint(game.export());
      enter(state, 'region:crypt');
      expect(state.player.instanceId).toBe(instance.id);
      expect(retainedArea(state).geometry).toEqual(instance.geometry);
      expect(state.world.dungeons[0]?.anchor.phase).toBe('living');
      expect(state.combat?.enemies.find((e) => e.kind === 'skeleton')?.health).toBe(2);
    }
  });
  it('defeats the real warden once, waits for reward plus exit, then generates one successor without resetting permanent victory', () => {
    let state = beatAnchor(fresh('region:crypt'));
    const first = copyData(state.world.dungeons[0]);
    if (!first) throw new Error('Missing dungeon');
    expect(first.anchor.phase).toBe('defeated');
    expect(state.player.instanceId).toBe(first.id);
    enter(state, 'region:forest');
    enter(state, 'region:crypt');
    expect(state.player.instanceId).toBe(first.id);
    expect(state.world.dungeons).toHaveLength(1);
    state = near(state, 'reward');
    expect(state.world.dungeons[0]?.anchor.phase).toBe('defeated');
    state.player.permanent.tools.push(toolIdSchema.parse('tool:axe'));
    state.player.permanent.kingDefeated = true;
    state.player.permanent.kingdomRestored = true;
    const permanent = copyData(state.player.permanent);
    state = checkpoint(state);
    enter(state, 'region:forest');
    expect(state.world.dungeons[0]?.anchor.phase).toBe('pending-regeneration');
    expect(state.world.dungeons).toHaveLength(1);
    state = checkpoint(state);
    enter(state, 'region:crypt');
    expect(state.world.dungeons).toHaveLength(2);
    expect(state.world.dungeons[0]?.anchor.phase).toBe('retired');
    expect(state.world.dungeons[1]?.generation).toBe(2);
    expect(state.world.dungeons[1]?.anchor.phase).toBe('living');
    expect(state.player.instanceId).not.toBe(first.id);
    expect(state.player.permanent).toEqual(permanent);
    const successor = state.player.instanceId;
    enter(state, 'region:forest');
    enter(state, 'region:crypt');
    expect(state.player.instanceId).toBe(successor);
    expect(state.world.dungeons).toHaveLength(2);
  });
  it('unlocks optional rolled warden gear only after the anchor reward is collected', () => {
    const defeated = beatAnchor(fresh('region:crypt'));
    const locked = new GameSession(defeated, PREVIEW_CONTENT, PREVIEW_WORLD);
    const claim = (game: GameSession) =>
      game.dispatch({
        type: 'inventory.build-claim',
        reward: 'boss',
        expectedTransaction: game.inventoryView.expectedTransaction,
      });
    expect(claim(locked).ok).toBe(false);
    const game = new GameSession(near(defeated, 'reward'), PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(claim(game).ok).toBe(true);
    expect(game.inventoryView.items.map((item) => item.name)).toEqual([
      'Iron sword',
      'Bastion Stone',
    ]);
    expect(game.inventoryView.items[0]?.enchantments).toHaveLength(2);
    expect(claim(game).ok).toBe(false);
  });
  it('renews only offscreen supplies and claimed ordinary enemies on a later day, preserving geography, gates, caches and anchor corpses', () => {
    let state = fresh();
    state = near(state, 'key');
    state = near(state, 'gate-key');
    state = near(state, 'secret');
    state = near(state, 'resource');
    const original = copyData(retainedArea(state)),
      battle = state.combat,
      slime = battle?.enemies.find((e) => e.kind === 'slime');
    if (!battle || !slime) throw new Error('Missing encounter');
    slime.health = 0;
    slime.phase = 'dead';
    slime.deathTick = 0;
    battle.drops.push({
      id: `${slime.id}:drop`,
      position: slime.position,
      money: 1,
      claimed: false,
    });
    enter(state, 'region:clearing');
    state.calendar.day = 2;
    enter(state, 'region:forest');
    expect(state.combat?.enemies.find((e) => e.kind === 'slime')?.health).toBe(0);
    expect(state.combat?.drops[0]?.claimed).toBe(false);
    const resource = original.geometry.generated?.placements.find((p) => p.kind === 'resource');
    if (!resource) throw new Error('Missing supplies');
    expect(retainedArea(state).changes.openedObjects).not.toContain(resource.id);
    const drop = state.combat?.drops[0];
    if (!drop) throw new Error('Missing coin');
    drop.claimed = true;
    enter(state, 'region:clearing');
    state.calendar.day = 3;
    enter(state, 'region:forest');
    expect(state.combat?.enemies.find((e) => e.kind === 'slime')?.health).toBeGreaterThan(0);
    expect(state.combat?.enemies.find((e) => e.kind === 'slime')?.id).not.toBe(slime.id);
    expect(retainedArea(state).geometry).toEqual(original.geometry);
    expect(retainedArea(state).changes.openedPassages).toEqual(original.changes.openedPassages);
    expect(retainedArea(state).changes.claimedRewards).toEqual(original.changes.claimedRewards);
  });
  it('rejects stale gates, inaccessible rewards and blocked travel atomically', () => {
    const state = fresh('region:crypt'),
      area = retainedArea(state),
      gate = area.geometry.generated?.placements.find((p) => p.kind === 'gate-key');
    if (!gate) throw new Error('Missing gate');
    const definition = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD).regionDefinition,
      solid = definition.solids.find((s) => s.owner === gate.id);
    if (!solid) throw new Error('Missing solid');
    expect(freeFoot(gate.position, definition.width, definition.height, [solid.rect])).toBe(false);
    const horizontal = solid.rect.width === 16;
    state.player.actor.position = {
      x: gate.position.x + (horizontal ? 20 : 0),
      y: gate.position.y + (horizontal ? 0 : 20),
    };
    state.player.actor.facing = horizontal ? 'left' : 'up';
    const game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(game.dispatch({ type: 'world.interact', target: gate.id })).toMatchObject({
      ok: false,
      message: expect.stringContaining('key'),
    });
    expect(game.export()).toEqual(state);
    const reward = area.geometry.generated?.placements.find((p) => p.kind === 'reward');
    if (!reward) throw new Error('Missing reward');
    state.player.actor.position = { x: reward.position.x - 20, y: reward.position.y };
    state.player.actor.facing = 'right';
    const locked = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(locked.dispatch({ type: 'world.interact', target: reward.id })).toMatchObject({
      ok: false,
    });
    expect(locked.export().player.carried.money).toBe(0);
  });
  it('rejects contradictory anchor checkpoints and commits no partial transition when a return spawn is blocked', () => {
    const state = fresh('region:crypt'),
      dungeon = state.world.dungeons[0];
    if (!dungeon) throw new Error('Missing dungeon');
    dungeon.anchor.phase = 'defeated';
    expect(() => checkpoint(state)).toThrow('Anchor phase contradicts');
    const returning = fresh(),
      clearing = returning.world.regions.find((r) => r.id === 'region:clearing'),
      definition = PREVIEW_WORLD.region('region:clearing'),
      box = definition.objects.find((o) => o.id === 'entity:clearing-box'),
      shape = definition.solids.find((s) => s.owner === box?.id),
      spawn = definition.spawns.find((s) => s.id === 'start');
    if (clearing?.kind !== 'surface' || clearing.phase === 'unvisited' || !box || !shape || !spawn)
      throw new Error('Missing return fixture');
    const object = clearing.geometry.objects.find((o) => o.id === box.id);
    if (!object) throw new Error('Missing box');
    object.position = {
      x: spawn.position.x - (shape.rect.x - box.position.x) - shape.rect.width / 2,
      y: spawn.position.y - 3 - (shape.rect.y - box.position.y) - shape.rect.height / 2,
    };
    const portal = retainedArea(returning).geometry.generated?.placements.find(
      (p) => p.kind === 'portal',
    );
    if (!portal) throw new Error('Missing return portal');
    returning.player.actor.position = { x: portal.position.x + 20, y: portal.position.y };
    returning.player.actor.facing = 'left';
    const game = new GameSession(returning, PREVIEW_CONTENT, PREVIEW_WORLD),
      before = game.export();
    expect(game.dispatch({ type: 'world.interact', target: portal.id })).toMatchObject({
      ok: false,
      message: 'Destination doorway is blocked',
    });
    expect(game.export()).toEqual(before);
  });
  it('continues encounter/death sequences across regions and practice revisits so stale commands cannot resolve a later defeat', () => {
    let state = fresh('region:crypt');
    if (!state.combat) throw new Error('Missing battle');
    state.combat.nextSequence = 17;
    enter(state, 'region:forest');
    expect(state.combat?.nextSequence).toBe(17);
    if (!state.combat) throw new Error('Missing forest battle');
    state.combat.nextSequence = 23;
    enter(state, 'region:crypt');
    expect(state.combat?.nextSequence).toBe(23);
    enter(state, 'region:clearing');
    let game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(game.dispatch({ type: 'combat.start', trial: 'melee' })).toEqual({ ok: true });
    expect(game.export().combat?.nextSequence).toBe(23);
    state = game.export();
    const generation = state.combat?.generation;
    enter(state, 'region:clearing');
    game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(game.dispatch({ type: 'combat.start', trial: 'melee' })).toEqual({ ok: true });
    expect(game.export().combat?.generation).toBe((generation ?? 0) + 1);
    expect(game.export().combat?.nextSequence).toBe(23);
    const battleState = game.export(),
      battle = battleState.combat,
      enemy = battle?.enemies[0];
    if (!battle || !enemy) throw new Error('Missing defeat fixture');
    battleState.player.actor.position = { x: enemy.position.x, y: enemy.position.y + 18 };
    battleState.player.actor.resources.health.current = 1;
    battle.invulnerableUntil = 0;
    game = new GameSession(battleState, PREVIEW_CONTENT, PREVIEW_WORLD);
    for (let tick = 0; tick < 500 && !game.snapshot.paused; tick++) game.advance(20);
    const death = game.snapshot.combat?.death;
    if (!death) throw new Error('Missing pending defeat');
    expect(death.id).toBeGreaterThanOrEqual(23);
    expect(game.dispatch({ type: 'combat.respawn', deathId: 17 })).toMatchObject({ ok: false });
    expect(game.snapshot.combat?.death?.phase).toBe('pending');
    expect(game.dispatch({ type: 'combat.respawn', deathId: death.id })).toEqual({ ok: true });
  });
});

it('leaves full-pack supply points and their coin unclaimed, then collects both once after a deliberate discard makes room', () => {
  const state = fresh(),
    placement = retainedArea(state).geometry.generated?.placements.find(
      (p) => p.kind === 'resource',
    );
  if (!placement) throw new Error('Missing resource');
  const probe = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD),
    definition = probe.regionDefinition;
  const approaches = [
    { x: placement.position.x, y: placement.position.y + 20, facing: 'up' as const },
    { x: placement.position.x + 20, y: placement.position.y, facing: 'left' as const },
    { x: placement.position.x - 20, y: placement.position.y, facing: 'right' as const },
    { x: placement.position.x, y: placement.position.y - 20, facing: 'down' as const },
  ];
  const approach = approaches.find((p) =>
    freeFoot(p, definition.width, definition.height, probe.solids),
  );
  if (!approach) throw new Error('Missing approach');
  state.player.actor.position = { x: approach.x, y: approach.y };
  state.player.actor.facing = approach.facing;
  state.player.carried = {
    capacity: 1,
    money: 7,
    items: [
      itemInstanceSchema.parse({
        id: 'item-instance:full-wood',
        templateId: 'item:wood',
        quantity: 99,
        enchantments: [],
      }),
    ],
  };
  const game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD),
    before = game.serialize(),
    wood = state.player.carried.items[0];
  if (!wood) throw new Error('Missing wood');
  expect(game.dispatch({ type: 'world.interact', target: placement.id })).toMatchObject({
    ok: false,
    message: expect.stringContaining('remains unclaimed'),
  });
  expect(game.serialize()).toBe(before);
  expect(
    game.dispatch({
      type: 'inventory.discard',
      itemId: wood.id,
      quantity: 2,
      confirmed: true,
      expectedTransaction: game.inventoryView.expectedTransaction,
    }),
  ).toEqual({ ok: true });
  expect(game.dispatch({ type: 'world.interact', target: placement.id })).toEqual({ ok: true });
  expect(game.export().player.carried).toMatchObject({
    money: 8,
    items: [{ id: wood.id, quantity: 99 }],
  });
  expect(retainedArea(game.export()).changes.openedObjects).toContain(placement.id);
  game.dispatch({ type: 'interaction.dismiss' });
  expect(game.dispatch({ type: 'world.interact', target: placement.id })).toMatchObject({
    ok: false,
  });
  expect(game.export().player.carried.money).toBe(8);
});
