import type Phaser from 'phaser';
import { CLEARING } from '../content/clearing';
import {
  terrainProfiles,
  terrainFrame,
  terrainMaskAt,
  shoreFrame,
  clearingGrass,
  clearingGrassDetails,
} from '../assets/terrain';
import type { SourceRect } from '../assets/terrain';
import type { SceneryLayer } from '../assets/scenery';
import { sceneryById } from '../assets/scenery';

export const ACTOR_DEPTH_BASE = 100;
/** Phaser 4 Texture.add uses source pixel rectangles; no universal 16px spritesheet slicing. */
function frameName(scene: Phaser.Scene, rect: SourceRect): string {
  if (!scene.textures.exists(rect.texture))
    throw new Error(`Missing scenery texture: ${rect.texture}`);
  const texture = scene.textures.get(rect.texture),
    name = `rect-${rect.x}-${rect.y}-${rect.width}-${rect.height}`;
  if (!texture.has(name)) texture.add(name, 0, rect.x, rect.y, rect.width, rect.height);
  return name;
}
function image(scene: Phaser.Scene, x: number, y: number, rect: SourceRect, depth: number) {
  return scene.add.image(x, y, rect.texture, frameName(scene, rect)).setOrigin(0).setDepth(depth);
}
function compose(
  scene: Phaser.Scene,
  id: string,
  x: number,
  y: number,
  hiddenLayers: readonly SceneryLayer[] = [],
) {
  const definition = sceneryById(id);
  for (const [index, piece] of definition.parts.entries()) {
    if (hiddenLayers.includes(piece.layer)) continue;
    image(
      scene,
      x - definition.foot.x + piece.x,
      y - definition.foot.y + piece.y,
      piece.rect,
      ACTOR_DEPTH_BASE + y + index * 0.001,
    );
  }
}
/** Authored illustration only: no region generation, collision, traversal, banking or farming state. */
export function createClearingScenery(scene: Phaser.Scene) {
  const dirt = terrainProfiles.find((p) => p.id === 'new-grasslands-dirt');
  if (!dirt) throw new Error('The clearing dirt profile is missing.');
  for (let y = 0; y < 17; y++)
    for (let x = 0; x < 30; x++) image(scene, x * 16, y * 16, clearingGrass, 0);
  const path = (x: number, y: number) =>
    x >= 0 &&
    x < 30 &&
    y >= 0 &&
    y < 17 &&
    ((x >= 14 && x <= 15 && y >= 7) ||
      (x >= 10 && x <= 19 && y >= 8 && y <= 10) ||
      (x >= 7 && x <= 10 && y >= 7 && y <= 9) ||
      (x >= 14 && x <= 15 && y <= 8) ||
      (x >= 19 && x <= 21 && y >= 10 && y <= 11));
  for (let y = 0; y < 17; y++)
    for (let x = 0; x < 30; x++)
      if (path(x, y)) {
        const rect = terrainFrame(dirt, terrainMaskAt(path, x, y));
        if (rect) image(scene, x * 16, y * 16, rect, 1);
      }
  for (let i = 0; i < 34; i++) {
    const x = (i * 83 + 41) % 464,
      y = (i * 47 + 52) % 256;
    if (path(Math.floor(x / 16), Math.floor(y / 16))) continue;
    const rect = clearingGrassDetails[i % clearingGrassDetails.length];
    if (rect) image(scene, x, y, rect, 2);
  }
  const pond: { sprite: Phaser.GameObjects.Image; frames: string[] }[] = [];
  for (let y = 0; y < CLEARING.pond.rows; y++)
    for (let x = 0; x < CLEARING.pond.columns; x++) {
      const column = x === 0 ? 0 : x === CLEARING.pond.columns - 1 ? 2 : 1;
      const row = y === 0 ? 0 : y === CLEARING.pond.rows - 1 ? 2 : 1;
      const frames = [0, 1, 2, 3].map((phase) => frameName(scene, shoreFrame(column, row, phase)));
      const rect = shoreFrame(column, row, 0);
      pond.push({
        sprite: image(scene, (CLEARING.pond.x + x) * 16, (CLEARING.pond.y + y) * 16, rect, 3),
        frames,
      });
    }
  const ground = scene.add.graphics().setDepth(4);
  ground.fillStyle(0x294c3d, 0.15);
  for (const [x, y] of CLEARING.trees) ground.fillEllipse(x, y - 1, 32, 10);
  for (const [x, y] of CLEARING.trees) compose(scene, 'tree-original', x, y);
  compose(scene, 'house-plaster-1-green', 128, 112);
  compose(scene, 'bench', 174, 119);
  compose(scene, 'boat-1-2-right', 385, 208, ['rider']);
  for (const [x, y] of CLEARING.bushes)
    scene.add.image(x, y, 'bush').setDepth(ACTOR_DEPTH_BASE + y);
  for (const [x, y] of CLEARING.rocks) scene.add.image(x, y, 'rock').setDepth(ACTOR_DEPTH_BASE + y);
  for (let i = 0; i < 18; i++) {
    const x = 135 + ((i * 43) % 177),
      y = i % 2 ? 67 + ((i * 13) % 33) : 198 + ((i * 11) % 34);
    scene.add.image(x, y, i % 3 ? 'flower-blue' : 'flower-orange').setDepth(ACTOR_DEPTH_BASE + y);
  }
  scene.add
    .image(277, 151, 'sign')
    .setOrigin(0.5, 1)
    .setDepth(ACTOR_DEPTH_BASE + 151);
  scene.add
    .image(211, 155, 'chest', 0)
    .setOrigin(0.5, 1)
    .setDepth(ACTOR_DEPTH_BASE + 155);
  let elapsedMs = 0,
    phase = 0;
  return {
    advance(deltaMs: number) {
      elapsedMs = (elapsedMs + Math.min(Math.max(deltaMs, 0), 50)) % 720;
      const next = Math.floor(elapsedMs / 180);
      if (next === phase) return;
      phase = next;
      for (const tile of pond) {
        const frame = tile.frames[phase];
        if (frame) tile.sprite.setFrame(frame);
      }
    },
  };
}
