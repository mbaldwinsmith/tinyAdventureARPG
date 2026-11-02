import { useEffect, useRef, useState } from 'react';
import { composeTongue } from '../assets/sprite-attachments';
import { DIRECTIONS } from '../assets/hero-animations';
import type { Direction } from '../assets/hero-animations';

export function TongueInspector({ image }: { image: HTMLImageElement | null }) {
  const [direction, setDirection] = useState<Direction>('down');
  const [reach, setReach] = useState(2);
  const canvas = useRef<HTMLCanvasElement>(null);
  const composition = composeTongue(direction, reach);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context || !image) return;
    context.clearRect(0, 0, composition.width * 3, composition.height * 3);
    context.imageSmoothingEnabled = false;
    for (const placement of composition.placements) {
      const part = placement.part;
      context.drawImage(
        image,
        part.x,
        part.y,
        part.width,
        part.height,
        (placement.x + composition.offsetX) * 3,
        (placement.y + composition.offsetY) * 3,
        part.width * 3,
        part.height * 3,
      );
    }
  }, [image, composition]);
  return (
    <section aria-label="Divided tongue assembly">
      <h4>Variable tongue reach</h4>
      <p>
        Body, repeatable middle and terminal tip. Presentation only; combat range is defined later.
      </p>
      <label>
        Assembly direction{' '}
        <select
          aria-label="Tongue direction"
          value={direction}
          onChange={(e) => {
            const next = DIRECTIONS.find((d) => d === e.target.value);
            if (next) setDirection(next);
          }}
        >
          {DIRECTIONS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      <label>
        Middle segments{' '}
        <input
          aria-label="Tongue segments"
          type="range"
          min={0}
          max={12}
          value={reach}
          onChange={(e) => setReach(Number(e.target.value))}
        />
      </label>
      <output data-testid="tongue-size">
        {reach} middle segments · {composition.width}×{composition.height}px
      </output>
      <div className="sprite-inspection-viewport">
        <canvas
          ref={canvas}
          width={composition.width * 3}
          height={composition.height * 3}
          aria-label="Assembled King tongue"
        />
      </div>
    </section>
  );
}
