import type { AssetManifest } from '../../src/assets/definitions';
import type { SourceRect } from '../../src/assets/terrain';
import {
  terrainProfiles,
  terrainFrame,
  shoreFrame,
  clearingGrass,
  clearingGrassDetails,
  validateRect,
} from '../../src/assets/terrain';
import { sceneryDefinitions } from '../../src/assets/scenery';
import { heroAnimations } from '../../src/assets/hero-animations';
import { guiSprites, guiPanels, bitmapFonts } from '../../src/assets/gui';
import { atlasFrameId } from '../../src/assets/atlas';
export function collectRuntimeFrames(assets: AssetManifest['assets']): SourceRect[] {
  const frames = new Map<string, SourceRect>();
  function add(rect: SourceRect) {
    const source = assets.find((s) => s.id === rect.texture);
    if (!source || source.inspectionOnly) return;
    validateRect(rect, assets);
    frames.set(atlasFrameId(rect), rect);
  }
  // Only sources explicitly registered with a uniform frame size receive grid extraction.
  for (const source of assets)
    if (!source.inspectionOnly && source.frameWidth && source.frameHeight)
      for (let y = 0; y < source.height; y += source.frameHeight)
        for (let x = 0; x < source.width; x += source.frameWidth)
          add({ texture: source.id, x, y, width: source.frameWidth, height: source.frameHeight });
  for (const animation of heroAnimations)
    for (const frame of animation.frames)
      add({
        texture: animation.texture,
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height,
      });
  for (const profile of terrainProfiles)
    for (let mask = 0; mask < 256; mask++) {
      const frame = terrainFrame(profile, mask);
      if (frame) add(frame);
    }
  add(clearingGrass);
  for (const frame of clearingGrassDetails) add(frame);
  for (const mode of ['water-patch', 'land-cutout'] as const)
    for (let phase = 0; phase < 4; phase++)
      for (const x of [0, 1, 2] as const)
        for (const y of [0, 1, 2] as const) add(shoreFrame(x, y, phase, mode));
  for (const definition of sceneryDefinitions) for (const part of definition.parts) add(part.rect);
  for (const sprite of guiSprites) add(sprite.rect);
  for (const panel of guiPanels) for (const frame of panel.slices) add(frame);
  for (const font of bitmapFonts) for (const glyph of font.glyphs) add(glyph.rect);
  for (const source of assets)
    if (
      !source.inspectionOnly &&
      ![...frames.values()].some((frame) => frame.texture === source.id)
    )
      add({ texture: source.id, x: 0, y: 0, width: source.width, height: source.height });
  return [...frames.values()].sort((a, b) => atlasFrameId(a).localeCompare(atlasFrameId(b), 'en'));
}
