import { describe, expect, it } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import {
  MERCHANT_ID,
  RESCUE_ID,
  SHOP_REGION,
  STOCK_QUEST,
  STORE_DOOR,
  RESERVED_PLOTS,
} from '../content/village';
import type { VillageNode } from '../content/village';
import { PREVIEW_WORLD } from '../content/world';
import { areaDefinition, enterArea, retainedArea } from './expeditions';
import { freeFoot } from './motion';
import type { Position, SaveState } from './model';
import { itemInstanceSchema } from './model';
import { readSaveState } from './save-state';
import { GameSession } from './session';
import { forestRescueSite, storefrontSolid } from './village';
import { toolSolidEntries } from './tools';
import { slotIdSchema, toolIdSchema } from './ids';

const make = (state = createPreviewSave()) =>
  new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
function near(state: SaveState, id: string, position: Position) {
  const region = areaDefinition(state, PREVIEW_WORLD);
  const solids = [
    ...toolSolidEntries(state, region, retainedArea(state)),
    ...storefrontSolid(state),
  ].map((entry) => entry.rect);
  for (const [dx, dy, facing] of [
    [0, 20, 'up'],
    [-20, 0, 'right'],
    [20, 0, 'left'],
    [0, -20, 'down'],
  ] as const) {
    const candidate = structuredClone(state);
    const foot = { x: position.x + dx, y: position.y + dy };
    if (!freeFoot(foot, region.width, region.height, solids)) continue;
    candidate.player.actor.position = foot;
    candidate.player.actor.facing = facing;
    const game = make(candidate);
    if (game.snapshot.nearby?.id === id) return game;
  }
  throw new Error(`No approach to ${id}`);
}
function talk(game: GameSession, target: string) {
  expect(game.dispatch({ type: 'world.interact', target })).toEqual({ ok: true });
}
function choose(game: GameSession, node: VillageNode, choice: string) {
  return game.dispatch({
    type: 'village.choose',
    node,
    choice,
    expectedTransaction: game.villageSnapshot.transaction,
  });
}
function close(game: GameSession) {
  expect(game.dispatch({ type: 'interaction.dismiss' }).ok).toBe(true);
}
function forest() {
  const state = createPreviewSave();
  enterArea(state, PREVIEW_WORLD, 'region:forest');
  return state;
}
function solveBrassGate(state: SaveState) {
  let checkpoint = state;
  for (const kind of ['key', 'gate-key']) {
    const target = retainedArea(checkpoint).geometry.generated?.placements.find(
      (entry) => entry.kind === kind,
    );
    if (!target) throw new Error(`Missing ${kind}`);
    const game = near(checkpoint, target.id, target.position);
    talk(game, target.id);
    close(game);
    checkpoint = game.export();
  }
  return checkpoint;
}
function rescue(state: SaveState) {
  const site = make(state).villageNpc;
  if (site?.id !== RESCUE_ID) throw new Error('Missing Tessa at trailhead');
  const game = near(state, site.id, site.position);
  talk(game, site.id);
  return game;
}
function recruit() {
  const game = rescue(solveBrassGate(forest()));
  expect(choose(game, 'rescue', 'invite')).toEqual({ ok: true });
  close(game);
  return game.export();
}
function enterShop(state: SaveState) {
  enterArea(state, PREVIEW_WORLD, 'region:clearing', 'merchant-return');
  const door = areaDefinition(state, PREVIEW_WORLD).interactions.find(
    (target) => target.id === STORE_DOOR,
  );
  if (!door) throw new Error('Missing store door');
  const game = near(state, door.id, door.position);
  talk(game, door.id);
  expect(game.snapshot.region.id).toBe(SHOP_REGION);
  return game.export();
}
function shopTalk(state: SaveState) {
  const npc = make(state).villageNpc;
  if (npc?.id !== MERCHANT_ID) throw new Error('Missing Tessa in store');
  const game = near(state, npc.id, npc.position);
  talk(game, MERCHANT_ID);
  return game;
}

describe('village rescue and merchant transactions', () => {
  it('requires a real brass-gate unlock, recruits once and opens the reserved shop', () => {
    const clearing = createPreviewSave();
    const plot = near(clearing, STORE_DOOR, { x: 380, y: 112 });
    talk(plot, STORE_DOOR);
    expect(plot.snapshot.message?.title).toBe('Inspect merchant plot');
    expect(() => enterArea(clearing, PREVIEW_WORLD, SHOP_REGION)).toThrow('Recruit Tessa');
    const state = forest();
    const blocked = rescue(state);
    expect(choose(blocked, 'rescue', 'invite').ok).toBe(false);
    expect(blocked.villageSnapshot.recruited).toBe(false);
    const game = rescue(solveBrassGate(state));
    const token = game.villageSnapshot.transaction;
    expect(choose(game, 'rescue', 'invite').ok).toBe(true);
    expect(
      game.dispatch({
        type: 'village.choose',
        node: 'rescue',
        choice: 'invite',
        expectedTransaction: token,
      }).ok,
    ).toBe(false);
    expect(game.export().domains.village.residents).toEqual([
      { id: MERCHANT_ID, recruited: true, service: 'general-store' },
    ]);
    expect(game.villageNpc).toBeNull();
    const interior = make(enterShop(game.export()));
    expect(interior.villageNpc?.id).toBe(MERCHANT_ID);
    expect(interior.villageSnapshot.stage).toBe('General store open');
  });

  it('saves dialogue and an earned reward once and trades without touching equipped or enchanted gear', () => {
    const state = enterShop(recruit());
    state.player.carried.items.push(
      itemInstanceSchema.parse({
        id: 'item-instance:shop-wood',
        templateId: 'item:wood',
        quantity: 4,
        enchantments: [],
      }),
    );
    const equipped = itemInstanceSchema.parse({
      id: 'item-instance:merchant-equipped',
      templateId: 'item:iron-sword',
      quantity: 1,
      enchantments: [],
    });
    const enchanted = itemInstanceSchema.parse({
      id: 'item-instance:merchant-keen',
      templateId: 'item:iron-sword',
      quantity: 1,
      enchantments: [{ id: 'enchantment:keen', magnitude: 2 }],
    });
    state.player.carried.items.push(equipped, enchanted);
    state.player.permanent.tools.push(toolIdSchema.parse('tool:sword'));
    state.player.equipment.push({
      slot: slotIdSchema.parse('slot:main-hand'),
      itemId: equipped.id,
    });
    let game = shopTalk(state);
    expect(choose(game, 'welcome', 'ask-stock').ok).toBe(true);
    expect(choose(game, 'stock', 'deliver-stock').ok).toBe(false);
    expect(choose(game, 'stock', 'accept-stock').ok).toBe(true);
    expect(choose(game, 'stock', 'deliver-stock').ok).toBe(true);
    expect(choose(game, 'stock', 'deliver-stock').ok).toBe(false);
    expect(game.villageSnapshot.stage).toBe('Market stocked');
    expect(game.export().player.carried.money).toBe(12);
    const checkpoint = JSON.parse(game.serialize()) as SaveState;
    expect(checkpoint.domains.village.dialogueFlags).toEqual(['heard-about-stock']);
    expect(checkpoint.domains.quests).toContainEqual({
      id: STOCK_QUEST,
      phase: 'completed',
      progress: 3,
      rewardClaimed: true,
    });
    game = shopTalk(checkpoint);
    expect(choose(game, 'welcome', 'browse').ok).toBe(true);
    const token = game.villageSnapshot.transaction;
    expect(
      game.dispatch({
        type: 'village.buy',
        item: 'item:wood',
        quantity: 2,
        expectedTransaction: token,
      }).ok,
    ).toBe(true);
    expect(
      game.dispatch({
        type: 'village.buy',
        item: 'item:wood',
        quantity: 2,
        expectedTransaction: token,
      }).ok,
    ).toBe(false);
    expect(game.villageSnapshot.shop?.money).toBe(8);
    const beforeRejectedSales = game.serialize();
    for (const itemId of [equipped.id, enchanted.id]) {
      expect(
        game.dispatch({
          type: 'village.sell',
          itemId,
          quantity: 1,
          expectedTransaction: game.villageSnapshot.transaction,
        }).ok,
      ).toBe(false);
    }
    expect(game.serialize()).toBe(beforeRejectedSales);
    expect(
      game.dispatch({
        type: 'village.sell',
        itemId: 'item-instance:shop-wood',
        quantity: 1,
        expectedTransaction: game.villageSnapshot.transaction,
      }).ok,
    ).toBe(true);
    const carried = game.export().player.carried;
    expect(carried.money).toBe(9);
    expect(carried.items).toContainEqual(
      expect.objectContaining({ id: 'item-instance:shop-wood', quantity: 2 }),
    );
    expect(carried.items).toContainEqual(equipped);
    expect(carried.items).toContainEqual(enchanted);
  });

  it('preserves money, capacity, identities and quest state when a shop trade is rejected', () => {
    const state = enterShop(recruit());
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
    const game = shopTalk(state);
    expect(choose(game, 'welcome', 'browse').ok).toBe(true);
    const before = game.serialize(),
      expectedTransaction = game.villageSnapshot.transaction;
    expect(
      game.dispatch({
        type: 'village.buy',
        item: 'item:iron-sword',
        quantity: 1,
        expectedTransaction,
      }),
    ).toMatchObject({ ok: false, message: 'You do not have enough coins.' });
    expect(
      game.dispatch({ type: 'village.buy', item: 'item:shield', quantity: 1, expectedTransaction })
        .ok,
    ).toBe(false);
    expect(game.serialize()).toBe(before);
  });

  it('adds the reserved plots and shop to older saves while retaining the forest and its RNG', () => {
    const state = solveBrassGate(forest());
    const oldForest = structuredClone(retainedArea(state));
    const clearing = state.world.regions.find((entry) => entry.id === 'region:clearing');
    if (clearing?.kind !== 'surface' || clearing.phase === 'unvisited')
      throw new Error('Missing clearing');
    clearing.geometry.objects = clearing.geometry.objects.filter(
      (object) => object.id !== STORE_DOOR && !RESERVED_PLOTS.some((plot) => plot.id === object.id),
    );
    state.world.regions = state.world.regions.filter((entry) => entry.id !== SHOP_REGION);
    const legacy = {
      ...state,
      schemaVersion: 5,
      domains: { ...state.domains, village: { residents: [] } },
    };
    const restored = readSaveState(legacy, PREVIEW_CONTENT);
    expect(retainedArea(restored)).toEqual(oldForest);
    expect(restored.random).toEqual(state.random);
    expect(restored.world.regions.filter((entry) => entry.id === SHOP_REGION)).toHaveLength(1);
    expect(readSaveState(restored, PREVIEW_CONTENT)).toEqual(restored);
  });

  it('finds a separate reachable rescue site across 100 generated forests', () => {
    for (let index = 0; index < 100; index++) {
      const state = createPreviewSave(`rescue-${index}`);
      enterArea(state, PREVIEW_WORLD, 'region:forest');
      const geometry = retainedArea(state).geometry;
      const definition = areaDefinition(state, PREVIEW_WORLD);
      expect(forestRescueSite(geometry, definition)).not.toBeNull();
    }
  });
});
