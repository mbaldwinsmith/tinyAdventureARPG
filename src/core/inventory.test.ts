import { describe, it, expect } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { ContentRegistry } from '../content/schemas';
import { PREVIEW_WORLD } from '../content/world';
import { GameSession } from './session';
import { itemInstanceSchema } from './model';
import type { InventoryCommand } from './inventory-model';
import { effectiveStats } from './equipment';
import { statusIdSchema } from './ids';
import { readSaveState } from './save-state';
import { receiveItem } from './inventory';
import { createBattle, beginAction, stepBattle, damagePlayer } from './combat';
import type { BattleContext } from './combat';
import v2 from '../../tests/fixtures/save-v2.json';
function fixture(capacity = 20) {
  const state = createPreviewSave('pack-tests');
  state.player.actor.position = { x: 211, y: 175 };
  state.player.actor.facing = 'up';
  state.player.carried.capacity = capacity;
  return new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
}
function command(
  game: GameSession,
  input: Omit<InventoryCommand, 'expectedTransaction'> | Record<string, unknown>,
) {
  return game.dispatch({ ...input, expectedTransaction: game.inventoryView.expectedTransaction });
}
function supplies(game: GameSession) {
  expect(command(game, { type: 'inventory.supplies', chestId: 'entity:clearing-chest' })).toEqual({
    ok: true,
  });
}
function item(game: GameSession, template: string, enchanted = false) {
  const result = game.inventoryView.items.find(
    (i) => i.templateId === template && !!i.enchantments.length === enchanted,
  );
  if (!result) throw new Error('Missing fixture item');
  return result;
}
describe('pack ownership and equipment', () => {
  it('claims supplies once, nearby, with an all-or-nothing capacity preflight and no consumed identities on failure', () => {
    const small = fixture(3),
      before = small.serialize();
    expect(
      command(small, { type: 'inventory.supplies', chestId: 'entity:clearing-chest' }),
    ).toMatchObject({ ok: false, message: expect.stringContaining('full') });
    expect(small.serialize()).toBe(before);
    expect(small.inventoryView.tools).toHaveLength(0);
    const game = fixture();
    supplies(game);
    expect(game.inventoryView.items).toHaveLength(4);
    expect(new Set(game.inventoryView.items.map((i) => i.id)).size).toBe(4);
    const claimed = game.serialize();
    expect(
      command(game, { type: 'inventory.supplies', chestId: 'entity:clearing-chest' }),
    ).toMatchObject({ ok: false });
    expect(game.serialize()).toBe(claimed);
    const distant = new GameSession(createPreviewSave(), PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(
      command(distant, { type: 'inventory.supplies', chestId: 'entity:clearing-chest' }),
    ).toMatchObject({ ok: false, message: expect.stringContaining('Stand near') });
  });
  it('splits, reorders and merges compatible quantities while preserving owners and rejecting stale tokens, self merges and invalid quantities', () => {
    const game = fixture();
    supplies(game);
    const wood = item(game, 'item:wood'),
      token = game.inventoryView.expectedTransaction;
    expect(command(game, { type: 'inventory.split', itemId: wood.id, quantity: 5 })).toEqual({
      ok: true,
    });
    const split = game.inventoryView.items.at(-1);
    if (!split) throw new Error('No split');
    expect(split.quantity).toBe(5);
    expect(split.id).not.toBe(wood.id);
    expect(
      game.dispatch({
        type: 'inventory.discard',
        itemId: wood.id,
        quantity: 1,
        confirmed: true,
        expectedTransaction: token,
      }),
    ).toMatchObject({ ok: false });
    expect(command(game, { type: 'inventory.move', itemId: split.id, position: 0 })).toEqual({
      ok: true,
    });
    expect(game.inventoryView.items[0]?.id).toBe(split.id);
    expect(
      command(game, { type: 'inventory.merge', itemId: split.id, targetId: wood.id, quantity: 3 }),
    ).toEqual({ ok: true });
    expect(item(game, 'item:wood').quantity).toBe(2);
    const before = game.serialize();
    for (const input of [
      { type: 'inventory.merge', itemId: split.id, targetId: split.id, quantity: 1 },
      { type: 'inventory.merge', itemId: split.id, targetId: wood.id, quantity: 3 },
      { type: 'inventory.split', itemId: split.id, quantity: 2 },
      { type: 'inventory.split', itemId: split.id, quantity: 0 },
      { type: 'inventory.move', itemId: split.id, position: 99 },
    ])
      expect(command(game, input)).toMatchObject({ ok: false });
    expect(game.serialize()).toBe(before);
    expect(
      command(game, { type: 'inventory.merge', itemId: split.id, targetId: wood.id, quantity: 2 }),
    ).toEqual({ ok: true });
    expect(item(game, 'item:wood').quantity).toBe(12);
    expect(game.inventoryView.items.some((i) => i.id === split.id)).toBe(false);
  });
  it('does not merge unique enchanted swords or exceed a stack/pack limit and leaves complete rewards unclaimed', () => {
    const game = fixture(4);
    supplies(game);
    const wood = item(game, 'item:wood'),
      plain = item(game, 'item:iron-sword'),
      keen = item(game, 'item:iron-sword', true),
      before = game.serialize();
    expect(
      command(game, { type: 'inventory.merge', itemId: keen.id, targetId: plain.id, quantity: 1 }),
    ).toMatchObject({ ok: false });
    expect(command(game, { type: 'inventory.split', itemId: wood.id, quantity: 1 })).toMatchObject({
      ok: false,
    });
    expect(game.serialize()).toBe(before);
    const inventory = {
      capacity: 1,
      items: [
        itemInstanceSchema.parse({
          id: wood.id,
          templateId: wood.templateId,
          quantity: 98,
          enchantments: [],
        }),
      ],
      money: 0,
    };
    const reward = itemInstanceSchema.parse({
      id: 'item-instance:reward',
      templateId: 'item:wood',
      quantity: 2,
      enchantments: [],
    });
    expect(() => receiveItem(inventory, reward, PREVIEW_CONTENT)).toThrow('remains unclaimed');
    expect(inventory.items[0]?.quantity).toBe(98);
    expect(reward.quantity).toBe(2);
  });
  it('swaps equipment in a full pack without copying items or accumulating stats across unequip/load', () => {
    const game = fixture(4);
    supplies(game);
    const keen = item(game, 'item:iron-sword', true),
      plain = item(game, 'item:iron-sword'),
      shield = item(game, 'item:shield');
    expect(
      command(game, { type: 'inventory.equip', itemId: keen.id, slot: 'slot:off-hand' }),
    ).toMatchObject({ ok: false });
    expect(
      command(game, { type: 'inventory.equip', itemId: keen.id, slot: 'slot:main-hand' }),
    ).toEqual({ ok: true });
    expect(
      command(game, { type: 'inventory.equip', itemId: shield.id, slot: 'slot:off-hand' }),
    ).toEqual({ ok: true });
    expect(game.inventoryView.stats).toMatchObject({ attack: 4, defence: 1 });
    expect(
      command(game, { type: 'inventory.discard', itemId: keen.id, quantity: 1, confirmed: true }),
    ).toMatchObject({ ok: false });
    expect(
      command(game, { type: 'inventory.equip', itemId: plain.id, slot: 'slot:main-hand' }),
    ).toEqual({ ok: true });
    expect(game.inventoryView.stats.attack).toBe(2);
    expect(game.export().player.carried.items).toHaveLength(4);
    expect(
      command(game, { type: 'inventory.equip', itemId: keen.id, slot: 'slot:main-hand' }),
    ).toEqual({ ok: true });
    const restored = new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(restored.inventoryView.stats).toEqual(game.inventoryView.stats);
    expect(restored.export().player.actor.stats.attack).toBe(1);
    expect(command(restored, { type: 'inventory.unequip', itemId: keen.id })).toEqual({ ok: true });
    expect(restored.inventoryView.stats.attack).toBe(1);
  });
  it('requires permanent ownership to equip, but discarding an instance never removes permanent route capability', () => {
    const game = fixture();
    supplies(game);
    const keen = item(game, 'item:iron-sword', true),
      state = game.export();
    state.player.permanent.tools = [];
    const unowned = new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(
      command(unowned, { type: 'inventory.equip', itemId: keen.id, slot: 'slot:main-hand' }),
    ).toMatchObject({ ok: false, message: expect.stringContaining('permanent') });
    const before = game.serialize();
    expect(
      command(game, { type: 'inventory.discard', itemId: keen.id, quantity: 1 }),
    ).toMatchObject({ ok: false });
    expect(game.serialize()).toBe(before);
    expect(
      command(game, { type: 'inventory.discard', itemId: keen.id, quantity: 1, confirmed: true }),
    ).toEqual({ ok: true });
    expect(game.export().player.permanent.tools).toContain('tool:sword');
    expect(game.inventoryView.items.some((i) => i.id === keen.id)).toBe(false);
  });
  it('uses derived attack and defence in real combat and equipment/status speed in the movement resolver', () => {
    const game = fixture();
    supplies(game);
    const keen = item(game, 'item:iron-sword', true),
      shield = item(game, 'item:shield');
    command(game, { type: 'inventory.equip', itemId: keen.id, slot: 'slot:main-hand' });
    command(game, { type: 'inventory.equip', itemId: shield.id, slot: 'slot:off-hand' });
    const player = game.export().player,
      battle = createBattle('melee', 1, 0),
      enemy = battle.enemies[0];
    if (!enemy) throw new Error('Missing enemy');
    battle.enemies = [enemy];
    battle.invulnerableUntil = 0;
    player.actor.position = { x: 240, y: 220 };
    enemy.position = { x: 240, y: 200 };
    enemy.hurtUntil = 1000;
    const context: BattleContext = {
      state: battle,
      actor: player.actor,
      stats: effectiveStats(player, PREVIEW_CONTENT),
      tick: 0,
      width: 480,
      height: 272,
      solids: [],
      emit: () => {},
    };
    beginAction(battle, player.actor, 'sword', 0, 'up');
    for (let tick = 1; tick <= 7; tick++) {
      context.tick = tick;
      stepBattle(context);
    }
    expect(enemy.health).toBe(0);
    const health = player.actor.resources.health.current;
    damagePlayer(context, 4, { x: 200, y: 220 });
    expect(player.actor.resources.health.current).toBe(health - 3);
    const data = structuredClone(PREVIEW_CONTENT.data);
    const sword = data.items.find((i) => i.id === 'item:iron-sword');
    if (!sword) throw new Error('Missing sword');
    sword.statModifiers.movementSpeedPixelsPerSecond = 10;
    const content = new ContentRegistry(data),
      slowed = game.export();
    slowed.player.actor.statuses = [
      { id: statusIdSchema.parse('status:slowed'), source: null, remainingTicks: 2, stacks: 1 },
    ];
    const fast = new GameSession(slowed, content, PREVIEW_WORLD);
    let speed = 0;
    fast.advance(20, (c) => {
      speed = c.movementSpeedPixelsPerSecond;
      return { position: c.position, facing: c.facing };
    });
    expect(speed).toBe((player.actor.stats.movementSpeedPixelsPerSecond + 10) * 0.5);
    fast.advance(20);
    fast.advance(20, (c) => {
      speed = c.movementSpeedPixelsPerSecond;
      return { position: c.position, facing: c.facing };
    });
    expect(speed).toBe(player.actor.stats.movementSpeedPixelsPerSecond + 10);
  });
  it('migrates v2 without rerolling items, equipment, geometry or RNG and defaults only the new pack state', () => {
    const migrated = readSaveState(v2, PREVIEW_CONTENT);
    expect(migrated.schemaVersion).toBe(4);
    expect(migrated.pack).toEqual({ selectedTool: 'sword', starterClaimed: false });
    const retained = structuredClone(migrated.world);
    retained.regions = retained.regions.filter((r) => r.id !== 'region:tool-trail');
    const woodland = retained.regions.find((r) => r.id === 'region:woodland');
    if (woodland?.kind === 'surface' && woodland.phase !== 'unvisited')
      woodland.geometry.objects = woodland.geometry.objects.filter(
        (o) => o.id !== 'entity:woodland-tool-trail',
      );
    expect(retained).toEqual(v2.world);
    expect(migrated.random).toEqual(v2.random);
    expect(migrated.player).toEqual(v2.player);
    const game = new GameSession(migrated, PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(game.inventoryView.stats.attack).toBe(4);
    expect(command(game, { type: 'inventory.select', tool: 'bow' })).toEqual({ ok: true });
    const restored = new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(restored.inventoryView.selectedTool).toBe('bow');
  });
});
