import { useEffect, useRef } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import type { FarmCommand } from '../core/farm-model';
import { CheckpointRecovery } from './SavePanel';

export function FarmDialog({
  snapshot,
  bridge,
  close,
}: {
  snapshot: GameSnapshot;
  bridge: GameBridge;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const focus = useRef<HTMLElement | null>(null);
  const farm = snapshot.farm;
  const target = snapshot.message?.farmTarget;
  const busy = !!snapshot.saves?.busy || !!snapshot.saves?.pending;
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);
  useEffect(() => {
    if (!busy && focus.current?.isConnected) focus.current.focus();
  }, [busy]);
  if (!farm || !farm.target || !target) return null;
  const plot = farm.target === 'barrel' ? null : farm.target;
  const crop = plot?.crop;
  const tend = (action: Extract<FarmCommand, { type: 'farm.tend' }>['action']) =>
    bridge.send({ type: 'farm.tend', action, target, expectedTransaction: farm.transaction });
  return (
    <dialog
      ref={ref}
      className="interaction-dialog inventory-dialog"
      aria-label={snapshot.message?.title}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) close();
      }}
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLElement) focus.current = event.target;
      }}
    >
      <h2>{snapshot.message?.title}</h2>
      <p>
        Watering can {farm.water} / {farm.capacity}
      </p>
      {plot && (
        <p>{plot.prepared ? (plot.wet ? 'Watered today' : 'Hoed, dry soil') : 'Unprepared soil'}</p>
      )}
      {crop && (
        <p>
          {crop.name} ·{' '}
          {crop.withered
            ? 'Withered'
            : crop.ready
              ? 'Ready to harvest'
              : `${crop.growth} / ${crop.days} watered days`}
        </p>
      )}
      {snapshot.message?.body && <p aria-live="polite">{snapshot.message.body}</p>}
      {snapshot.notice && <p role="alert">{snapshot.notice}</p>}
      <div className="tool-context-actions">
        {!farm.started && plot && (
          <button className="button" disabled={busy} onClick={() => tend('supplies')}>
            Collect farm supplies
          </button>
        )}
        {!plot && (
          <button
            className="button"
            disabled={busy || !farm.started || farm.water === farm.capacity}
            onClick={() => tend('refill')}
          >
            Refill watering can
          </button>
        )}
        {farm.started && plot && !plot.prepared && (
          <button className="button" disabled={busy} onClick={() => tend('hoe')}>
            Hoe soil
          </button>
        )}
        {crop?.ready && (
          <button className="button" disabled={busy} onClick={() => tend('harvest')}>
            Harvest {crop.name}
          </button>
        )}
        {crop?.withered && (
          <button className="button" disabled={busy} onClick={() => tend('clear')}>
            Clear withered crop
          </button>
        )}
        {crop && !crop.ready && !crop.withered && (
          <button
            className="button"
            disabled={busy || !!plot?.wet || farm.water === 0}
            onClick={() => tend('water')}
          >
            Water crop
          </button>
        )}
        <button className="button button-subtle" autoFocus disabled={busy} onClick={close}>
          Close farm
        </button>
      </div>
      {crop && !crop.ready && !crop.withered && farm.water === 0 && (
        <p>Refill the can at the farm barrel.</p>
      )}
      {farm.started && plot?.prepared && !crop && (
        <section aria-label="Plant seeds">
          <h3>Plant seeds</h3>
          {farm.seeds.map((seed) => (
            <p key={seed.id}>
              <button
                className="button button-subtle"
                disabled={busy || !seed.available || seed.count === 0}
                onClick={() =>
                  bridge.send({
                    type: 'farm.plant',
                    target,
                    crop: seed.id,
                    expectedTransaction: farm.transaction,
                  })
                }
              >
                Plant {seed.name}
              </button>{' '}
              · {seed.count} in pack · {seed.seasons}
            </p>
          ))}
        </section>
      )}
      <CheckpointRecovery bridge={bridge} snapshot={snapshot} />
    </dialog>
  );
}
