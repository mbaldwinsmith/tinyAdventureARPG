import { slotRowSchema, SaveConflictError } from './contracts';
import type { SlotRow, SaveRepository } from './contracts';
/** Test adapter for deterministic failure/interruption scenarios; never used by the browser runtime. */
export class MemorySaveRepository implements SaveRepository {
  readonly rows = new Map<string, SlotRow>();
  activeId: string | null = null;
  failure: Error | null = null;
  afterCommitFailure: Error | null = null;
  gate: Promise<void> | null = null;
  writes = 0;
  async list() {
    return [...this.rows.values()].map((row) => structuredClone(row));
  }
  async read(id: string) {
    const row = this.rows.get(id);
    return row ? structuredClone(row) : undefined;
  }
  async active() {
    return this.activeId;
  }
  async commit(input: Parameters<SaveRepository['commit']>[0]) {
    if (this.gate) await this.gate;
    if (this.failure) throw this.failure;
    const previous = this.rows.get(input.id);
    if (previous?.revision === input.expectedRevision + 1 && previous.current === input.encoded) {
      if (input.activate) this.activeId = input.id;
      return structuredClone(previous);
    }
    if ((previous?.revision ?? 0) !== input.expectedRevision) throw new SaveConflictError();
    const row = slotRowSchema.parse({
      id: input.id,
      name: input.name,
      revision: input.expectedRevision + 1,
      current: input.encoded,
      previous: previous?.current ?? null,
      createdAt: previous?.createdAt ?? input.timestamp,
      updatedAt: input.timestamp,
    });
    this.rows.set(row.id, row);
    if (input.activate) this.activeId = row.id;
    this.writes++;
    if (this.afterCommitFailure) throw this.afterCommitFailure;
    return structuredClone(row);
  }
  async select(id: string, expectedRevision: number) {
    if (this.rows.get(id)?.revision !== expectedRevision) throw new SaveConflictError();
    this.activeId = id;
  }
  close() {}
}
