import type { AssetManifest } from './definitions';
import type { SourceRect } from './terrain';
export function atlasFrameId(rect: SourceRect): string {
  return `${rect.texture}-${rect.x}-${rect.y}-${rect.width}-${rect.height}`;
}
export type PackedFrame = AssetManifest['frames'][number];
export type AtlasLookup = (rect: SourceRect) => PackedFrame;
export function createAtlasLookup(manifest: AssetManifest): AtlasLookup {
  const frames = new Map<string, PackedFrame>();
  for (const frame of manifest.frames) {
    if (frames.has(frame.id) || frame.id !== atlasFrameId(frame.source))
      throw new Error(`Duplicate or invalid packed frame ID: ${frame.id}`);
    const page = manifest.pages.find((p) => p.id === frame.page),
      source = manifest.assets.find((s) => s.id === frame.source.texture);
    if (
      !page ||
      !source ||
      source.inspectionOnly ||
      frame.x < 2 ||
      frame.y < 2 ||
      frame.x + frame.width + 2 > page.width ||
      frame.y + frame.height + 2 > page.height ||
      frame.source.x + frame.source.width > source.width ||
      frame.source.y + frame.source.height > source.height ||
      frame.width !== frame.source.width ||
      frame.height !== frame.source.height
    )
      throw new Error(`Packed frame reference or padding invalid: ${frame.id}`);
    frames.set(frame.id, frame);
  }
  return (rect) => {
    const frame = frames.get(atlasFrameId(rect));
    if (!frame) throw new Error(`Missing packed frame: ${atlasFrameId(rect)}`);
    return frame;
  };
}

export function sourceFrameRect(manifest: AssetManifest, id: string, index = 0): SourceRect {
  const source = manifest.assets.find((a) => a.id === id);
  if (!source || source.inspectionOnly || !Number.isInteger(index) || index < 0)
    throw new Error(`Missing runtime source: ${id}`);
  if (!source.frameWidth || !source.frameHeight) {
    if (index !== 0) throw new Error(`Unframed source index: ${id}`);
    return { texture: id, x: 0, y: 0, width: source.width, height: source.height };
  }
  const columns = source.width / source.frameWidth;
  const frame = {
    texture: id,
    x: (index % columns) * source.frameWidth,
    y: Math.floor(index / columns) * source.frameHeight,
    width: source.frameWidth,
    height: source.frameHeight,
  };
  if (frame.y + frame.height > source.height) throw new Error(`Source index outside bounds: ${id}`);
  return frame;
}
