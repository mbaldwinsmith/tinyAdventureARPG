import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import type { AssetManifest } from '../assets/definitions';
import { selectedToolSchema } from '../core/inventory-model';
import { slotIdSchema } from '../core/ids';
import { ActionPrompt } from './ActionPrompt';
import { CheckpointRecovery } from './SavePanel';
export type InventoryItem = NonNullable<GameSnapshot['inventory']>['items'][number];
const focusWorld = () =>
  requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
export function ItemDescription({ item }: { item: InventoryItem }) {
  return (
    <div className="item-description">
      <p>{item.description}</p>
      {item.properties.length > 0 && (
        <ul>
          {item.properties.map((p) => (
            <li key={p.stat}>
              {p.label} {p.value >= 0 ? '+' : ''}
              {p.value} while equipped
            </li>
          ))}
        </ul>
      )}
      {item.enchantments.length > 0 && (
        <ul className="item-enchantments">
          {item.enchantments.map((e) => (
            <li key={e.id}>
              <strong>
                {e.name} +{e.magnitude}
              </strong>{' '}
              · {e.effect}
            </li>
          ))}
        </ul>
      )}
      <p className="item-risk">{item.lossRisk}</p>
      {item.tool && (
        <p className="small-copy">
          Permanent {item.tool.name} ownership:{' '}
          {item.tool.owned ? 'owned' : 'required before equipping'}. Ownership is separate from this
          item.
        </p>
      )}
      <small>No additional ability effects. Instance {item.id.slice(14)}.</small>
    </div>
  );
}
export function InventoryPanel({
  bridge,
  snapshot,
  assets,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
  assets: AssetManifest | null;
}) {
  const pack = snapshot.inventory;
  if (!pack) return null;
  const open = snapshot.pauseReasons.includes('inventory'),
    busy = !!snapshot.saves?.busy || !!snapshot.saves?.pending;
  const select = (tool: typeof pack.selectedTool) => {
    const result = bridge.send({
      type: 'inventory.select',
      tool,
      expectedTransaction: pack.expectedTransaction,
    });
    if (result.ok) focusWorld();
  };
  return (
    <section className="pack-panel" aria-label="Pack and tools">
      <div className="pack-heading">
        <div>
          <p className="eyebrow">READY FOR THE NEXT PATH</p>
          <h2>Your pack. Your choices.</h2>
          <p className="small-copy">
            {pack.items.length} / {pack.capacity} stacks · {pack.money} carried coins · equipment
            stays carried.
          </p>
        </div>
        <button
          className="button"
          disabled={snapshot.status !== 'ready' || snapshot.paused || busy}
          onClick={() => bridge.send({ type: 'pause.set', reason: 'inventory', active: true })}
        >
          Open pack <ActionPrompt manifest={assets} input={snapshot.input} action="inventory" />
        </button>
      </div>
      <div className="tool-hotbar" aria-label="Tool hotbar">
        {pack.hotbar.map((tool) => (
          <button
            key={tool.id}
            className={`tool-slot ${tool.id === pack.selectedTool ? 'selected' : ''}`}
            aria-pressed={tool.id === pack.selectedTool}
            aria-label={`Select ${tool.name}`}
            disabled={snapshot.status !== 'ready' || snapshot.paused || busy}
            onClick={() => select(tool.id)}
          >
            <strong>{tool.name}</strong>
            <span>
              {tool.cooldownSeconds > 0 ? `${tool.cooldownSeconds.toFixed(1)}s` : 'Ready'}
            </span>
            <small>
              {tool.energyCost === 0
                ? 'No energy cost'
                : `${tool.energyCost} energy${tool.id === 'shield' ? ' per block' : ''}`}
            </small>
          </button>
        ))}
      </div>
      <div className="hotbar-use">
        <p className="small-copy">
          {snapshot.combat?.active
            ? `Borrowed encounter kit · ${snapshot.combat.energy} / ${snapshot.combat.maximumEnergy} energy. No ammunition.`
            : 'Choose a tool here, then use X / RT. New trail tools require permanent ownership; Push and Pull work on marked weights.'}
        </p>
        <button
          className="button button-subtle"
          disabled={
            (!snapshot.combat?.active && ['sword', 'roll'].includes(pack.selectedTool)) ||
            snapshot.paused ||
            busy ||
            pack.selectedTool === 'shield'
          }
          onClick={() => {
            bridge.send({ type: 'tool.use' });
            focusWorld();
          }}
        >
          {pack.selectedTool === 'shield' ? 'Hold selected shield' : 'Use selected tool'}{' '}
          <ActionPrompt manifest={assets} input={snapshot.input} action="use" />
        </button>
      </div>
      {pack.selectedTool === 'shield' && (
        <p className="small-copy">
          Hold the selected-tool binding or the dedicated shield binding to guard; release to lower
          it.
        </p>
      )}
      {(pack.feedback || snapshot.notice) && (
        <p className="pack-feedback" aria-live="polite">
          {snapshot.notice ?? `Last action: ${pack.feedback}`}
        </p>
      )}
      {!pack.starterClaimed && (
        <p className="small-copy">
          The travel chest in the clearing holds one set of starter supplies for this adventure.
        </p>
      )}
      {open && (
        <InventoryDialog key={snapshot.transitionSequence} bridge={bridge} snapshot={snapshot} />
      )}
    </section>
  );
}
function InventoryDialog({ bridge, snapshot }: { bridge: GameBridge; snapshot: GameSnapshot }) {
  const ref = useRef<HTMLDialogElement>(null),
    closeButton = useRef<HTMLButtonElement>(null),
    lastFocused = useRef<HTMLElement | null>(null),
    [selected, setSelected] = useState<string | null>(null),
    [error, setError] = useState<string | null>(null),
    [discard, setDiscard] = useState<{
      item: InventoryItem;
      quantity: number;
      transaction: number;
    } | null>(null),
    pack = snapshot.inventory;
  const busy = !!snapshot.saves?.busy || !!snapshot.saves?.pending;
  useEffect(() => {
    ref.current?.showModal();
    closeButton.current?.focus();
    return () => {
      focusWorld();
    };
  }, []);
  useEffect(() => {
    if (!busy && lastFocused.current?.isConnected && ref.current?.contains(lastFocused.current))
      lastFocused.current.focus();
  }, [busy]);
  if (!pack) return null;
  const item = pack.items.find((i) => i.id === selected) ?? pack.items[0],
    send = (command: Parameters<GameBridge['send']>[0]) => {
      const result = bridge.send(command);
      setError(result.ok ? null : result.message);
      return result;
    },
    close = () => {
      if (busy) return;
      bridge.send({ type: 'pause.set', reason: 'inventory', active: false });
      focusWorld();
    };
  return (
    <dialog
      ref={ref}
      className="interaction-dialog inventory-dialog"
      aria-label="Inventory and equipment"
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLElement) lastFocused.current = event.target;
      }}
      onCancel={(e) => {
        e.preventDefault();
        if (!discard) close();
      }}
      onKeyDown={(e) => {
        if (e.code === snapshot.input.keys.inventory && !e.repeat && !discard) {
          e.preventDefault();
          close();
        }
      }}
    >
      <div className="pack-heading">
        <div>
          <p className="eyebrow">CARRY WHAT MATTERS</p>
          <h2>Pack &amp; equipment</h2>
          <p>
            {pack.items.length} / {pack.capacity} stacks · {pack.money} coins
          </p>
        </div>
        <button ref={closeButton} className="button button-subtle" disabled={busy} onClick={close}>
          Close pack
        </button>
      </div>
      <div className="pack-stats" aria-label="Effective equipment stats">
        {(['attack', 'defence', 'movementSpeedPixelsPerSecond'] as const).map((stat) => (
          <div key={stat}>
            <span>
              {stat === 'movementSpeedPixelsPerSecond'
                ? 'Movement speed'
                : stat === 'attack'
                  ? 'Attack'
                  : 'Defence'}
            </span>
            <strong data-testid={`stat-${stat}`}>{Number(pack.stats[stat].toFixed(2))}</strong>
            <small>
              Base {pack.baseStats[stat]}
              {stat === 'movementSpeedPixelsPerSecond' ? ' px/s' : ''}
            </small>
          </div>
        ))}
      </div>
      <div className="inventory-columns">
        <section className="pack-carried">
          <h3>Carried items</h3>
          {pack.items.length === 0 ? (
            <p>Your pack is empty. Collect supplies at the clearing’s travel chest.</p>
          ) : (
            <div className="pack-grid" aria-label="Carried stack selection">
              {pack.items.map((entry, index) => (
                <button
                  key={entry.id}
                  className={`pack-cell ${item?.id === entry.id ? 'selected' : ''}`}
                  aria-pressed={item?.id === entry.id}
                  aria-label={`Select pack item ${index + 1}: ${entry.name}${entry.enchantments.length ? ' · ' + entry.enchantments.map((e) => e.name + ' +' + e.magnitude).join(', ') : ''}`}
                  onClick={() => setSelected(entry.id)}
                  onKeyDown={(event) => {
                    const delta =
                      event.key === 'ArrowRight'
                        ? 1
                        : event.key === 'ArrowLeft'
                          ? -1
                          : event.key === 'ArrowDown'
                            ? 3
                            : event.key === 'ArrowUp'
                              ? -3
                              : 0;
                    if (!delta) return;
                    event.preventDefault();
                    const next = pack.items[index + delta];
                    if (next) {
                      setSelected(next.id);
                      const cells = ref.current?.querySelectorAll<HTMLButtonElement>('.pack-cell');
                      cells?.[index + delta]?.focus();
                    }
                  }}
                >
                  <small>
                    {String(index + 1).padStart(2, '0')} {entry.equipped ? '· equipped' : ''}
                  </small>
                  <strong>{entry.name}</strong>
                  <span>× {entry.quantity}</span>
                  {entry.enchantments.length > 0 && (
                    <em>{entry.enchantments.map((e) => `${e.name} +${e.magnitude}`).join(', ')}</em>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
        <section className="equipment-slots">
          <h3>Equipment</h3>
          {pack.slots.map((slot) => {
            const worn = pack.items.find((i) => i.id === slot.itemId);
            return (
              <div key={slot.id}>
                <span>{slot.name}</span>
                <strong>
                  {worn
                    ? `${worn.name}${worn.enchantments.length ? ' · ' + worn.enchantments.map((e) => e.name + ' +' + e.magnitude).join(', ') : ''}`
                    : 'Empty'}
                </strong>
                {worn && (
                  <button
                    className="button button-subtle"
                    disabled={busy}
                    onClick={() =>
                      send({
                        type: 'inventory.unequip',
                        itemId: worn.id,
                        expectedTransaction: pack.expectedTransaction,
                      })
                    }
                  >
                    Unequip {slot.name}
                  </button>
                )}
              </div>
            );
          })}
          <label>
            Selected tool
            <select
              aria-label="Selected tool"
              value={pack.selectedTool}
              disabled={busy}
              onChange={(event) => {
                const tool = selectedToolSchema.safeParse(event.target.value);
                if (tool.success)
                  send({
                    type: 'inventory.select',
                    tool: tool.data,
                    expectedTransaction: pack.expectedTransaction,
                  });
              }}
            >
              {pack.hotbar.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </label>
          <p className="small-copy">
            Permanent tools:{' '}
            {pack.tools.length ? pack.tools.map((t) => t.name).join(', ') : 'none yet'}. The
            encounter kit remains borrowed.
          </p>
          {pack.statuses.length > 0 && (
            <p>Active effects: {pack.statuses.map((s) => `${s.name} ×${s.stacks}`).join(', ')}</p>
          )}
        </section>
      </div>
      {item && (
        <ItemActions
          key={item.id}
          item={item}
          pack={pack}
          busy={busy}
          send={send}
          discard={(quantity) =>
            setDiscard({ item, quantity, transaction: pack.expectedTransaction })
          }
        />
      )}
      {(error || snapshot.notice) && <p role="alert">{error ?? snapshot.notice}</p>}
      {pack.feedback && (
        <p className="pack-feedback" aria-live="polite">
          Last action: {pack.feedback}
        </p>
      )}
      <CheckpointRecovery bridge={bridge} snapshot={snapshot} />
      <p className="small-copy">
        Carried materials risk the agreed individual loss rolls. Equipment, deposited possessions
        and permanent tool ownership are protected on death.
      </p>
      {discard && (
        <DiscardDialog
          item={discard.item}
          quantity={discard.quantity}
          cancel={() => {
            setDiscard(null);
            requestAnimationFrame(() => closeButton.current?.focus());
          }}
          confirm={() => {
            const result = send({
              type: 'inventory.discard',
              itemId: discard.item.id,
              quantity: discard.quantity,
              confirmed: true,
              expectedTransaction: discard.transaction,
            });
            if (result.ok) {
              setDiscard(null);
              requestAnimationFrame(() => closeButton.current?.focus());
            }
          }}
        />
      )}
    </dialog>
  );
}
function ItemActions({
  item,
  pack,
  busy,
  send,
  discard,
}: {
  item: InventoryItem;
  pack: NonNullable<GameSnapshot['inventory']>;
  busy: boolean;
  send: (command: Parameters<GameBridge['send']>[0]) => unknown;
  discard: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState('1'),
    [target, setTarget] = useState(''),
    [position, setPosition] = useState('1');
  const token = { itemId: item.id, expectedTransaction: pack.expectedTransaction };
  return (
    <section className="pack-item-actions" aria-label="Selected item details">
      <div>
        <p className="eyebrow">SELECTED ITEM</p>
        <h3>
          {item.name} × {item.quantity}
        </h3>
        <ItemDescription item={item} />
      </div>
      <div className="pack-action-controls">
        {item.slots.map((slot) => (
          <button
            key={slot.id}
            className="button"
            disabled={busy || (!item.tool?.owned && !!item.tool) || item.equippedSlot === slot.id}
            onClick={() => {
              const id = slotIdSchema.safeParse(slot.id);
              if (id.success) send({ type: 'inventory.equip', ...token, slot: id.data });
            }}
          >
            Equip {slot.name}
          </button>
        ))}
        {item.equipped && (
          <button
            className="button button-subtle"
            disabled={busy}
            onClick={() => send({ type: 'inventory.unequip', ...token })}
          >
            Unequip selected item
          </button>
        )}
        <label>
          Item quantity
          <input
            aria-label="Item quantity"
            type="number"
            min="1"
            max={item.quantity}
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>
        <button
          className="button button-subtle"
          disabled={busy || item.maxStack === 1 || item.quantity < 2}
          onClick={() => send({ type: 'inventory.split', ...token, quantity: Number(quantity) })}
        >
          Split selected stack
        </button>
        <label>
          Merge into
          <select
            aria-label="Merge into"
            value={target}
            disabled={busy || item.maxStack === 1}
            onChange={(event) => setTarget(event.target.value)}
          >
            <option value="">Choose another stack</option>
            {pack.items
              .filter((i) => i.id !== item.id)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} × {i.quantity}
                  {i.enchantments.length ? ' · enchanted' : ''}
                </option>
              ))}
          </select>
        </label>
        <button
          className="button button-subtle"
          disabled={busy || item.maxStack === 1 || !target}
          onClick={() => {
            const entry = pack.items.find((i) => i.id === target);
            if (entry)
              send({
                type: 'inventory.merge',
                ...token,
                targetId: entry.id,
                quantity: Number(quantity),
              });
          }}
        >
          Merge selected quantity
        </button>
        <label>
          Pack position
          <input
            aria-label="Pack position"
            type="number"
            min="1"
            max={pack.items.length}
            step="1"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          />
        </label>
        <button
          className="button button-subtle"
          disabled={busy}
          onClick={() => send({ type: 'inventory.move', ...token, position: Number(position) - 1 })}
        >
          Move selected stack
        </button>
        <button
          className="button button-danger"
          disabled={busy || item.equipped}
          onClick={() => discard(Number(quantity))}
        >
          Discard selected quantity…
        </button>
      </div>
    </section>
  );
}
function DiscardDialog({
  item,
  quantity,
  cancel,
  confirm,
}: {
  item: InventoryItem;
  quantity: number;
  cancel: () => void;
  confirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    cancelButton = useRef<HTMLButtonElement>(null),
    [checked, setChecked] = useState(false);
  useEffect(() => {
    ref.current?.showModal();
    cancelButton.current?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="interaction-dialog discard-dialog"
      aria-label="Confirm discard"
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
    >
      <p className="eyebrow">A DELIBERATE CHOICE</p>
      <h2>{item.unique ? 'Discard a valuable item?' : 'Discard this quantity?'}</h2>
      <p>
        Permanently remove {quantity} {item.name}
        {item.enchantments.length
          ? ' · ' + item.enchantments.map((e) => `${e.name} +${e.magnitude}`).join(', ')
          : ''}{' '}
        from this adventure.
      </p>
      <p className="small-copy">
        Permanent tools and route access remain owned. Discarding does not move the item to a chest.
      </p>
      <label className="discard-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        I understand this removes the selected possessions.
      </label>
      <div className="save-actions">
        <button ref={cancelButton} className="button" onClick={cancel}>
          Keep item
        </button>
        <button
          className="button button-danger"
          disabled={
            !checked || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > item.quantity
          }
          onClick={confirm}
        >
          Confirm discard
        </button>
      </div>
    </dialog>
  );
}
