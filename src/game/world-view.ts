import { createFarmView } from './farm-view';
import { MERCHANT_PLOT, RESERVED_PLOTS, SHOP_REGION } from '../content/village';
import { createVillageActorView } from './village-view';
import { TRAIL_ID, trailPathAt, TRAIL_ENTRY } from '../content/tool-trail';
import { createGeneratedWorldView } from './generated-world-view';
import { EXPEDITION_PORTAL } from '../core/generated-world';
import type Phaser from 'phaser';
import type { AssetManifest } from '../assets/definitions';
import { createAtlasLookup, sourceFrameRect } from '../assets/atlas';
import { sceneryById } from '../assets/scenery';
import {
  terrainProfiles,
  terrainFrame,
  terrainMaskAt,
  clearingGrass,
  clearingGrassDetails,
  shoreFrame,
} from '../assets/terrain';
import { CLEARING, clearingPathAt } from '../content/clearing';
import { WOODLAND_TREES, woodlandPathAt, PRACTICE_BENCHES } from '../content/world';
import type { GameSession } from '../core/session';
import type { SourceRect } from '../assets/terrain';

export const DEPTH = {
  terrain: 0,
  details: 10,
  shadows: 20,
  items: 30,
  feet: 100,
  canopies: 2000,
  effects: 4000,
  debug: 5000,
} as const;
export function createWorldView(
  scene: Phaser.Scene,
  manifest: AssetManifest,
  session: GameSession,
) {
  if (session.geometry.generated) return createGeneratedWorldView(scene, manifest, session);
  const lookup = createAtlasLookup(manifest),
    region = session.regionDefinition;
  const image = (x: number, y: number, rect: SourceRect, depth: number) => {
    const f = lookup(rect);
    return scene.add.image(x, y, f.page, f.id).setOrigin(0).setDepth(depth);
  };
  const prop = (x: number, y: number, id: string, depth = DEPTH.feet + y, index = 0) => {
    const f = lookup(sourceFrameRect(manifest, id, index));
    return scene.add.image(x, y, f.page, f.id).setOrigin(0.5, 1).setDepth(depth);
  };
  const compose = (id: string, x: number, y: number, hide: readonly string[] = []) => {
    const definition = sceneryById(id);
    return definition.parts.flatMap((piece, index) =>
      hide.includes(piece.layer)
        ? []
        : [
            image(
              x - definition.foot.x + piece.x,
              y - definition.foot.y + piece.y,
              piece.rect,
              piece.layer === 'canopy' || piece.layer === 'roof'
                ? DEPTH.canopies + y
                : DEPTH.feet + y + index * 0.001,
            ),
          ],
    );
  };
  const dirt = terrainProfiles.find((p) => p.id === 'new-grasslands-dirt');
  if (!dirt) throw new Error('Missing dirt terrain');
  const path =
    region.id === TRAIL_ID
      ? trailPathAt
      : region.style === 'clearing'
        ? clearingPathAt
        : woodlandPathAt;
  for (let y = 0; y < region.height / 16; y++)
    for (let x = 0; x < region.width / 16; x++) {
      image(
        x * 16,
        y * 16,
        region.style === 'cottage'
          ? sourceFrameRect(manifest, 'world-cottage-floor')
          : clearingGrass,
        DEPTH.terrain,
      );
      if (region.style !== 'cottage' && path(x, y)) {
        const r = terrainFrame(dirt, terrainMaskAt(path, x, y));
        if (r) image(x * 16, y * 16, r, DEPTH.details);
      }
    }
  const pond: { sprite: Phaser.GameObjects.Image; frames: ReturnType<typeof lookup>[] }[] = [];
  let box: Phaser.GameObjects.Image | undefined;
  const chests = new Map<string, Phaser.GameObjects.Image>();
  let storefront:
    | {
        pieces: Phaser.GameObjects.Image[];
        label: Phaser.GameObjects.Text;
        reserve: Phaser.GameObjects.Graphics;
      }
    | undefined;
  const syncMerchant =
    region.id === SHOP_REGION ? createVillageActorView(scene, manifest, session) : null;
  const syncFarm =
    region.style === 'clearing'
      ? createFarmView(scene, manifest, session, DEPTH.details + 3)
      : null;
  if (region.style === 'clearing') {
    const p = EXPEDITION_PORTAL.position;
    scene.add
      .graphics()
      .setDepth(20)
      .fillStyle(0x538889)
      .fillEllipse(p.x, p.y, 24, 10)
      .lineStyle(1, 0xffcf70)
      .strokeEllipse(p.x, p.y, 24, 10);
    scene.add
      .text(p.x, p.y - 12, 'FOREST', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#fff3c6',
        backgroundColor: '#305a3d',
        padding: { x: 2, y: 2 },
      })
      .setOrigin(0.5, 1)
      .setDepth(4000);
    for (let i = 0; i < 34; i++) {
      const x = (i * 83 + 41) % 464,
        y = (i * 47 + 52) % 256,
        r = clearingGrassDetails[i % clearingGrassDetails.length];
      if (r && !path(Math.floor(x / 16), Math.floor(y / 16))) image(x, y, r, DEPTH.details + 1);
    }
    for (let y = 0; y < CLEARING.pond.rows; y++)
      for (let x = 0; x < CLEARING.pond.columns; x++) {
        const column = x === 0 ? 0 : x === CLEARING.pond.columns - 1 ? 2 : 1,
          row = y === 0 ? 0 : y === CLEARING.pond.rows - 1 ? 2 : 1;
        const frames = [0, 1, 2, 3].map((phase) => lookup(shoreFrame(column, row, phase)));
        pond.push({
          sprite: image(
            (CLEARING.pond.x + x) * 16,
            (CLEARING.pond.y + y) * 16,
            shoreFrame(column, row, 0),
            DEPTH.details + 2,
          ),
          frames,
        });
      }
    const shadows = scene.add.graphics().setDepth(DEPTH.shadows).fillStyle(0x294c3d, 0.15);
    for (const [x, y] of CLEARING.trees) {
      shadows.fillEllipse(x, y - 1, 32, 10);
      compose('tree-original', x, y);
    }
    compose('house-plaster-1-green', 128, 112);
    const plotLabel = (x: number, y: number, text: string) =>
      scene.add
        .text(x, y, text, {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#fff3c6',
          backgroundColor: '#305a3d',
          padding: { x: 2, y: 2 },
        })
        .setOrigin(0.5, 1)
        .setDepth(4000);
    const outline = (x: number, y: number, width: number) =>
      scene.add
        .graphics()
        .setDepth(DEPTH.details + 3)
        .fillStyle(0x927752, 0.35)
        .fillRect(x - width / 2, y - 16, width, 25)
        .lineStyle(1, 0xe7cf8a, 0.85)
        .strokeRect(x - width / 2, y - 16, width, 25);
    for (const { name, position } of RESERVED_PLOTS) {
      outline(position.x, position.y, 32);
      plotLabel(position.x, position.y - 4, name);
    }
    storefront = {
      pieces: compose('house-plaster-1-blue', MERCHANT_PLOT.x + 9, MERCHANT_PLOT.y),
      label: plotLabel(MERCHANT_PLOT.x, MERCHANT_PLOT.y + 9, 'Merchant reserve'),
      reserve: outline(MERCHANT_PLOT.x, MERCHANT_PLOT.y, 58),
    };
    compose('bench', 174, 119);
    compose('boat-1-2-right', 385, 208, ['rider']);
    for (const [x, y] of CLEARING.bushes) prop(x, y + 8, 'bush', DEPTH.feet + y);
    for (const [x, y] of CLEARING.rocks) prop(x, y + 8, 'rock', DEPTH.feet + y);
    for (let i = 0; i < 18; i++) {
      const x = 135 + ((i * 43) % 177),
        y = i % 2 ? 67 + ((i * 13) % 33) : 198 + ((i * 11) % 34);
      prop(x, y + 8, i % 3 ? 'flower-blue' : 'flower-orange', DEPTH.details + 3);
    }
    prop(277, 151, 'sign');
    chests.set('entity:clearing-chest', prop(211, 155, 'chest'));
    const npc = lookup({ texture: 'hero-3-idle', x: 0, y: 0, width: 16, height: 16 });
    scene.add
      .image(310, 172, npc.page, npc.id)
      .setOrigin(0.5, 0.875)
      .setDepth(DEPTH.feet + 172);
    box = prop(260, 198, 'world-small-box', DEPTH.items);
    scene.add
      .graphics()
      .setDepth(DEPTH.details + 3)
      .lineStyle(2, 0xe7cf8a, 0.8)
      .strokeRect(236, 4, 24, 6);
  } else if (region.style === 'cottage') {
    const walls = scene.add
      .graphics()
      .setDepth(DEPTH.feet + 24)
      .fillStyle(0x44495d)
      .fillRect(0, 0, 320, 24)
      .fillRect(0, 0, 16, 192)
      .fillRect(304, 0, 16, 192)
      .fillRect(0, 176, 144, 16)
      .fillRect(176, 176, 144, 16);
    walls.lineStyle(2, 0x87929a).lineBetween(16, 24, 304, 24);
    if (region.id === SHOP_REGION) {
      compose('bench', 136, 82);
      prop(136, 75, 'chest');
      prop(250, 68, 'chest');
    } else {
      compose('bench', 112, 88);
      chests.set('entity:cottage-chest', prop(230, 96, 'chest'));
    }
  } else if (region.style === 'practice') {
    for (const p of PRACTICE_BENCHES) compose('bench', p.x, p.y);
    const marking = scene.add
      .graphics()
      .setDepth(DEPTH.details + 2)
      .lineStyle(1, 0xf2dca6, 0.65);
    marking.strokeRect(24, 24, 432, 224).strokeCircle(240, 220, 12);
    marking.lineStyle(2, 0xe7cf8a).strokeRect(228, 256, 24, 5);
  } else if (region.id !== TRAIL_ID) {
    const entry = TRAIL_ENTRY.position;
    scene.add
      .graphics()
      .setDepth(24)
      .lineStyle(2, 0xf3d088)
      .strokeRect(entry.x - 12, entry.y - 6, 24, 12);
    scene.add
      .text(entry.x, entry.y - 12, 'TOOLS', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#fff0bc',
        backgroundColor: '#315946',
      })
      .setOrigin(0.5, 1)
      .setDepth(4000);
    for (const point of WOODLAND_TREES) compose('tree-original', point.x, point.y);
    prop(512, 272, 'sign');
    scene.add
      .graphics()
      .setDepth(DEPTH.details + 2)
      .lineStyle(2, 0xe7cf8a)
      .strokeRect(468, 520, 24, 5);
  }
  const carried = prop(0, 0, 'world-small-box').setVisible(false);
  const marker = scene.add.graphics().setDepth(DEPTH.effects + 1);
  let phase = 0,
    elapsedMs = 0;
  return {
    advance(ms: number) {
      elapsedMs = (elapsedMs + ms) % 720;
      const next = Math.floor(elapsedMs / 180);
      if (next !== phase) {
        phase = next;
        for (const p of pond) {
          const f = p.frames[phase];
          if (f) p.sprite.setTexture(f.page, f.id);
        }
      }
    },
    sync() {
      syncMerchant?.();
      syncFarm?.();
      if (storefront) {
        const village = session.snapshot.village;
        storefront.reserve.setVisible(!village.recruited);
        for (const part of storefront.pieces) part.setVisible(village.recruited);
        storefront.label.setText(
          village.recruited
            ? village.quest?.complete
              ? 'STOCKED STORE'
              : 'GENERAL STORE'
            : 'Merchant reserve',
        );
      }
      const data = session.worldPresentation,
        actor = session.actor;
      for (const [id, sprite] of chests) {
        const f = lookup(
          sourceFrameRect(manifest, 'chest', data.opened.some((opened) => opened === id) ? 3 : 0),
        );
        sprite.setTexture(f.page, f.id);
      }
      if (box) {
        const object = data.objects.find((o) => o.id === 'entity:clearing-box');
        box.setVisible(!data.removed.some((id) => id === 'entity:clearing-box'));
        if (object) box.setPosition(object.position.x, object.position.y);
      }
      carried
        .setVisible(!!data.carrying)
        .setPosition(actor.position.x, actor.position.y - 13)
        .setDepth(DEPTH.feet + actor.position.y + 0.5);
      marker.clear();
      const nearby = session.snapshot.nearby;
      if (nearby && !data.carrying) {
        const object = data.objects.find((o) => o.id === nearby.id);
        if (object)
          marker.lineStyle(1, 0xffcf70).strokeCircle(object.position.x, object.position.y - 8, 11);
      }
    },
  };
}
