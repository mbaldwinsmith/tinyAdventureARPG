import { useEffect, useRef, useState } from 'react';
import type { AssetManifest } from '../assets/definitions';
import { sceneryDefinitions, SCENERY_LAYERS } from '../assets/scenery';
import type { SceneryLayer } from '../assets/scenery';

export function SceneryInspector({
  textureIds,
  textures,
}: {
  textureIds: string[];
  textures: AssetManifest['assets'];
}) {
  const choices = sceneryDefinitions.filter((d) =>
    d.parts.some((p) => textureIds.includes(p.rect.texture)),
  );
  const [selected, setSelected] = useState(choices[0]?.id ?? '');
  const definition = choices.find((d) => d.id === selected);
  const [layers, setLayers] = useState<readonly SceneryLayer[]>(SCENERY_LAYERS);
  const [anchors, setAnchors] = useState(true);
  const [images, setImages] = useState<ReadonlyMap<string, HTMLImageElement>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!definition) return;
    let disposed = false;
    const unique = [...new Set(definition.parts.map((p) => p.rect.texture))];
    void Promise.all(
      unique.map(async (id) => {
        const source = textures.find((t) => t.id === id);
        if (!source) throw new Error(`No source for ${id}`);
        const image = new Image();
        image.src = `/__catalogue/${source.canonicalId}.png`;
        await image.decode();
        return [id, image] as const;
      }),
    )
      .then((pairs) => {
        if (!disposed) {
          setImages(new Map(pairs));
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (!disposed)
          setError(cause instanceof Error ? cause.message : 'Scenery sources could not load.');
      });
    return () => {
      disposed = true;
    };
  }, [definition, textures]);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx || !definition) return;
    ctx.clearRect(0, 0, definition.width * 4, definition.height * 4);
    ctx.imageSmoothingEnabled = false;
    for (const piece of definition.parts) {
      const image = images.get(piece.rect.texture);
      if (!image || !layers.includes(piece.layer)) continue;
      const r = piece.rect;
      ctx.drawImage(
        image,
        r.x,
        r.y,
        r.width,
        r.height,
        piece.x * 4,
        piece.y * 4,
        r.width * 4,
        r.height * 4,
      );
    }
    if (anchors) {
      ctx.fillStyle = '#78ffd0';
      ctx.fillRect(definition.foot.x * 4 - 3, definition.foot.y * 4 - 3, 6, 6);
      for (const point of Object.values(definition.sockets ?? {})) {
        ctx.fillStyle = '#f7a5ff';
        ctx.fillRect(point.x * 4 - 2, point.y * 4 - 2, 4, 4);
      }
    }
  }, [definition, images, layers, anchors]);
  if (!definition) return null;
  return (
    <section className="asset-special-inspector" aria-label="Layered scenery composition">
      <h4>Layers & attachment points</h4>
      <label>
        Composition{' '}
        <select
          aria-label="Scenery composition"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {choices.map((d) => (
            <option key={d.id}>{d.id}</option>
          ))}
        </select>
      </label>
      <div className="inspector-toggles">
        {SCENERY_LAYERS.filter((layer) => definition.parts.some((p) => p.layer === layer)).map(
          (layer) => (
            <label key={layer}>
              <input
                type="checkbox"
                aria-label={`Show scenery ${layer}`}
                checked={layers.includes(layer)}
                onChange={(e) =>
                  setLayers((current) =>
                    e.target.checked ? [...current, layer] : current.filter((p) => p !== layer),
                  )
                }
              />
              {layer}
            </label>
          ),
        )}
        <label>
          <input
            type="checkbox"
            aria-label="Show scenery anchors"
            checked={anchors}
            onChange={(e) => setAnchors(e.target.checked)}
          />
          Feet & sockets
        </label>
      </div>
      <output data-testid="scenery-size">
        {definition.width}×{definition.height}px · foot {definition.foot.x},{definition.foot.y}
      </output>
      <div className="sprite-inspection-viewport">
        <canvas
          ref={canvas}
          width={definition.width * 4}
          height={definition.height * 4}
          aria-label="Assembled scenery"
        />
      </div>
      <p>{definition.note}</p>
      <ul>
        {definition.parts.map((piece) => (
          <li key={piece.id}>
            <code>{piece.id}</code> · {piece.layer} · {piece.rect.width}×{piece.rect.height} at{' '}
            {piece.x},{piece.y}
          </li>
        ))}
      </ul>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
