import { useEffect, useRef, useState } from 'react';
import {
  terrainProfiles,
  terrainFrame,
  terrainMaskAt,
  normalizeTerrainMask,
  shoreFrame,
} from '../assets/terrain';

const NEIGHBOURS = [
  ['N', 1],
  ['E', 2],
  ['S', 4],
  ['W', 8],
  ['NE', 16],
  ['SE', 32],
  ['SW', 64],
  ['NW', 128],
] as const;
export function TerrainInspector({
  textureIds,
  image,
}: {
  textureIds: string[];
  image: HTMLImageElement | null;
}) {
  const profiles = terrainProfiles.filter((p) => textureIds.includes(p.texture));
  const [profileId, setProfileId] = useState(profiles[0]?.id ?? '');
  const profile = profiles.find((p) => p.id === profileId);
  const [mask, setMask] = useState(255);
  const [shape, setShape] = useState('notch');
  const tile = useRef<HTMLCanvasElement>(null),
    patch = useRef<HTMLCanvasElement>(null);
  const frame = profile ? terrainFrame(profile, mask) : null;
  const canonical = normalizeTerrainMask(mask);
  const [phase, setPhase] = useState(0),
    [playing, setPlaying] = useState(false),
    [mode, setMode] = useState<'water-patch' | 'land-cutout'>('water-patch');
  const shore = textureIds.includes('terrain-shore-updated');
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPhase((p) => (p + 1) % 4), 180);
    return () => window.clearTimeout(timer);
  }, [phase, playing]);
  useEffect(() => {
    const ctx = tile.current?.getContext('2d');
    if (!ctx || !image) return;
    ctx.clearRect(0, 0, 96, 96);
    ctx.imageSmoothingEnabled = false;
    if (frame) ctx.drawImage(image, frame.x, frame.y, 16, 16, 0, 0, 96, 96);
  }, [image, frame]);
  useEffect(() => {
    const ctx = patch.current?.getContext('2d');
    if (!ctx || !image) return;
    ctx.clearRect(0, 0, 432, 336);
    ctx.imageSmoothingEnabled = false;
    if (shore) {
      for (const x of [0, 1, 2] as const)
        for (const y of [0, 1, 2] as const) {
          const r = shoreFrame(x, y, phase, mode);
          ctx.drawImage(image, r.x, r.y, 16, 16, x * 48, y * 48, 48, 48);
        }
      return;
    }
    if (!profile) return;
    const filled = (x: number, y: number) =>
      x >= 0 &&
      x < 9 &&
      y >= 0 &&
      y < 7 &&
      (shape === 'rectangle'
        ? x >= 1 && x <= 7 && y >= 1 && y <= 5
        : shape === 'cross'
          ? x === 4 || y === 3
          : x >= 1 && x <= 7 && y >= 1 && y <= 5 && !(x >= 4 && y <= 2));
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 9; x++)
        if (filled(x, y)) {
          const r = terrainFrame(profile, terrainMaskAt(filled, x, y));
          if (r) ctx.drawImage(image, r.x, r.y, 16, 16, x * 48, y * 48, 48, 48);
          else {
            ctx.fillStyle = '#d26cbd';
            ctx.fillRect(x * 48, y * 48, 48, 48);
            ctx.fillStyle = '#261c39';
            ctx.fillText('?', x * 48 + 19, y * 48 + 27);
          }
        }
  }, [image, profile, shape, shore, phase, mode]);
  if (!profiles.length && !shore) return null;
  return (
    <section className="asset-special-inspector" aria-label="Terrain composition">
      <h4>{shore ? 'Updated animated shoreline' : 'Terrain adjacency & corners'}</h4>
      {shore ? (
        <>
          <label>
            Shore mode{' '}
            <select
              aria-label="Shore mode"
              value={mode}
              onChange={(e) =>
                setMode(e.target.value === 'land-cutout' ? 'land-cutout' : 'water-patch')
              }
            >
              <option value="water-patch">Water patch</option>
              <option value="land-cutout">Land cutout</option>
            </select>
          </label>
          <label>
            Phase{' '}
            <input
              aria-label="Shore phase"
              type="range"
              min={0}
              max={3}
              value={phase}
              onChange={(e) => {
                setPhase(Number(e.target.value));
                setPlaying(false);
              }}
            />
          </label>
          <button className="button button-subtle" onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Stop shoreline' : 'Play shoreline'}
          </button>
          <output data-testid="shore-phase">Phase {phase + 1} / 4</output>
          <p>
            Four inspected 3×3 patches in the updated 192×96 source. The 192×80 legacy strip remains
            a catalogue alternative.
          </p>
        </>
      ) : (
        <>
          <label>
            Terrain profile{' '}
            <select
              aria-label="Terrain profile"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>Connected neighbours</legend>
            {NEIGHBOURS.map(([name, bit]) => (
              <label key={name}>
                <input
                  aria-label={`Neighbour ${name}`}
                  type="checkbox"
                  checked={(mask & bit) !== 0}
                  onChange={(e) => setMask((m) => (e.target.checked ? m | bit : m & ~bit))}
                />
                {name}{' '}
              </label>
            ))}
          </fieldset>
          <output data-testid="terrain-mask">
            Canonical mask {canonical} ·{' '}
            {frame ? `${frame.x},${frame.y}` : 'unsupported by Old Style'}
          </output>
          <div className="sprite-inspection-viewport">
            <canvas ref={tile} width={96} height={96} aria-label="Selected terrain tile" />
          </div>
          <p>
            {profile?.style === 'old-patch'
              ? 'Old Style supplies border patches and isolated/concave pieces. Thin ends and crosses are unsupported; magenta ? cells mark the missing art instead of borrowing New Style.'
              : 'New Style supplies all 47 normalized masks, including thin paths and inward corners.'}
          </p>
          <label>
            Test shape{' '}
            <select
              aria-label="Terrain test shape"
              value={shape}
              onChange={(e) => setShape(e.target.value)}
            >
              <option value="rectangle">Rectangle</option>
              <option value="notch">Notched region</option>
              <option value="cross">Thin cross</option>
            </select>
          </label>
        </>
      )}
      <div
        className="sprite-inspection-viewport"
        style={{ backgroundColor: profile?.background ?? '#78ad47' }}
      >
        <canvas
          ref={patch}
          width={shore ? 144 : 432}
          height={shore ? 144 : 336}
          aria-label="Assembled terrain patch"
        />
      </div>
    </section>
  );
}
