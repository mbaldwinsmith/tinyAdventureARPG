import { fieldArt } from '../assets/adventure-art';
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
  const stone = lookup(fieldArt.stone);
  const torches: Phaser.GameObjects.Image[] = [];
  const torchFrames = fieldArt.torches.map(lookup);
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
            ? fieldArt.floor
            : layout.biome === 'forest'
              ? clearingGrass
              : biomeGround(profile.palette);
        const f = lookup(base);
        const tile = scene.add
          .image(x * 16, y * 16, f.page, f.id)
          .setOrigin(0)
          .setDepth(0);
        if (layout.biome === 'crypt') {
          tile.setTint((x + 2 * y) % 5 === 0 ? 0xaab5c3 : 0x9eacba);
          if (
            torchFrames[0] &&
            !floor(x, y - 1) &&
            floor(x - 1, y) &&
            floor(x + 1, y) &&
            (x + y) % 5 === 0
          )
            torches.push(
              scene.add
                .image(x * 16 + 8, y * 16 + 3, torchFrames[0].page, torchFrames[0].id)
                .setDepth(11),
            );
        }
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
        if (floor(x, y + 1) || floor(x, y - 1) || floor(x + 1, y) || floor(x - 1, y))
          scene.add
            .image(x * 16, y * 16, stone.page, stone.id)
            .setOrigin(0)
            .setDepth(10);
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
  const isGate = (kind: string) => kind.startsWith('gate-') || kind === 'shortcut';
  const sprites = new Map(
    layout.placements.flatMap((p) => {
      const gate = isGate(p.kind);
      const stair = p.kind === 'portal';
      const destination = stair
        ? session.regionDefinition.interactions.find((target) => target.id === p.id)?.destination
        : null;
      const rect =
        p.kind === 'key'
          ? fieldArt.key
          : p.kind === 'switch'
            ? fieldArt.switchUp
            : p.kind === 'reward' || p.kind === 'secret'
              ? fieldArt.treasureClosed
              : stair
                ? destination?.regionId === 'region:crypt'
                  ? layout.biome === 'forest'
                    ? fieldArt.stairsGrass
                    : fieldArt.stairsDown
                  : fieldArt.stairsUp
                : gate
                  ? fieldArt.gateClosed
                  : p.kind === 'resource'
                    ? sourceFrameRect(manifest, 'bush')
                    : p.kind === 'landmark' || p.kind === 'axe'
                      ? sourceFrameRect(manifest, 'rock')
                      : null;
      if (!rect) return [];
      const packed = lookup(rect);
      const image = scene.add
        .image(p.position.x, p.position.y, packed.page, packed.id)
        .setOrigin(0.5, gate || stair || p.kind === 'switch' ? 0.5 : 1)
        .setDepth(stair || gate ? 24 : 100 + p.position.y);
      const solid = gate
        ? session.regionDefinition.solids.find((s) => s.owner === p.id)?.rect
        : null;
      if (solid) {
        image.setScale(
          Math.max(solid.width, solid.height) / 28,
          Math.min(solid.width, solid.height) / 24,
        );
        if (solid.height > solid.width) image.setRotation(Math.PI / 2);
      }
      const label = ['gate-key', 'gate-switch', 'gate-axe', 'shortcut', 'axe'].includes(p.kind)
        ? scene.add
            .text(
              p.position.x,
              p.position.y - (solid && solid.height > solid.width ? 28 : 14),
              p.kind === 'gate-key'
                ? 'KEY'
                : p.kind === 'gate-switch'
                  ? 'SUN'
                  : p.kind === 'shortcut'
                    ? 'PATH'
                    : 'AXE',
              {
                fontFamily: 'monospace',
                fontSize: '8px',
                color: '#fff0c7',
                backgroundColor: '#28312c',
                padding: { x: 2, y: 1 },
              },
            )
            .setOrigin(0.5, 1)
            .setDepth(4000)
        : null;
      const view = { image, label, changed: false };
      return [[p.id, view] as const];
    }),
  );
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
      const flame = torchFrames[Math.floor(session.tick / 5) % torchFrames.length];
      if (flame) for (const torch of torches) torch.setTexture(flame.page, flame.id);
      for (const p of layout.placements) {
        const view = sprites.get(p.id);
        if (!view) continue;
        const changed =
          changes.passages.includes(p.id) ||
          changes.opened.includes(p.id) ||
          changes.claimed.includes(p.id);
        if (changed === view.changed) continue;
        view.changed = changed;
        const rect = isGate(p.kind)
          ? changed
            ? fieldArt.gateOpen
            : fieldArt.gateClosed
          : p.kind === 'switch'
            ? changed
              ? fieldArt.switchDown
              : fieldArt.switchUp
            : p.kind === 'reward' || p.kind === 'secret'
              ? changed
                ? fieldArt.treasureOpen
                : fieldArt.treasureClosed
              : null;
        if (rect) {
          const f = lookup(rect);
          view.image.setTexture(f.page, f.id);
        }
        if (p.kind === 'key' || p.kind === 'axe') view.image.setVisible(!changed);
        if (p.kind === 'resource') view.image.setAlpha(changed ? 0.45 : 1);
        view.label?.setVisible(!changed);
      }
      nearby.clear();
      const target = session.snapshot.nearby,
        p = layout.placements.find((p) => p.id === target?.id);
      if (p) nearby.lineStyle(1, 0xffe1a2).strokeCircle(p.position.x, p.position.y - 8, 13);
    },
  };
}
