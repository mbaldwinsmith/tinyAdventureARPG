import { useEffect, useRef, useState } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
export function ExpeditionPanel({
  bridge,
  snapshot,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
}) {
  const [open, setOpen] = useState(false),
    expedition = snapshot.expedition;
  const close = () => {
    setOpen(false);
    bridge.send({ type: 'pause.set', reason: 'map', active: false });
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
  };
  return (
    <section className="expedition-panel" aria-label="Persistent expeditions">
      <div>
        <p className="eyebrow">A WORLD THAT REMEMBERS</p>
        <h2>{expedition ? 'Your expedition' : 'Beyond the familiar paths'}</h2>
        <p className="small-copy">
          {expedition
            ? 'Find the brass key, activate the sun switch and claim the trail axe. Familiar routes stay open. Your borrowed combat kit works here, too.'
            : 'The forest trail is in the southwest corner of the village clearing. Follow it to persistent forest, desert, winter and coastal regions, and an anchored crypt.'}
        </p>
      </div>
      {expedition && (
        <>
          <div className="expedition-summary">
            <strong>
              {expedition.rooms.filter((r) => r.explored).length} / 9 clearings explored
            </strong>
            <span>
              Generation {expedition.generation}
              {expedition.anchor ? ` · anchor ${expedition.anchor}` : ''}
            </span>
            <span>
              {expedition.tools.some((t) => t === 'tool:axe')
                ? 'Trail axe: permanent access'
                : 'Trail axe: not yet found'}
            </span>
            <button
              className="button"
              disabled={snapshot.paused}
              onClick={() => {
                const result = bridge.send({ type: 'pause.set', reason: 'map', active: true });
                if (result.ok) setOpen(true);
              }}
            >
              Open explored map
            </button>
          </div>
          <p className="small-copy">
            Surfaces keep their geography. Wild supplies and claimed ordinary enemies refresh
            offscreen on a later day. A living crypt never resets. After its warden falls, collect
            the reward and exit; the next entry creates its successor. Preview defeat returns you to
            the village without loss. Reloading this preview starts a fresh session. Saved game
            slots are coming next.
          </p>
        </>
      )}
      {open && expedition && <ExploredMap expedition={expedition} close={close} />}
    </section>
  );
}
function ExploredMap({
  expedition: e,
  close,
}: {
  expedition: NonNullable<GameSnapshot['expedition']>;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    button.current?.focus();
  }, []);
  const point = (id: number) => {
    const r = e.rooms.find((r) => r.id === id);
    return { x: 50 + (r?.column ?? 0) * 100, y: 50 + (r?.row ?? 0) * 100 };
  };
  return (
    <dialog
      ref={ref}
      className="interaction-dialog explored-map"
      aria-label="Explored map"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <p className="eyebrow">{e.rooms.filter((r) => r.explored).length} PLACES REMEMBERED</p>
      <h2>Chart your return.</h2>
      <svg viewBox="0 0 300 300" role="img" aria-label="Explored rooms and known trails">
        {e.edges.map((edge) => {
          const a = point(edge.from),
            b = point(edge.to);
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={edge.shortcut ? '#b78950' : '#798978'}
              strokeWidth="6"
              strokeDasharray={edge.shortcut ? '4 4' : undefined}
            />
          );
        })}
        {e.rooms.map((r) => {
          const p = point(r.id),
            markers = e.markers.filter((m) => m.room === r.id);
          return (
            <g key={r.id}>
              <rect
                x={p.x - 36}
                y={p.y - 31}
                width="72"
                height="62"
                rx="8"
                fill={r.explored ? '#d8e4ce' : '#e6e4d8'}
                stroke="#849482"
              />
              <text x={p.x} y={p.y - 4} textAnchor="middle" fontSize="11">
                {r.explored ? r.tag : '?'}
              </text>
              <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize="8">
                {markers
                  .map((m) =>
                    m.kind === 'portal'
                      ? 'entrance'
                      : m.kind === 'shortcut'
                        ? m.opened
                          ? 'shortcut ✓'
                          : 'shortcut'
                        : m.kind,
                  )
                  .join(' · ')}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="small-copy">
        ? Unexplored · dotted trail: shortcut · entrances and discoveries persist.
      </p>
      <details>
        <summary>Generation diagnostics</summary>
        <p className="small-copy diagnostics">
          World seed: {e.seed}
          <br />
          Region: {e.region}
          <br />
          Instance: {e.instance ?? 'surface'}
          <br />
          Generator: v1 · generation {e.generation} · attempt {e.attempt + 1}
          {e.fallback ? ' · fallback' : ''}
          <br />
          Regional seed: {e.regionalSeed}
        </p>
      </details>
      <button ref={button} className="button" onClick={close}>
        Close map
      </button>
    </dialog>
  );
}
