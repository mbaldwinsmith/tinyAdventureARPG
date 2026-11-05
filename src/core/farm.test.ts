import { MERCHANT_ID } from '../content/village';
import { describe, expect, it } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { CROPS, FARM_BARREL, FARM_PLOTS, WATER_CAPACITY } from '../content/farm';
import { GameSession } from './session';
import { readSaveState } from './save-state';
import { enterArea } from './expeditions';

const plot = FARM_PLOTS[1];
const make = (state = createPreviewSave()) =>
  new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
function atPlot(state = createPreviewSave()) {
  state.player.actor.position = { x: plot.position.x, y: plot.position.y - 20 };
  state.player.actor.facing = 'down';
  return make(state);
}
function open(game: GameSession, target = plot.id) {
  expect(game.dispatch({ type: 'world.interact', target })).toEqual({ ok: true });
}
function tend(game: GameSession, action: string, target = plot.id) {
  return game.dispatch({
    type: 'farm.tend',
    target,
    action,
    expectedTransaction: game.export().nextTransaction,
  });
}
function plant(game: GameSession, crop: string) {
  return game.dispatch({
    type: 'farm.plant',
    target: plot.id,
    crop,
    expectedTransaction: game.export().nextTransaction,
  });
}
function sleep(game: GameSession) {
  expect(game.dispatch({ type: 'interaction.dismiss' }).ok).toBe(true);
  expect(
    game.dispatch({ type: 'calendar.sleep', expectedDay: game.snapshot.calendar.day }),
  ).toEqual({ ok: true });
  open(game);
}
function planted(crop: string) {
  const game = atPlot();
  open(game);
  expect(tend(game, 'supplies').ok).toBe(true);
  expect(tend(game, 'hoe').ok).toBe(true);
  expect(plant(game, crop).ok).toBe(true);
  return game;
}

describe('farm and active days', () => {
  it('allocates fresh resident and farm defaults for every adventure', () => {
    const first = createPreviewSave('first');
    first.domains.village.residents.push({
      id: MERCHANT_ID,
      recruited: true,
      service: 'general-store',
    });
    first.domains.farm.plots.push({
      id: plot.id,
      regionId: first.player.regionId,
      prepared: true,
      wateredDay: null,
      crop: null,
    });
    const second = createPreviewSave('second');
    expect(second.domains.village.residents).toEqual([]);
    expect(second.domains.farm.plots).toEqual([]);
  });
  it('keeps care, growth, sleep energy and harvest durable without advancing dry or paused days', () => {
    let game = planted('turnip');
    expect(tend(game, 'water').ok).toBe(true);
    const wet = game.export();
    expect(tend(game, 'water').ok).toBe(false);
    expect(game.advance(250).steps).toBe(0);
    expect(game.export()).toEqual(wet);
    game = make(wet);
    open(game);
    expect(game.export().domains.farm.plots[0]?.crop?.growth).toBe(0);
    sleep(game);
    expect(game.actor.resources.energy.current).toBe(game.actor.resources.energy.maximum);
    expect(game.export().domains.farm.plots[0]).toMatchObject({
      wateredDay: null,
      crop: { growth: 1 },
    });
    sleep(game);
    expect(game.export().domains.farm.plots[0]?.crop?.growth).toBe(1);
    expect(tend(game, 'water').ok).toBe(true);
    sleep(game);
    expect(tend(game, 'harvest').ok).toBe(true);
    expect(tend(game, 'harvest').ok).toBe(false);
    const after = make(game.export()).export();
    expect(after.domains.farm.plots[0]).toMatchObject({ prepared: true, crop: null });
    expect(
      after.player.carried.items.find((item) => item.templateId === CROPS.turnip.produce)?.quantity,
    ).toBe(1);
  });
  it('regrows blueberries across spring to summer, then withers them in autumn', () => {
    let game = planted('blueberry');
    const nearSummer = game.export();
    nearSummer.calendar.day = 27;
    game = make(nearSummer);
    open(game);
    for (let day = 0; day < 4; day++) {
      expect(tend(game, 'water').ok).toBe(true);
      sleep(game);
    }
    expect(game.snapshot.calendar.season).toBe('Summer');
    expect(tend(game, 'harvest').ok).toBe(true);
    expect(game.export().domains.farm.plots[0]?.crop?.growth).toBe(2);
    const withEmptyCan = game.export();
    expect(withEmptyCan.domains.farm.water).toBe(0);
    expect(tend(game, 'water').ok).toBe(false);
    withEmptyCan.player.actor.position = {
      x: FARM_BARREL.position.x,
      y: FARM_BARREL.position.y + 20,
    };
    withEmptyCan.player.actor.facing = 'up';
    game = make(withEmptyCan);
    open(game, FARM_BARREL.id);
    expect(tend(game, 'refill', FARM_BARREL.id).ok).toBe(true);
    expect(game.export().domains.farm.water).toBe(WATER_CAPACITY);
    game = atPlot(game.export());
    open(game);
    for (let day = 0; day < 2; day++) {
      expect(tend(game, 'water').ok).toBe(true);
      sleep(game);
    }
    expect(tend(game, 'harvest').ok).toBe(true);
    expect(
      game.export().player.carried.items.find((item) => item.templateId === CROPS.blueberry.produce)
        ?.quantity,
    ).toBe(4);
    const lateSummer = game.export();
    lateSummer.calendar.day = 56;
    game = atPlot(lateSummer);
    open(game);
    expect(tend(game, 'water').ok).toBe(true);
    sleep(game);
    expect(game.export().domains.farm.plots[0]?.crop?.withered).toBe(true);
    expect(tend(game, 'clear').ok).toBe(true);
    expect(plant(game, 'blueberry').ok).toBe(false);
  });
  it('crosses 02:00 once without the sleep refill, including when away from the farm', () => {
    const plotGame = planted('turnip');
    expect(tend(plotGame, 'water').ok).toBe(true);
    const state = plotGame.export();
    enterArea(state, PREVIEW_WORLD, 'region:forest');
    state.calendar.elapsedTicks = state.timeRules.ticksPerDay - 1;
    state.player.actor.resources.energy.current = 2;
    const game = make(state);
    expect(game.snapshot.calendar.minuteOfDay).toBe(119);
    game.advance(20);
    expect(game.snapshot.calendar).toMatchObject({ day: 2, minuteOfDay: 360 });
    expect(game.actor.resources.energy.current).toBeLessThan(10);
    expect(game.export().domains.farm.plots[0]?.crop?.growth).toBe(1);
    expect(
      game.consumeEvents().filter((event) => event.type === 'calendar.day-started'),
    ).toMatchObject([{ cause: 'rollover', day: 2 }]);
    const restored = make(game.export());
    restored.advance(20);
    expect(restored.export().domains.farm.plots[0]?.crop?.growth).toBe(1);
  });
  it('rejects full-pack and stale requests without spending seeds, water or IDs', () => {
    const state = createPreviewSave();
    state.player.carried.capacity = 2;
    const game = atPlot(state);
    open(game);
    const before = game.export();
    expect(tend(game, 'supplies').ok).toBe(false);
    expect(game.export()).toEqual(before);
    const grow = planted('turnip');
    const plantedState = grow.export();
    expect(
      grow.dispatch({
        type: 'farm.tend',
        target: plot.id,
        action: 'water',
        expectedTransaction: plantedState.nextTransaction - 1,
      }),
    ).toMatchObject({ code: 'stale-command' });
    expect(grow.export()).toEqual(plantedState);
  });
  it('retains soil, watering, tools and the date through an expedition death and reload', () => {
    const plotGame = planted('carrot');
    expect(tend(plotGame, 'water').ok).toBe(true);
    const state = plotGame.export();
    enterArea(state, PREVIEW_WORLD, 'region:crypt');
    if (!state.combat) throw new Error('Missing expedition encounter');
    state.player.actor.resources.health.current = 0;
    const deathId = state.combat.nextSequence++;
    state.combat.death = { id: deathId, phase: 'pending', lostItems: [], lostMoney: 0, losses: [] };
    const game = make(state);
    expect(game.advance(250).steps).toBe(0);
    expect(game.dispatch({ type: 'combat.respawn', deathId })).toEqual({ ok: true });
    const checkpoint = make(game.export()).export();
    expect(checkpoint.domains.farm).toEqual(state.domains.farm);
    expect(checkpoint.calendar).toEqual(state.calendar);
    expect(checkpoint.player.permanent.tools).toEqual(state.player.permanent.tools);
  });
  it('migrates the old clock and adds farm objects without growing anything or touching RNG', () => {
    const state = createPreviewSave();
    state.calendar.elapsedTicks = 15000; // 18:00 in the 24-hour preview.
    const clearing = state.world.regions.find((region) => region.id === 'region:clearing');
    if (clearing?.kind !== 'surface' || clearing.phase === 'unvisited')
      throw new Error('Missing clearing');
    clearing.geometry.objects = clearing.geometry.objects.filter(
      (object) =>
        object.id !== FARM_BARREL.id &&
        !FARM_PLOTS.some((entry) => entry.id === object.id && entry.id !== plot.id),
    );
    const upgraded = readSaveState({ ...state, schemaVersion: 6 }, PREVIEW_CONTENT);
    expect(make(upgraded).snapshot.calendar).toMatchObject({ day: 1, minuteOfDay: 1080 });
    expect(upgraded.domains.farm.plots).toEqual([]);
    expect(upgraded.random).toEqual(state.random);
    expect(upgraded.world.regions.find((region) => region.id === 'region:clearing')).toMatchObject({
      geometry: { objects: expect.arrayContaining([...FARM_PLOTS, FARM_BARREL]) },
    });
  });
});
