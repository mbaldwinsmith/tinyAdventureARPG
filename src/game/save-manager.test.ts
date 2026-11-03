import { describe, it, expect, vi } from 'vitest';
import { GameBridge } from '../bridge/game-bridge';
import { PreviewController } from './preview-controller';
import { MemorySaveRepository } from '../platform/saves/test-repository';
import { encodeSave, decodeSave } from '../platform/saves/codec';
import { createPreviewSave, PREVIEW_CONTENT } from '../content/preview';
import { PREVIEW_WORLD } from '../content/world';
import { enterArea } from '../core/expeditions';
import { itemInstanceSchema } from '../core/model';
import type { SaveState } from '../core/model';
import { resolveDeathLoss, EXPEDITION_LOSS_POLICY } from '../core/death-loss';
import { RandomStreams } from '../core/random';
import { entityIdSchema, regionIdSchema, toolIdSchema, slotIdSchema } from '../core/ids';
const id = 'a1976035-eb17-4078-905c-13eb33534492',
  timestamp = '2026-11-03T12:00:00.000Z';
function fixture(): SaveState {
  const state = createPreviewSave('durable-transactions');
  state.player.actor.position = { x: 211, y: 175 };
  state.player.actor.facing = 'up';
  state.player.carried.money = 25;
  state.player.carried.items = [
    itemInstanceSchema.parse({
      id: 'item-instance:carried-wood',
      templateId: 'item:wood',
      quantity: 10,
      enchantments: [],
    }),
  ];
  return state;
}
async function preload(repository: MemorySaveRepository, state = fixture()) {
  await repository.commit({
    id,
    name: 'Transaction fixture',
    expectedRevision: 0,
    encoded: await encodeSave(state, {
      slotId: id,
      name: 'Transaction fixture',
      revision: 1,
      savedAt: timestamp,
    }),
    timestamp,
    activate: true,
  });
}
async function runtime(repository: MemorySaveRepository) {
  const bridge = new GameBridge(),
    downloads: string[] = [],
    controller = new PreviewController(bridge, {
      repository,
      download: (_name, text) => downloads.push(text),
    });
  await controller.initialize();
  controller.ready();
  return { bridge, controller, downloads };
}
async function settled(bridge: GameBridge) {
  await vi.waitFor(() => expect(bridge.snapshot.saves?.busy).toBe(null), {
    timeout: 5000,
    interval: 5,
  });
}
function depositCommand(bridge: GameBridge) {
  const chest = bridge.snapshot.storage;
  if (!chest) throw new Error('Missing local chest');
  return {
    type: 'storage.item' as const,
    chestId: chest.id,
    direction: 'deposit' as const,
    itemId:
      chest.carried.items[0]?.id ??
      itemInstanceSchema.parse({
        id: 'item-instance:invalid',
        templateId: 'item:wood',
        quantity: 1,
        enchantments: [],
      }).id,
    quantity: 3,
    expectedTransaction: chest.expectedTransaction,
  };
}
describe('durable-first session coordination', () => {
  it('keeps a failed item transfer out of the live owner, exports the staged recovery and commits it exactly once after retry', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const f = await runtime(repository),
      command = depositCommand(f.bridge);
    repository.failure = new DOMException('quota fixture', 'QuotaExceededError');
    expect(f.bridge.send(command)).toEqual({ ok: true });
    await settled(f.bridge);
    expect(f.bridge.snapshot.saves).toMatchObject({
      pending: true,
      dirty: false,
      error: expect.stringContaining('full'),
    });
    expect(f.controller.session.export().player.carried.items[0]?.quantity).toBe(10);
    expect(f.controller.session.export().player.deposits).toHaveLength(0);
    expect(repository.rows.get(id)?.revision).toBe(1);
    f.bridge.send({ type: 'save.export', id: null });
    await vi.waitFor(() => expect(f.downloads).toHaveLength(1));
    const backup = f.downloads[0];
    if (!backup) throw new Error('Missing backup');
    expect(
      (await decodeSave(backup, PREVIEW_CONTENT)).state.player.carried.items[0]?.quantity,
    ).toBe(7);
    repository.failure = null;
    f.bridge.send({ type: 'save.retry' });
    await settled(f.bridge);
    expect(f.controller.session.export().player.carried.items[0]?.quantity).toBe(7);
    expect(f.controller.session.export().player.deposits[0]?.inventory.items[0]?.quantity).toBe(3);
    expect(repository.rows.get(id)?.revision).toBe(2);
    expect(f.bridge.send(command)).toMatchObject({ ok: false });
    expect(repository.rows.get(id)?.revision).toBe(2);
    f.controller.dispose();
  });
  it('recognizes an identical checkpoint after a lost acknowledgement instead of issuing a second transfer', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const f = await runtime(repository);
    repository.afterCommitFailure = new Error('acknowledgement lost');
    f.bridge.send(depositCommand(f.bridge));
    await settled(f.bridge);
    expect(repository.rows.get(id)?.revision).toBe(2);
    expect(f.controller.session.export().player.carried.items[0]?.quantity).toBe(10);
    repository.afterCommitFailure = null;
    f.bridge.send({ type: 'save.retry' });
    await settled(f.bridge);
    expect(repository.writes).toBe(2);
    expect(repository.rows.get(id)?.revision).toBe(2);
    expect(f.controller.session.export().nextTransaction).toBe(2);
    expect(f.controller.session.export().player.carried.items[0]?.quantity).toBe(7);
    f.controller.dispose();
  });
  it('retains a single seeded death outcome through write failure, retry and reload without touching deposits or equipment', async () => {
    const state = fixture();
    state.player.permanent.tools = [toolIdSchema.parse('tool:sword')];
    const sword = itemInstanceSchema.parse({
      id: 'item-instance:keen',
      templateId: 'item:iron-sword',
      quantity: 1,
      enchantments: [{ id: 'enchantment:keen', magnitude: 2 }],
    });
    state.player.carried.items.push(sword);
    state.player.equipment = [{ slot: slotIdSchema.parse('slot:main-hand'), itemId: sword.id }];
    state.player.deposits = [
      {
        chestId: entityIdSchema.parse('entity:clearing-chest'),
        regionId: regionIdSchema.parse('region:clearing'),
        instanceId: null,
        inventory: { capacity: 20, items: [], money: 100 },
      },
    ];
    enterArea(state, PREVIEW_WORLD, 'region:crypt');
    if (!state.combat) throw new Error('Missing crypt combat');
    state.player.actor.resources.health.current = 0;
    const deathId = state.combat.nextSequence++;
    state.combat.death = { id: deathId, phase: 'pending', lostItems: [], lostMoney: 0, losses: [] };
    const instance = state.player.instanceId,
      random = new RandomStreams(state.world.seed, state.random),
      expected = resolveDeathLoss(state.player, PREVIEW_CONTENT, EXPEDITION_LOSS_POLICY, () =>
        random.next('death'),
      );
    const repository = new MemorySaveRepository();
    await preload(repository, state);
    const f = await runtime(repository);
    repository.failure = new Error('write interruption');
    f.bridge.send({ type: 'combat.respawn', deathId });
    await settled(f.bridge);
    expect(f.controller.session.export().player.actor.resources.health.current).toBe(0);
    expect(f.controller.session.export().random).toEqual(state.random);
    repository.failure = null;
    f.bridge.send({ type: 'save.retry' });
    await settled(f.bridge);
    const post = f.controller.session.export();
    expect(post.player.carried).toEqual(expected.carried);
    expect(post.player.equipment).toEqual(state.player.equipment);
    expect(post.player.deposits).toEqual(state.player.deposits);
    expect(post.random).toEqual(random.snapshot());
    expect(post.lastDeath?.losses).toEqual(expected.losses);
    expect(post.lastDeath?.lostMoney).toBe(2);
    expect(f.bridge.send({ type: 'combat.respawn', deathId })).toMatchObject({ ok: false });
    f.controller.dispose();
    const restored = await runtime(repository);
    expect(restored.controller.session.export().lastDeath).toEqual(post.lastDeath);
    expect(restored.controller.session.export().player.carried).toEqual(post.player.carried);
    expect(
      restored.controller.session.export().world.dungeons.find((d) => d.id === instance)?.anchor
        .phase,
    ).toBe('living');
    expect(restored.controller.session.export().random).toEqual(post.random);
    restored.controller.dispose();
  });
  it('detects cross-tab conflicts and forks a recovery copy without overwriting the newer adventure', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const a = await runtime(repository),
      b = await runtime(repository);
    a.bridge.send(depositCommand(a.bridge));
    await settled(a.bridge);
    const chest = b.bridge.snapshot.storage;
    if (!chest) throw new Error('Missing chest');
    b.bridge.send({
      type: 'storage.money',
      chestId: chest.id,
      direction: 'deposit',
      amount: 5,
      expectedTransaction: chest.expectedTransaction,
    });
    await settled(b.bridge);
    expect(b.bridge.snapshot.saves?.error).toContain('another tab');
    expect(b.controller.session.export().player.carried.money).toBe(25);
    const original = repository.rows.get(id)?.current;
    b.bridge.send({ type: 'save.copy' });
    await settled(b.bridge);
    expect(b.bridge.snapshot.saves?.active?.id).not.toBe(id);
    expect(b.controller.session.export().player.carried.money).toBe(20);
    expect(repository.rows.get(id)?.current).toBe(original);
    expect(repository.rows.size).toBe(2);
    a.controller.dispose();
    b.controller.dispose();
  });
  it('offers a previous checkpoint as a separate recovered adventure and preserves the damaged original unchanged', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const f = await runtime(repository);
    f.bridge.send({ type: 'appearance.set', hero: 4 });
    await settled(f.bridge);
    f.controller.dispose();
    const row = repository.rows.get(id);
    if (!row?.previous) throw new Error('Missing previous checkpoint');
    repository.rows.set(id, { ...row, current: '{broken' });
    const restored = await runtime(repository);
    expect(restored.bridge.snapshot.saves).toMatchObject({ recovery: id, open: true });
    expect(restored.bridge.snapshot.saves?.slots[0]?.canRecover).toBe(true);
    expect(restored.bridge.send({ type: 'save.open', open: false })).toMatchObject({ ok: false });
    restored.bridge.send({ type: 'save.recover', id });
    await settled(restored.bridge);
    expect(restored.bridge.snapshot.saves?.active?.id).not.toBe(id);
    expect(restored.controller.session.snapshot.hero).toBe(1);
    expect(repository.rows.get(id)?.current).toBe('{broken');
    expect(repository.rows.get(id)?.previous).toBe(row.previous);
    restored.controller.dispose();
  });
  it('persists sleep once and advances no calendar time while a session is closed', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const f = await runtime(repository);
    f.bridge.send({ type: 'calendar.sleep', expectedDay: 1 });
    await settled(f.bridge);
    expect(f.controller.session.snapshot.calendar.day).toBe(2);
    f.controller.dispose();
    const restored = await runtime(repository);
    expect(restored.controller.session.snapshot.calendar.day).toBe(2);
    expect(restored.bridge.send({ type: 'calendar.sleep', expectedDay: 1 })).toMatchObject({
      ok: false,
    });
    expect(restored.controller.session.snapshot.calendar.day).toBe(2);
    restored.controller.dispose();
  });
});

describe('adventure selection and unsaved recovery', () => {
  it('creates just one initial slot when two startup owners race', async () => {
    const repository = new MemorySaveRepository();
    const [a, b] = await Promise.all([runtime(repository), runtime(repository)]);
    expect(repository.rows.size).toBe(1);
    expect(a.bridge.snapshot.saves?.mode).toBe('durable');
    expect(b.bridge.snapshot.saves?.mode).toBe('durable');
    a.controller.dispose();
    b.controller.dispose();
  });
  it('saves session-only progress as a new copy when browser storage returns', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const f = await runtime(repository),
      original = repository.rows.get(id)?.current;
    f.bridge.send({ type: 'save.session-only' });
    f.bridge.send({ type: 'appearance.set', hero: 6 });
    f.bridge.send({ type: 'save.retry-storage' });
    await settled(f.bridge);
    expect(f.bridge.snapshot.saves?.mode).toBe('durable');
    expect(f.bridge.snapshot.saves?.active?.id).not.toBe(id);
    expect(repository.rows.get(id)?.current).toBe(original);
    f.controller.dispose();
    const restored = await runtime(repository);
    expect(restored.bridge.snapshot.hero).toBe(6);
    restored.controller.dispose();
  });
  it('preserves unsaved progress before creating a new adventure and accepts a maximum-length backup name', async () => {
    const repository = new MemorySaveRepository();
    await preload(repository);
    const f = await runtime(repository);
    f.bridge.send({ type: 'save.session-only' });
    f.bridge.send({ type: 'appearance.set', hero: 5 });
    f.bridge.send({ type: 'save.new', name: 'Second journey', seed: 'new-seed', hero: 2 });
    await settled(f.bridge);
    expect(repository.rows.size).toBe(3);
    const recovered = [...repository.rows.values()].find(
      (r) => r.name === 'Recovered unsaved adventure',
    );
    if (!recovered) throw new Error('Missing preserved session');
    expect((await decodeSave(recovered.current, PREVIEW_CONTENT)).state.player.hero).toBe(5);
    const backup = await encodeSave(fixture(), {
      slotId: id,
      name: 'A'.repeat(48),
      revision: 1,
      savedAt: timestamp,
    });
    f.bridge.send({ type: 'save.import', text: backup });
    await settled(f.bridge);
    expect(f.bridge.snapshot.saves?.error).toBe(null);
    expect(f.bridge.snapshot.saves?.active?.name).toHaveLength(48);
    expect(repository.rows.size).toBe(4);
    f.controller.dispose();
  });
});
