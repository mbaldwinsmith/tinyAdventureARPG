import { describe, expect, it, vi } from 'vitest';
import { GameSession } from './session';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { ContentRegistry, MissingContentError } from '../content/schemas';
import { copyData } from './data';
import { RandomStreams, RANDOM_STREAMS, randomStateSchema } from './random';
import {
  entityIdSchema,
  itemInstanceIdSchema,
  toolIdSchema,
  slotIdSchema,
  unlockIdSchema,
} from './ids';
import { saveSchema, itemInstanceSchema, dungeonSchema, regionSchema } from './model';
import { stackIdentity } from './invariants';
import { defeatAnchor, requestRegeneration, retireInstance, setSurfaceActivity } from './lifecycle';
import { STEP_MS } from './time';

const session = () => new GameSession(createPreviewSave(), PREVIEW_CONTENT);
const blade = () =>
  itemInstanceSchema.parse({
    id: 'item-instance:preview-1',
    templateId: 'item:iron-sword',
    quantity: 1,
    enchantments: [{ id: 'enchantment:keen', magnitude: 3 }],
  });
function equippedSave() {
  const save = createPreviewSave();
  save.world.nextId = 2;
  save.player.carried.items.push(blade());
  save.player.permanent.tools.push(toolIdSchema.parse('tool:sword'));
  save.player.equipment.push({ slot: slotIdSchema.parse('slot:main-hand'), itemId: blade().id });
  return save;
}

describe('serializable identities, content and possession boundaries', () => {
  it('keeps names separate from typed IDs and resumes monotonic allocation without collisions', () => {
    expect(entityIdSchema.safeParse('A Friendly Villager').success).toBe(false);
    expect(entityIdSchema.safeParse('item:wood').success).toBe(false);
    const game = session();
    expect(game.allocateId('item-instance')).toBe('item-instance:preview-1');
    const restored = new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT);
    expect(restored.allocateId('entity')).toBe('entity:preview-2');
    const invalid = equippedSave();
    invalid.world.nextId = 1;
    expect(() => new GameSession(invalid, PREVIEW_CONTENT)).toThrow('reuse');
  });
  it('validates content references, optional nulls, duplicate IDs and cyclic progression', () => {
    expect(PREVIEW_CONTENT.item('item:wood').requiredTool).toBeNull();
    expect(() => PREVIEW_CONTENT.item('item:missing')).toThrow(MissingContentError);
    const duplicate = copyData(PREVIEW_CONTENT.data);
    duplicate.items.push(copyData(duplicate.items[0] ?? PREVIEW_CONTENT.item('item:wood')));
    expect(() => new ContentRegistry(duplicate)).toThrow('Duplicate');
    const cycle = copyData(PREVIEW_CONTENT.data);
    const unlock = cycle.unlocks[0];
    if (!unlock) throw new Error('Missing fixture');
    unlock.requiresUnlocks.push(unlock.id);
    expect(() => new ContentRegistry(cycle)).toThrow('Cyclic');
    expect(() => saveSchema.parse({ ...createPreviewSave(), schemaVersion: 2 })).toThrow();
    const unknown = copyData(PREVIEW_CONTENT.data);
    const item = unknown.items[0];
    if (!item) throw new Error('Missing fixture');
    item.requiredTool = toolIdSchema.parse('tool:missing');
    expect(() => new ContentRegistry(unknown)).toThrow(MissingContentError);
  });
  it('rejects duplicated possessions, excessive stacks, incompatible equipment and enchantments', () => {
    const good = equippedSave();
    expect(() => new GameSession(good, PREVIEW_CONTENT)).not.toThrow();
    const duplicate = copyData(good);
    duplicate.player.deposits.push({
      chestId: entityIdSchema.parse('entity:clearing-chest'),
      regionId: good.player.regionId,
      instanceId: null,
      inventory: { capacity: 10, money: 500, items: [blade()] },
    });
    expect(() => new GameSession(duplicate, PREVIEW_CONTENT)).toThrow('multiple possessions');
    const excessive = copyData(good);
    const excessiveItem = excessive.player.carried.items[0];
    if (!excessiveItem) throw new Error('Missing fixture');
    excessiveItem.quantity = 2;
    expect(() => new GameSession(excessive, PREVIEW_CONTENT)).toThrow('Stack exceeds');
    const equipment = copyData(good);
    const equipped = equipment.player.equipment[0];
    if (!equipped) throw new Error('Missing fixture');
    equipped.slot = slotIdSchema.parse('slot:off-hand');
    expect(() => new GameSession(equipment, PREVIEW_CONTENT)).toThrow('Impossible equipment');
    const missingTool = copyData(good);
    missingTool.player.permanent.tools = [];
    expect(() => new GameSession(missingTool, PREVIEW_CONTENT)).toThrow('permanent tool');
    const incompatible = copyData(good);
    const enchanted = incompatible.player.carried.items[0];
    if (!enchanted) throw new Error('Missing fixture');
    enchanted.templateId = PREVIEW_CONTENT.item('item:wood').id;
    incompatible.player.equipment = [];
    expect(() => new GameSession(incompatible, PREVIEW_CONTENT)).toThrow(
      'Incompatible enchantment',
    );
    const a = blade(),
      b = blade();
    b.id = itemInstanceIdSchema.parse('item-instance:other');
    expect(stackIdentity(a)).toBe(stackIdentity(b));
    const enchant = b.enchantments[0];
    if (!enchant) throw new Error('Missing fixture');
    enchant.magnitude = 4;
    expect(stackIdentity(a)).not.toBe(stackIdentity(b));
  });
  it('validates progression and retains separately deposited possessions in detached checkpoints', () => {
    const state = equippedSave();
    state.player.permanent.tools.push(toolIdSchema.parse('tool:axe'));
    state.player.permanent.unlocks.push(unlockIdSchema.parse('unlock:woodland-route'));
    state.player.deposits.push({
      chestId: entityIdSchema.parse('entity:clearing-chest'),
      regionId: state.player.regionId,
      instanceId: null,
      inventory: { capacity: 5, items: [], money: 50 },
    });
    const game = new GameSession(state, PREVIEW_CONTENT);
    state.player.carried.money = 999;
    const checkpoint = game.export();
    expect(checkpoint.player.carried.money).toBe(0);
    expect(checkpoint.player.deposits[0]?.inventory.money).toBe(50);
    checkpoint.player.permanent.tools.length = 0;
    expect(game.export().player.permanent.tools).toHaveLength(2);
    const invalid = copyData(state);
    invalid.player.permanent.tools = [];
    expect(() => new GameSession(invalid, PREVIEW_CONTENT)).toThrow('progression prerequisite');
    const victory = createPreviewSave();
    victory.player.permanent.kingdomRestored = true;
    expect(() => new GameSession(victory, PREVIEW_CONTENT)).toThrow('King victory');
  });
});

describe('isolated deterministic streams and plain-data checkpoints', () => {
  it('keeps loot independent of terrain/encounters/death draws and restores every stream exactly', () => {
    const golden = new RandomStreams('fixture-seed');
    expect(RANDOM_STREAMS.map((stream) => golden.next(stream))).toEqual([
      0.5191265829199648, 0.7428488522804453, 0.39618337218967825, 0.37810615032793826,
    ]);
    const a = new RandomStreams('fixture-seed'),
      b = new RandomStreams('fixture-seed');
    for (let i = 0; i < 100; i++) {
      a.next('terrain');
      a.next('encounters');
      a.next('death');
    }
    expect(Array.from({ length: 20 }, () => a.next('loot'))).toEqual(
      Array.from({ length: 20 }, () => b.next('loot')),
    );
    const restored = new RandomStreams('fixture-seed', JSON.parse(JSON.stringify(a.snapshot())));
    for (const stream of RANDOM_STREAMS)
      expect(Array.from({ length: 20 }, () => restored.next(stream))).toEqual(
        Array.from({ length: 20 }, () => a.next(stream)),
      );
    const corrupt = a.snapshot();
    corrupt.streams.loot.S.fill(0);
    expect(() => randomStateSchema.parse(corrupt)).toThrow();
    expect(() => a.integer('terrain', 0)).toThrow('bound');
  });
  it('round-trips runtime state and resumes time and random outcomes without a browser or wall clock', () => {
    const original = session();
    for (let i = 0; i < 3; i++) original.nextRandom('loot');
    original.advance(77);
    const encoded = original.serialize(),
      restored = new GameSession(JSON.parse(encoded), PREVIEW_CONTENT);
    expect(restored.export()).toEqual(original.export());
    original.advance(123);
    restored.advance(123);
    expect(restored.nextRandom('loot')).toBe(original.nextRandom('loot'));
    expect(restored.serialize()).toBe(original.serialize());
    expect(encoded).not.toContain('pauseReasons');
    expect(encoded).not.toContain('timestamp');
    const invalid = original.export();
    invalid.player.actor.resources.health.current = 100;
    expect(() => new GameSession(invalid, PREVIEW_CONTENT)).toThrow();
  });
});

describe('one fixed-step owner for position, calendar and timed data', () => {
  it('commits resolved movement exactly once per step across render rates', () => {
    const results = [30, 60, 144].map((fps) => {
      const game = session();
      const resolver = vi.fn((context) => ({
        position: {
          x: context.position.x + (context.movementSpeedPixelsPerSecond * context.stepMs) / 1000,
          y: context.position.y,
        },
        facing: context.facing,
      }));
      for (let i = 0; i < fps; i++) game.advance(1000 / fps, resolver);
      expect(resolver).toHaveBeenCalledTimes(50);
      expect(game.tick).toBe(50);
      expect(game.actor.position.x).toBeCloseTo(300, 8);
      return game.export().calendar;
    });
    expect(results[0]).toEqual(results[1]);
    expect(results[1]).toEqual(results[2]);
    const invalid = session();
    expect(() =>
      invalid.advance(STEP_MS, () => ({ position: { x: NaN, y: 0 }, facing: 'down' })),
    ).toThrow();
    expect(invalid.tick).toBe(0);
    expect(() => invalid.advance(-1)).toThrow();
    expect(invalid.advance(60000).simulatedMs).toBe(240);
  });
  it('composes pause reasons and freezes all timed state without banked frame catch-up', () => {
    const state = createPreviewSave();
    state.player.actor.cooldowns.push({
      toolId: toolIdSchema.parse('tool:bow'),
      remainingTicks: 3,
    });
    state.player.actor.statuses.push({
      id: PREVIEW_CONTENT.status('status:slowed').id,
      source: null,
      remainingTicks: 2,
      stacks: 1,
    });
    const game = new GameSession(state, PREVIEW_CONTENT);
    game.advance(25);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: true });
    game.dispatch({ type: 'pause.set', reason: 'background', active: true });
    game.dispatch({ type: 'pause.set', reason: 'menu', active: false });
    const frozen = game.serialize(),
      resolve = vi.fn();
    game.advance(1000000, resolve);
    expect(resolve).not.toHaveBeenCalled();
    expect(game.serialize()).toBe(frozen);
    expect(game.snapshot.pauseReasons).toEqual(['background']);
    expect(game.dispatch({ type: 'calendar.sleep', expectedDay: 1 }).ok).toBe(false);
    game.dispatch({ type: 'pause.set', reason: 'background', active: false });
    game.advance(15);
    expect(game.actor.statuses).toHaveLength(0);
    expect(game.actor.cooldowns[0]?.remainingTicks).toBe(1);
    game.advance(20);
    expect(game.actor.cooldowns).toHaveLength(0);
    expect(Reflect.set(game.snapshot.calendar, 'day', 900)).toBe(false);
  });
  it('rolls seasons/years and makes a sleep command atomic and stale-safe', () => {
    const state = createPreviewSave();
    state.timeRules = { ticksPerDay: 5, daysPerSeason: 2, startHour: 6 };
    state.calendar.day = 8;
    const game = new GameSession(state, PREVIEW_CONTENT);
    game.advance(100);
    expect(game.snapshot.calendar).toMatchObject({
      day: 9,
      season: 'Spring',
      year: 2,
      dayOfSeason: 1,
      minuteOfDay: 360,
    });
    const before = game.export().player;
    const command = { type: 'calendar.sleep', expectedDay: 9 };
    expect(game.dispatch(command)).toEqual({ ok: true });
    expect(game.snapshot.calendar.day).toBe(10);
    expect(game.export().player).toEqual(before);
    expect(game.dispatch(command)).toMatchObject({ ok: false, code: 'stale-command' });
    expect(game.consumeEvents().map((e) => [e.type, e.sequence, e.tick])).toEqual([
      ['calendar.day-started', 1, 5],
      ['calendar.day-started', 2, 5],
    ]);
    expect(game.consumeEvents()).toHaveLength(0);
  });
  it('keeps snapshots stable and rejects invalid and reentrant commands', () => {
    const game = session(),
      snapshot = game.snapshot;
    game.advance(20);
    expect(game.snapshot).toBe(snapshot);
    expect(game.dispatch({ type: 'appearance.set', hero: 99 })).toMatchObject({
      ok: false,
      code: 'invalid-command',
    });
    game.advance(20, (context) => {
      expect(game.dispatch({ type: 'calendar.sleep', expectedDay: 1 })).toMatchObject({
        ok: false,
        code: 'busy',
      });
      return { position: { ...context.position }, facing: context.facing };
    });
    expect(game.snapshot.calendar.day).toBe(1);
  });
});

describe('retained regions and guarded dungeon anchor lifecycle', () => {
  it('preserves geometry/deltas across inactivity and blocks living or occupied regeneration', () => {
    const initial = createPreviewSave().world.regions[0];
    if (!initial || initial.kind !== 'surface' || initial.phase === 'unvisited')
      throw new Error('Missing surface fixture');
    const surface = copyData(initial);
    surface.changes.claimedRewards.push(entityIdSchema.parse('entity:clearing-chest'));
    expect(setSurfaceActivity(setSurfaceActivity(surface, false), true)).toEqual(surface);
    const dungeon = dungeonSchema.parse({
      id: 'instance:crypt-1',
      regionId: 'region:fixture-crypt',
      generation: 1,
      generatorVersion: 1,
      geometry: {
        ...copyData(surface.geometry),
        objects: [{ id: 'entity:crypt-anchor', position: { x: 100, y: 100 } }],
      },
      changes: { removedObjects: [], openedPassages: [], claimedRewards: [] },
      anchor: { bossId: 'entity:crypt-anchor', phase: 'living' },
    });
    expect(() => requestRegeneration(dungeon, false)).toThrow('cannot regenerate');
    const defeated = defeatAnchor(dungeon);
    expect(dungeon.anchor.phase).toBe('living');
    expect(defeated.geometry).toEqual(dungeon.geometry);
    expect(() => requestRegeneration(defeated, true)).toThrow();
    const pending = requestRegeneration(defeated, false);
    expect(() => retireInstance(pending, true)).toThrow();
    expect(retireInstance(pending, false).anchor.phase).toBe('retired');
    const state = createPreviewSave();
    state.world.regions.push(
      regionSchema.parse({
        id: 'region:fixture-crypt',
        kind: 'dungeon',
        currentInstance: dungeon.id,
      }),
    );
    state.world.dungeons.push(dungeon);
    const invalid = copyData(state);
    const anchor = invalid.world.dungeons[0];
    if (!anchor) throw new Error('Missing anchor fixture');
    anchor.changes.removedObjects.push(anchor.anchor.bossId);
    expect(() => new GameSession(invalid, PREVIEW_CONTENT)).toThrow('Living anchor');
    const checkpoint = new GameSession(state, PREVIEW_CONTENT).serialize();
    expect(
      new GameSession(JSON.parse(checkpoint), PREVIEW_CONTENT).export().world.dungeons[0]?.anchor
        .phase,
    ).toBe('living');
  });
});
