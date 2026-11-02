import { manifestSchema } from '../assets/definitions';
import type { AssetManifest } from '../assets/definitions';
let manifestPromise: Promise<AssetManifest> | null = null;
const images = new Map<string, Promise<HTMLImageElement>>();
/** Immutable build metadata is shared by Phaser and React, never authoritative game state. */
export function loadAssetManifest(): Promise<AssetManifest> {
  if (!manifestPromise)
    manifestPromise = fetch(`${import.meta.env.BASE_URL}generated/manifest.json`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            `Asset manifest could not load (${response.status}). Run npm run assets:build.`,
          );
        return manifestSchema.parse(await response.json());
      })
      .catch((error: unknown) => {
        manifestPromise = null;
        throw error;
      });
  return manifestPromise;
}
export function loadAtlasImage(file: string): Promise<HTMLImageElement> {
  let promise = images.get(file);
  if (!promise) {
    promise = (async () => {
      const image = new Image();
      image.src = `${import.meta.env.BASE_URL}generated/${file}`;
      await image.decode();
      return image;
    })().catch((error: unknown) => {
      images.delete(file);
      throw error;
    });
    images.set(file, promise);
  }
  return promise;
}
