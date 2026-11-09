import { useEffect, useRef } from 'react';
import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
export function ExpeditionPanel({
  bridge,
  snapshot,
}: {
  bridge: GameBridge;
  snapshot: GameSnapshot;
}) {
  const expedition = snapshot.expedition;
  if (!expedition) return null;
  const close = () => {
    bridge.send({ type: 'pause.set', reason: 'map', active: false });
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
  };
  return (
    <section className="expedition-panel" aria-label="Persistent expeditions">
      <h2>Explored routes</h2>
      <div className="expedition-summary">
        <strong>
          {expedition.rooms.filter((r) => r.explored).length} / {expedition.rooms.length} clearings
          explored
        </strong>
        <span>
          Generation {expedition.generation}
          {expedition.anchor ? ` · anchor ${expedition.anchor}` : ''}
        </span>
        <span>
          {expedition.tools.some((tool) => tool === 'tool:axe')
            ? 'Trail axe · permanent access'
            : 'Trail axe · undiscovered'}
        </span>
      </div>
      {snapshot.pauseReasons.includes('map') && (
        <ExploredMap expedition={expedition} close={close} />
      )}
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
  const markerName = (marker: (typeof e.markers)[number]) => {
    const name =
      marker.kind === 'portal'
        ? 'exit'
        : marker.kind.startsWith('gate-')
          ? marker.kind.slice(5) + ' gate'
          : marker.kind;
    return marker.opened ? `${name} ✓` : name;
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
      <h2>Explored map</h2>
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
            markers = e.markers.filter((m) => m.room === r.id),
            here = r.id === e.currentRoom;
          return (
            <g key={r.id}>
              <rect
                x={p.x - 36}
                y={p.y - 31}
                width="72"
                height="62"
                rx="3"
                fill={here ? '#fae9ad' : r.explored ? '#d8e4ce' : '#e6e4d8'}
                stroke={here ? '#805d33' : '#849482'}
                strokeWidth={here ? 3 : 1}
              />
              <text x={p.x} y={p.y - 4} textAnchor="middle" fontSize="11">
                {r.explored ? r.tag : '?'}
              </text>
              {here && (
                <text x={p.x} y={p.y - 17} textAnchor="middle" fontSize="8">
                  YOU ARE HERE
                </text>
              )}
              {markers.slice(0, 2).map((marker, index) => (
                <text
                  key={marker.id}
                  x={p.x}
                  y={p.y + 9 + index * 11}
                  textAnchor="middle"
                  fontSize="8"
                >
                  {markerName(marker)}
                  {index === 1 && markers.length > 2 ? ` +${markers.length - 2}` : ''}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <p className="small-copy">? Unexplored · ✓ Claimed or open · dotted lines show shortcuts.</p>
      {e.markers.length > 0 && (
        <details>
          <summary>Known landmarks</summary>
          <ul className="small-copy">
            {e.markers.map((marker) => (
              <li key={marker.id}>
                {e.rooms.find((room) => room.id === marker.room)?.tag} · {markerName(marker)}
              </li>
            ))}
          </ul>
        </details>
      )}
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
