import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { GameBridge } from '../bridge/game-bridge';
import { HERO_IDS } from '../core/preview-session';
import { GameCanvas } from './GameCanvas';
import { createUiStore } from './ui-store';
import { HERO_ACTIONS } from '../assets/hero-animations';
import type { HeroAction } from '../assets/hero-animations';
const AssetWorkbench = import.meta.env.DEV ? lazy(() => import('./AssetWorkbench')) : null;

export function App() {
  const [bridge] = useState(() => new GameBridge());
  const [store] = useState(createUiStore);
  const snapshot = useStore(store, (state) => state.snapshot);
  const [mounted, setMounted] = useState(true);
  const [workbenchOpen, setWorkbenchOpen] = useState(false);
  const [previewAction, setPreviewAction] = useState<HeroAction>('sword');
  const [commandError, setCommandError] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuOpen = snapshot.pauseReasons.includes('menu');

  useEffect(() => bridge.subscribe((next) => store.setState({ snapshot: next })), [bridge, store]);
  useEffect(() => {
    if (menuOpen && !dialog.current?.open) dialog.current?.showModal();
    if (!menuOpen && dialog.current?.open) dialog.current.close();
  }, [menuOpen]);

  const pause = (active: boolean) => {
    const result = bridge.send({ type: 'pause.set', reason: 'menu', active });
    setCommandError(result.ok ? null : result.message);
  };

  return (
    <div className="app-shell">
      <header className="masthead">
        <a className="wordmark" href="#" aria-label="Tiny Adventure home">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span>
            Tiny Adventure<small>A KINGDOM WORTH RESTORING</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="build-badge">FIRST STEPS · 0.0.0</span>
          <button
            className="button button-subtle"
            disabled={snapshot.status !== 'ready' || !mounted}
            onClick={() => pause(true)}
          >
            Pause <kbd>Esc</kbd>
          </button>
        </div>
      </header>
      <main>
        <div className="intro-row">
          <div>
            <p className="eyebrow">THE JOURNEY BEGINS HERE</p>
            <h1>
              A small clearing.
              <br />
              <em>A world to come.</em>
            </h1>
          </div>
          <p className="intro-copy">
            Beyond the trees, an adventure is taking shape.
            <br />
            For now, take a breath. Find your feet.
          </p>
        </div>
        <section className="adventure-frame" aria-labelledby="clearing-title">
          <div className="location-bar">
            <div>
              <span className="location-dot" aria-hidden="true" />
              <h2 id="clearing-title">Wayfarer’s clearing</h2>
              <span className="location-type">FOREST PREVIEW</span>
            </div>
            <span className="engine-status" role="status">
              {snapshot.status === 'loading'
                ? 'Opening the path…'
                : snapshot.status === 'failed'
                  ? 'Unable to open the path'
                  : !mounted
                    ? 'Scene unloaded'
                    : snapshot.pauseReasons.includes('workbench')
                      ? 'Inspecting artwork'
                      : menuOpen
                        ? 'Taking a breather'
                        : 'The path is open'}
            </span>
          </div>
          <div
            className="world-stage"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && snapshot.status === 'ready') {
                event.preventDefault();
                pause(true);
              }
            }}
          >
            {mounted && <GameCanvas bridge={bridge} />}
            {snapshot.status === 'loading' && (
              <div className="scene-overlay">
                <span className="loading-star">✦</span>
                <p>Preparing the clearing…</p>
              </div>
            )}
            {snapshot.status === 'failed' && (
              <div className="scene-overlay error-panel" role="alert">
                <h3>The path needs a little attention</h3>
                <p>{snapshot.error}</p>
                <button className="button" onClick={() => window.location.reload()}>
                  Try again
                </button>
              </div>
            )}
            {!mounted && (
              <div className="scene-overlay">
                <p>The clearing has been unloaded.</p>
              </div>
            )}
            {snapshot.pauseReasons.includes('background') &&
              !menuOpen &&
              snapshot.status === 'ready' &&
              mounted && (
                <div className="background-notice">Paused while this window is inactive</div>
              )}
          </div>
          <div className="controls-bar">
            <p>
              <span className="key-group">
                <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd>
              </span>{' '}
              or arrow keys to wander <span className="control-divider">/</span> Click the clearing
              to focus
            </p>
            <span className="preview-label">Movement & interface preview</span>
          </div>
        </section>
        <section className="below-world" aria-label="Preview options and development status">
          <div className="appearance-panel">
            <p className="eyebrow">A FACE FOR THE JOURNEY</p>
            <h2>Choose your wanderer</h2>
            <div className="hero-list">
              {HERO_IDS.map((hero) => (
                <button
                  key={hero}
                  className={`hero-button ${snapshot.hero === hero ? 'selected' : ''}`}
                  aria-label={`Wanderer ${hero}`}
                  aria-pressed={snapshot.hero === hero}
                  disabled={snapshot.status !== 'ready' || !mounted}
                  onClick={() => {
                    const result = bridge.send({ type: 'appearance.set', hero });
                    setCommandError(result.ok ? null : result.message);
                  }}
                >
                  <span
                    className="hero-portrait"
                    style={{
                      backgroundImage: `url(${import.meta.env.BASE_URL}generated/hero-${hero}-idle.png)`,
                    }}
                  />
                  <span className="hero-number">0{hero}</span>
                </button>
              ))}
            </div>
            <p className="small-copy">Six appearances. The same adventure.</p>
          </div>
          <div className="development-note">
            <span className="note-icon" aria-hidden="true">
              ❧
            </span>
            <div>
              <p className="eyebrow">A SEED, NOT THE WHOLE GARDEN</p>
              <h2>Something worth growing</h2>
              <p>
                This first preview brings the artwork and interface together. Combat, storage,
                farming and the wider Kingdom are still ahead.
              </p>
              <a
                href="https://github.com/mbaldwinsmith/tinyAdventureARPG/blob/main/PLAN.md"
                target="_blank"
                rel="noreferrer"
              >
                Follow the release plan <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <section className="animation-practice" aria-label="Animation previews">
          <div>
            <p className="eyebrow">TRY A NEW MOVE</p>
            <h2>Bring the artwork to life</h2>
            <p>Animation preview only — tools, damage and combat come later.</p>
          </div>
          <label>
            Action
            <select
              aria-label="Animation to preview"
              value={previewAction}
              onChange={(event) => {
                const action = HERO_ACTIONS.find((candidate) => candidate === event.target.value);
                if (action) setPreviewAction(action);
              }}
            >
              {HERO_ACTIONS.map((action) => (
                <option key={action} value={action}>
                  {action.replaceAll('-', ' ')}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button"
            disabled={snapshot.status !== 'ready' || !mounted || snapshot.paused}
            onClick={() => {
              const result = bridge.send({ type: 'animation.preview', action: previewAction });
              setCommandError(result.ok ? null : result.message);
            }}
          >
            Preview animation
          </button>
        </section>
        {commandError && (
          <p role="alert" className="command-error">
            {commandError}
          </p>
        )}
        {import.meta.env.DEV && (
          <details className="developer-tools">
            <summary>Development tools</summary>
            <button className="button button-subtle" onClick={() => setMounted((value) => !value)}>
              {mounted ? 'Unload scene' : 'Mount scene'}
            </button>
            <button
              className="button button-subtle"
              disabled={snapshot.status !== 'ready' || !mounted}
              onClick={() => {
                bridge.send({ type: 'pause.set', reason: 'workbench', active: true });
                setWorkbenchOpen(true);
              }}
            >
              Open sprite workbench
            </button>
            <p>
              Lifecycle check: exactly one canvas should exist after remounting. This is a
              development-only control.
            </p>
          </details>
        )}
        {workbenchOpen && AssetWorkbench && (
          <Suspense fallback={<p>Opening sprite workbench…</p>}>
            <AssetWorkbench
              onClose={() => {
                bridge.send({ type: 'pause.set', reason: 'workbench', active: false });
                setWorkbenchOpen(false);
              }}
            />
          </Suspense>
        )}
      </main>
      <footer>
        <span>Learn the paths. Bring something home.</span>
        <span>
          Artwork by Vryell <span aria-hidden="true">·</span> Created by Mark Baldwin-Smith
        </span>
      </footer>
      <dialog
        ref={dialog}
        className="pause-dialog"
        onCancel={(event) => {
          event.preventDefault();
          pause(false);
        }}
      >
        <p className="eyebrow">THERE’S NO HURRY</p>
        <h2>Take a breather.</h2>
        <p>The clearing is paused. Your wanderer will be right where you left them.</p>
        <button className="button" autoFocus onClick={() => pause(false)}>
          Back to the clearing <span aria-hidden="true">→</span>
        </button>
      </dialog>
    </div>
  );
}
