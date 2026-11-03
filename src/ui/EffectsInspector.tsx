import { useEffect, useRef, useState } from 'react';
import { bombExplosion, effectDurationMs, effectFrameAt } from '../assets/effects';
const durationMs = effectDurationMs(bombExplosion);
export function EffectsInspector() {
  const [frame, setFrame] = useState(0),
    [playing, setPlaying] = useState(false),
    startedAt = useRef<number | null>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const selected = bombExplosion.frames[frame];
  useEffect(() => {
    if (!playing) return;
    let request = 0;
    const advance = (now: number) => {
      if (startedAt.current === null) return;
      const elapsedMs = Math.max(0, now - startedAt.current);
      const selectedFrame = effectFrameAt(bombExplosion, elapsedMs);
      setFrame(
        selectedFrame
          ? bombExplosion.frames.indexOf(selectedFrame)
          : bombExplosion.frames.length - 1,
      );
      if (elapsedMs >= durationMs) {
        startedAt.current = null;
        setPlaying(false);
      } else request = requestAnimationFrame(advance);
    };
    request = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(request);
  }, [playing]);
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
          startedAt.current = performance.now();
          setFrame(0);
          setPlaying(true);
        }}
      >
        Play explosion
      </button>
      <button
        className="button button-subtle"
        disabled={!playing}
        onClick={() => {
          startedAt.current = null;
          setPlaying(false);
        }}
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
            startedAt.current = null;
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
