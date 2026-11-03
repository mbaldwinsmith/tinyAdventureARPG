import { useEffect, useRef } from 'react';
import type { GameBridge } from '../bridge/game-bridge';
import { mountGame } from '../game/create-game';

export function GameCanvas({ bridge }: { bridge: GameBridge }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    return mountGame(host.current, bridge);
  }, [bridge]);
  useEffect(
    () =>
      bridge.onEvent((event) => {
        if (event.type === 'domain.event' && event.event.type === 'world.region-entered')
          requestAnimationFrame(() => host.current?.focus());
      }),
    [bridge],
  );
  return (
    <div
      ref={host}
      className="game-canvas"
      role="region"
      aria-label="Walkable forest clearing"
      tabIndex={0}
      onPointerDown={(event) => event.currentTarget.focus()}
      onKeyDown={(event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key))
          event.preventDefault();
      }}
    />
  );
}
