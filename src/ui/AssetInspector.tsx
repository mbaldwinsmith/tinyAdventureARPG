import { useEffect, useRef, useState } from 'react';
import type { CatalogueAsset } from '../assets/catalogue-types';
import type { AssetManifest } from '../assets/definitions';
import { heroAnimations } from '../assets/hero-animations';

export function AssetInspector({
  asset,
  textures,
}: {
  asset: CatalogueAsset;
  textures: AssetManifest['assets'];
}) {
  const textureIds = textures
    .filter((texture) => texture.canonicalId === asset.id)
    .map((texture) => texture.id);
  const sequences = heroAnimations.filter((animation) => textureIds.includes(animation.texture));
  const [sequenceId, setSequenceId] = useState(sequences[0]?.id ?? '');
  const sequence = sequences.find((animation) => animation.id === sequenceId);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(asset.width > 256 ? 1 : 4);
  const [grid, setGrid] = useState(true);
  const [anchors, setAnchors] = useState(true);
  const [hitbox, setHitbox] = useState(false);
  const [guide, setGuide] = useState({ x: 5, y: 10, width: 6, height: 4 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const clip = sequence?.frames[frame];
  const width = clip?.width ?? asset.width,
    height = clip?.height ?? asset.height;

  useEffect(() => {
    const img = new Image();
    let disposed = false;
    img.onload = () => {
      if (!disposed) setImage(img);
    };
    img.onerror = () => {
      if (!disposed) setError('This source preview could not load.');
    };
    img.src = `/__catalogue/${asset.id}.png`;
    return () => {
      disposed = true;
    };
  }, [asset.id]);

  useEffect(() => {
    if (!playing || !sequence) return;
    const delay = sequence.frames[frame]?.durationMs ?? 100;
    const timer = window.setTimeout(
      () => setFrame((current) => (current + 1) % sequence.frames.length),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [playing, sequence, frame]);

  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context || !image) return;
    context.clearRect(0, 0, width * zoom, height * zoom);
    context.imageSmoothingEnabled = false;
    context.drawImage(
      image,
      clip?.x ?? 0,
      clip?.y ?? 0,
      width,
      height,
      0,
      0,
      width * zoom,
      height * zoom,
    );
    context.lineWidth = 1;
    if (grid) {
      const cellX = clip?.width ?? asset.suggestedCell?.[0] ?? 16;
      const cellY = clip?.height ?? asset.suggestedCell?.[1] ?? 16;
      context.strokeStyle = '#e5c777aa';
      for (let x = 0; x <= width; x += cellX) {
        context.beginPath();
        context.moveTo(x * zoom + 0.5, 0);
        context.lineTo(x * zoom + 0.5, height * zoom);
        context.stroke();
      }
      for (let y = 0; y <= height; y += cellY) {
        context.beginPath();
        context.moveTo(0, y * zoom + 0.5);
        context.lineTo(width * zoom, y * zoom + 0.5);
        context.stroke();
      }
    }
    if (anchors && sequence) {
      context.strokeStyle = '#78ffd0';
      const x = sequence.foot.x * zoom,
        y = sequence.foot.y * zoom;
      context.beginPath();
      context.moveTo(x - 7, y);
      context.lineTo(x + 7, y);
      context.moveTo(x, y - 7);
      context.lineTo(x, y + 7);
      context.stroke();
    }
    if (hitbox) {
      context.strokeStyle = '#ff718d';
      context.strokeRect(guide.x * zoom, guide.y * zoom, guide.width * zoom, guide.height * zoom);
    }
  }, [
    image,
    clip,
    width,
    height,
    zoom,
    grid,
    anchors,
    hitbox,
    guide,
    asset.suggestedCell,
    sequence,
  ]);

  return (
    <article className="asset-inspector">
      <h3>{asset.identity}</h3>
      <p className="asset-technical">
        {asset.auditId} · {asset.id} · {asset.width} × {asset.height}px · {asset.sources.length}{' '}
        exact source occurrence(s)
      </p>
      <div className="inspector-toolbar">
        <label>
          Validated animation
          <select
            aria-label="Validated animation"
            value={sequenceId}
            onChange={(event) => {
              setSequenceId(event.target.value);
              setFrame(0);
              setPlaying(false);
            }}
          >
            <option value="">Full source sheet</option>
            {sequences.map((animation) => (
              <option key={animation.id} value={animation.id}>
                {animation.id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Zoom
          <select
            aria-label="Sprite zoom"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          >
            {[1, 2, 3, 4, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n}×
              </option>
            ))}
          </select>
        </label>
        <button
          className="button button-subtle"
          disabled={!sequence}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? 'Stop animation' : 'Play animation'}
        </button>
      </div>
      {sequence && (
        <div className="frame-controls">
          <label>
            Frame{' '}
            <input
              aria-label="Animation frame"
              type="range"
              min={0}
              max={sequence.frames.length - 1}
              value={frame}
              onChange={(event) => {
                setFrame(Number(event.target.value));
                setPlaying(false);
              }}
            />
          </label>
          <span data-testid="frame-count">
            {frame + 1} / {sequence.frames.length}
          </span>
          <code>
            {clip?.x},{clip?.y} · {width}×{height} · {clip?.durationMs}ms
          </code>
        </div>
      )}
      <div className="inspector-toggles">
        <label>
          <input
            type="checkbox"
            checked={grid}
            onChange={(event) => setGrid(event.target.checked)}
          />{' '}
          Frame/grid overlay
        </label>
        <label>
          <input
            type="checkbox"
            checked={anchors}
            onChange={(event) => setAnchors(event.target.checked)}
          />{' '}
          Authored foot anchor
        </label>
        <label>
          <input
            type="checkbox"
            checked={hitbox}
            onChange={(event) => setHitbox(event.target.checked)}
          />{' '}
          Custom hitbox guide
        </label>
      </div>
      {hitbox && (
        <div className="hitbox-controls">
          {(['x', 'y', 'width', 'height'] as const).map((key) => (
            <label key={key}>
              {key}
              <input
                aria-label={`Hitbox ${key}`}
                type="number"
                min={0}
                max={8192}
                value={guide[key]}
                onChange={(event) =>
                  setGuide((value) => ({
                    ...value,
                    [key]: Math.max(0, Math.min(8192, Number(event.target.value) || 0)),
                  }))
                }
              />
            </label>
          ))}
          <p>Inspection guide only; this does not define gameplay collision or damage.</p>
        </div>
      )}
      <div className="sprite-inspection-viewport">
        <canvas
          ref={canvas}
          width={width * zoom}
          height={height * zoom}
          aria-label={`${asset.identity} pixel preview`}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <p>{asset.suggestedUse}</p>
      <p className="asset-technical">
        {sequence
          ? `Authored frame rectangles; reference anchor ${sequence.foot.x},${sequence.foot.y}. ${sequence.directionSource === 'shared' ? 'Same source pose reused across directions.' : ''} ${sequence.adaptation ?? ''}`
          : `Sheet grid is an inspection aid, not a validated runtime atlas. ${asset.framingBasis}`}
      </p>
      <details>
        <summary>Source occurrences & version choice</summary>
        <p>{asset.versionPolicy}</p>
        {asset.sources.map((source) => (
          <p key={source.archive + source.path} className="asset-source">
            <strong>{source.archive}</strong>
            <br />
            {source.path}
          </p>
        ))}
        <code>SHA-256: {asset.sha256}</code>
      </details>
      <details>
        <summary>Audit notes</summary>
        {asset.notes.map((note, index) => (
          <p key={index}>{note}</p>
        ))}
      </details>
    </article>
  );
}
