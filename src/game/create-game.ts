import type PhaserTypes from 'phaser';
import type { GameBridge } from '../bridge/game-bridge';
import { manifestSchema, assetSources } from '../assets/definitions';
import { CLEARING, PREVIEW_SPEED_PIXELS_PER_SECOND } from '../content/clearing';
import { PreviewController } from './preview-controller';
import { observeBackgroundPause } from '../platform/browser-pause';

type Direction = 'down' | 'left' | 'up' | 'right';
const directions: Direction[] = ['down', 'left', 'up', 'right'];

/** Cancel before async startup finishes; each mount owns its game, listeners and handler. */
export function mountGame(host: HTMLElement, bridge: GameBridge): () => void {
  const controller = new PreviewController(bridge);
  let disposed = false;
  let game: PhaserTypes.Game | undefined;
  let stopBackground = () => {};

  const start = async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}generated/manifest.json`);
    if (!response.ok)
      throw new Error(
        `Asset manifest could not load (${response.status}). Run npm run assets:build.`,
      );
    const manifest = manifestSchema.parse(await response.json());
    for (const source of assetSources) {
      if (!manifest.assets.some((asset) => asset.id === source.id))
        throw new Error(`Missing required asset: ${source.id}`);
    }
    const { default: Phaser } = await import('phaser');
    if (disposed) return;

    class ClearingScene extends Phaser.Scene {
      private actor: PhaserTypes.GameObjects.Sprite | undefined;
      private keys:
        | Record<
            'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd',
            PhaserTypes.Input.Keyboard.Key
          >
        | undefined;
      private direction: Direction = 'down';
      private currentHero = 1;

      constructor() {
        super('clearing-preview');
      }

      preload() {
        this.load.on('loaderror', (file: PhaserTypes.Loader.File) => {
          if (!disposed)
            controller.fail(`Could not load texture “${file.key}”. Rebuild assets and reload.`);
        });
        for (const asset of manifest.assets) {
          const url = `${import.meta.env.BASE_URL}generated/${asset.file}`;
          if (asset.frameWidth && asset.frameHeight)
            this.load.spritesheet(asset.id, url, {
              frameWidth: asset.frameWidth,
              frameHeight: asset.frameHeight,
            });
          else this.load.image(asset.id, url);
        }
      }

      create() {
        if (disposed || bridge.snapshot.status === 'failed') return;
        this.cameras.main.setBackgroundColor('#78a957');
        this.add
          .tileSprite(0, 0, CLEARING.widthPixels, CLEARING.heightPixels, 'grass')
          .setOrigin(0)
          .setTint(0x91bb73);
        const ground = this.add.graphics();
        ground.fillStyle(0xc2a578).fillRoundedRect(199, 0, 82, 272, 26);
        ground.fillStyle(0xc2a578).fillRoundedRect(108, 115, 259, 68, 28);
        ground.fillStyle(0xceb48a).fillEllipse(242, 144, 170, 104);
        ground.fillStyle(0x294c3d, 0.17);
        for (const [x, y] of CLEARING.trees) ground.fillEllipse(x, y + 8, 34, 12);
        for (const [x, y] of CLEARING.trees)
          this.add.image(x, y, 'tree').setOrigin(0.5, 0.9).setDepth(y);
        for (const [x, y] of CLEARING.bushes) this.add.image(x, y, 'bush').setDepth(y);
        for (const [x, y] of CLEARING.rocks) this.add.image(x, y, 'rock').setDepth(y);
        for (let i = 0; i < 20; i++) {
          const x = 123 + ((i * 43) % 235);
          const y = i % 2 ? 80 + ((i * 13) % 25) : 190 + ((i * 11) % 32);
          this.add.image(x, y, i % 3 ? 'flower-blue' : 'flower-orange').setDepth(y);
        }
        this.add.image(286, 124, 'sign').setOrigin(0.5, 1).setDepth(124);
        this.add.image(186, 158, 'chest', 0).setOrigin(0.5, 1).setDepth(158);

        for (let hero = 1; hero <= 6; hero++) {
          for (const action of ['idle', 'walk']) {
            directions.forEach((direction, row) => {
              this.anims.create({
                key: `${hero}-${action}-${direction}`,
                frames: this.anims.generateFrameNumbers(`hero-${hero}-${action}`, {
                  start: row * 4,
                  end: row * 4 + 3,
                }),
                frameRate: action === 'walk' ? 9 : 4,
                repeat: -1,
              });
            });
          }
        }
        this.actor = this.add
          .sprite(CLEARING.spawn.x, CLEARING.spawn.y, 'hero-1-idle')
          .setOrigin(0.5, 0.875);
        const keyboard = this.input.keyboard;
        if (!keyboard) throw new Error('Keyboard input is unavailable.');
        this.keys = {
          up: keyboard.addKey('UP', false),
          down: keyboard.addKey('DOWN', false),
          left: keyboard.addKey('LEFT', false),
          right: keyboard.addKey('RIGHT', false),
          w: keyboard.addKey('W', false),
          a: keyboard.addKey('A', false),
          s: keyboard.addKey('S', false),
          d: keyboard.addKey('D', false),
        };
        stopBackground = observeBackgroundPause((background) => {
          keyboard.resetKeys();
          bridge.send({ type: 'pause.set', reason: 'background', active: background });
        });
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => stopBackground());
        controller.ready();
      }

      update(_time: number, deltaMilliseconds: number) {
        if (disposed || !this.actor || !this.keys) return;
        const actor = this.actor;
        const snapshot = controller.session.snapshot;
        if (snapshot.paused) {
          this.input.keyboard?.resetKeys();
          actor.anims.pause();
          return;
        }
        actor.anims.resume();
        const focused = document.activeElement === host || host.contains(document.activeElement);
        const x = focused
          ? Number(this.keys.right.isDown || this.keys.d.isDown) -
            Number(this.keys.left.isDown || this.keys.a.isDown)
          : 0;
        const y = focused
          ? Number(this.keys.down.isDown || this.keys.s.isDown) -
            Number(this.keys.up.isDown || this.keys.w.isDown)
          : 0;
        const moving = x !== 0 || y !== 0;
        if (moving) {
          if (y !== 0) this.direction = y > 0 ? 'down' : 'up';
          else this.direction = x > 0 ? 'right' : 'left';
          const distance =
            (PREVIEW_SPEED_PIXELS_PER_SECOND * Math.min(deltaMilliseconds, 50)) / 1000;
          const length = Math.hypot(x, y);
          actor.x = Phaser.Math.Clamp(
            actor.x + (x / length) * distance,
            12,
            CLEARING.widthPixels - 12,
          );
          actor.y = Phaser.Math.Clamp(
            actor.y + (y / length) * distance,
            20,
            CLEARING.heightPixels - 8,
          );
        }
        if (this.currentHero !== snapshot.hero) this.currentHero = snapshot.hero;
        actor.play(`${this.currentHero}-${moving ? 'walk' : 'idle'}-${this.direction}`, true);
        actor.setDepth(actor.y);
      }
    }

    game = new Phaser.Game({
      type: Phaser.WEBGL,
      parent: host,
      width: CLEARING.widthPixels,
      height: CLEARING.heightPixels,
      backgroundColor: '#78a957',
      pixelArt: true,
      roundPixels: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [ClearingScene],
      audio: { noAudio: true },
    });
  };
  void start().catch((error: unknown) => {
    if (!disposed)
      controller.fail(error instanceof Error ? error.message : 'The clearing could not start.');
  });

  return () => {
    disposed = true;
    stopBackground();
    controller.dispose();
    game?.destroy(true);
  };
}
