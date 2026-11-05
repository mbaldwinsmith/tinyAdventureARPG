import { createVillageActorView } from './village-view';
import type Phaser from 'phaser';
import type { AssetManifest } from '../assets/definitions';
import { createAtlasLookup, sourceFrameRect } from '../assets/atlas';
import {
  terrainProfiles,
  terrainFrame,
  terrainMaskAt,
  clearingGrass,
  biomeGround,
  shoreFrame,
} from '../assets/terrain';
import { sceneryById } from '../assets/scenery';
import type { GameSession } from '../core/session';
/** Render retained tiles and discrete object deltas; no generation occurs in Phaser. */
export function createGeneratedWorldView(
  scene: Phaser.Scene,
  manifest: AssetManifest,
  session: GameSession,
) {
  const syncMerchant =
    session.regionDefinition.id === 'region:forest'
      ? createVillageActorView(scene, manifest, session)
      : null;
  const g = session.geometry,
    layout = g.generated,
    lookup = createAtlasLookup(manifest);
  if (!layout) throw new Error('Missing generated layout');
  const palette =
    layout.biome === 'desert' || layout.biome === 'coast'
      ? 'desert'
      : layout.biome === 'winter'
        ? 'snow'
        : 'grasslands';
  const profile = terrainProfiles.find((p) => p.id === `new-${palette}-dirt`);
  if (!profile) throw new Error('Missing biome terrain');
  const floor = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < g.width && y < g.height && g.tiles[y * g.width + x] === 1;
  const trail = (x: number, y: number) =>
    floor(x, y) &&
    layout.edges.some((edge) => {
      const a = layout.rooms.find((r) => r.id === edge.from),
        b = layout.rooms.find((r) => r.id === edge.to);
      if (!a || !b) return false;
      const ax = 5 + a.column * 11,
        ay = 5 + a.row * 11,
        bx = 5 + b.column * 11,
        by = 5 + b.row * 11;
      return ax === bx
        ? Math.abs(x - ax) <= 1 && y >= Math.min(ay, by) - 1 && y <= Math.max(ay, by) + 1
        : Math.abs(y - ay) <= 1 && x >= Math.min(ax, bx) - 1 && x <= Math.max(ax, bx) + 1;
    });
  const canopies: { sprite: Phaser.GameObjects.Image; x: number; y: number }[] = [];
  const background =
    layout.biome === 'crypt'
      ? 0x303442
      : layout.biome === 'coast'
        ? 0x009bdb
        : layout.biome === 'winter'
          ? 0xb2c5bd
          : layout.biome === 'desert'
            ? 0xf3c367
            : 0x305a3d;
  scene.add
    .graphics()
    .setDepth(0)
    .fillStyle(background)
    .fillRect(0, 0, g.width * 16, g.height * 16);
  for (let y = 0; y < g.height; y++)
    for (let x = 0; x < g.width; x++) {
      if (floor(x, y)) {
        const base =
          layout.biome === 'crypt'
            ? sourceFrameRect(manifest, 'world-cottage-floor')
            : layout.biome === 'forest'
              ? clearingGrass
              : biomeGround(profile.palette);
        const f = lookup(base);
        scene.add
          .image(x * 16, y * 16, f.page, f.id)
          .setOrigin(0)
          .setDepth(0);
        if (layout.biome !== 'crypt' && (layout.biome !== 'forest' || trail(x, y))) {
          const rect =
            layout.biome === 'coast'
              ? shoreFrame(
                  !floor(x - 1, y) ? 0 : !floor(x + 1, y) ? 2 : 1,
                  !floor(x, y - 1) ? 0 : !floor(x, y + 1) ? 2 : 1,
                  0,
                  'land-cutout',
                )
              : terrainFrame(
                  profile,
                  terrainMaskAt(layout.biome === 'forest' ? trail : floor, x, y),
                );
          if (rect) {
            const f = lookup(rect);
            scene.add
              .image(x * 16, y * 16, f.page, f.id)
              .setOrigin(0)
              .setDepth(1);
          }
        }
      } else if (layout.biome === 'crypt') {
        scene.add
          .graphics()
          .setDepth(10)
          .fillStyle(0x51586b)
          .fillRect(x * 16, y * 16, 16, 16)
          .lineStyle(1, 0x79818f)
          .lineBetween(x * 16, y * 16, x * 16 + 15, y * 16);
      } else if (
        layout.biome === 'forest' &&
        (floor(x - 1, y) || floor(x + 1, y) || floor(x, y - 1) || floor(x, y + 1))
      ) {
        const f = lookup(sourceFrameRect(manifest, 'bush'));
        scene.add
          .image(x * 16 + 8, y * 16 + 16, f.page, f.id)
          .setOrigin(0.5, 1)
          .setDepth(100 + y * 16 + 16);
      } else if ((x + y * 3) % 5 === 0 && !floor(x, y + 1) && !floor(x + 1, y)) {
        if (layout.biome === 'forest' || layout.biome === 'coast') {
          const tree = sceneryById(layout.biome === 'coast' ? 'tree-palm' : 'tree-original');
          for (const piece of tree.parts) {
            const f = lookup(piece.rect);
            const sprite = scene.add
              .image(x * 16 - tree.foot.x + piece.x, y * 16 - tree.foot.y + piece.y, f.page, f.id)
              .setOrigin(0)
              .setDepth(piece.layer === 'canopy' ? 2000 + y * 16 : 100 + y * 16);
            if (piece.layer === 'canopy') canopies.push({ sprite, x: x * 16, y: y * 16 - 24 });
          }
        } else
          scene.add
            .graphics()
            .setDepth(12)
            .fillStyle(layout.biome === 'winter' ? 0xe7f4e5 : 0xffd785)
            .fillEllipse(x * 16 + 8, y * 16 + 8, 20, 12);
      }
    }
  const glyphs: Record<string, string> = {
    key: 'K',
    switch: 'S',
    axe: 'A',
    'gate-key': 'K',
    'gate-switch': 'S',
    'gate-axe': 'A',
    shortcut: '↗',
    portal: '↪',
    reward: '★',
    secret: '?',
    landmark: 'III',
    resource: '+',
  };
  const sprites = new Map<
    string,
    {
      image: Phaser.GameObjects.Image | null;
      label: Phaser.GameObjects.Text;
      marker: Phaser.GameObjects.Graphics;
    }
  >();
  for (const p of layout.placements.filter(
    (p) => !['entry', 'anchor', 'encounter', 'exit'].includes(p.kind),
  )) {
    const marker = scene.add.graphics().setDepth(20),
      label = scene.add
        .text(p.position.x, p.position.y - 19, glyphs[p.kind] ?? '', {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#fff3c6',
          backgroundColor: '#303c38',
          padding: { x: 2, y: 1 },
        })
        .setOrigin(0.5, 1)
        .setDepth(4000);
    let image: Phaser.GameObjects.Image | null = null;
    if (p.kind === 'reward' || p.kind === 'secret' || p.kind === 'landmark') {
      const f = lookup(sourceFrameRect(manifest, p.kind === 'landmark' ? 'rock' : 'chest'));
      image = scene.add
        .image(p.position.x, p.position.y, f.page, f.id)
        .setOrigin(0.5, 1)
        .setDepth(100 + p.position.y);
    }
    sprites.set(p.id, { image, label, marker });
  }
  const nearby = scene.add.graphics().setDepth(4002);
  return {
    advance(_ms: number) {
      void _ms;
    },
    sync() {
      syncMerchant?.();
      const changes = session.worldPresentation,
        actor = session.actor.position;
      for (const canopy of canopies)
        canopy.sprite.setAlpha(Math.hypot(actor.x - canopy.x, actor.y - canopy.y) < 32 ? 0.35 : 1);
      for (const p of layout.placements) {
        const view = sprites.get(p.id);
        if (!view) continue;
        const opened = changes.passages.includes(p.id),
          collected = changes.opened.includes(p.id) || changes.claimed.includes(p.id);
        view.marker.clear();
        view.label.setAlpha(opened || collected ? 0.55 : 1);
        if (p.kind === 'portal')
          view.marker
            .fillStyle(0x85c9b5, 0.8)
            .fillEllipse(p.position.x, p.position.y - 2, 22, 10)
            .lineStyle(1, 0xd5edba)
            .strokeEllipse(p.position.x, p.position.y - 2, 22, 10);
        else if (p.kind.startsWith('gate-') || p.kind === 'shortcut') {
          if (!opened) {
            const solid = session.regionDefinition.solids.find((s) => s.owner === p.id)?.rect;
            if (solid)
              view.marker
                .fillStyle(
                  p.kind === 'gate-key' ? 0xe7bb64 : p.kind === 'gate-switch' ? 0x91bfcd : 0x8b6747,
                )
                .fillRect(solid.x, solid.y, solid.width, solid.height)
                .lineStyle(1, 0x302f37)
                .strokeRect(solid.x, solid.y, solid.width, solid.height);
          }
        } else
          view.marker
            .fillStyle(collected ? 0x4d6556 : 0xe0b86f, 0.9)
            .fillCircle(p.position.x, p.position.y - 5, 6);
        if (view.image && (p.kind === 'reward' || p.kind === 'secret')) {
          const f = lookup(sourceFrameRect(manifest, 'chest', collected ? 3 : 0));
          view.image.setTexture(f.page, f.id);
        }
      }
      nearby.clear();
      const target = session.snapshot.nearby,
        p = layout.placements.find((p) => p.id === target?.id);
      if (p) nearby.lineStyle(1, 0xffe1a2).strokeCircle(p.position.x, p.position.y - 8, 13);
    },
  };
}
