import Dexie from 'dexie';
import type { Table } from 'dexie';
import { slotRowSchema, SaveConflictError } from './contracts';
import type { SaveRepository } from './contracts';
export const SAVE_DATABASE = 'tiny-adventure-saves';
class AdventureDatabase extends Dexie {
  slots: Table<unknown, string>;
  settings: Table<{ id: string; value: string }, string>;
  constructor(name: string) {
    super(name);
    this.version(1).stores({ slots: 'id,updatedAt', settings: 'id' });
    this.slots = this.table('slots');
    this.settings = this.table('settings');
  }
}
/** Encode/hash outside this adapter. Transaction scopes await only IndexedDB operations. */
export class DexieSaveRepository implements SaveRepository {
  private db: AdventureDatabase;
  constructor(name = SAVE_DATABASE) {
    this.db = new AdventureDatabase(name);
  }
  async list() {
    return this.db.slots.toArray();
  }
  async read(id: string) {
    return this.db.slots.get(id);
  }
  async active() {
    return (await this.db.settings.get('active'))?.value ?? null;
  }
  async commit(input: Parameters<SaveRepository['commit']>[0]) {
    return this.db.transaction('rw', [this.db.slots, this.db.settings], async () => {
      const raw = await this.db.slots.get(input.id),
        previous = raw === undefined ? null : slotRowSchema.parse(raw);
      if (previous?.revision === input.expectedRevision + 1 && previous.current === input.encoded) {
        if (input.activate) await this.db.settings.put({ id: 'active', value: input.id });
        return previous;
      }
      if ((previous?.revision ?? 0) !== input.expectedRevision) throw new SaveConflictError();
      const row = slotRowSchema.parse({
        id: input.id,
        name: input.name,
        revision: input.expectedRevision + 1,
        createdAt: previous?.createdAt ?? input.timestamp,
        updatedAt: input.timestamp,
        current: input.encoded,
        previous: previous?.current ?? null,
      });
      await this.db.slots.put(row);
      if (input.activate) await this.db.settings.put({ id: 'active', value: row.id });
      return row;
    });
  }
  async select(id: string, expectedRevision: number) {
    await this.db.transaction('rw', [this.db.slots, this.db.settings], async () => {
      const raw = await this.db.slots.get(id),
        row = slotRowSchema.parse(raw);
      if (row.revision !== expectedRevision) throw new SaveConflictError();
      await this.db.settings.put({ id: 'active', value: id });
    });
  }
  close() {
    this.db.close();
  }
}
