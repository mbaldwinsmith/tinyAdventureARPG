import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PNG } from 'pngjs';
import { buildAtlases } from './lib/atlas-builder';
import { sha256 } from './lib/archive';
import { manifestSchema } from '../src/assets/definitions';
import { atlasFrameId, createAtlasLookup } from '../src/assets/atlas';
import { collectRuntimeFrames } from './lib/runtime-frames';
import { bitmapFonts, guiPanels, layoutBitmapText, promptFor } from '../src/assets/gui';
import {
  bombExplosion,
  effectDurationMs,
  effectFrameAt,
  deathPreviewAlpha,
} from '../src/assets/effects';

const manifest = manifestSchema.parse(
  JSON.parse(readFileSync('public/generated/manifest.json', 'utf8')),
);
const pixel = (png: PNG, x: number, y: number) =>
  png.data.subarray((y * png.width + x) * 4, (y * png.width + x + 1) * 4);

describe('pixel-safe atlas contract', () => {
  it('copies exact RGBA pixels, including transparent colour, deterministically regardless of input order', () => {
    const image = new PNG({ width: 3, height: 2 });
    image.data.set([
      255, 0, 0, 255, 0, 255, 0, 128, 17, 23, 31, 0, 0, 0, 255, 255, 12, 34, 56, 255, 78, 90, 12,
      255,
    ]);
    const inputs = [
      { texture: 'source', x: 0, y: 0, width: 2, height: 2 },
      { texture: 'source', x: 2, y: 0, width: 1, height: 2 },
    ];
    const sources = new Map([['source', image]]);
    const first = buildAtlases(inputs, sources),
      second = buildAtlases([...inputs].reverse(), sources);
    expect(first).toEqual(second);
    for (const page of first.pages) {
      const packed = PNG.sync.read(page.image);
      for (const frame of first.frames.filter((f) => f.page === page.record.id))
        for (let y = -2; y < frame.height + 2; y++)
          for (let x = -2; x < frame.width + 2; x++)
            expect(pixel(packed, frame.x + x, frame.y + y)).toEqual(
              pixel(
                image,
                frame.source.x + Math.max(0, Math.min(frame.width - 1, x)),
                Math.max(0, Math.min(frame.height - 1, y)),
              ),
            );
    }
    expect(() =>
      buildAtlases(
        [inputs[0], inputs[0]].filter((v) => v !== undefined),
        sources,
      ),
    ).toThrow('Duplicate');
    expect(() =>
      buildAtlases([{ texture: 'source', x: 0, y: 0, width: 2045, height: 1 }], sources),
    ).toThrow('budget');
  });

  it('verifies every emitted crop and padding pixel with no overlapping padded regions or inspection art', () => {
    const lookup = createAtlasLookup(manifest);
    expect(
      collectRuntimeFrames(manifest.assets)
        .map((r) => lookup(r).id)
        .sort(),
    ).toEqual(manifest.frames.map((f) => f.id).sort());
    for (const page of manifest.pages) {
      const packed = PNG.sync.read(readFileSync(`public/generated/${page.image}`));
      const occupied = new Uint8Array(packed.width * packed.height);
      for (const frame of manifest.frames.filter((f) => f.page === page.id)) {
        const crop = Buffer.alloc(frame.width * frame.height * 4);
        for (let y = 0; y < frame.height; y++)
          packed.data.copy(
            crop,
            y * frame.width * 4,
            ((frame.y + y) * packed.width + frame.x) * 4,
            ((frame.y + y) * packed.width + frame.x + frame.width) * 4,
          );
        expect(sha256(crop), frame.id).toBe(frame.pixelHash);
        for (let y = -2; y < frame.height + 2; y++) {
          const start = (frame.y + y) * packed.width + frame.x - 2;
          if (occupied.subarray(start, start + frame.width + 4).some((v) => v !== 0))
            throw new Error(`Padded overlap: ${frame.id}`);
          occupied.fill(1, start, start + frame.width + 4);
          for (let x = -2; x < frame.width + 2; x++) {
            if (x >= 0 && x < frame.width && y >= 0 && y < frame.height) continue;
            if (
              !pixel(packed, frame.x + x, frame.y + y).equals(
                pixel(
                  packed,
                  frame.x + Math.max(0, Math.min(frame.width - 1, x)),
                  frame.y + Math.max(0, Math.min(frame.height - 1, y)),
                ),
              )
            )
              throw new Error(`Extrusion mismatch: ${frame.id}`);
          }
        }
      }
    }
    const frame = manifest.frames[0];
    if (!frame) throw new Error('Missing frame fixture');
    expect(() => createAtlasLookup({ ...manifest, frames: [frame, frame] })).toThrow('Duplicate');
    expect(() =>
      createAtlasLookup({
        ...manifest,
        assets: manifest.assets.map((a) =>
          a.id === frame.source.texture ? { ...a, inspectionOnly: true } : a,
        ),
      }),
    ).toThrow('reference');
    expect(() => lookup({ ...frame.source, x: 99999 })).toThrow('Missing packed frame');
    expect(frame.id).toBe(atlasFrameId(frame.source));
  });
});

describe('GUI and authored effect contracts', () => {
  it('partitions panels without gaps and keeps physical controller labels distinct from keyboard bindings', () => {
    for (const panel of guiPanels) {
      const coverage = new Uint8Array(panel.rect.width * panel.rect.height);
      for (const r of panel.slices)
        for (let y = r.y; y < r.y + r.height; y++)
          for (let x = r.x; x < r.x + r.width; x++) {
            const i = y * panel.rect.width + x;
            coverage[i] = (coverage[i] ?? 0) + 1;
          }
      expect(coverage.every((n) => n === 1)).toBe(true);
    }
    expect(promptFor('xbox', 'south')?.label).toBe('A');
    expect(promptFor('switch', 'south')?.label).toBe('B');
    expect(promptFor('playstation', 'south')?.label).toBe('Cross');
    expect(promptFor('keyboard-light', 'Enter')?.rect.height).toBe(32);
    expect(promptFor('xbox', 'moveUp')).toBeUndefined();
  });
  it('lays out spacing and line breaks, substitutes unsupported glyphs and bounds long samples', () => {
    for (const font of bitmapFonts) {
      const layout = layoutBitmapText(font, 'A A\n🦊');
      const first = layout.glyphs[0],
        second = layout.glyphs[1],
        fallback = layout.glyphs[2];
      if (!first || !second || !fallback) throw new Error('Missing layout fixture');
      expect(second.x - first.x).toBe(first.glyph.advance + font.spaceAdvance);
      expect(fallback.glyph.char).toBe('?');
      expect(fallback.y).toBe(font.lineHeight + fallback.glyph.offsetY);
      expect(layout.unsupported).toEqual(['🦊']);
      expect(layout.height).toBe(font.lineHeight * 2);
      expect(() => layoutBitmapText(font, 'a'.repeat(513))).toThrow('budget');
    }
  });
  it('ends explosions without looping and keeps death fade and effect cells bounded', () => {
    const duration = effectDurationMs(bombExplosion);
    expect(effectFrameAt(bombExplosion, -1)).toBeUndefined();
    expect(effectFrameAt(bombExplosion, NaN)).toBeUndefined();
    expect(effectFrameAt(bombExplosion, 0)).toBe(bombExplosion.frames[0]);
    expect(effectFrameAt(bombExplosion, 80)).toBe(bombExplosion.frames[1]);
    expect(effectFrameAt(bombExplosion, duration - 1)).toBe(bombExplosion.frames.at(-1));
    expect(effectFrameAt(bombExplosion, duration)).toBeUndefined();
    expect(effectFrameAt(bombExplosion, duration + 1000)).toBeUndefined();
    expect([0, 200, 380, 560, 10000].map(deathPreviewAlpha)).toEqual([1, 1, 0.5, 0, 0]);
    for (const frame of bombExplosion.frames)
      for (const cell of frame.cells) {
        expect(cell.x + cell.width).toBeLessThanOrEqual(bombExplosion.width);
        expect(cell.y + cell.height).toBeLessThanOrEqual(bombExplosion.height);
      }
  });
});
