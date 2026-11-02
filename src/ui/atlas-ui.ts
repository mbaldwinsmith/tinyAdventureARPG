import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { AssetManifest } from '../assets/definitions';
import type { SourceRect } from '../assets/terrain';
import { atlasFrameId } from '../assets/atlas';
import { guiPanels } from '../assets/gui';
import { loadAssetManifest, loadAtlasImage } from '../platform/asset-loader';
export function useAssetManifest() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  useEffect(() => {
    let disposed = false;
    void loadAssetManifest()
      .then((value) => {
        if (!disposed) setManifest(value);
      })
      .catch(() => {
        /* The game owns the visible loading error; decorative UI keeps its text fallback. */
      });
    return () => {
      disposed = true;
    };
  }, []);
  return manifest;
}
export function packedSpriteStyle(
  manifest: AssetManifest | null,
  rect: SourceRect,
  scale = 1,
): CSSProperties | undefined {
  const frame = manifest?.frames.find((f) => f.id === atlasFrameId(rect)),
    page = manifest?.pages.find((p) => p.id === frame?.page);
  if (!frame || !page) return undefined;
  return {
    width: rect.width * scale,
    height: rect.height * scale,
    backgroundImage: `url(${import.meta.env.BASE_URL}generated/${page.image})`,
    backgroundPosition: `${-frame.x * scale}px ${-frame.y * scale}px`,
    backgroundSize: `${page.width * scale}px ${page.height * scale}px`,
    imageRendering: 'pixelated',
  };
}
export function usePanelSkin(
  manifest: AssetManifest | null,
  id: string,
): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties>();
  useEffect(() => {
    const panel = guiPanels.find((p) => p.id === id),
      frame = manifest?.frames.find(
        (f) =>
          f.id === atlasFrameId(panel?.rect ?? { texture: '', x: 0, y: 0, width: 1, height: 1 }),
      ),
      page = manifest?.pages.find((p) => p.id === frame?.page);
    if (!panel || !frame || !page) return;
    let disposed = false;
    void loadAtlasImage(page.image)
      .then((image) => {
        const canvas = document.createElement('canvas');
        canvas.width = frame.width;
        canvas.height = frame.height;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.imageSmoothingEnabled = false;
        context.drawImage(
          image,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          0,
          0,
          frame.width,
          frame.height,
        );
        if (!disposed)
          setStyle({
            borderImageSource: `url(${canvas.toDataURL()})`,
            borderImageSlice: `${panel.borderPixels} fill`,
            borderImageWidth: `${panel.borderPixels * 2}px`,
            borderImageRepeat: 'stretch',
            borderWidth: panel.borderPixels * 2,
            borderStyle: 'solid',
            borderRadius: 0,
            backgroundColor: '#2f5753',
          });
      })
      .catch(() => {
        /* Keep the readable native panel if decorative artwork cannot decode. */
      });
    return () => {
      disposed = true;
    };
  }, [manifest, id]);
  return style;
}
