import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import type { AssetManifest } from '../assets/definitions';
import { trialSchema } from '../core/combat-model';
import type { Trial } from '../core/combat-model';
import { ActionPrompt } from './ActionPrompt';
export function CombatPanel({
  bridge,
  snapshot,
  assets,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
  assets: AssetManifest | null;
}) {
  const [trial, setTrial] = useState<Trial>('melee'),
    [error, setError] = useState<string | null>(null),
    combat = snapshot.combat;
  const focus = () =>
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
  return (
    <section className="combat-panel" aria-label="Combat practice">
      <div>
        <p className="eyebrow">LEARN THE RHYTHM</p>
        <h2>
          {snapshot.expedition
            ? 'Expedition combat'
            : combat?.active
              ? 'The practice field'
              : 'Try your first encounter'}
        </h2>
        <p className="small-copy">
          {snapshot.expedition
            ? 'The warden guards a one-time reward. Find the route tools, read its windup and strike or block.'
            : 'Watch the golden windup. Strike, block from the front, or roll clear. Practice refills health and energy; defeat retains your possessions.'}
        </p>
      </div>
      {!snapshot.expedition && (
        <div className="trial-controls">
          <label>
            Encounter
            <select
              aria-label="Practice encounter"
              value={trial}
              onChange={(e) => {
                const next = trialSchema.safeParse(e.target.value);
                if (next.success) setTrial(next.data);
              }}
            >
              <option value="melee">Skeleton &amp; zombie</option>
              <option value="archer">Goblin archer</option>
              <option value="swarm">Bat, rat &amp; slime</option>
              <option value="mixed">Mixed encounter</option>
            </select>
          </label>
          <button
            className="button"
            disabled={
              snapshot.status !== 'ready' ||
              snapshot.paused ||
              snapshot.carrying ||
              !!snapshot.expedition
            }
            onClick={() => {
              const result = bridge.send({ type: 'combat.start', trial });
              setError(result.ok ? null : result.message);
              if (result.ok) focus();
            }}
          >
            {combat?.active ? 'Start new trial' : 'Enter practice field'}
          </button>
        </div>
      )}
      {combat?.active && (
        <div className="combat-hud" data-testid="combat-hud">
          <div className="combat-pools">
            <label>
              Health{' '}
              <span data-testid="combat-health">
                {combat.health} / {combat.maximumHealth}
              </span>
              <progress
                aria-label={snapshot.expedition ? 'Expedition health' : 'Practice health'}
                max={combat.maximumHealth}
                value={combat.health}
              />
            </label>
            <label>
              Energy{' '}
              <span data-testid="combat-energy">
                {combat.energy} / {combat.maximumEnergy}
              </span>
              <progress
                aria-label={snapshot.expedition ? 'Expedition energy' : 'Practice energy'}
                max={combat.maximumEnergy}
                value={combat.energy}
              />
            </label>
          </div>
          <div className="combat-readout">
            <span data-testid="combat-remaining">{combat.remaining} enemies remaining</span>
            <span data-testid="combat-phase">{combat.guard ? 'Shield raised' : combat.phase}</span>
            <span data-testid="combat-coins">{combat.coins} coins</span>
          </div>
          <div className="combat-bindings">
            <span>
              <ActionPrompt manifest={assets} input={snapshot.input} action="attack" /> Sword{' '}
              {combat.swordCooldown > 0 ? `${combat.swordCooldown.toFixed(1)}s` : 'ready'}
            </span>
            <span>
              <ActionPrompt manifest={assets} input={snapshot.input} action="guard" /> Hold shield
            </span>
            <span>
              <ActionPrompt manifest={assets} input={snapshot.input} action="roll" /> Roll{' '}
              {combat.rollCooldown > 0 ? `${combat.rollCooldown.toFixed(1)}s` : 'ready'}
            </span>
            <span>
              <ActionPrompt manifest={assets} input={snapshot.input} action="bow" /> Bow{' '}
              {combat.bowCooldown > 0 ? `${combat.bowCooldown.toFixed(1)}s` : 'ready'}
            </span>
          </div>
          <p className="combat-feedback" aria-live="polite" data-testid="combat-feedback">
            {combat.feedback ||
              (combat.completed
                ? snapshot.expedition
                  ? 'Encounter cleared. Collect the coins and explore the reward room.'
                  : 'Encounter cleared. Collect the coins or try another trial.'
                : 'Golden ring: windup. Red: active attack. Keep room to recover.')}
          </p>
          {combat.drop && (
            <button
              className="button"
              disabled={snapshot.paused}
              onClick={() => {
                if (!combat.drop) return;
                const result = bridge.send({ type: 'combat.collect', dropId: combat.drop });
                setError(result.ok ? null : result.message);
                focus();
              }}
            >
              Collect nearby coin
            </button>
          )}
          <p className="small-copy">
            {snapshot.expedition
              ? 'Glowing trail markers lead between regions.'
              : 'The marked exit is at the south edge.'}{' '}
            Arrow shots cost energy, never ammunition.{' '}
            {snapshot.expedition
              ? 'Gates and discoveries remain when you return.'
              : 'A new trial explicitly resets its enemies and refills your pools.'}
          </p>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
export function DefeatDialog({ bridge, snapshot }: { bridge: GameBridge; snapshot: GameSnapshot }) {
  const ref = useRef<HTMLDialogElement>(null),
    button = useRef<HTMLButtonElement>(null),
    [error, setError] = useState<string | null>(null);
  useEffect(() => {
    ref.current?.showModal();
    button.current?.focus();
  }, []);
  const death = snapshot.combat?.death;
  return (
    <dialog
      ref={ref}
      className="interaction-dialog"
      aria-label={snapshot.expedition ? 'Defeated on expedition' : 'Defeated in practice'}
      onCancel={(e) => e.preventDefault()}
    >
      <p className="eyebrow">TAKE A BREATH</p>
      <h2>Another chance.</h2>
      <p>
        The field is paused. Your possessions are safe. Return{' '}
        {snapshot.expedition ? 'to the village' : 'to the entrance'} with full health and energy;
        defeated enemies and unclaimed coins remain.
      </p>
      <button
        ref={button}
        className="button"
        onClick={() => {
          if (!death) return;
          const result = bridge.send({ type: 'combat.respawn', deathId: death.id });
          setError(result.ok ? null : result.message);
          if (result.ok)
            requestAnimationFrame(() =>
              document.querySelector<HTMLElement>('.game-canvas')?.focus(),
            );
        }}
      >
        {snapshot.expedition ? 'Return to village' : 'Return to practice entrance'}
      </button>
      {error && <p role="alert">{error}</p>}
    </dialog>
  );
}
