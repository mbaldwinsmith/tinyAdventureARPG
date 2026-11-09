import { useEffect, useState } from 'react';
import type { AssetManifest } from '../assets/definitions';
import { adventureIcons, fieldArt } from '../assets/adventure-art';
import type { SourceRect } from '../assets/terrain';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import type { DomainEvent } from '../core/session';
import { ActionPrompt } from './ActionPrompt';
import { packedSpriteStyle } from './atlas-ui';

export function PixelIcon({
  assets,
  rect,
  scale = 2,
}: {
  assets: AssetManifest | null;
  rect: SourceRect;
  scale?: number;
}) {
  return (
    <span
      className="pixel-icon"
      aria-hidden="true"
      style={packedSpriteStyle(assets, rect, scale)}
    />
  );
}

export function PlayHud({
  assets,
  snapshot,
  bridge,
}: {
  assets: AssetManifest | null;
  snapshot: GameSnapshot;
  bridge: GameBridge;
}) {
  const { health, maxHealth, energy, maxEnergy } = snapshot.vitals;
  const { calendar, expedition } = snapshot;
  const hearts = Math.min(8, Math.ceil(maxHealth / 2));
  const visibleHealth = maxHealth > 0 ? (health / maxHealth) * hearts : 0;
  const ready = snapshot.status === 'ready' && !snapshot.paused;
  const hour = String(Math.floor(calendar.minuteOfDay / 60)).padStart(2, '0');
  const minute = String(calendar.minuteOfDay % 60).padStart(2, '0');

  return (
    <div className="play-hud" aria-label="Adventure HUD">
      <div className="hud-vitals">
        <div className="hud-hearts">
          <span className="heart-sprites" aria-hidden="true">
            {Array.from({ length: hearts }, (_, index) => (
              <PixelIcon
                key={index}
                assets={assets}
                rect={{
                  texture: 'gui-vitals',
                  x: (visibleHealth >= index + 1 ? 3 : visibleHealth > index ? 4 : 5) * 16,
                  y: 0,
                  width: 16,
                  height: 16,
                }}
              />
            ))}
          </span>
          <span className="hud-pool-label">
            Life{' '}
            <strong>
              {health} / {maxHealth}
            </strong>
          </span>
        </div>
        <div className="hud-energy">
          <progress aria-label="Energy" max={maxEnergy || 1} value={energy} />
          <span className="hud-pool-label">
            Energy{' '}
            <strong>
              {energy} / {maxEnergy}
            </strong>
          </span>
        </div>
      </div>
      <div className="hud-time">
        <PixelIcon assets={assets} rect={adventureIcons.clock} />
        <span data-testid="world-time">
          Day {calendar.day} · {calendar.season} {calendar.dayOfSeason} · {hour}:{minute}
        </span>
      </div>
      <div className="hud-actions">
        <span className="hud-wallet">
          <PixelIcon assets={assets} rect={adventureIcons.coin} />
          <strong>{snapshot.inventory?.money ?? 0}</strong>
          <span className="visually-hidden"> coins</span>
        </span>
        {expedition && (
          <button
            className="hud-button"
            aria-label="Open explored map"
            disabled={!ready}
            onClick={() => bridge.send({ type: 'pause.set', reason: 'map', active: true })}
          >
            <PixelIcon assets={assets} rect={adventureIcons.map} />
            Map <ActionPrompt manifest={assets} input={snapshot.input} action="map" />
          </button>
        )}
        <button
          className="hud-button"
          aria-label="Open pack"
          disabled={!ready || !snapshot.inventory}
          onClick={() => bridge.send({ type: 'pause.set', reason: 'inventory', active: true })}
        >
          <PixelIcon assets={assets} rect={adventureIcons.pack} />
          Pack <ActionPrompt manifest={assets} input={snapshot.input} action="inventory" />
        </button>
      </div>
    </div>
  );
}

export function DiscoveryNotice({
  assets,
  bridge,
}: {
  assets: AssetManifest | null;
  bridge: GameBridge;
}) {
  const [notice, setNotice] = useState<Extract<DomainEvent, { type: 'world.discovery' }> | null>(
    null,
  );
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = bridge.onEvent((update) => {
      if (update.type !== 'domain.event') return;
      const event = update.event;
      if (event.type === 'world.region-entered') {
        clearTimeout(timeout);
        setNotice(null);
      } else if (event.type === 'world.discovery') {
        clearTimeout(timeout);
        setNotice(event);
        timeout = setTimeout(() => setNotice(null), 4800);
      }
    });
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [bridge]);
  return (
    <div className={notice ? 'discovery-notice' : 'visually-hidden'} aria-live="polite">
      {notice && (
        <>
          <PixelIcon
            assets={assets}
            rect={notice.icon === 'key' ? fieldArt.key : adventureIcons[notice.icon]}
          />
          <div>
            <strong>{notice.title}</strong>
            <span>{notice.message}</span>
          </div>
        </>
      )}
    </div>
  );
}
