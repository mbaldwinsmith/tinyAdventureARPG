import { useEffect, useRef, useState } from 'react';
import { bombExplosion } from '../assets/effects';
export function EffectsInspector() {
  const [frame, setFrame] = useState(0),
    [playing, setPlaying] = useState(false),
    canvas = useRef<HTMLCanvasElement>(null);
  const selected = bombExplosion.frames[frame];
  useEffect(() => {
    if (!playing || !selected) return;
    const timer = window.setTimeout(() => {
      if (frame + 1 === bombExplosion.frames.length) setPlaying(false);
      else setFrame((f) => f + 1);
    }, selected.durationMs);
    return () => window.clearTimeout(timer);
  }, [playing, frame, selected]);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 256, 256);
    for (const cell of selected?.cells ?? []) {
      ctx.globalAlpha = cell.alpha;
      ctx.fillStyle = '#' + cell.colour.toString(16).padStart(6, '0');
      ctx.fillRect(cell.x * 4, cell.y * 4, cell.width * 4, cell.height * 4);
    }
    ctx.globalAlpha = 1;
  }, [selected]);
  return (
    <section aria-label="Authored explosion preview">
      <p>
        Code-authored pixel explosion. Six bounded frames; no damage, fuse or inventory effects.
        Death presentation reuses fall poses with a fade in the clearing.
      </p>
      <button
        className="button button-subtle"
        onClick={() => {
          setFrame(0);
          setPlaying(true);
        }}
      >
        Play explosion
      </button>
      <button
        className="button button-subtle"
        disabled={!playing}
        onClick={() => setPlaying(false)}
      >
        Stop explosion
      </button>
      <label>
        Effect frame{' '}
        <input
          aria-label="Explosion frame"
          type="range"
          min={0}
          max={5}
          value={frame}
          onChange={(e) => {
            setFrame(Number(e.target.value));
            setPlaying(false);
          }}
        />
      </label>
      <output data-testid="explosion-frame">Frame {frame + 1} / 6</output>
      <div className="sprite-inspection-viewport">
        <canvas ref={canvas} width={256} height={256} aria-label="Pixel explosion" />
      </div>
    </section>
  );
}
