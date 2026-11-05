import type Phaser from 'phaser';
import type { AssetManifest } from '../assets/definitions';
import { createAtlasLookup } from '../assets/atlas';
import { farmCropFrame, farmSoil, farmSprout } from '../assets/farm';
import { CROPS, FARM_BARREL, FARM_PLOTS } from '../content/farm';
import type { GameSession } from '../core/session';

export function createFarmView(
  scene: Phaser.Scene,
  manifest: AssetManifest,
  session: GameSession,
  depth: number,
) {
  const lookup = createAtlasLookup(manifest);
  const dry = lookup(farmSoil.dry);
  const wet = lookup(farmSoil.wet);
  const marker = scene.add.graphics().setDepth(depth).lineStyle(1, 0xb7c975, 0.85);
  const plots = FARM_PLOTS.map(({ id, position: { x, y } }) => {
    marker.strokeRect(x - 7, y - 14, 14, 14);
    const soil = scene.add
      .image(x, y, dry.page, dry.id)
      .setOrigin(0.5, 1)
      .setDepth(depth + 1);
    const plant = scene.add
      .image(x, y, dry.page, dry.id)
      .setOrigin(0.5, 1)
      .setDepth(depth + 2);
    return { id, soil, plant };
  });
  const { x, y } = FARM_BARREL.position;
  scene.add
    .graphics()
    .setDepth(depth + 2)
    .fillStyle(0x5a3b33)
    .fillRoundedRect(x - 6, y - 12, 12, 12, 2)
    .fillStyle(0xb28b61)
    .fillRect(x - 5, y - 8, 10, 2)
    .fillRect(x - 5, y - 4, 10, 2)
    .fillStyle(0x4aa2ab)
    .fillEllipse(x, y - 11, 10, 4);
  return () => {
    const farm = session.snapshot.farm;
    for (const { id, soil, plant } of plots) {
      const plot = farm?.plots.find((entry) => entry.id === id);
      const texture = plot?.wet ? wet : dry;
      soil.setVisible(!!plot?.prepared).setTexture(texture.page, texture.id);
      const crop = plot?.crop;
      plant.setVisible(!!crop);
      if (crop) {
        const frame = lookup(
          crop.growth === 0 ? farmSprout : farmCropFrame(CROPS[crop.id].artRow, crop.ready),
        );
        plant.setTexture(frame.page, frame.id).setTint(crop.withered ? 0x9c7845 : 0xffffff);
      }
    }
  };
}
