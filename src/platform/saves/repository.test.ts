import 'fake-indexeddb/auto';
import { describe, it, expect, vi } from 'vitest';
import { DexieSaveRepository } from './dexie-repository';
import { slotRowSchema } from './contracts';
import { encodeSave, decodeSave } from './codec';
import { persistentDomainsSchema } from '../../core/persistent-domains';
import { createPreviewSave, PREVIEW_CONTENT } from '../../content/preview';
const timestamp = '2026-11-03T12:00:00.000Z',
  id = 'b75b8aba-7d3b-461b-9805-e2a020777746';
async function encoded(revision: number, money: number) {
  const state = createPreviewSave();
  state.player.carried.money = money;
  return encodeSave(state, {
    slotId: id,
    name: 'Repository fixture',
    revision,
    savedAt: timestamp,
  });
}
describe('Dexie full-checkpoint transactions and validated envelopes', () => {
  it('commits a complete checkpoint plus active pointer, keeps the previous record and rejects stale concurrent writers', async () => {
    const name = 'm07-repository-' + crypto.randomUUID(),
      a = new DexieSaveRepository(name),
      b = new DexieSaveRepository(name);
    try {
      const first = await encoded(1, 25),
        input = {
          id,
          name: 'Repository fixture',
          expectedRevision: 0,
          encoded: first,
          timestamp,
          activate: true,
        };
      await a.commit(input);
      expect((await a.commit(input)).revision).toBe(1);
      expect(await a.active()).toBe(id);
      const second = await encoded(2, 15),
        competing = await encoded(2, 30);
      const outcomes = await Promise.allSettled([
        a.commit({ ...input, expectedRevision: 1, encoded: second }),
        b.commit({ ...input, expectedRevision: 1, encoded: competing }),
      ]);
      expect(outcomes.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      expect(outcomes.filter((r) => r.status === 'rejected')).toHaveLength(1);
      const row = slotRowSchema.parse(await a.read(id));
      expect(row.revision).toBe(2);
      expect(row.previous).toBe(first);
      expect([15, 30]).toContain(
        (await decodeSave(row.current, PREVIEW_CONTENT)).state.player.carried.money,
      );
    } finally {
      a.close();
      b.close();
    }
  });
  it('aborts the entire IndexedDB transaction if the active-pointer write fails after the slot put', async () => {
    const repository = new DexieSaveRepository('m07-abort-' + crypto.randomUUID()),
      first = await encoded(1, 25),
      input = {
        id,
        name: 'Abort fixture',
        expectedRevision: 0,
        encoded: first,
        timestamp,
        activate: true,
      };
    await repository.commit(input);
    const original = IDBObjectStore.prototype.put;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (
      this: IDBObjectStore,
      value: unknown,
      key?: IDBValidKey,
    ) {
      if (this.name === 'settings') throw new DOMException('quota fixture', 'QuotaExceededError');
      return key === undefined ? original.call(this, value) : original.call(this, value, key);
    });
    try {
      await expect(
        repository.commit({ ...input, expectedRevision: 1, encoded: await encoded(2, 0) }),
      ).rejects.toThrow();
    } finally {
      spy.mockRestore();
    }
    expect(slotRowSchema.parse(await repository.read(id))).toMatchObject({
      revision: 1,
      current: first,
      previous: null,
    });
    expect(await repository.active()).toBe(id);
    repository.close();
  });
  it('round-trips nonempty farm, resident and quest records with complete retained geometry', async () => {
    const state = createPreviewSave();
    state.domains = persistentDomainsSchema.parse({
      farm: {
        plots: [
          {
            id: 'entity:clearing-plot',
            regionId: 'region:clearing',
            prepared: true,
            wateredDay: 1,
          },
        ],
      },
      village: {
        residents: [{ id: 'entity:clearing-wayfarer', recruited: true, service: 'seed-shop' }],
      },
      quests: [{ id: 'quest:first-steps', phase: 'completed', progress: 1, rewardClaimed: true }],
    });
    const text = await encodeSave(state, {
      slotId: id,
      name: 'Domains',
      revision: 1,
      savedAt: timestamp,
    });
    expect((await decodeSave(text, PREVIEW_CONTENT)).state).toEqual(state);
  });
  it('checks digests, state semantics and future envelope versions before any imported data can replace a session', async () => {
    const text = await encoded(1, 25),
      value = JSON.parse(text);
    value.state.player.carried.money = 999;
    await expect(decodeSave(JSON.stringify(value), PREVIEW_CONTENT)).rejects.toThrow('integrity');
    await expect(
      decodeSave(JSON.stringify({ ...JSON.parse(text), version: 99 }), PREVIEW_CONTENT),
    ).rejects.toThrow('Unsupported');
    await expect(decodeSave('{broken', PREVIEW_CONTENT)).rejects.toThrow('valid JSON');
    const bad = createPreviewSave();
    bad.player.permanent.kingdomRestored = true;
    const semanticallyBad = await encodeSave(bad, {
      slotId: id,
      name: 'Bad',
      revision: 1,
      savedAt: timestamp,
    });
    await expect(decodeSave(semanticallyBad, PREVIEW_CONTENT)).rejects.toThrow('Restoration');
  });
});
