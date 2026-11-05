import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import { CheckpointRecovery } from './SavePanel';

export function VillageJournal({ snapshot }: { snapshot: GameSnapshot }) {
  const village = snapshot.village;
  if (!village) return null;
  return (
    <section className="pack-panel" aria-label="Village journal">
      <h2>Village journal</h2>
      <p>
        <strong>{village.stage}</strong>
      </p>
      <p>{village.hint}</p>
      {village.quest && (
        <p>
          Stock the shelves ·{' '}
          {village.quest.complete
            ? 'Reward claimed'
            : `${village.quest.wood} / ${village.quest.required} Wood in your pack`}
        </p>
      )}
    </section>
  );
}

export function VillageDialog({
  snapshot,
  bridge,
  close,
}: {
  snapshot: GameSnapshot;
  bridge: GameBridge;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const village = snapshot.village;
  const message = snapshot.message;
  const busy = !!snapshot.saves?.busy || !!snapshot.saves?.pending;
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);
  useEffect(() => {
    if (!busy && lastFocused.current?.isConnected) lastFocused.current.focus();
  }, [busy]);
  if (!village?.dialogue || !message) return null;
  const dialogue = village.dialogue;
  const transaction = village.transaction;
  const send = (command: Parameters<GameBridge['send']>[0]) => {
    const result = bridge.send(command);
    setError(result.ok ? null : result.message);
  };
  return (
    <dialog
      ref={ref}
      className="interaction-dialog inventory-dialog"
      aria-label={message.title}
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLElement) lastFocused.current = event.target;
      }}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) close();
      }}
    >
      <h2>{message.title}</h2>
      <p>{message.body}</p>
      {dialogue.node === 'stock' && village.quest && (
        <p>
          {village.quest.complete
            ? 'Reward claimed · 12 coins'
            : `Wood in pack: ${village.quest.wood} / ${village.quest.required}`}
        </p>
      )}
      {village.shop && (
        <>
          <p>
            <strong>{village.shop.money} carried coins</strong>
          </p>
          <label>
            Trade quantity{' '}
            <input
              type="number"
              min="1"
              max="99"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <div className="storage-columns">
            <section aria-label="Buy stock">
              <h3>Buy</h3>
              {village.shop.offers.map((offer) => (
                <p key={offer.item}>
                  <button
                    className="button button-subtle"
                    disabled={busy}
                    onClick={() =>
                      send({
                        type: 'village.buy',
                        item: offer.item,
                        quantity: offer.max === 1 ? 1 : Number(quantity),
                        expectedTransaction: transaction,
                      })
                    }
                  >
                    Buy {offer.name}
                  </button>{' '}
                  · {offer.buy} coins each
                </p>
              ))}
            </section>
            <section aria-label="Sell possessions">
              <h3>Sell</h3>
              {village.shop.sales.length === 0 && <p>No eligible items in your pack.</p>}
              {village.shop.sales.map((item) => (
                <p key={item.id}>
                  <button
                    className="button button-subtle"
                    disabled={busy}
                    onClick={() =>
                      send({
                        type: 'village.sell',
                        itemId: item.id,
                        quantity: item.max === 1 ? 1 : Number(quantity),
                        expectedTransaction: transaction,
                      })
                    }
                  >
                    Sell {item.name}
                  </button>{' '}
                  · {item.price} {item.price === 1 ? 'coin' : 'coins'} each · {item.quantity}{' '}
                  carried
                </p>
              ))}
            </section>
          </div>
        </>
      )}
      <div className="tool-context-actions">
        {dialogue.choices.map((choice) => (
          <button
            className="button"
            key={choice.id}
            disabled={busy}
            onClick={() =>
              send({
                type: 'village.choose',
                node: dialogue.node,
                choice: choice.id,
                expectedTransaction: transaction,
              })
            }
          >
            {choice.label}
          </button>
        ))}
        <button className="button button-subtle" autoFocus disabled={busy} onClick={close}>
          Continue exploring
        </button>
      </div>
      {(error || snapshot.notice) && <p role="alert">{error ?? snapshot.notice}</p>}
      <CheckpointRecovery bridge={bridge} snapshot={snapshot} />
    </dialog>
  );
}
