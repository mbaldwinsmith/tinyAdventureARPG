import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import { ACTIONS, KEY_CODES } from '../core/actions';
const labels = {
  up: 'Move up',
  left: 'Move left',
  down: 'Move down',
  right: 'Move right',
  interact: 'Interact',
  attack: 'Swing preview',
  pause: 'Pause',
};
const buttonChoices = [
  [0, 'South face'],
  [2, 'West face'],
  [3, 'North face'],
  [4, 'Left bumper'],
  [5, 'Right bumper'],
  [8, 'View / Select'],
  [9, 'Start / Menu'],
] as const;
export function ControlsDialog({
  bridge,
  snapshot,
  close,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    done = useRef<HTMLButtonElement>(null),
    [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
    done.current?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="controls-dialog"
      aria-label="Controls and bindings"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <p className="eyebrow">FIND YOUR OWN RHYTHM</p>
      <h2>Controls</h2>
      <p>
        Click the clearing to focus it. Arrow keys always move; a controller uses its left stick or
        directional pad.
      </p>
      <fieldset>
        <legend>Keyboard</legend>
        <div className="binding-grid">
          {ACTIONS.map((action) => (
            <label key={action}>
              {labels[action]}
              <select
                aria-label={`${labels[action]} key`}
                value={snapshot.input.keys[action]}
                onChange={(event) => {
                  const result = bridge.send({
                    type: 'input.key.set',
                    action,
                    code: event.target.value,
                  });
                  setError(result.ok ? null : result.message);
                }}
              >
                {KEY_CODES.map((code) => (
                  <option
                    value={code}
                    key={code}
                    disabled={ACTIONS.some(
                      (other) => other !== action && snapshot.input.keys[other] === code,
                    )}
                  >
                    {code.startsWith('Key') ? code.slice(3) : code}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Controller</legend>
        <p>
          Release the stick and buttons after connecting, changing menus or returning to the
          clearing. The east face button closes menus; the interact button confirms. Use up/down to
          focus controls and left/right to change a selector.
        </p>
        <div className="binding-grid">
          {(['interact', 'attack', 'pause'] as const).map((action) => (
            <label key={action}>
              {labels[action]}
              <select
                aria-label={`${labels[action]} controller button`}
                value={
                  action === 'interact'
                    ? snapshot.input.interactButton
                    : action === 'attack'
                      ? snapshot.input.attackButton
                      : snapshot.input.pauseButton
                }
                onChange={(event) => {
                  const result = bridge.send({
                    type: 'input.button.set',
                    action,
                    button: Number(event.target.value),
                  });
                  setError(result.ok ? null : result.message);
                }}
              >
                {buttonChoices.map(([id, label]) => (
                  <option
                    key={id}
                    value={id}
                    disabled={
                      (action !== 'interact' && snapshot.input.interactButton === id) ||
                      (action !== 'attack' && snapshot.input.attackButton === id) ||
                      (action !== 'pause' && snapshot.input.pauseButton === id)
                    }
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="small-copy">
        Bindings apply to this session. Swing is an animation preview; damage and combat come later.
        Pointer clicks can activate a nearby highlighted object.
      </p>
      {error && <p role="alert">{error}</p>}
      <button ref={done} className="button" onClick={close}>
        Done with controls
      </button>
    </dialog>
  );
}
