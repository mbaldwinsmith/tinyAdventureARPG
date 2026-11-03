import type PhaserTypes from 'phaser';
import type { GameBridge } from '../bridge/game-bridge';
import { assetSources } from '../assets/definitions';
import { loadAssetManifest } from '../platform/asset-loader';
import { ActionInput } from '../platform/action-input';
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
import { moveFoot, cardinal, footRect } from '../core/motion';
import { presentationAction } from './presentation-priority';
import { createBattleView } from './battle-view';
import { createWorldView, DEPTH } from './world-view';

/** A mount owns its controller, device listeners, background observer and single Phaser game. */
export function mountGame(host: HTMLElement, bridge: GameBridge): () => void {
  const controller = new PreviewController(bridge);
  const input = new ActionInput(
    host,
    () => controller.inputChanged(),
    (action) => bridge.navigate(action),
  );
  controller.attachInput(input);
  let disposed = false,
    game: PhaserTypes.Game | undefined;
  const stopBackground = observeBackgroundPause((background) => {
    input.reset();
    bridge.send({ type: 'pause.set', reason: 'background', active: background });
  });
  const start = async () => {
    const manifest = await loadAssetManifest();
    for (const source of assetSources)
      if (!manifest.assets.some((asset) => asset.id === source.id))
        throw new Error(`Missing required asset: ${source.id}`);
    validateHeroAnimations(heroAnimations, manifest.assets);
    const lookup = createAtlasLookup(manifest);
    for (const animation of heroAnimations)
      for (const frame of animation.frames) lookup({ texture: animation.texture, ...frame });
    const { default: Phaser } = await import('phaser');
    if (disposed) return;
    class BootScene extends Phaser.Scene {
      constructor() {
        super('boot');
      }
      create() {
        this.scene.start('assets');
      }
    }
    class AssetScene extends Phaser.Scene {
      constructor() {
        super('assets');
      }
      preload() {
        this.load.on('loaderror', (file: PhaserTypes.Loader.File) => {
          if (!disposed)
            controller.fail(`Could not load texture “${file.key}”. Retry to reload the assets.`);
        });
        for (const page of manifest.pages)
          this.load.atlas(
            page.id,
            `${import.meta.env.BASE_URL}generated/${page.image}`,
            `${import.meta.env.BASE_URL}generated/${page.data}`,
          );
      }
      create() {
        if (disposed || bridge.snapshot.status === 'failed') return;
        for (const definition of heroAnimations) {
          const baseDurationMs = Math.min(...definition.frames.map((frame) => frame.durationMs));
          this.anims.create({
            key: definition.id,
            frames: definition.frames.map((frame) => {
              const packed = lookup({ texture: definition.texture, ...frame });
              return {
                key: packed.page,
                frame: packed.id,
                duration: frame.durationMs - baseDurationMs,
              };
            }),
            frameRate: 1000 / baseDurationMs,
            repeat: definition.loop ? -1 : 0,
          });
        }
        this.scene.start('world');
      }
    }
    class WorldScene extends Phaser.Scene {
      private actor: PhaserTypes.GameObjects.Sprite | undefined;
      private scenery: ReturnType<typeof createWorldView> | undefined;
      private battle: ReturnType<typeof createBattleView> | undefined;
      private shakenTick = -1;
      private explosion: PhaserTypes.GameObjects.Graphics | undefined;
      private overlay: PhaserTypes.GameObjects.Graphics | undefined;
      private debugText: PhaserTypes.GameObjects.Text | undefined;
      private regionId = '';
      private pendingRestart = false;
      private seenRequest = 0;
      private preview: HeroAction | null = null;
      private remainingMs = 0;
      private elapsedMs = 0;
      private hero = 1;
      private debugElapsedMs = 0;
      constructor() {
        super('world');
      }
      create() {
        try {
          input.reset();
          this.pendingRestart = false;
          this.preview = null;
          this.remainingMs = 0;
          this.elapsedMs = 0;
          this.regionId = controller.session.snapshot.region.id;
          this.seenRequest = bridge.snapshot.animationRequest?.sequence ?? 0;
          const region = controller.session.regionDefinition,
            state = controller.session.actor;
          this.cameras.main.setBackgroundColor(region.style === 'cottage' ? '#292e3f' : '#63ab3f');
          this.scenery = createWorldView(this, manifest, controller.session);
          this.battle = createBattleView(this, manifest, controller.session, Phaser.TintModes.FILL);
          const first = lookup({
            texture: `hero-${controller.session.snapshot.hero}-idle`,
            x: 0,
            y: 0,
            width: 16,
            height: 16,
          });
          this.actor = this.add
            .sprite(state.position.x, state.position.y, first.page, first.id)
            .setOrigin(0.5, 0.875)
            .setDepth(DEPTH.feet + state.position.y);
          this.explosion = this.add.graphics().setDepth(DEPTH.effects);
          this.overlay = this.add.graphics().setDepth(DEPTH.debug);
          this.debugText = this.add
            .text(6, 6, '', {
              fontSize: '10px',
              fontFamily: 'monospace',
              color: '#ffffff',
              backgroundColor: '#172821',
            })
            .setScrollFactor(0)
            .setDepth(DEPTH.debug + 1);
          this.cameras.main
            .setBounds(
              Math.min(0, (region.width - 480) / 2),
              Math.min(0, (region.height - 272) / 2),
              Math.max(480, region.width),
              Math.max(272, region.height),
              true,
            )
            .startFollow(this.actor, true, 0.15, 0.15)
            .centerOn(state.position.x, state.position.y);
          this.cameras.main.roundPixels = true;
          this.cameras.main.fadeIn(120, 0, 0, 0);
          this.input.on('pointerdown', (pointer: PhaserTypes.Input.Pointer) => {
            if (controller.session.snapshot.paused) return;
            const target = controller.session.snapshot.nearby;
            if (!target) return;
            const position = controller.session.worldPresentation.objects.find(
              (o) => o.id === target.id,
            )?.position;
            const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            if (position && Math.hypot(point.x - position.x, point.y - position.y) < 18)
              bridge.send({ type: 'world.interact', target: target.id });
          });
          this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            input.reset();
            for (const key of [
              'x',
              'y',
              'region',
              'cameraX',
              'cameraY',
              'animation',
              'tick',
              'battle',
            ])
              delete host.dataset[key];
          });
          controller.ready();
          this.scenery.sync();
        } catch (error: unknown) {
          controller.fail(error instanceof Error ? error.message : 'The region could not open.');
        }
      }
      update(_time: number, deltaMs: number) {
        try {
          this.advancePresentation(deltaMs);
        } catch (error: unknown) {
          controller.fail(error instanceof Error ? error.message : 'The world update failed.');
        }
      }
      private restartIfNeeded() {
        if (this.regionId === controller.session.snapshot.region.id) return false;
        if (!this.pendingRestart) {
          this.pendingRestart = true;
          input.reset();
          controller.loading();
          this.scene.restart();
        }
        return true;
      }
      private advancePresentation(deltaMs: number) {
        if (disposed || !this.actor || this.pendingRestart) return;
        if (this.restartIfNeeded()) return;
        const intent = input.poll(controller.session.snapshot.paused);
        const combat = controller.session.snapshot.combat;
        if (
          controller.session.battleActive &&
          !controller.session.snapshot.paused &&
          intent.guard !== combat?.guard
        )
          bridge.send({ type: 'combat.guard', active: intent.guard });
        if (intent.pressed.includes('pause'))
          bridge.send({ type: 'pause.set', reason: 'menu', active: true });
        else if (intent.pressed.includes('interact')) {
          if (combat?.active && combat.drop)
            bridge.send({ type: 'combat.collect', dropId: combat.drop });
          else bridge.send({ type: 'world.interact', target: null });
        } else if (controller.session.battleActive) {
          const action = intent.pressed.includes('attack')
            ? 'sword'
            : intent.pressed.includes('roll')
              ? 'roll'
              : intent.pressed.includes('bow')
                ? 'bow'
                : null;
          if (action)
            bridge.send({
              type: 'combat.action',
              action,
              facing: cardinal(intent.x, intent.y, controller.session.actor.facing),
            });
        } else if (intent.pressed.includes('attack'))
          bridge.send({ type: 'animation.preview', action: 'sword' });
        if (this.restartIfNeeded()) return;
        const snapshot = controller.session.snapshot,
          actor = this.actor;
        this.drawDebug(deltaMs);
        this.scenery?.sync();
        this.battle?.render();
        if (snapshot.paused) {
          this.cameras.main.shakeEffect.reset();
          actor.anims.pause();
          return;
        }
        actor.anims.resume();
        if (controller.session.battleActive) {
          this.preview = null;
          this.remainingMs = 0;
        }
        const request = bridge.snapshot.animationRequest;
        if (!controller.session.battleActive && request && request.sequence !== this.seenRequest) {
          this.seenRequest = request.sequence;
          this.preview = request.action;
          this.elapsedMs = 0;
          this.explosion?.clear();
          actor.setAlpha(1);
          actor.anims.stop();
          const definition = heroAnimations.find(
            (a) => a.id === `${snapshot.hero}-${request.action}-${controller.session.actor.facing}`,
          );
          this.remainingMs = definition?.loop
            ? 1200
            : (definition?.frames.reduce((sum, f) => sum + f.durationMs, 0) ?? 500);
          if (request.action === 'bomb') this.remainingMs += effectDurationMs(bombExplosion);
        }
        const forced = this.preview !== null && this.remainingMs > 0;
        const moving = !forced && Math.hypot(intent.x, intent.y) > 0;
        const frame = controller.advance(deltaMs, (context) => {
          const direction = cardinal(intent.x, intent.y, context.facing);
          if (!moving)
            return {
              position: { ...context.position },
              facing: forced ? context.facing : direction,
            };
          const region = controller.session.regionDefinition,
            distance = (context.movementSpeedPixelsPerSecond * context.stepMs) / 1000;
          return {
            position: moveFoot(
              context.position,
              intent.x * distance,
              intent.y * distance,
              region.width,
              region.height,
              controller.session.solids,
            ),
            facing: direction,
          };
        });
        const state = controller.session.actor;
        actor
          .setPosition(state.position.x, state.position.y)
          .setDepth(DEPTH.feet + state.position.y);
        this.scenery?.advance(frame.simulatedMs);
        this.scenery?.sync();
        this.battle?.render();
        if (this.battle?.hero(actor, moving)) {
          const battle = controller.session.battlePresentation;
          if (
            battle &&
            bridge.snapshot.screenShake &&
            battle.lastDamageTick > this.shakenTick &&
            controller.session.tick < battle.hurtUntil
          ) {
            this.shakenTick = battle.lastDamageTick;
            this.cameras.main.shake(100, 0.002);
          }
          return;
        }
        if (forced && this.preview) {
          if (this.elapsedMs === 0 || this.hero !== snapshot.hero) this.play(this.preview);
          if (this.preview === 'death') actor.setAlpha(deathPreviewAlpha(this.elapsedMs));
          if (this.preview === 'bomb') {
            const effect = effectFrameAt(bombExplosion, this.elapsedMs - 360),
              region = controller.session.regionDefinition;
            const dx = state.facing === 'right' ? 32 : state.facing === 'left' ? -32 : 0,
              dy = state.facing === 'down' ? 32 : state.facing === 'up' ? -32 : 0;
            const x = Phaser.Math.Clamp(actor.x + dx, 32, region.width - 32) - 32,
              y = Phaser.Math.Clamp(actor.y + dy, 32, region.height - 32) - 32;
            this.explosion?.clear();
            for (const cell of effect?.cells ?? [])
              this.explosion
                ?.fillStyle(cell.colour, cell.alpha)
                .fillRect(x + cell.x, y + cell.y, cell.width, cell.height);
          }
          this.elapsedMs += frame.simulatedMs;
          this.remainingMs -= frame.simulatedMs;
        } else {
          this.preview = null;
          actor.setAlpha(1);
          this.explosion?.clear();
          this.play(
            presentationAction({
              forced: null,
              swimming: controller.session.swimming,
              carrying: controller.session.snapshot.carrying,
              moving,
            }),
          );
        }
      }
      private play(action: HeroAction) {
        if (!this.actor) return;
        this.hero = controller.session.snapshot.hero;
        const definition = heroAnimations.find(
            (a) => a.id === `${this.hero}-${action}-${controller.session.actor.facing}`,
          ),
          frame = definition?.frames[0];
        if (!definition || !frame) return;
        this.actor
          .setOrigin(definition.foot.x / frame.width, definition.foot.y / frame.height)
          .play(definition.id, true);
      }
      private drawDebug(deltaMs: number) {
        const enabled = import.meta.env.DEV && bridge.snapshot.debug;
        this.overlay?.clear();
        this.debugText?.setVisible(enabled);
        if (!enabled) return;
        const state = controller.session.actor,
          body = footRect(state.position);
        this.overlay?.lineStyle(1, 0xff6b6b, 0.8);
        for (const solid of controller.session.solids)
          this.overlay?.strokeRect(solid.x, solid.y, solid.width, solid.height);
        this.overlay
          ?.lineStyle(1, 0xffffff)
          .strokeRect(body.x, body.y, body.width, body.height)
          .lineStyle(1, 0xffcf70, 0.6)
          .strokeCircle(state.position.x, state.position.y, 26);
        this.debugText?.setText(
          `${this.regionId} · world\nfeet ${state.position.x.toFixed(1)}, ${state.position.y.toFixed(1)} · ${state.facing}\ntick ${controller.session.tick}`,
        );
        this.debugElapsedMs += deltaMs;
        if (this.debugElapsedMs < 100) return;
        this.debugElapsedMs = 0;
        Object.assign(host.dataset, {
          x: String(state.position.x),
          y: String(state.position.y),
          region: this.regionId,
          cameraX: String(Math.round(this.cameras.main.scrollX)),
          cameraY: String(Math.round(this.cameras.main.scrollY)),
          animation: this.actor?.anims.currentAnim?.key ?? '',
          battle: JSON.stringify(controller.session.battlePresentation),
          tick: String(controller.session.tick),
        });
      }
    }
    game = new Phaser.Game({
      type: Phaser.WEBGL,
      parent: host,
      width: 480,
      height: 272,
      backgroundColor: '#63ab3f',
      pixelArt: true,
      roundPixels: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [BootScene, AssetScene, WorldScene],
      audio: { noAudio: true },
    });
  };
  void start().catch((error: unknown) => {
    if (!disposed)
      controller.fail(error instanceof Error ? error.message : 'The world could not start.');
  });
  return () => {
    disposed = true;
    stopBackground();
    input.dispose();
    controller.dispose();
    game?.destroy(true);
  };
}
