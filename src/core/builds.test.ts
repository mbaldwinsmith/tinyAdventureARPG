import { describe, expect, it } from 'vitest';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { TRAIL_ID } from '../content/tool-trail';
import { PREVIEW_WORLD } from '../content/world';
import type { EnemyKind } from './combat-model';
import { resolveDeathLoss, EXPEDITION_LOSS_POLICY } from './death-loss';
import { enterArea } from './expeditions';
import { slotIdSchema, toolIdSchema } from './ids';
import { itemInstanceSchema } from './model';
import type { SaveState } from './model';
import { readSaveState } from './save-state';
import { GameSession } from './session';

function session(state = createPreviewSave('m10-builds')) {
  return new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
}
function chest() {
  const state = createPreviewSave('m10-builds');
  state.player.actor.position = { x: 211, y: 175 };
  state.player.actor.facing = 'up';
  const game = session(state);
  expect(
    game.dispatch({
      type: 'inventory.supplies',
      chestId: 'entity:clearing-chest',
      expectedTransaction: 1,
    }).ok,
  ).toBe(true);
  return game.export();
}
function give(state: SaveState, templateId: string, slot: string, enchantments: unknown[] = []) {
  const item = itemInstanceSchema.parse({
    id: `item-instance:build-${state.player.carried.items.length + 1}`,
    templateId,
    quantity: 1,
    enchantments,
  });
  state.player.carried.items.push(item);
  state.player.equipment.push({ slot: slotIdSchema.parse(slot), itemId: item.id });
}
function ticks(game: GameSession, count: number) {
  for (let index = 0; index < count; index++) game.advance(20);
}
function claim(game: GameSession, reward: string) {
  return game.dispatch({
    type: 'inventory.build-claim',
    reward,
    expectedTransaction: game.inventoryView.expectedTransaction,
  });
}

describe('earned and saved builds', () => {
  it('keeps a full prize unclaimed and consumes the same loot roll on a successful retry', () => {
    const original = chest();
    const full = structuredClone(original);
    full.player.carried.capacity = full.player.carried.items.length;
    const blocked = session(full);
    const before = blocked.serialize();
    expect(claim(blocked, 'chest')).toMatchObject({
      ok: false,
      message: expect.stringContaining('full'),
    });
    expect(blocked.serialize()).toBe(before);
    const first = session(original);
    const retry = session({
      ...full,
      player: { ...full.player, carried: { ...full.player.carried, capacity: 20 } },
    });
    expect(claim(first, 'chest')).toEqual({ ok: true });
    expect(claim(retry, 'chest')).toEqual({ ok: true });
    const rolled = first.export();
    expect(retry.export().player.carried.items).toEqual(rolled.player.carried.items);
    expect(retry.export().random).toEqual(rolled.random);
    expect(rolled.random.streams.loot).not.toEqual(original.random.streams.loot);
    expect(rolled.random.streams.death).toEqual(original.random.streams.death);
    expect(rolled.player.carried.items.at(-1)).toMatchObject({
      lootTier: 'trail',
      enchantments: [
        {
          id: expect.stringMatching(/^enchantment:(fire|holy|ice)$/),
          magnitude: expect.any(Number),
        },
      ],
    });
    expect(rolled.build.unlocked).toEqual(['battle-focus']);
    const restored = session(JSON.parse(first.serialize()));
    expect(claim(restored, 'chest').ok).toBe(false);
    expect(restored.export().player.carried.items).toEqual(rolled.player.carried.items);
  });

  it('rejects contradictory element rolls and over-budget items', () => {
    const state = chest();
    const invalid = itemInstanceSchema.parse({
      id: 'item-instance:invalid',
      templateId: 'item:iron-sword',
      quantity: 1,
      lootTier: 'warden',
      enchantments: [
        { id: 'enchantment:fire', magnitude: 2 },
        { id: 'enchantment:holy', magnitude: 2 },
      ],
    });
    state.player.carried.items.push(invalid);
    expect(() => session(state)).toThrow('Conflicting enchantments');
    invalid.enchantments = [
      { ...invalid.enchantments[0]!, magnitude: 3 },
      {
        ...invalid.enchantments[1]!,
        id: PREVIEW_CONTENT.enchantment('enchantment:keen').id,
        magnitude: 3,
      },
    ];
    expect(() => session(state)).toThrow('loot budget');
  });

  it('applies each named bonus to its matching enemy family through real sword contacts', () => {
    function hit(element: string, enemyKind: EnemyKind, focus = false) {
      const game = session();
      expect(game.dispatch({ type: 'combat.start', trial: 'mixed' }).ok).toBe(true);
      const state = game.export();
      const enemy = state.combat?.enemies.find((entry) => entry.kind === enemyKind);
      if (!state.combat || !enemy) throw new Error('Missing enemy');
      state.player.actor.position = { x: 240, y: 232 };
      enemy.position = enemy.home = { x: 240, y: 214 };
      enemy.health = enemy.maximumHealth = 40;
      enemy.hurtUntil = 1000;
      state.combat.enemies = [enemy];
      state.player.permanent.tools.push(toolIdSchema.parse('tool:sword'));
      give(state, 'item:iron-sword', 'slot:main-hand', [
        { id: `enchantment:${element}`, magnitude: 2 },
      ]);
      if (focus)
        state.build = {
          ...state.build,
          claims: ['chest'],
          unlocked: ['battle-focus'],
          selected: 'battle-focus',
        };
      const fight = session(state);
      if (focus)
        expect(
          fight.dispatch({
            type: 'inventory.ability-use',
            expectedTransaction: fight.inventoryView.expectedTransaction,
          }).ok,
        ).toBe(true);
      expect(fight.dispatch({ type: 'combat.action', action: 'sword', facing: 'up' }).ok).toBe(
        true,
      );
      ticks(fight, 20);
      return 40 - fight.battlePresentation!.enemies[0]!.health;
    }
    expect(hit('fire', 'bat')).toBe(6);
    expect(hit('fire', 'skeleton')).toBe(4);
    expect(hit('ice', 'skeleton')).toBe(4);
    expect(hit('holy', 'skeleton')).toBe(6);
    expect(hit('holy', 'zombie')).toBe(6);
    expect(hit('holy', 'slime')).toBe(4);
    expect(hit('ice', 'slime')).toBe(6);
    expect(hit('ice', 'rat')).toBe(4);
    expect(hit('holy', 'skeleton', true)).toBe(7.5);
  });

  it('runs the same bomb passage with three relics and caps combined cooldown and energy effects', () => {
    for (const [relic, focus, energy, bombReady, magicReady, magicCost] of [
      ['swift-coil', false, 7, 40, 20, 2],
      ['ember-lens', false, 8, 50, 25, 1],
      ['bastion-stone', false, 7, 50, 25, 2],
      ['swift-coil', true, 6, 30, 15, 1],
      ['ember-lens', true, 6, 38, 19, 1],
    ] as const) {
      const state = createPreviewSave('same-puzzle');
      enterArea(state, PREVIEW_WORLD, TRAIL_ID);
      if (!state.combat) throw new Error('Missing trail');
      state.combat.enemies = [];
      state.combat.completed = true;
      state.player.actor.position = { x: 600, y: 408 };
      state.player.actor.facing = 'right';
      state.player.permanent.tools.push(
        toolIdSchema.parse('tool:bomb'),
        toolIdSchema.parse('tool:magic'),
      );
      give(state, `item:${relic}`, 'slot:relic');
      state.build = {
        ...state.build,
        mixedTrialCompleted: true,
        claims: ['encounter'],
        unlocked: ['tool-focus'],
        selected: 'tool-focus',
      };
      const game = session(state);
      if (focus)
        expect(game.dispatch({ type: 'inventory.ability-use', expectedTransaction: 1 }).ok).toBe(
          true,
        );
      expect(game.dispatch({ type: 'tool.action', tool: 'bomb' }).ok).toBe(true);
      expect(game.actor.resources.energy.current).toBe(energy);
      expect(game.actor.cooldowns.find((tool) => tool.toolId === 'tool:bomb')?.remainingTicks).toBe(
        bombReady,
      );
      expect(game.dispatch({ type: 'tool.action', tool: 'magic' }).ok).toBe(true);
      expect(game.actor.resources.energy.current).toBe(energy - magicCost);
      expect(
        game.actor.cooldowns.find((tool) => tool.toolId === 'tool:magic')?.remainingTicks,
      ).toBe(magicReady);
      ticks(game, 100);
      expect(game.worldPresentation.passages).toContain('entity:trail-bomb-wall');
      expect(game.inventoryView.stats.defence).toBe(relic === 'bastion-stone' ? 2 : 0);
      const result = resolveDeathLoss(
        game.export().player,
        PREVIEW_CONTENT,
        EXPEDITION_LOSS_POLICY,
        () => 0,
      );
      expect(result.carried.items.some((item) => item.templateId === `item:${relic}`)).toBe(true);
    }
  });

  it('keeps the mixed trial prize available after starting another trial and unlocks Tool Focus once', () => {
    const start = session();
    expect(start.dispatch({ type: 'combat.start', trial: 'mixed' }).ok).toBe(true);
    const state = start.export();
    const enemy = state.combat?.enemies[0];
    if (!state.combat || !enemy) throw new Error('Missing trial');
    state.player.actor.position = { x: 240, y: 232 };
    enemy.position = enemy.home = { x: 240, y: 214 };
    enemy.health = 1;
    enemy.hurtUntil = 1000;
    state.combat.enemies = [enemy];
    const game = session(state);
    expect(claim(game, 'encounter').ok).toBe(false);
    expect(game.dispatch({ type: 'combat.action', action: 'sword', facing: 'up' }).ok).toBe(true);
    ticks(game, 30);
    expect(game.dispatch({ type: 'combat.start', trial: 'melee' }).ok).toBe(true);
    expect(claim(game, 'encounter').ok).toBe(true);
    expect(game.inventoryView.items.some((item) => item.name === 'Swift Coil')).toBe(true);
    expect(game.export().build.unlocked).toEqual(['tool-focus']);
    expect(claim(game, 'encounter').ok).toBe(false);
  });

  it('awards the trail challenge after the real shortcut blast', () => {
    const state = createPreviewSave('build-trail-challenge');
    enterArea(state, PREVIEW_WORLD, TRAIL_ID);
    if (!state.combat) throw new Error('Missing trail');
    state.combat.enemies = [];
    state.combat.completed = true;
    state.player.actor.position = { x: 216, y: 136 };
    state.player.actor.facing = 'left';
    state.player.permanent.tools.push(
      toolIdSchema.parse('tool:bomb'),
      toolIdSchema.parse('tool:swim'),
    );
    const game = session(state);
    expect(claim(game, 'quest').ok).toBe(false);
    expect(game.dispatch({ type: 'tool.action', tool: 'bomb' }).ok).toBe(true);
    ticks(game, 100);
    expect(game.worldPresentation.passages).toContain('entity:trail-shortcut');
    expect(claim(game, 'quest').ok).toBe(true);
    expect(game.inventoryView.items.map((item) => item.name)).toEqual(['Shield', 'Ember Lens']);
    expect(game.export().player.permanent.tools).toEqual(state.player.permanent.tools);
  });

  it('migrates a v4 checkpoint, freezes a temporary effect during pause and shares its cooldown after reload', () => {
    const { build: removed, ...old } = chest();
    void removed;
    const migrated = readSaveState({ ...old, schemaVersion: 4 }, PREVIEW_CONTENT);
    expect(migrated.player).toEqual(old.player);
    expect(migrated.random).toEqual(old.random);
    const game = session(migrated);
    expect(claim(game, 'chest').ok).toBe(true);
    expect(
      game.dispatch({
        type: 'inventory.ability-use',
        expectedTransaction: game.inventoryView.expectedTransaction,
      }).ok,
    ).toBe(true);
    ticks(game, 50);
    game.dispatch({ type: 'pause.set', reason: 'menu', active: true });
    ticks(game, 250);
    const restored = session(JSON.parse(game.serialize()));
    expect(restored.export().build.active?.remainingTicks).toBe(150);
    ticks(restored, 150);
    expect(restored.export().build.active).toBeNull();
    expect(
      restored.dispatch({
        type: 'inventory.ability-use',
        expectedTransaction: restored.inventoryView.expectedTransaction,
      }).ok,
    ).toBe(false);
    ticks(restored, 300);
    expect(
      restored.dispatch({
        type: 'inventory.ability-use',
        expectedTransaction: restored.inventoryView.expectedTransaction,
      }).ok,
    ).toBe(true);
  });
});
