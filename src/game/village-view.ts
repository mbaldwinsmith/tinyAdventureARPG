import type Phaser from 'phaser';
import type { AssetManifest } from '../assets/definitions';
import { createAtlasLookup } from '../assets/atlas';
import { MERCHANT } from '../content/village';
import type { GameSession } from '../core/session';

export function createVillageActorView(
  scene: Phaser.Scene,
  manifest: AssetManifest,
  session: GameSession,
) {
  const frame = createAtlasLookup(manifest)({
    texture: MERCHANT.texture,
    x: 0,
    y: 0,
    width: 16,
    height: 16,
  });
  const sprite = scene.add.image(0, 0, frame.page, frame.id).setOrigin(0.5, 0.875);
  const label = scene.add
    .text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#fff3c6',
      backgroundColor: '#305a3d',
      padding: { x: 2, y: 2 },
    })
    .setOrigin(0.5, 1)
    .setDepth(4000);
  return () => {
    const actor = session.villageNpc;
    sprite.setVisible(!!actor);
    label.setVisible(!!actor);
    if (!actor) return;
    const { x, y } = actor.position;
    sprite.setPosition(x, y).setDepth(100 + y);
    label.setPosition(x, y - 15).setText(`${MERCHANT.name} ${actor.emote}`);
  };
}
