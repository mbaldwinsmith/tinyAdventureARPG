import type Phaser from 'phaser';
import { CLEARING, clearingPathAt } from '../content/clearing';
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
import { createAtlasLookup, sourceFrameRect } from '../assets/atlas';
import type { AssetManifest } from '../assets/definitions';
import { sceneryById } from '../assets/scenery';

export const ACTOR_DEPTH_BASE = 100;
/** Authored illustration only: no region generation, collision, traversal, banking or farming state. */
export function createClearingScenery(scene: Phaser.Scene, manifest: AssetManifest) {
  const lookup = createAtlasLookup(manifest);
  function image(x: number, y: number, rect: SourceRect, depth: number) {
    const frame = lookup(rect);
    return scene.add.image(x, y, frame.page, frame.id).setOrigin(0).setDepth(depth);
  }
  function prop(x: number, y: number, id: string, depth: number, index = 0) {
    const frame = lookup(sourceFrameRect(manifest, id, index));
    return scene.add.image(x, y, frame.page, frame.id).setDepth(depth);
  }
  function compose(id: string, x: number, y: number, hiddenLayers: readonly SceneryLayer[] = []) {
    const definition = sceneryById(id);
    for (const [index, piece] of definition.parts.entries())
      if (!hiddenLayers.includes(piece.layer))
        image(
          x - definition.foot.x + piece.x,
          y - definition.foot.y + piece.y,
          piece.rect,
          ACTOR_DEPTH_BASE + y + index * 0.001,
        );
  }
  const dirt = terrainProfiles.find((p) => p.id === 'new-grasslands-dirt');
  if (!dirt) throw new Error('The clearing dirt profile is missing.');
  for (let y = 0; y < 17; y++) for (let x = 0; x < 30; x++) image(x * 16, y * 16, clearingGrass, 0);
  const path = clearingPathAt;
  for (let y = 0; y < 17; y++)
    for (let x = 0; x < 30; x++)
      if (path(x, y)) {
        const rect = terrainFrame(dirt, terrainMaskAt(path, x, y));
        if (rect) image(x * 16, y * 16, rect, 1);
      }
  for (let i = 0; i < 34; i++) {
    const x = (i * 83 + 41) % 464,
      y = (i * 47 + 52) % 256;
    if (path(Math.floor(x / 16), Math.floor(y / 16))) continue;
    const rect = clearingGrassDetails[i % clearingGrassDetails.length];
    if (rect) image(x, y, rect, 2);
  }
  const pond: { sprite: Phaser.GameObjects.Image; frames: ReturnType<typeof lookup>[] }[] = [];
  for (let y = 0; y < CLEARING.pond.rows; y++)
    for (let x = 0; x < CLEARING.pond.columns; x++) {
      const column = x === 0 ? 0 : x === CLEARING.pond.columns - 1 ? 2 : 1;
      const row = y === 0 ? 0 : y === CLEARING.pond.rows - 1 ? 2 : 1;
      const frames = [0, 1, 2, 3].map((phase) => lookup(shoreFrame(column, row, phase)));
      const rect = shoreFrame(column, row, 0);
      pond.push({
        sprite: image((CLEARING.pond.x + x) * 16, (CLEARING.pond.y + y) * 16, rect, 3),
        frames,
      });
    }
  const ground = scene.add.graphics().setDepth(4);
  ground.fillStyle(0x294c3d, 0.15);
  for (const [x, y] of CLEARING.trees) ground.fillEllipse(x, y - 1, 32, 10);
  for (const [x, y] of CLEARING.trees) compose('tree-original', x, y);
  compose('house-plaster-1-green', 128, 112);
  compose('bench', 174, 119);
  compose('boat-1-2-right', 385, 208, ['rider']);
  for (const [x, y] of CLEARING.bushes) prop(x, y, 'bush', ACTOR_DEPTH_BASE + y);
  for (const [x, y] of CLEARING.rocks) prop(x, y, 'rock', ACTOR_DEPTH_BASE + y);
  for (let i = 0; i < 18; i++) {
    const x = 135 + ((i * 43) % 177),
      y = i % 2 ? 67 + ((i * 13) % 33) : 198 + ((i * 11) % 34);
    prop(x, y, i % 3 ? 'flower-blue' : 'flower-orange', ACTOR_DEPTH_BASE + y);
  }
  prop(277, 151, 'sign', ACTOR_DEPTH_BASE + 151).setOrigin(0.5, 1);
  prop(211, 155, 'chest', ACTOR_DEPTH_BASE + 155).setOrigin(0.5, 1);
  let elapsedMs = 0,
    phase = 0;
  return {
    advance(deltaMs: number) {
      elapsedMs = (elapsedMs + Math.max(deltaMs, 0)) % 720;
      const next = Math.floor(elapsedMs / 180);
      if (next === phase) return;
      phase = next;
      for (const tile of pond) {
        const frame = tile.frames[phase];
        if (frame) tile.sprite.setTexture(frame.page, frame.id);
      }
    },
  };
}
