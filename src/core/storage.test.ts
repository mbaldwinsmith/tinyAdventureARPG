import { describe, it, expect } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { GameSession } from './session';
import { itemInstanceSchema, saveSchema } from './model';
import { toolIdSchema, slotIdSchema, itemInstanceIdSchema } from './ids';
import { transferItem, transferMoney } from './transactions';
import { resolveDeathLoss, EXPEDITION_LOSS_POLICY } from './death-loss';
import { enterArea } from './expeditions';
import { readSaveState } from './save-state';
import legacyFixture from '../../tests/fixtures/save-v1.json';
function wood(id: string, quantity: number) {
  return itemInstanceSchema.parse({
    id: `item-instance:${id}`,
    templateId: 'item:wood',
    quantity,
    enchantments: [],
  });
}
function nearChest() {
  const state = createPreviewSave();
  state.player.actor.position = { x: 211, y: 175 };
  state.player.actor.facing = 'up';
  state.player.carried.items = [wood('carried-wood', 10)];
  state.player.carried.money = 25;
  return state;
}
describe('atomic local storage and confirmed per-unit loss', () => {
  it('preflights capacity, merges only identical properties and allocates a new identity only for a partial stack that needs a new slot', () => {
    const source = { capacity: 20, items: [wood('wood', 10)], money: 0 },
      destination = { capacity: 1, items: [wood('stored', 95)], money: 0 };
    let allocations = 0;
    const allocate = () => {
      allocations++;
      return itemInstanceIdSchema.parse('item-instance:split');
    };
    expect(() =>
      transferItem(source, destination, 'item-instance:wood', 5, PREVIEW_CONTENT, allocate),
    ).toThrow('no space');
    expect(allocations).toBe(0);
    expect(source.items[0]?.quantity).toBe(10);
    expect(destination.items[0]?.quantity).toBe(95);
    const merged = transferItem(
      source,
      destination,
      'item-instance:wood',
      4,
      PREVIEW_CONTENT,
      allocate,
    );
    expect(merged.source.items[0]?.quantity).toBe(6);
    expect(merged.destination.items[0]).toMatchObject({ id: 'item-instance:stored', quantity: 99 });
    expect(allocations).toBe(0);
    const partial = transferItem(
      source,
      { capacity: 2, items: [], money: 0 },
      'item-instance:wood',
      3,
      PREVIEW_CONTENT,
      allocate,
    );
    expect(partial.source.items[0]?.id).toBe('item-instance:wood');
    expect(partial.destination.items[0]).toMatchObject({ id: 'item-instance:split', quantity: 3 });
    expect(allocations).toBe(1);
    const full = transferItem(
      source,
      { capacity: 1, items: [], money: 0 },
      'item-instance:wood',
      10,
      PREVIEW_CONTENT,
      allocate,
    );
    expect(full.destination.items[0]?.id).toBe('item-instance:wood');
    expect(full.source.items).toHaveLength(0);
    expect(allocations).toBe(1);
  });
  it('rejects money underflow/overflow and returns both complete inventories without mutating inputs', () => {
    const carried = { capacity: 20, items: [], money: 25 },
      chest = { capacity: 20, items: [], money: 100 };
    expect(() => transferMoney(carried, chest, 26)).toThrow('Not enough');
    expect(() => transferMoney(carried, { ...chest, money: Number.MAX_SAFE_INTEGER }, 1)).toThrow(
      'cannot hold',
    );
    const moved = transferMoney(carried, chest, 10);
    expect([moved.source.money, moved.destination.money]).toEqual([15, 110]);
    expect([carried.money, chest.money]).toEqual([25, 100]);
  });
  it('requires a nearby local chest and a fresh transaction token, then retains both owners and IDs in checkpoints', () => {
    const game = new GameSession(nearChest(), PREVIEW_CONTENT, PREVIEW_WORLD),
      view = game.storageView;
    if (!view) throw new Error('Missing chest');
    const command = {
      type: 'storage.item',
      chestId: view.id,
      direction: 'deposit',
      itemId: 'item-instance:carried-wood',
      quantity: 3,
      expectedTransaction: view.expectedTransaction,
    };
    expect(game.dispatch(command)).toEqual({ ok: true });
    expect(game.dispatch(command)).toMatchObject({ ok: false });
    const restored = new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD),
      next = restored.storageView;
    if (!next) throw new Error('Missing restored chest');
    expect(next.carried.items[0]?.quantity).toBe(7);
    expect(next.deposited.items[0]?.quantity).toBe(3);
    expect(next.carried.items[0]?.id).not.toBe(next.deposited.items[0]?.id);
    expect(
      restored.dispatch({
        type: 'storage.money',
        chestId: next.id,
        direction: 'deposit',
        amount: 10,
        expectedTransaction: next.expectedTransaction,
      }),
    ).toEqual({ ok: true });
    const exported = restored.export();
    exported.player.actor.position = { x: 240, y: 146 };
    const distant = new GameSession(exported, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(distant.dispatch({ ...command, expectedTransaction: 3 })).toMatchObject({
      ok: false,
      message: expect.stringContaining('Stand nearby'),
    });
  });
  it('keeps each chest local when travelling between authored regions', () => {
    const game = new GameSession(nearChest(), PREVIEW_CONTENT, PREVIEW_WORLD),
      chest = game.storageView;
    if (!chest) throw new Error('Missing clearing chest');
    expect(
      game.dispatch({
        type: 'storage.money',
        chestId: chest.id,
        direction: 'deposit',
        amount: 10,
        expectedTransaction: chest.expectedTransaction,
      }),
    ).toEqual({ ok: true });
    const state = game.export();
    enterArea(state, PREVIEW_WORLD, 'region:cottage');
    state.player.actor.position = { x: 230, y: 116 };
    state.player.actor.facing = 'up';
    const cottage = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD),
      local = cottage.storageView;
    if (!local) throw new Error('Missing cottage chest');
    expect(local.deposited.money).toBe(0);
    expect(
      cottage.dispatch({
        type: 'storage.money',
        chestId: local.id,
        direction: 'withdraw',
        amount: 1,
        expectedTransaction: local.expectedTransaction,
      }),
    ).toMatchObject({ ok: false });
    expect(cottage.export().player.deposits[0]?.inventory.money).toBe(10);
  });
  it('rolls each material unit independently, retains partial-stack identity and protects all equipment, deposits and permanent tools', () => {
    const state = nearChest();
    state.player.permanent.tools = [toolIdSchema.parse('tool:sword')];
    const sword = itemInstanceSchema.parse({
      id: 'item-instance:keen',
      templateId: 'item:iron-sword',
      quantity: 1,
      enchantments: [{ id: 'enchantment:keen', magnitude: 2 }],
    });
    state.player.carried.items = [wood('wood', 4), sword];
    state.player.equipment = [{ slot: slotIdSchema.parse('slot:main-hand'), itemId: sword.id }];
    state.player.carried.money = 29;
    state.player.deposits = [
      {
        chestId:
          PREVIEW_WORLD.region('region:clearing').objects.find(
            (o) => o.id === 'entity:clearing-chest',
          )?.id ?? state.player.actor.id,
        regionId: state.player.regionId,
        instanceId: null,
        inventory: { capacity: 20, items: [wood('banked', 40)], money: 100 },
      },
    ];
    const before = structuredClone(state.player),
      draws = [0.1, 0.9, 0.2, 0.7];
    let index = 0;
    const loss = resolveDeathLoss(
      state.player,
      PREVIEW_CONTENT,
      EXPEDITION_LOSS_POLICY,
      () => draws[index++] ?? 0.9,
    );
    expect(index).toBe(4);
    expect(loss.lostMoney).toBe(2);
    expect(loss.losses).toEqual([
      { id: 'item-instance:wood', templateId: 'item:wood', quantity: 2 },
    ]);
    expect(loss.carried.items[0]).toMatchObject({ id: 'item-instance:wood', quantity: 2 });
    expect(loss.carried.items[1]).toEqual(sword);
    expect(state.player).toEqual(before);
    state.player.carried.money = 9007199254740989;
    expect(
      resolveDeathLoss(state.player, PREVIEW_CONTENT, EXPEDITION_LOSS_POLICY, () => 0.9).lostMoney,
    ).toBe(900719925474098);
  });
  it('migrates the supported v1 fixture without rerolling geography, discoveries, money or random continuation and rejects future versions', () => {
    const legacy: unknown = legacyFixture,
      upgraded = readSaveState(legacy, PREVIEW_CONTENT);
    expect(upgraded.schemaVersion).toBe(5);
    expect(upgraded.player.carried.money).toBe(17);
    expect(upgraded.world.regions.find((r) => r.id === 'region:forest')).toMatchObject({
      changes: { exploredRooms: [0, 1] },
    });
    expect(upgraded.deathRules).toMatchObject({
      materialChance: 0.25,
      moneyFraction: 0.1,
      unit: 'each',
      equipment: 'protected',
    });
    const legacyObject = JSON.parse(JSON.stringify(legacy));
    const original = saveSchema.parse({ ...legacyObject, schemaVersion: 5 }).world;
    const retained = structuredClone(upgraded.world);
    retained.regions = retained.regions.filter((r) => r.id !== 'region:tool-trail');
    const woodland = retained.regions.find((r) => r.id === 'region:woodland');
    if (woodland?.kind === 'surface' && woodland.phase !== 'unvisited')
      woodland.geometry.objects = woodland.geometry.objects.filter(
        (o) => o.id !== 'entity:woodland-tool-trail',
      );
    expect(retained).toEqual(original);
    expect(upgraded.random).toEqual(legacyObject.random);
    expect(() => readSaveState({ ...upgraded, schemaVersion: 99 }, PREVIEW_CONTENT)).toThrow(
      'Unsupported',
    );
  });
});
