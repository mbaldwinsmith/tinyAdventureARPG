import { ItemDescription } from './InventoryPanel';
import { CheckpointRecovery } from './SavePanel';
import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
export function StoragePanel({ bridge, snapshot }: { bridge: GameBridge; snapshot: GameSnapshot }) {
  const [open, setOpen] = useState(false),
    view = snapshot.storage;
  const close = () => {
    setOpen(false);
    bridge.send({ type: 'pause.set', reason: 'storage', active: false });
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
  };
  if (!view) return null;
  return (
    <section className="storage-panel" aria-label="Local chest">
      <p className="small-copy">
        This chest has its own items and money. Deposited possessions are protected on death.
      </p>
      <button
        className="button"
        disabled={snapshot.paused || !!snapshot.saves?.busy}
        onClick={() => {
          const result = bridge.send({ type: 'pause.set', reason: 'storage', active: true });
          if (result.ok) setOpen(true);
        }}
      >
        Open local storage
      </button>
      {open && <StorageDialog bridge={bridge} snapshot={snapshot} close={close} />}
    </section>
  );
}
function StorageDialog({
  bridge,
  snapshot,
  close,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    [amount, setAmount] = useState('1'),
    [error, setError] = useState<string | null>(null),
    view = snapshot.storage;
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  if (!view) return null;
  const busy = !!snapshot.saves?.busy || !!snapshot.saves?.pending,
    send = (direction: 'deposit' | 'withdraw') => {
      const result = bridge.send({
        type: 'storage.money',
        chestId: view.id,
        direction,
        amount: Number(amount),
        expectedTransaction: view.expectedTransaction,
      });
      setError(result.ok ? null : result.message);
    };
  return (
    <dialog
      ref={ref}
      className="interaction-dialog storage-dialog"
      aria-label="Local storage"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) close();
      }}
    >
      <p className="eyebrow">SAFEKEEPING</p>
      <h2>A place for the journey home.</h2>
      {snapshot.inventory?.suppliesAvailable && (
        <section className="starter-supplies">
          <h3>One adventure. A first kit.</h3>
          <p>
            Collect 12 wood, an iron sword, a shield and a Keen +2 iron sword. Sword and shield
            ownership become permanent. The complete kit needs room in your pack.
          </p>
          <button
            className="button"
            disabled={busy}
            onClick={() => {
              const inventory = snapshot.inventory;
              if (!inventory) return;
              const result = bridge.send({
                type: 'inventory.supplies',
                chestId: view.id,
                expectedTransaction: inventory.expectedTransaction,
              });
              setError(result.ok ? null : result.message);
            }}
          >
            Collect starter supplies
          </button>
        </section>
      )}
      <div className="storage-money">
        <span data-testid="carried-money">Carried: {view.carried.money} coins</span>
        <span data-testid="deposited-money">In this chest: {view.deposited.money} coins</span>
        <label>
          Coin amount
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button className="button" disabled={busy} onClick={() => send('deposit')}>
          Deposit coins
        </button>
        <button className="button" disabled={busy} onClick={() => send('withdraw')}>
          Withdraw coins
        </button>
      </div>
      <div className="storage-columns">
        {(['carried', 'deposited'] as const).map((side) => (
          <section key={side}>
            <h3>{side === 'carried' ? 'Carried items' : 'This chest'}</h3>
            <p className="small-copy">
              {view[side].items.length} / {view[side].capacity} stacks
            </p>
            {view[side].items.length === 0 && <p>Empty.</p>}
            {view[side].items.map((item) => (
              <ItemTransfer
                key={item.id}
                item={item}
                direction={side === 'carried' ? 'deposit' : 'withdraw'}
                busy={busy}
                transfer={(quantity) => {
                  const result = bridge.send({
                    type: 'storage.item',
                    chestId: view.id,
                    itemId: item.id,
                    quantity,
                    direction: side === 'carried' ? 'deposit' : 'withdraw',
                    expectedTransaction: view.expectedTransaction,
                  });
                  setError(result.ok ? null : result.message);
                }}
              />
            ))}
          </section>
        ))}
      </div>
      {snapshot.inventory?.feedback && (
        <p className="pack-feedback" aria-live="polite">
          Last action: {snapshot.inventory.feedback}
        </p>
      )}
      {(error || snapshot.notice || snapshot.saves?.error) && (
        <p role="alert">{error ?? snapshot.saves?.error ?? snapshot.notice}</p>
      )}
      <CheckpointRecovery bridge={bridge} snapshot={snapshot} />
      <p className="small-copy">
        Transfers checkpoint both inventories together. Equipment must be unequipped before deposit;
        enchantments and item identity are retained.
      </p>
      <button className="button" disabled={busy} onClick={close}>
        Close local storage
      </button>
    </dialog>
  );
}
function ItemTransfer({
  item,
  direction,
  busy,
  transfer,
}: {
  item: NonNullable<GameSnapshot['storage']>['carried']['items'][number];
  direction: 'deposit' | 'withdraw';
  busy: boolean;
  transfer: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState('1');
  return (
    <div className="storage-item">
      <strong>
        {item.name} × {item.quantity}
        {item.equipped ? ' · equipped' : ''}
      </strong>
      <ItemDescription item={item} />
      <label>
        {direction === 'deposit' ? 'Deposit' : 'Withdraw'} {item.name} quantity
        <input
          type="number"
          min="1"
          max={item.quantity}
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <button
        className="button button-subtle"
        disabled={busy || item.equipped}
        onClick={() => transfer(Number(quantity))}
      >
        {direction === 'deposit' ? 'Deposit' : 'Withdraw'} {item.name}
      </button>
    </div>
  );
}
export function DeathReport({ snapshot }: { snapshot: GameSnapshot }) {
  const report = snapshot.deathReport;
  if (!report) return null;
  return (
    <section className="loss-report" aria-label="Last death outcome">
      <p className="eyebrow">THE RETURN HOME</p>
      <h2>What you kept. What you lost.</h2>
      <p>
        Lost {report.lostMoney} coins. Kept {report.retainedMoney} carried coins.
      </p>
      {report.losses.length ? (
        <ul>
          {report.losses.map((item) => (
            <li key={item.id}>
              Lost {item.quantity} {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items lost.</p>
      )}
      <p className="small-copy">
        Retained:{' '}
        {report.retained.length
          ? report.retained.map((i) => `${i.quantity} ${i.name}`).join(', ')
          : 'no carried items'}
        . Equipment, deposits, permanent tools and discoveries are protected.
        {report.policy === 'practice' ? ' Practice is loss-free.' : ''}
      </p>
    </section>
  );
}
