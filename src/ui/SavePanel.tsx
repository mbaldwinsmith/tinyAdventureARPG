import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import { HERO_IDS } from '../core/model';
import type { HeroId } from '../core/model';
import { heroSchema } from '../core/model';
import { MAX_SAVE_BYTES } from '../platform/saves/codec';
export function SavePanel({ bridge, snapshot }: { bridge: GameBridge; snapshot: GameSnapshot }) {
  const saves = snapshot.saves;
  if (!saves) return null;
  const label = saves.busy
    ? 'Saving…'
    : saves.error
      ? 'Save needs attention'
      : saves.mode === 'session-only'
        ? 'Playing without saves'
        : saves.mode === 'unavailable'
          ? 'Storage unavailable'
          : saves.dirty
            ? 'Progress not yet checkpointed'
            : 'Saved';
  return (
    <section className="save-panel" aria-label="Saved adventures">
      <div>
        <strong>{saves.active?.name ?? 'Your adventure'}</strong>
        <span data-testid="save-status" aria-live="polite">
          {label}
        </span>
        {saves.active && <small>Checkpoint {saves.active.revision}</small>}
      </div>
      <button
        className="button button-subtle"
        disabled={!!saves.busy}
        onClick={() => bridge.send({ type: 'save.open', open: true })}
      >
        Saved adventures
      </button>
      {saves.error && (
        <p className="save-error" aria-live="polite">
          {saves.error}
        </p>
      )}
      {saves.open && <SaveDialog bridge={bridge} snapshot={snapshot} />}
    </section>
  );
}
function SaveDialog({ bridge, snapshot }: { bridge: GameBridge; snapshot: GameSnapshot }) {
  const ref = useRef<HTMLDialogElement>(null),
    close = useRef<HTMLButtonElement>(null),
    file = useRef<HTMLInputElement>(null),
    [name, setName] = useState('New adventure'),
    [seed, setSeed] = useState(''),
    [hero, setHero] = useState<HeroId>(snapshot.hero),
    [error, setError] = useState<string | null>(null),
    saves = snapshot.saves;
  useEffect(() => {
    ref.current?.showModal();
    close.current?.focus();
    return () => {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
    };
  }, []);
  if (!saves) return null;
  const busy = !!saves.busy,
    send = (command: Parameters<GameBridge['send']>[0]) => {
      const result = bridge.send(command);
      setError(result.ok ? null : result.message);
    };
  return (
    <dialog
      ref={ref}
      className="interaction-dialog save-dialog"
      aria-label="Saved adventures"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy && !saves.pending) send({ type: 'save.open', open: false });
      }}
    >
      <p className="eyebrow">PLACES WORTH REMEMBERING</p>
      <h2>Your adventures.</h2>
      <p className="small-copy">
        Checkpoints stay in this browser on this site. Export backups before changing browsers or
        clearing site data. Closed-game time never advances the world.
      </p>
      {saves.busy && (
        <p className="save-progress" aria-live="polite">
          {saves.busy}…
        </p>
      )}
      {(saves.error || error) && <p role="alert">{error ?? saves.error}</p>}
      <div className="save-actions">
        <button
          className="button"
          disabled={busy || saves.pending || saves.mode !== 'durable' || !saves.active}
          onClick={() => send({ type: 'save.write' })}
        >
          Save now
        </button>
        <button
          className="button button-subtle"
          disabled={busy}
          onClick={() => send({ type: 'save.export', id: null })}
        >
          Export current backup
        </button>
      </div>
      {saves.pending && (
        <div className="save-recovery">
          <p>
            The pending checkpoint is retained. Retry writes the same result; it does not repeat a
            transfer or reroll death loss.
          </p>
          <button className="button" disabled={busy} onClick={() => send({ type: 'save.retry' })}>
            Retry checkpoint
          </button>
          <button className="button" disabled={busy} onClick={() => send({ type: 'save.copy' })}>
            Save recovery as new adventure
          </button>
          <button
            className="button button-subtle"
            disabled={busy}
            onClick={() => send({ type: 'save.cancel' })}
          >
            Cancel pending action
          </button>
        </div>
      )}
      {(saves.mode === 'unavailable' || saves.mode === 'session-only') && (
        <div className="save-actions">
          <button
            className="button"
            disabled={busy || saves.pending}
            onClick={() => send({ type: 'save.retry-storage' })}
          >
            Retry browser storage
          </button>
          <button
            className="button button-subtle"
            disabled={busy}
            onClick={() => send({ type: 'save.session-only' })}
          >
            Play without browser saves
          </button>
        </div>
      )}
      <ul className="save-slots">
        {saves.slots.map((slot) => (
          <li key={slot.id}>
            <div>
              <strong>{slot.name}</strong>
              <small>
                Checkpoint {slot.revision}
                {slot.id === saves.active?.id ? ' · current' : ''}
              </small>
              {slot.issue && <p>{slot.issue}</p>}
            </div>
            <div className="save-actions">
              <button
                className="button"
                disabled={busy || saves.pending || !!slot.issue}
                onClick={() => send({ type: 'save.load', id: slot.id, revision: slot.revision })}
              >
                Continue {slot.name}
              </button>
              {slot.canRecover && (
                <button
                  className="button"
                  disabled={busy || saves.pending}
                  onClick={() => send({ type: 'save.recover', id: slot.id })}
                >
                  Recover previous checkpoint
                </button>
              )}
              <button
                className="button button-subtle"
                disabled={busy}
                onClick={() => send({ type: 'save.export', id: slot.id })}
              >
                Export original {slot.name}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <details>
        <summary>Start a new adventure</summary>
        <form
          className="save-new"
          onSubmit={(event) => {
            event.preventDefault();
            send({ type: 'save.new', name, seed, hero });
          }}
        >
          <label>
            Adventure name
            <input required maxLength={48} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            World seed (optional)
            <input maxLength={128} value={seed} onChange={(e) => setSeed(e.target.value)} />
          </label>
          <label>
            Wanderer
            <select
              value={hero}
              onChange={(e) => {
                const parsed = heroSchema.safeParse(Number(e.target.value));
                if (parsed.success) setHero(parsed.data);
              }}
            >
              {HERO_IDS.map((id) => (
                <option key={id} value={id}>
                  Wanderer {id}
                </option>
              ))}
            </select>
          </label>
          <button className="button" disabled={busy || saves.pending || !name.trim()}>
            Create new adventure
          </button>
        </form>
      </details>
      <div className="save-import">
        <label htmlFor="save-import">Import backup as a new adventure</label>
        <input
          ref={file}
          id="save-import"
          type="file"
          accept=".json,application/json"
          disabled={busy || saves.pending}
          onChange={async (e) => {
            const selected = e.target.files?.[0];
            if (!selected) return;
            if (selected.size > MAX_SAVE_BYTES) {
              setError('The backup is larger than 32 MiB.');
              return;
            }
            try {
              send({ type: 'save.import', text: await selected.text() });
            } catch {
              setError('The selected file could not be read.');
            }
            if (file.current) file.current.value = '';
          }}
        />
        <p className="small-copy">
          Every import gets a new slot. Existing adventures and the original file are kept.
        </p>
      </div>
      <button
        ref={close}
        className="button"
        disabled={busy || saves.pending || !!saves.recovery}
        onClick={() => send({ type: 'save.open', open: false })}
      >
        Return to adventure
      </button>
    </dialog>
  );
}

export function CheckpointRecovery({
  bridge,
  snapshot,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
}) {
  const saves = snapshot.saves;
  if (!saves?.pending) return null;
  const busy = !!saves.busy;
  return (
    <div className="save-recovery">
      <p aria-live="polite">{saves.error ?? saves.busy}</p>
      <button
        className="button"
        disabled={busy}
        onClick={() => bridge.send({ type: 'save.retry' })}
      >
        Retry checkpoint
      </button>
      <button
        className="button button-subtle"
        disabled={busy}
        onClick={() => bridge.send({ type: 'save.export', id: null })}
      >
        Export recoverable backup
      </button>
      <button
        className="button button-subtle"
        disabled={busy}
        onClick={() => bridge.send({ type: 'save.copy' })}
      >
        Save recovery as new adventure
      </button>
      <button
        className="button button-subtle"
        disabled={busy}
        onClick={() => bridge.send({ type: 'save.cancel' })}
      >
        Cancel pending action
      </button>
    </div>
  );
}
