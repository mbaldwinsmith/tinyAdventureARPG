import { toolCommandSchemas } from '../core/tool-model';
import { inventoryCommandSchemas } from '../core/inventory-model';
import { z } from 'zod';
import { copyData, freezeData } from '../core/data';
import type { GameSession, CoreCommand, CoreResult, DomainEvent } from '../core/session';
import type { SaveState, HeroId } from '../core/model';
import type { SaveRepository, SlotRow } from '../platform/saves/contracts';
import { slotRowSchema, storageMessage } from '../platform/saves/contracts';
import { encodeSave, decodeSave } from '../platform/saves/codec';
import type { ContentRegistry } from '../content/schemas';
export interface SaveView {
  pending: boolean;
  mode: 'loading' | 'durable' | 'unavailable' | 'session-only';
  open: boolean;
  busy: string | null;
  error: string | null;
  dirty: boolean;
  active: { id: string; name: string; revision: number; updatedAt: string } | null;
  slots: {
    id: string;
    name: string;
    revision: number;
    updatedAt: string;
    issue: string | null;
    canRecover: boolean;
  }[];
  recovery: string | null;
  sequence: number;
  lastReason: string | null;
}
const IMPORTANT_EVENTS = new Set([
  'world.region-entered',
  'calendar.day-started',
  'combat.enemy-defeated',
  'combat.player-defeated',
  'combat.encounter-completed',
  'tools.changed',
]);
export const DURABLE_COMMANDS = new Set([
  'appearance.set',
  'calendar.sleep',
  'world.interact',
  'combat.start',
  'combat.collect',
  'combat.respawn',
  'storage.item',
  'storage.money',
  ...inventoryCommandSchemas.map((s) => s.shape.type.value),
  ...toolCommandSchemas.map((s) => s.shape.type.value),
  'tool.use',
]);
export class SaveManager {
  private state: Omit<SaveView, 'pending'> = {
    mode: 'loading',
    open: false,
    busy: null,
    error: null,
    dirty: false,
    active: null,
    slots: [],
    recovery: null,
    sequence: 0,
    lastReason: null,
  };
  private pending: (() => Promise<void>) | null = null;
  private recoverable: SaveState | null = null;
  private disposed = false;
  private lastCheckpointTick = 0;
  private cached: Readonly<SaveView> | undefined;
  private writeCache = new Map<string, Parameters<SaveRepository['commit']>[0]>();
  constructor(
    private session: GameSession,
    private repository: SaveRepository,
    private content: ContentRegistry,
    private makeSession: (state: SaveState) => GameSession,
    private makeNew: (seed: string, hero: HeroId) => SaveState,
    private changed: () => void,
    private download: (name: string, text: string) => void,
  ) {}
  get view() {
    return (this.cached ??= freezeData({
      ...copyData(this.state),
      pending: this.pending !== null,
    }));
  }
  private publish() {
    if (this.disposed) return;
    this.cached = undefined;
    this.changed();
  }
  private pause(active: boolean) {
    this.session.dispatch({ type: 'pause.set', reason: 'saving', active });
  }
  private active() {
    const active = this.state.active;
    if (!active) throw new Error('Choose or create an adventure before saving.');
    return { ...active };
  }
  get blocked() {
    return this.state.busy !== null || this.pending !== null;
  }
  private acceptRow(row: SlotRow) {
    this.state.active = {
      id: row.id,
      name: row.name,
      revision: row.revision,
      updatedAt: row.updatedAt,
    };
    this.state.dirty = false;
    this.lastCheckpointTick = this.session.tick;
  }
  private async write(
    state: SaveState,
    active: { id: string; name: string; revision: number },
    activate = true,
  ) {
    const key = active.id + '/' + active.revision;
    let input = this.writeCache.get(key);
    if (!input) {
      const timestamp = new Date().toISOString();
      const encoded = await encodeSave(state, {
        slotId: active.id,
        name: active.name,
        revision: active.revision + 1,
        savedAt: timestamp,
      });
      input = {
        id: active.id,
        name: active.name,
        expectedRevision: active.revision,
        encoded,
        timestamp,
        activate,
      };
      this.writeCache.set(key, input);
    }
    const row = await this.repository.commit(input);
    this.acceptRow(row);
    return row;
  }
  private async refresh() {
    const raw = await this.repository.list(),
      slots: SaveView['slots'] = [];
    for (const value of raw) {
      const parsed = slotRowSchema.safeParse(value);
      if (!parsed.success) {
        const id = z.object({ id: z.string() }).safeParse(value);
        if (id.success)
          slots.push({
            id: id.data.id,
            name: 'Unreadable adventure',
            revision: 0,
            updatedAt: '',
            issue: 'Save metadata is invalid. Export the original data before attempting recovery.',
            canRecover: false,
          });
        continue;
      }
      const row = parsed.data;
      let issue: string | null = null,
        canRecover = false;
      try {
        const data = await decodeSave(row.current, this.content);
        if (
          data.metadata &&
          (data.metadata.slotId !== row.id || data.metadata.revision !== row.revision)
        )
          throw new Error('Checkpoint identity or revision does not match its slot.');
        this.makeSession(data.state);
      } catch (error) {
        issue = storageMessage(error);
        if (row.previous)
          try {
            this.makeSession((await decodeSave(row.previous, this.content)).state);
            canRecover = true;
          } catch {
            /* The original row remains intact for export. */
          }
      }
      slots.push({
        id: row.id,
        name: row.name,
        revision: row.revision,
        updatedAt: row.updatedAt,
        issue,
        canRecover,
      });
    }
    this.state.slots = slots.sort(
      (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id),
    );
  }
  async initialize() {
    this.pause(true);
    this.state.busy = 'Opening saved adventures';
    this.publish();
    try {
      await this.refresh();
      const activeId = await this.repository.active();
      if (this.disposed) return;
      if (activeId) {
        const row = slotRowSchema.parse(await this.repository.read(activeId));
        const summary = this.state.slots.find((s) => s.id === activeId);
        if (summary?.issue) {
          this.state.recovery = activeId;
          this.state.error = summary.issue;
          this.state.open = true;
          this.session.dispatch({ type: 'pause.set', reason: 'saves', active: true });
        } else {
          const data = await decodeSave(row.current, this.content);
          this.session.adopt(this.makeSession(data.state), true);
          this.acceptRow(row);
        }
      } else if (this.state.slots.length === 0) {
        await this.write(this.session.export(), {
          id: '00000000-0000-4000-8000-000000000001',
          name: 'First adventure',
          revision: 0,
        });
        await this.refresh();
      } else {
        this.state.open = true;
        this.session.dispatch({ type: 'pause.set', reason: 'saves', active: true });
      }
      this.state.mode = 'durable';
    } catch (error) {
      if (error instanceof Error && error.name === 'SaveConflictError') {
        try {
          const id = await this.repository.active();
          if (!id) throw error;
          const row = slotRowSchema.parse(await this.repository.read(id)),
            data = await decodeSave(row.current, this.content);
          if (this.disposed) return;
          this.session.adopt(this.makeSession(data.state), true);
          this.acceptRow(row);
          this.state.mode = 'durable';
          return;
        } catch {
          /* Show an explicit unavailable state below. */
        }
      }
      this.state.mode = 'unavailable';
      this.state.error = storageMessage(error);
      this.state.open = true;
      this.session.dispatch({ type: 'pause.set', reason: 'saves', active: true });
    } finally {
      this.state.busy = null;
      this.pause(false);
      this.publish();
    }
  }
  private run(
    label: string,
    task: () => Promise<void>,
    recoverable: SaveState | null = null,
  ): CoreResult {
    if (this.blocked)
      return { ok: false, code: 'busy', message: 'Finish or retry the pending checkpoint first.' };
    this.writeCache.clear();
    this.pending = task;
    this.recoverable = recoverable;
    void this.execute(label);
    return { ok: true };
  }
  private async execute(label: string) {
    const task = this.pending;
    if (!task) return;
    this.state.busy = label;
    this.state.error = null;
    this.pause(true);
    this.publish();
    try {
      await task();
      if (this.disposed) return;
      this.pending = null;
      this.recoverable = null;
      this.state.lastReason = label;
      this.state.sequence++;
      this.lastCheckpointTick = this.session.tick;
      try {
        await this.refresh();
      } catch (error) {
        this.state.error =
          'Checkpoint written, but the slot list could not refresh: ' + storageMessage(error);
      }
    } catch (error) {
      if (!this.disposed) this.state.error = storageMessage(error);
    } finally {
      this.state.busy = null;
      if (!this.pending) this.pause(false);
      this.publish();
    }
  }
  command(command: CoreCommand): CoreResult {
    if (this.blocked)
      return {
        ok: false,
        code: 'busy',
        message: 'A checkpoint is pending. Retry or export it before continuing.',
      };
    if (this.state.mode !== 'durable' || !this.state.active) {
      const result = this.session.dispatch(command);
      if (result.ok) this.state.dirty = true;
      this.publish();
      return result;
    }
    const { draft, result } = this.session.stage(command);
    if (!result.ok) return result;
    const state = draft.export(),
      active = this.active();
    return this.run(
      'Saving progress',
      async () => {
        await this.write(state, active);
        if (!this.disposed) this.session.adopt(draft);
      },
      state,
    );
  }
  afterAdvance(steps: number, events: readonly DomainEvent[]) {
    if (steps === 0) return;
    const changed = !this.state.dirty;
    this.state.dirty = true;
    if (
      !this.blocked &&
      this.state.mode === 'durable' &&
      this.state.active &&
      (events.some((e) => IMPORTANT_EVENTS.has(e.type)) ||
        this.session.tick - this.lastCheckpointTick >= 750)
    )
      this.checkpoint('Autosaving progress');
    else if (changed) this.publish();
  }
  checkpoint(label = 'Saving adventure'): CoreResult {
    if (this.state.mode !== 'durable' || !this.state.active)
      return {
        ok: false,
        code: 'unavailable',
        message: 'Storage is unavailable. Export a backup or choose a saved adventure.',
      };
    const state = this.session.export(),
      active = this.active();
    return this.run(
      label,
      async () => {
        await this.write(state, active);
      },
      state,
    );
  }
  setOpen(open: boolean): CoreResult {
    if (!open && this.state.recovery)
      return {
        ok: false,
        code: 'unavailable',
        message:
          'Recover the checkpoint, choose another adventure or explicitly play without saves.',
      };
    if (!open && this.blocked)
      return {
        ok: false,
        code: 'busy',
        message: 'Wait for the checkpoint or choose a recovery action.',
      };
    this.state.open = open;
    this.session.dispatch({ type: 'pause.set', reason: 'saves', active: open });
    this.publish();
    if (
      open &&
      !this.blocked &&
      this.state.mode === 'durable' &&
      this.state.active &&
      this.state.dirty
    )
      this.checkpoint();
    else if (open && !this.blocked)
      void this.refresh()
        .then(() => this.publish())
        .catch((error) => {
          this.state.error = storageMessage(error);
          this.publish();
        });
    return { ok: true };
  }
  private async flush() {
    if (!this.state.dirty) return;
    if (this.state.mode === 'durable' && this.state.active)
      await this.write(this.session.export(), this.active());
    else
      await this.write(this.session.export(), {
        id: crypto.randomUUID(),
        name: 'Recovered unsaved adventure',
        revision: 0,
      });
  }
  private closeMenu() {
    this.state.open = false;
    this.state.recovery = null;
    this.session.dispatch({ type: 'pause.set', reason: 'saves', active: false });
    this.session.dispatch({ type: 'pause.set', reason: 'storage', active: false });
    this.session.dispatch({ type: 'pause.set', reason: 'inventory', active: false });
    this.session.dispatch({ type: 'interaction.dismiss' });
  }
  load(id: string, expectedRevision: number): CoreResult {
    return this.run('Loading adventure', async () => {
      const sameCurrent =
        this.state.active?.id === id && this.state.active.revision === expectedRevision;
      await this.flush();
      if (sameCurrent) expectedRevision = this.active().revision;
      const row = slotRowSchema.parse(await this.repository.read(id));
      if (row.revision !== expectedRevision)
        throw new Error('That slot changed. Reopen the list before loading it.');
      const data = await decodeSave(row.current, this.content);
      if (
        data.metadata &&
        (data.metadata.slotId !== row.id || data.metadata.revision !== row.revision)
      )
        throw new Error('Checkpoint identity mismatch. Original data was kept.');
      const candidate = this.makeSession(data.state);
      await this.repository.select(id, row.revision);
      if (this.disposed) return;
      this.session.adopt(candidate, true);
      this.acceptRow(row);
      this.state.mode = 'durable';
      this.closeMenu();
    });
  }
  newGame(name: string, seed: string, hero: HeroId): CoreResult {
    const state = this.makeNew(seed || crypto.randomUUID(), hero),
      id = crypto.randomUUID();
    return this.run(
      'Creating adventure',
      async () => {
        await this.flush();
        await this.write(state, { id, name, revision: 0 });
        if (!this.disposed) {
          this.session.adopt(this.makeSession(state), true);
          this.state.mode = 'durable';
          this.closeMenu();
        }
      },
      state,
    );
  }
  importBackup(text: string): CoreResult {
    const id = crypto.randomUUID();
    return this.run('Importing backup as a new adventure', async () => {
      const data = await decodeSave(text, this.content),
        candidate = this.makeSession(data.state);
      await this.flush();
      await this.write(data.state, {
        id,
        name: (data.metadata?.name ?? 'Imported adventure').slice(0, 37) + ' (imported)',
        revision: 0,
      });
      if (!this.disposed) {
        this.session.adopt(candidate, true);
        this.state.mode = 'durable';
        this.closeMenu();
      }
    });
  }
  recover(id: string): CoreResult {
    const newId = crypto.randomUUID();
    return this.run('Recovering previous checkpoint as a new adventure', async () => {
      const row = slotRowSchema.parse(await this.repository.read(id));
      if (!row.previous)
        throw new Error(
          'No previous checkpoint is available. Export the original row for recovery.',
        );
      const data = await decodeSave(row.previous, this.content),
        candidate = this.makeSession(data.state);
      await this.flush();
      await this.write(data.state, {
        id: newId,
        name: row.name.slice(0, 36) + ' (recovered)',
        revision: 0,
      });
      if (!this.disposed) {
        this.session.adopt(candidate, true);
        this.state.mode = 'durable';
        this.closeMenu();
      }
    });
  }
  retry(): CoreResult {
    if (!this.pending)
      return { ok: false, code: 'unavailable', message: 'There is no failed checkpoint to retry.' };
    if (this.state.busy)
      return { ok: false, code: 'busy', message: 'A checkpoint is already in progress.' };
    void this.execute('Retrying the same checkpoint');
    return { ok: true };
  }
  cancel(): CoreResult {
    if (this.state.busy) return { ok: false, code: 'busy', message: 'Wait for the current write.' };
    this.pending = null;
    this.recoverable = null;
    this.state.error = null;
    this.pause(false);
    this.publish();
    return { ok: true };
  }
  sessionOnly(): CoreResult {
    if (this.state.busy)
      return { ok: false, code: 'busy', message: 'Wait for the current operation.' };
    this.pending = null;
    this.recoverable = null;
    this.state.mode = 'session-only';
    this.state.active = null;
    this.state.error = 'Playing without browser saves. Export a backup before closing this page.';
    this.pause(false);
    this.closeMenu();
    this.publish();
    return { ok: true };
  }
  retryStorage(): CoreResult {
    if (this.blocked)
      return { ok: false, code: 'busy', message: 'Finish the pending checkpoint first.' };
    if (this.state.dirty || this.state.mode === 'session-only') return this.saveCopy();
    void this.initialize();
    return { ok: true };
  }
  saveCopy(): CoreResult {
    if (this.state.busy) return { ok: false, code: 'busy', message: 'Wait for the current write.' };
    const state = this.recoverable ?? this.session.export(),
      candidate = this.makeSession(state),
      id = crypto.randomUUID();
    this.pending = null;
    this.recoverable = null;
    return this.run(
      'Saving a separate recovery copy',
      async () => {
        await this.write(state, { id, name: 'Recovery copy', revision: 0 });
        if (!this.disposed) {
          this.session.adopt(candidate, true);
          this.state.mode = 'durable';
          this.closeMenu();
        }
      },
      state,
    );
  }
  exportBackup(id: string | null = null): CoreResult {
    if (this.state.busy)
      return {
        ok: false,
        code: 'busy',
        message: 'Wait for the current checkpoint before exporting.',
      };
    void (async () => {
      try {
        if (id) {
          const raw = await this.repository.read(id);
          if (raw === undefined) throw new Error('That save no longer exists.');
          const parsed = slotRowSchema.safeParse(raw);
          this.download(
            'tiny-adventure-original.json',
            parsed.success ? parsed.data.current : JSON.stringify(raw),
          );
        } else {
          const state = this.recoverable ?? this.session.export(),
            active = this.state.active;
          this.download(
            'tiny-adventure-backup.json',
            await encodeSave(state, {
              slotId: active?.id ?? crypto.randomUUID(),
              name: active?.name ?? 'Unsaved adventure',
              revision: active?.revision ?? 1,
              savedAt: new Date().toISOString(),
            }),
          );
        }
      } catch (error) {
        this.state.error = storageMessage(error);
        this.publish();
      }
    })();
    return { ok: true };
  }
  dispose() {
    this.disposed = true;
    this.repository.close();
  }
}
