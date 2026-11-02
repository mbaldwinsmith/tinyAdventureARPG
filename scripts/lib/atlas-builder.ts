import { PNG } from 'pngjs';
import type { SourceRect } from '../../src/assets/terrain';
import type { AssetManifest } from '../../src/assets/definitions';
import { atlasFrameId } from '../../src/assets/atlas';
import { sha256 } from './archive';
export const ATLAS_PADDING = 2,
  ATLAS_MAX_SIDE = 2048,
  ATLAS_MAX_PAGES = 8;
export interface AtlasBuild {
  pages: { record: AssetManifest['pages'][number]; image: Buffer; data: string }[];
  frames: AssetManifest['frames'];
}
interface Shelf {
  x: number;
  y: number;
  height: number;
}
interface Placement {
  source: SourceRect;
  x: number;
  y: number;
}
interface Page {
  shelves: Shelf[];
  placements: Placement[];
  height: number;
  width: number;
}
function pow2(n: number) {
  let result = 64;
  while (result < n) result *= 2;
  return result;
}
export function buildAtlases(
  rectangles: readonly SourceRect[],
  sources: ReadonlyMap<string, PNG>,
): AtlasBuild {
  const pages: Page[] = [],
    ids = new Set<string>();
  const ordered = [...rectangles].sort(
    (a, b) =>
      b.height - a.height ||
      b.width - a.width ||
      atlasFrameId(a).localeCompare(atlasFrameId(b), 'en'),
  );
  for (const source of ordered) {
    const id = atlasFrameId(source);
    if (ids.has(id)) throw new Error(`Duplicate atlas input: ${id}`);
    ids.add(id);
    const width = source.width + 4,
      height = source.height + 4;
    if (width > ATLAS_MAX_SIDE || height > ATLAS_MAX_SIDE || width <= 4 || height <= 4)
      throw new Error(`Atlas input exceeds page budget: ${id}`);
    let placed = false;
    for (let i = 0; i <= pages.length; i++) {
      let page = pages[i];
      if (!page) {
        if (pages.length >= ATLAS_MAX_PAGES) throw new Error('Atlas page budget exceeded');
        page = { shelves: [], placements: [], height: 0, width: 0 };
        pages.push(page);
      }
      let shelf = page.shelves.find((s) => s.height >= height && s.x + width <= ATLAS_MAX_SIDE);
      if (!shelf && page.height + height <= ATLAS_MAX_SIDE) {
        shelf = { x: 0, y: page.height, height };
        page.shelves.push(shelf);
        page.height += height;
      }
      if (!shelf) continue;
      page.placements.push({ source, x: shelf.x + 2, y: shelf.y + 2 });
      shelf.x += width;
      page.width = Math.max(page.width, shelf.x);
      placed = true;
      break;
    }
    if (!placed) throw new Error(`Could not pack ${id}`);
  }
  const output: AtlasBuild = { pages: [], frames: [] };
  for (const [pageIndex, page] of pages.entries()) {
    const id = `atlas-${pageIndex}`,
      width = pow2(page.width),
      height = pow2(page.height),
      image = new PNG({ width, height, fill: true });
    const jsonFrames: Record<string, unknown> = {};
    for (const placement of page.placements) {
      const { source, x, y } = placement,
        src = sources.get(source.texture);
      if (
        !src ||
        source.x < 0 ||
        source.y < 0 ||
        source.x + source.width > src.width ||
        source.y + source.height > src.height
      )
        throw new Error(`Atlas source missing or out of bounds: ${source.texture}`);
      const pixels = Buffer.alloc(source.width * source.height * 4);
      for (let row = 0; row < source.height; row++)
        src.data.copy(
          pixels,
          row * source.width * 4,
          ((source.y + row) * src.width + source.x) * 4,
          ((source.y + row) * src.width + source.x + source.width) * 4,
        );
      for (let dy = -2; dy < source.height + 2; dy++)
        for (let dx = -2; dx < source.width + 2; dx++) {
          const sx = source.x + Math.max(0, Math.min(source.width - 1, dx)),
            sy = source.y + Math.max(0, Math.min(source.height - 1, dy));
          const input = (sy * src.width + sx) * 4,
            target = ((y + dy) * width + x + dx) * 4;
          src.data.copy(image.data, target, input, input + 4);
        }
      const frameId = atlasFrameId(source);
      output.frames.push({
        id: frameId,
        page: id,
        source,
        x,
        y,
        width: source.width,
        height: source.height,
        pixelHash: sha256(pixels),
      });
      jsonFrames[frameId] = {
        frame: { x, y, w: source.width, h: source.height },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: source.width, h: source.height },
        sourceSize: { w: source.width, h: source.height },
      };
    }
    const encoded = PNG.sync.write(image, { colorType: 6, filterType: 4, deflateLevel: 9 });
    const data =
      JSON.stringify(
        {
          frames: jsonFrames,
          meta: { image: `${id}.png`, size: { w: width, h: height }, scale: '1' },
        },
        null,
        2,
      ) + '\n';
    output.pages.push({
      record: {
        id,
        image: `${id}.png`,
        data: `${id}.json`,
        width,
        height,
        imageSha256: sha256(encoded),
        dataSha256: sha256(Buffer.from(data)),
      },
      image: encoded,
      data,
    });
  }
  output.frames.sort((a, b) => a.id.localeCompare(b.id, 'en'));
  return output;
}
