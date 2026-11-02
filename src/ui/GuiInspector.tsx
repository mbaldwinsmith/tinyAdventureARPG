import { useEffect, useRef, useState } from 'react';
import { guiSprites, guiPanels, bitmapFonts, layoutBitmapText } from '../assets/gui';
export function GuiInspector({
  textureIds,
  image,
}: {
  textureIds: string[];
  image: HTMLImageElement | null;
}) {
  const choices = guiSprites.filter((s) => textureIds.includes(s.rect.texture)),
    font = bitmapFonts.find((f) => textureIds.includes(f.texture)),
    panel = guiPanels.find((p) => textureIds.includes(p.rect.texture));
  const [selected, setSelected] = useState(choices[0]?.id ?? ''),
    [text, setText] = useState('Tiny Adventure\nReady?'),
    [width, setWidth] = useState(240),
    [height, setHeight] = useState(128);
  const sprite = choices.find((s) => s.id === selected),
    layout = font ? layoutBitmapText(font, text) : null;
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawWidth = font
    ? (layout?.width ?? 1) * 3
    : panel
      ? width
      : (sprite?.rect.width ?? 16) * 3;
  const drawHeight = font
    ? (layout?.height ?? 1) * 3
    : panel
      ? height
      : (sprite?.rect.height ?? 16) * 3;
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx || !image) return;
    ctx.clearRect(0, 0, drawWidth, drawHeight);
    ctx.imageSmoothingEnabled = false;
    if (font && layout) {
      for (const item of layout.glyphs) {
        const r = item.glyph.rect;
        ctx.drawImage(
          image,
          r.x,
          r.y,
          r.width,
          r.height,
          item.x * 3,
          item.y * 3,
          r.width * 3,
          r.height * 3,
        );
      }
    } else if (panel) {
      const b = panel.borderPixels,
        positionsX = [0, b * 2, width - b * 2],
        positionsY = [0, b * 2, height - b * 2],
        widths = [b * 2, width - b * 4, b * 2],
        heights = [b * 2, height - b * 4, b * 2];
      for (const [index, r] of panel.slices.entries()) {
        const x = index % 3,
          y = Math.floor(index / 3);
        ctx.drawImage(
          image,
          r.x,
          r.y,
          r.width,
          r.height,
          positionsX[x] ?? 0,
          positionsY[y] ?? 0,
          widths[x] ?? 0,
          heights[y] ?? 0,
        );
      }
    } else if (sprite) {
      const r = sprite.rect;
      ctx.drawImage(image, r.x, r.y, r.width, r.height, 0, 0, drawWidth, drawHeight);
    }
  }, [image, font, layout, panel, sprite, width, height, drawWidth, drawHeight]);
  if (!choices.length && !font) return null;
  return (
    <section className="asset-special-inspector" aria-label="GUI asset preview">
      <h4>
        {font ? 'Bitmap font mapping' : panel ? 'Nine-slice panel' : 'GUI icons & device prompts'}
      </h4>
      {font ? (
        <>
          <label>
            Sample text{' '}
            <textarea
              aria-label="Bitmap sample text"
              maxLength={80}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <p data-testid="glyph-support">
            {layout?.unsupported.length
              ? `Unsupported characters use ?: ${layout.unsupported.join(' ')}`
              : 'All characters mapped'}
          </p>
          <p>
            {font.glyphs.length} supplied glyphs · line height {font.lineHeight}px · DOM text
            remains the accessible UI default.
          </p>
        </>
      ) : panel ? (
        <>
          <label>
            Width{' '}
            <input
              aria-label="Panel sample width"
              type="range"
              min={64}
              max={512}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>
          <label>
            Height{' '}
            <input
              aria-label="Panel sample height"
              type="range"
              min={32}
              max={256}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>
          <p data-testid="panel-size">
            {width}×{height}px · {panel.borderPixels}px source border at 2×
          </p>
        </>
      ) : (
        <>
          <label>
            GUI frame{' '}
            <select
              aria-label="GUI frame"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {choices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}
                </option>
              ))}
            </select>
          </label>
          <p>{sprite?.label}</p>
        </>
      )}
      <div className="sprite-inspection-viewport">
        <canvas
          ref={canvas}
          width={drawWidth}
          height={drawHeight}
          aria-label="Rendered GUI sample"
        />
      </div>
    </section>
  );
}
