import { FARM_BARREL, FARM_PLOTS } from '../content/farm';
import { RESERVED_PLOTS, STORE_DOOR } from '../content/village';
import { describe, it, expect } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { TRAIL_ID } from '../content/tool-trail';
import { GameSession } from './session';
import { enterArea, retainedArea } from './expeditions';
import { toolIdSchema, entityIdSchema } from './ids';
import { readSaveState } from './save-state';
import { createBattle } from './combat';
import { freeFoot } from './motion';
import type { ActiveTool } from './tool-model';
import v2 from '../../tests/fixtures/save-v2.json';
function fixture(
  x = 48,
  y = 488,
  facing: 'up' | 'down' | 'left' | 'right' = 'right',
  owned = true,
) {
  const state = createPreviewSave('m09-tools');
  enterArea(state, PREVIEW_WORLD, TRAIL_ID);
  if (!state.combat) throw new Error('Missing trail combat');
  state.combat.enemies = [];
  state.combat.completed = true;
  state.combat.invulnerableUntil = 0;
  state.player.actor.position = { x, y };
  state.player.actor.facing = facing;
  if (owned)
    state.player.permanent.tools = ['bow', 'bomb', 'boomerang', 'hook', 'magic'].map((id) =>
      toolIdSchema.parse(`tool:${id}`),
    );
  return new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
}
function advance(game: GameSession, ticks: number) {
  for (let i = 0; i < ticks; i++) game.advance(20);
}
function use(game: GameSession, tool: ActiveTool) {
  return game.dispatch({ type: 'tool.action', tool });
}
function restore(game: GameSession) {
  return new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD);
}
function pose(game: GameSession, x: number, y: number, facing: 'up' | 'down' | 'left' | 'right') {
  const state = game.export();
  state.player.actor.position = { x, y };
  state.player.actor.facing = facing;
  return new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
}
const changed = (
  game: GameSession,
  set: 'openedObjects' | 'openedPassages' | 'claimedRewards' | 'removedObjects',
  id: string,
) => retainedArea(game.export()).changes[set].includes(entityIdSchema.parse(`entity:trail-${id}`));
describe('saved tools and recoverable authored puzzles', () => {
  it('uses real enemy contacts for returning boomerang hits, magic damage, one bomb blast and hook interception', () => {
    function battleFixture() {
      const state = fixture(688, 408, 'right').export(),
        battle = createBattle('melee', 1, 0),
        enemy = battle.enemies[0];
      if (!enemy) throw new Error('Missing enemy');
      battle.regionId = state.player.regionId;
      battle.enemies = [enemy];
      enemy.id = entityIdSchema.parse('entity:trail-test-skeleton');
      enemy.position = { x: 728, y: 408 };
      enemy.home = { ...enemy.position };
      enemy.hurtUntil = 10000;
      battle.invulnerableUntil = 0;
      state.combat = battle;
      return new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    }
    const returning = battleFixture();
    expect(use(returning, 'boomerang')).toEqual({ ok: true });
    advance(returning, 100);
    expect(returning.battlePresentation?.enemies[0]?.health).toBe(4);
    const magic = battleFixture();
    expect(use(magic, 'magic')).toEqual({ ok: true });
    advance(magic, 30);
    expect(magic.battlePresentation?.enemies[0]?.health).toBe(3);
    let bomb = battleFixture();
    expect(use(bomb, 'bomb')).toEqual({ ok: true });
    bomb = pose(bomb, 680, 464, 'right');
    advance(bomb, 100);
    expect(bomb.battlePresentation?.enemies[0]?.health).toBe(2);
    advance(bomb, 12);
    expect(bomb.battlePresentation?.enemies[0]?.health).toBe(2);
    const hook = battleFixture(),
      state = hook.export();
    if (!state.combat?.enemies[0]) throw new Error('Missing enemy');
    state.combat.enemies[0].hurtUntil = 0;
    const intercepted = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(use(intercepted, 'hook')).toEqual({ ok: true });
    advance(intercepted, 4);
    expect(intercepted.battlePresentation?.enemies[0]?.hurtUntil).toBeGreaterThan(intercepted.tick);
    expect(intercepted.toolsPresentation.effects[0]?.phase).toBe('back');
    expect(intercepted.actor.position.x).toBe(688);
  });

  it('grants only the nearby permanent trail kit, keeps acquisition idempotent and rejects unowned tools without consuming energy or identities', () => {
    const game = fixture(56, 480, 'right', false),
      before = game.serialize();
    expect(use(game, 'bomb')).toMatchObject({ ok: false });
    expect(game.serialize()).toBe(before);
    expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-kit' })).toEqual({
      ok: true,
    });
    expect(game.export().player.permanent.tools).toContain('tool:hook');
    const tools = game.export().player.permanent.tools;
    game.dispatch({ type: 'world.interact', target: 'entity:trail-kit' });
    expect(game.export().player.permanent.tools).toEqual(tools);
    expect(restore(game).export().player.permanent.tools).toEqual(tools);
  });
  it('commits cardinal bow aim through its full windup, uses no energy and opens only a visible arrow target', () => {
    const game = fixture(240, 408, 'up'),
      state = game.export();
    state.player.actor.resources.energy.current = 0;
    const empty = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(use(empty, 'bow')).toEqual({ ok: true });
    expect(empty.actor.resources.energy.current).toBe(0);
    advance(empty, 12);
    expect(empty.battlePresentation?.projectiles).toHaveLength(0);
    advance(empty, 1);
    expect(empty.battlePresentation?.projectiles[0]?.velocity).toMatchObject({ x: 0 });
    expect(use(empty, 'bow')).toMatchObject({ ok: false });
    advance(empty, 24);
    expect(changed(empty, 'openedPassages', 'bow-gate')).toBe(true);
    expect(restore(empty).worldPresentation.passages).toContain('entity:trail-bow-gate');
    const wrong = fixture(240, 408, 'left');
    use(wrong, 'bow');
    advance(wrong, 40);
    expect(changed(wrong, 'openedObjects', 'bow-target')).toBe(false);
    const outdoors = new GameSession(
      createPreviewSave('outside-battle-bow'),
      PREVIEW_CONTENT,
      PREVIEW_WORLD,
    );
    expect(use(outdoors, 'bow')).toEqual({ ok: true });
    expect(outdoors.inventoryView.hotbar.find((t) => t.id === 'bow')?.cooldownSeconds).toBe(1);
    advance(outdoors, 50);
    expect(outdoors.inventoryView.hotbar.find((t) => t.id === 'bow')?.cooldownSeconds).toBe(0);
  });
  it('retains a placed bomb fuse under composed pause and reload, then applies one permanent blast after the exact fuse boundary', () => {
    let game = fixture(600, 408, 'right');
    expect(use(game, 'bomb')).toEqual({ ok: true });
    expect(game.actor.resources.energy.current).toBe(7);
    advance(game, 60);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: true });
    const frozen = game.serialize();
    game.advance(1000);
    expect(game.serialize()).toBe(frozen);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: false });
    advance(game, 39);
    expect(changed(game, 'openedPassages', 'bomb-wall')).toBe(false);
    game = pose(game, 584, 456, 'right');
    game = restore(game);
    advance(game, 1);
    expect(game.toolsPresentation.effects[0]).toMatchObject({ kind: 'bomb', phase: 'blast' });
    expect(changed(game, 'openedPassages', 'bomb-wall')).toBe(true);
    const restored = restore(game);
    advance(restored, 30);
    expect(restored.toolsPresentation.effects).toHaveLength(0);
    expect(
      restored.worldPresentation.passages.filter((id) => id === 'entity:trail-bomb-wall'),
    ).toHaveLength(1);
  });
  it('lifts and throws the same live bomb without resetting its fuse', () => {
    const game = fixture(600, 408, 'right');
    use(game, 'bomb');
    advance(game, 20);
    expect(game.dispatch({ type: 'tool.lift-bomb' })).toEqual({ ok: true });
    const id = game.toolsPresentation.effects[0]?.id;
    expect(game.toolsPresentation.carriedBomb).toBe(id);
    advance(game, 10);
    expect(game.dispatch({ type: 'tool.throw' })).toEqual({ ok: true });
    expect(game.toolsPresentation.effects[0]?.age).toBe(30);
    expect(game.toolsPresentation.carriedBomb).toBe(null);
    advance(game, 70);
    expect(changed(game, 'openedPassages', 'bomb-wall')).toBe(true);
  });
  it('returns a boomerang, retrieves one loose coin and preserves the in-flight cargo through reload without duplicate claims', () => {
    let game = fixture(480, 136, 'up');
    expect(use(game, 'boomerang')).toEqual({ ok: true });
    advance(game, 20);
    expect(use(game, 'boomerang')).toMatchObject({ ok: false });
    expect(game.toolsPresentation.effects[0]?.cargo).toBe('entity:trail-coin');
    game = restore(game);
    advance(game, 100);
    expect(game.toolsPresentation.effects).toHaveLength(0);
    expect(game.export().player.carried.money).toBe(1);
    expect(changed(game, 'openedPassages', 'return-gate')).toBe(true);
    expect(changed(game, 'claimedRewards', 'coin')).toBe(true);
    expect(use(game, 'boomerang')).toEqual({ ok: true });
    advance(game, 120);
    expect(game.export().player.carried.money).toBe(1);
  });
  it('extends, latches, pulls and retracts a hook across unwalkable water, including mid-tether reload and rejected blocked tethers', () => {
    let game = fixture(688, 408, 'right');
    expect(freeFoot({ x: 760, y: 408 }, 960, 544, game.solids)).toBe(false);
    expect(use(game, 'hook')).toEqual({ ok: true });
    advance(game, 16);
    expect(game.toolsPresentation.effects[0]?.phase).toBe('pull');
    expect(game.actor.position.x).toBeGreaterThan(688);
    game = restore(game);
    advance(game, 20);
    expect(game.actor.position).toEqual({ x: 824, y: 408 });
    expect(game.toolsPresentation.effects.filter((e) => e.kind === 'hook')).toHaveLength(0);
    expect(game.swimming).toBe(false);
    const blocked = fixture(688, 408, 'right').export(),
      crate = retainedArea(blocked).geometry.objects.find((o) => o.id === 'entity:trail-crate');
    if (!crate) throw new Error('Missing crate');
    crate.position = { x: 824, y: 408 };
    const occupied = new GameSession(blocked, PREVIEW_CONTENT, PREVIEW_WORLD),
      before = occupied.serialize();
    expect(use(occupied, 'hook')).toMatchObject({
      ok: false,
      message: expect.stringContaining('visible brass anchor'),
    });
    expect(occupied.serialize()).toBe(before);
  });
  it('requires regenerating energy only for magic/bombs, and allows a required brazier puzzle to recover from an empty pool', () => {
    const initial = fixture(800, 232, 'up').export();
    initial.player.actor.resources.energy.current = 0;
    const game = new GameSession(initial, PREVIEW_CONTENT, PREVIEW_WORLD),
      before = game.serialize();
    expect(use(game, 'magic')).toMatchObject({
      ok: false,
      message: expect.stringContaining('energy'),
    });
    expect(game.serialize()).toBe(before);
    advance(game, 100);
    expect(use(game, 'magic')).toEqual({ ok: true });
    advance(game, 25);
    expect(changed(game, 'openedObjects', 'brazier')).toBe(true);
    expect(changed(game, 'openedPassages', 'magic-gate')).toBe(true);
    expect(restore(game).worldPresentation.passages).toContain('entity:trail-magic-gate');
  });
  it('pushes and pulls a non-liftable weight onto and away from a live plate, retaining the solved positions after reload', () => {
    let game = fixture(376, 432, 'right');
    expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-weight' })).toEqual({
      ok: true,
    });
    expect(game.export().player.carrying).toBe(null);
    expect(game.solids.some((s) => s.x === 552 && s.y === 384)).toBe(true);
    for (let i = 0; i < 3; i++) {
      expect(use(game, 'push')).toEqual({ ok: true });
      advance(game, 8);
    }
    expect(
      retainedArea(game.export()).geometry.objects.find((o) => o.id === 'entity:trail-weight')
        ?.position,
    ).toEqual({ x: 448, y: 432 });
    expect(game.solids.some((s) => s.x === 552 && s.y === 384)).toBe(false);
    game = restore(game);
    expect(game.solids.some((s) => s.x === 552 && s.y === 384)).toBe(false);
    game = pose(game, 472, 432, 'left');
    expect(use(game, 'pull')).toEqual({ ok: true });
    expect(game.solids.some((s) => s.x === 552 && s.y === 384)).toBe(true);
  });
  it('throws liftable crates safely, breaks pots and resets movable puzzle pieces without undoing permanent passages or claims', () => {
    let game = fixture(344, 464, 'right');
    expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-crate' })).toEqual({
      ok: true,
    });
    expect(game.export().player.carrying).toBe('entity:trail-crate');
    expect(game.dispatch({ type: 'tool.use' })).toEqual({ ok: true });
    advance(game, 12);
    expect(changed(game, 'removedObjects', 'crate')).toBe(false);
    expect(
      retainedArea(game.export()).geometry.objects.find((o) => o.id === 'entity:trail-crate')
        ?.position.x,
    ).toBe(408);
    game = pose(game, 96, 428, 'right');
    game.dispatch({ type: 'world.interact', target: 'entity:trail-pot' });
    game.dispatch({ type: 'tool.throw' });
    advance(game, 12);
    expect(changed(game, 'removedObjects', 'pot')).toBe(true);
    const state = game.export();
    retainedArea(state).changes.openedPassages.push(entityIdSchema.parse('entity:trail-bow-gate'));
    game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    game = pose(game, 96, 476, 'right');
    expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-reset' })).toEqual({
      ok: true,
    });
    expect(changed(game, 'removedObjects', 'pot')).toBe(false);
    expect(changed(game, 'openedPassages', 'bow-gate')).toBe(true);
    expect(game.actor.position).toEqual({ x: 48, y: 488 });
  });
  it('persists two readable colour groups and keeps an occupied doorway open until its occupant clears it', () => {
    let game = fixture(864, 344, 'up');
    expect(game.trailPresentation.find((f) => f.kind === 'blue-gate')?.blocked).toBe(true);
    expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-lever-low' })).toEqual({
      ok: true,
    });
    expect(game.trailPresentation.find((f) => f.kind === 'blue-gate')?.blocked).toBe(false);
    game = restore(game);
    expect(game.trailPresentation.find((f) => f.kind === 'orange-gate')?.blocked).toBe(true);
    game = pose(game, 864, 200, 'down');
    game.dispatch({ type: 'world.interact', target: 'entity:trail-lever-high' });
    expect(game.trailPresentation.find((f) => f.kind === 'blue-gate')?.blocked).toBe(true);
    game = pose(game, 864, 272, 'down');
    expect(game.trailPresentation.find((f) => f.kind === 'blue-gate')?.blocked).toBe(false);
    game.advance(20, (c) => ({ position: { x: c.position.x, y: 290 }, facing: 'down' }));
    expect(game.trailPresentation.find((f) => f.kind === 'blue-gate')?.blocked).toBe(true);
  });
  it('telegraphs timed spikes/traps, freezes their cycles under menus and rescues pit/acid contact to retained safe ground', () => {
    const game = fixture(864, 194, 'down');
    advance(game, 39);
    expect(game.actor.resources.health.current).toBe(10);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: true });
    game.advance(5000);
    expect(game.tick).toBe(39);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: false });
    advance(game, 1);
    expect(game.actor.resources.health.current).toBe(8);
    const trap = fixture(848, 408, 'right');
    trap.dispatch({ type: 'combat.guard', active: true });
    advance(trap, 70);
    expect(trap.actor.resources.health.current).toBe(10);
    expect(trap.actor.resources.energy.current).toBeLessThan(10);
    const state = fixture(404, 120, 'down').export();
    state.tools.safe = { regionId: state.player.regionId, position: { x: 376, y: 136 } };
    const pit = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    advance(pit, 1);
    expect(pit.actor.position).toEqual({ x: 376, y: 136 });
    expect(pit.actor.resources.health.current).toBe(8);
    const acidState = fixture(900, 184, 'down').export();
    acidState.tools.safe = { regionId: acidState.player.regionId, position: { x: 876, y: 216 } };
    const acid = new GameSession(acidState, PREVIEW_CONTENT, PREVIEW_WORLD);
    advance(acid, 1);
    expect(acid.actor.resources.health.current).toBe(8);
    expect(acid.actor.position).toEqual({ x: 876, y: 216 });
    const current = fixture(688, 324, 'left');
    advance(current, 10);
    expect(current.actor.position.x).toBeCloseTo(696);
    current.dispatch({ type: 'pause.set', reason: 'menu', active: true });
    current.advance(1000);
    expect(current.actor.position.x).toBeCloseTo(696);
    current.dispatch({ type: 'pause.set', reason: 'menu', active: false });
    for (let i = 0; i < 5; i++)
      current.advance(20, (c) => ({
        position: { x: c.position.x - 1.8, y: c.position.y },
        facing: 'left',
      }));
    expect(current.actor.position.x).toBeCloseTo(691);
  });
  it('gates the required water channel on permanent flippers, which survive saved defeat together with solved passages', () => {
    let game = fixture(288, 176, 'left');
    expect(freeFoot({ x: 224, y: 136 }, 960, 544, game.solids)).toBe(false);
    expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-flippers' })).toEqual({
      ok: true,
    });
    expect(freeFoot({ x: 224, y: 136 }, 960, 544, game.solids)).toBe(true);
    const state = game.export();
    state.player.actor.resources.health.current = 1;
    state.player.actor.position = { x: 404, y: 120 };
    state.tools.safe = { regionId: state.player.regionId, position: { x: 376, y: 136 } };
    retainedArea(state).changes.openedPassages.push(entityIdSchema.parse('entity:trail-shortcut'));
    game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    advance(game, 1);
    const death = game.snapshot.combat?.death;
    if (!death) throw new Error('No pending defeat');
    game = restore(game);
    expect(game.dispatch({ type: 'combat.respawn', deathId: death.id })).toEqual({ ok: true });
    expect(game.snapshot.region.id).toBe('region:clearing');
    expect(game.export().player.permanent.tools).toContain('tool:swim');
    const trail = retainedArea(game.export(), TRAIL_ID, null);
    expect(trail.changes.openedPassages).toContain('entity:trail-shortcut');
    expect(game.toolsPresentation.effects).toHaveLength(0);
  });
  it('adds the authored annex and entry exactly once while preserving every older region, dungeon, item and random continuation through v3 migration', () => {
    const old = {
        ...structuredClone(v2),
        schemaVersion: 3,
        pack: { selectedTool: 'bow', starterClaimed: true },
      },
      migrated = readSaveState(old, PREVIEW_CONTENT);
    expect(migrated.schemaVersion).toBe(7);
    expect(migrated.pack).toEqual(old.pack);
    expect(migrated.player).toEqual(old.player);
    expect(migrated.random).toEqual(old.random);
    expect(migrated.world.regions.filter((r) => r.id === TRAIL_ID)).toHaveLength(1);
    for (const original of old.world.regions) {
      const current = migrated.world.regions.find((r) => r.id === original.id);
      if (
        (original.id === 'region:woodland' || original.id === 'region:clearing') &&
        current?.kind === 'surface' &&
        current.phase !== 'unvisited'
      ) {
        const retained = structuredClone(current);
        retained.geometry.objects = retained.geometry.objects.filter(
          (o) =>
            o.id !== 'entity:woodland-tool-trail' &&
            o.id !== STORE_DOOR &&
            o.id !== FARM_BARREL.id &&
            !FARM_PLOTS.some((plot) => plot.id === o.id && plot.id !== 'entity:clearing-plot') &&
            !RESERVED_PLOTS.some((plot) => plot.id === o.id),
        );
        expect(retained).toEqual(original);
      } else expect(current).toEqual(original);
    }
    expect(readSaveState(migrated, PREVIEW_CONTENT)).toEqual(migrated);
    expect(migrated.tools).toEqual({
      nextId: 1,
      effects: [],
      carriedBomb: null,
      safe: null,
      feedback: '',
    });
    expect(() =>
      readSaveState({ ...migrated, tools: { ...migrated.tools, carriedBomb: 9 } }, PREVIEW_CONTENT),
    ).toThrow('carried bomb');
  });
});

it('keeps a retrieved coin unclaimed when the money balance is full, then claims it once after room is available', () => {
  const state = fixture(480, 136, 'up').export();
  state.player.carried.money = Number.MAX_SAFE_INTEGER;
  let game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
  use(game, 'boomerang');
  advance(game, 120);
  expect(game.export().player.carried.money).toBe(Number.MAX_SAFE_INTEGER);
  expect(changed(game, 'claimedRewards', 'coin')).toBe(false);
  const available = game.export();
  available.player.carried.money--;
  game = new GameSession(available, PREVIEW_CONTENT, PREVIEW_WORLD);
  use(game, 'boomerang');
  advance(game, 120);
  expect(game.export().player.carried.money).toBe(Number.MAX_SAFE_INTEGER);
  expect(changed(game, 'claimedRewards', 'coin')).toBe(true);
});
it('toggles a linked lever group only once per boomerang throw, even when both matching levers are on the return path', () => {
  const game = fixture(864, 376, 'up');
  use(game, 'boomerang');
  advance(game, 100);
  expect(game.toolsView?.orange).toBe(true);
  expect(game.trailPresentation.find((f) => f.kind === 'blue-gate')?.blocked).toBe(false);
});
it('does not strand a defeated player carrying a world object or a live bomb, and restores the world owner once', () => {
  for (const kind of ['crate', 'bomb'] as const) {
    let game = fixture(kind === 'crate' ? 344 : 600, kind === 'crate' ? 464 : 408, 'right');
    if (kind === 'crate')
      expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-crate' })).toEqual({
        ok: true,
      });
    else {
      expect(use(game, 'bomb')).toEqual({ ok: true });
      expect(game.dispatch({ type: 'tool.lift-bomb' })).toEqual({ ok: true });
    }
    const state = game.export();
    state.player.actor.resources.health.current = 0;
    if (!state.combat) throw new Error('No battle');
    const id = state.combat.nextSequence++;
    state.combat.death = { id, phase: 'pending', lostItems: [], lostMoney: 0, losses: [] };
    game = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(game.dispatch({ type: 'combat.respawn', deathId: id })).toEqual({ ok: true });
    expect(game.snapshot.region.id).toBe('region:clearing');
    expect(game.export().player.carrying).toBe(null);
    expect(game.toolsPresentation.carriedBomb).toBe(null);
    expect(game.toolsPresentation.effects).toHaveLength(0);
    if (kind === 'crate')
      expect(retainedArea(game.export(), TRAIL_ID, null).changes.removedObjects).not.toContain(
        'entity:trail-crate',
      );
    expect(game.dispatch({ type: 'combat.respawn', deathId: id })).toMatchObject({ ok: false });
    expect(restore(game).snapshot.region.id).toBe('region:clearing');
  }
});
it('restores an unlanded thrown crate to its retained pre-lift position on travel, while rejecting travel with a held bomb', () => {
  let game = fixture(344, 464, 'right');
  game.dispatch({ type: 'world.interact', target: 'entity:trail-crate' });
  game.dispatch({ type: 'tool.throw' });
  const state = game.export(),
    before = retainedArea(state).geometry.objects.find(
      (o) => o.id === 'entity:trail-crate',
    )?.position;
  enterArea(state, PREVIEW_WORLD, 'region:woodland');
  expect(
    retainedArea(state, TRAIL_ID, null).geometry.objects.find((o) => o.id === 'entity:trail-crate')
      ?.position,
  ).toEqual(before);
  expect(retainedArea(state, TRAIL_ID, null).changes.removedObjects).not.toContain(
    'entity:trail-crate',
  );
  expect(state.tools.effects).toHaveLength(0);
  game = fixture(32, 488, 'down');
  use(game, 'bomb');
  game.dispatch({ type: 'tool.lift-bomb' });
  const carried = game.serialize();
  expect(game.dispatch({ type: 'world.interact', target: 'entity:trail-exit' })).toMatchObject({
    ok: false,
    message: expect.stringContaining('live bomb'),
  });
  expect(game.serialize()).toBe(carried);
});
