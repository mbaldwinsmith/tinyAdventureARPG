import type PhaserTypes from 'phaser';
import type { GameBridge } from '../bridge/game-bridge';
import { assetSources } from '../assets/definitions';
import { createClearingScenery, ACTOR_DEPTH_BASE } from './clearing-scenery';
import { CLEARING } from '../content/clearing';
import { loadAssetManifest } from '../platform/asset-loader';
import { PreviewController } from './preview-controller';
import { observeBackgroundPause } from '../platform/browser-pause';
import { heroAnimations, validateHeroAnimations } from '../assets/hero-animations';
import { createAtlasLookup } from '../assets/atlas';
import {
  bombExplosion,
  effectDurationMs,
  effectFrameAt,
  deathPreviewAlpha,
} from '../assets/effects';
import type { HeroAction } from '../assets/hero-animations';

type Direction = 'down' | 'left' | 'up' | 'right';

/** Cancel before async startup finishes; each mount owns its game, listeners and handler. */
export function mountGame(host: HTMLElement, bridge: GameBridge): () => void {
  const controller = new PreviewController(bridge);
  let disposed = false;
  let game: PhaserTypes.Game | undefined;
  let stopBackground = () => {};

  const start = async () => {
    const manifest = await loadAssetManifest();
    for (const source of assetSources) {
      if (!manifest.assets.some((asset) => asset.id === source.id))
        throw new Error(`Missing required asset: ${source.id}`);
    }
    validateHeroAnimations(heroAnimations, manifest.assets);
    const lookup = createAtlasLookup(manifest);
    for (const animation of heroAnimations)
      for (const frame of animation.frames)
        lookup({
          texture: animation.texture,
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
        });
    const { default: Phaser } = await import('phaser');
    if (disposed) return;

    class ClearingScene extends Phaser.Scene {
      private scenery: ReturnType<typeof createClearingScenery> | undefined;
      private actor: PhaserTypes.GameObjects.Sprite | undefined;
      private keys:
        | Record<
            'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd',
            PhaserTypes.Input.Keyboard.Key
          >
        | undefined;
      private direction: Direction = 'down';
      private currentHero = 1;
      private seenAnimationRequest = 0;
      private previewAction: HeroAction | null = null;
      private previewRemainingMilliseconds = 0;
      private previewElapsedMilliseconds = 0;
      private explosion: PhaserTypes.GameObjects.Graphics | undefined;

      constructor() {
        super('clearing-preview');
      }

      preload() {
        this.load.on('loaderror', (file: PhaserTypes.Loader.File) => {
          if (!disposed)
            controller.fail(`Could not load texture “${file.key}”. Rebuild assets and reload.`);
        });
        for (const page of manifest.pages)
          this.load.atlas(
            page.id,
            `${import.meta.env.BASE_URL}generated/${page.image}`,
            `${import.meta.env.BASE_URL}generated/${page.data}`,
          );
      }

      create() {
        try {
          this.createPresentation();
        } catch (error: unknown) {
          controller.fail(
            error instanceof Error ? error.message : 'The clearing presentation could not start.',
          );
        }
      }
      private createPresentation() {
        if (disposed || bridge.snapshot.status === 'failed') return;
        this.cameras.main.setBackgroundColor('#63ab3f');
        this.scenery = createClearingScenery(this, manifest);

        for (const definition of heroAnimations) {
          const baseDurationMs = Math.min(...definition.frames.map((frame) => frame.durationMs));
          this.anims.create({
            key: definition.id,
            frames: definition.frames.map((frame) => ({
              key: lookup({
                texture: definition.texture,
                x: frame.x,
                y: frame.y,
                width: frame.width,
                height: frame.height,
              }).page,
              frame: lookup({
                texture: definition.texture,
                x: frame.x,
                y: frame.y,
                width: frame.width,
                height: frame.height,
              }).id,
              duration: frame.durationMs - baseDurationMs,
            })),
            frameRate: 1000 / baseDurationMs,
            repeat: definition.loop ? -1 : 0,
          });
        }
        this.actor = this.add
          .sprite(
            CLEARING.spawn.x,
            CLEARING.spawn.y,
            lookup({ texture: 'hero-1-idle', x: 0, y: 0, width: 16, height: 16 }).page,
            lookup({ texture: 'hero-1-idle', x: 0, y: 0, width: 16, height: 16 }).id,
          )
          .setOrigin(0.5, 0.875)
          .setDepth(ACTOR_DEPTH_BASE + CLEARING.spawn.y);
        this.explosion = this.add.graphics().setDepth(1000);
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
        try {
          this.advancePresentation(deltaMilliseconds);
        } catch (error: unknown) {
          controller.fail(error instanceof Error ? error.message : 'The gameplay step failed.');
        }
      }
      private advancePresentation(deltaMilliseconds: number) {
        if (disposed || !this.actor || !this.keys) return;
        const actor = this.actor;
        const snapshot = controller.session.snapshot;
        if (snapshot.paused) {
          this.input.keyboard?.resetKeys();
          actor.anims.pause();
          return;
        }
        actor.anims.resume();
        const request = bridge.snapshot.animationRequest;
        if (request && request.sequence !== this.seenAnimationRequest) {
          this.seenAnimationRequest = request.sequence;
          this.previewAction = request.action;
          this.previewElapsedMilliseconds = 0;
          this.explosion?.clear();
          actor.setAlpha(1);
          actor.anims.stop();
          const definition = heroAnimations.find(
            (animation) => animation.id === `${snapshot.hero}-${request.action}-${this.direction}`,
          );
          this.previewRemainingMilliseconds = definition?.loop
            ? 1200
            : (definition?.frames.reduce((total, frame) => total + frame.durationMs, 0) ?? 500);
          if (request.action === 'bomb')
            this.previewRemainingMilliseconds += effectDurationMs(bombExplosion);
        }
        const focused = document.activeElement === host || host.contains(document.activeElement);
        const x = focused
          ? Number(this.keys.right.isDown || this.keys.d.isDown) -
            Number(this.keys.left.isDown || this.keys.a.isDown)
          : 0;
        const y = focused
          ? Number(this.keys.down.isDown || this.keys.s.isDown) -
            Number(this.keys.up.isDown || this.keys.w.isDown)
          : 0;
        const previewing = this.previewAction !== null && this.previewRemainingMilliseconds > 0;
        const moving = !previewing && (x !== 0 || y !== 0);
        const frame = controller.advance(deltaMilliseconds, (context) => {
          if (!moving) return { position: { ...context.position }, facing: context.facing };
          const facing = y !== 0 ? (y > 0 ? 'down' : 'up') : x > 0 ? 'right' : 'left';
          const distance = (context.movementSpeedPixelsPerSecond * context.stepMs) / 1000;
          const length = Math.hypot(x, y);
          // Phaser resolves movement/bounds once per requested core step. M04 adds collision here.
          return {
            position: {
              x: Phaser.Math.Clamp(
                context.position.x + (x / length) * distance,
                12,
                CLEARING.widthPixels - 12,
              ),
              y: Phaser.Math.Clamp(
                context.position.y + (y / length) * distance,
                20,
                CLEARING.heightPixels - 8,
              ),
            },
            facing,
          };
        });
        const resolved = controller.session.actor;
        actor
          .setPosition(resolved.position.x, resolved.position.y)
          .setDepth(ACTOR_DEPTH_BASE + resolved.position.y);
        this.direction = resolved.facing;
        this.scenery?.advance(frame.simulatedMs);
        if (this.previewAction && this.previewRemainingMilliseconds > 0) {
          // Start once and hold non-looping endpoints while attached effects finish.
          if (this.previewElapsedMilliseconds === 0 || this.currentHero !== snapshot.hero) {
            this.currentHero = snapshot.hero;
            this.playAction(this.previewAction);
          }
          if (this.previewAction === 'death')
            actor.setAlpha(deathPreviewAlpha(this.previewElapsedMilliseconds));
          if (this.previewAction === 'bomb') {
            const frame = effectFrameAt(bombExplosion, this.previewElapsedMilliseconds - 360);
            this.explosion?.clear();
            const dx = this.direction === 'right' ? 32 : this.direction === 'left' ? -32 : 0,
              dy = this.direction === 'down' ? 32 : this.direction === 'up' ? -32 : 0;
            const x = Phaser.Math.Clamp(actor.x + dx, 32, CLEARING.widthPixels - 32) - 32,
              y = Phaser.Math.Clamp(actor.y + dy, 32, CLEARING.heightPixels - 32) - 32;
            for (const cell of frame?.cells ?? [])
              this.explosion
                ?.fillStyle(cell.colour, cell.alpha)
                .fillRect(x + cell.x, y + cell.y, cell.width, cell.height);
          }
          this.previewElapsedMilliseconds += frame.simulatedMs;
          this.previewRemainingMilliseconds -= frame.simulatedMs;
          return;
        }
        this.previewAction = null;
        actor.setAlpha(1);
        this.explosion?.clear();
        this.currentHero = snapshot.hero;
        this.playAction(moving ? 'walk' : 'idle');
        actor.setDepth(ACTOR_DEPTH_BASE + actor.y);
      }
      private playAction(action: HeroAction) {
        if (!this.actor) return;
        const definition = heroAnimations.find(
          (animation) => animation.id === `${this.currentHero}-${action}-${this.direction}`,
        );
        const frame = definition?.frames[0];
        if (!definition || !frame) return;
        this.actor.setOrigin(definition.foot.x / frame.width, definition.foot.y / frame.height);
        this.actor.play(definition.id, true);
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
