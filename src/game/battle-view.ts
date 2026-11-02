import type Phaser from 'phaser';
import type { AssetManifest } from '../assets/definitions';
import { presentationAnimations } from '../assets/presentation-animations';
import { heroAnimations } from '../assets/hero-animations';
import type { HeroAction } from '../assets/hero-animations';
import { createAtlasLookup } from '../assets/atlas';
import type { GameSession } from '../core/session';
import type { CombatEnemy } from '../core/combat-model';
import { attackBox, directionVector } from '../core/combat';
import { COMBAT_RULES } from '../content/combat';
import { DEPTH } from './world-view';
const animations = new Map(presentationAnimations.map((a) => [a.id, a]));
function enemyAnimation(e: CombatEnemy) {
  const locomotion = e.phase === 'pursuit' || e.phase === 'return';
  if (e.kind === 'bat') return `enemy-bat-${e.facing === 'left' ? 'left' : 'right'}-fly`;
  if (e.kind === 'rat') return `enemy-rat-${e.facing}-walk`;
  if (e.kind === 'slime') return `enemy-slime-blue-${e.facing === 'up' ? 'up' : 'down'}-bounce`;
  return `enemy-${e.kind}-${e.kind === 'goblin' && (e.phase === 'windup' || e.phase === 'active') ? 'bow' : locomotion ? 'walk' : 'idle'}-${e.facing}`;
}
/** Pixels are presentation only. Windup/aim/active geometry and animation frames follow committed ticks. */
export function createBattleView(
  scene: Phaser.Scene,
  manifest: AssetManifest,
  session: GameSession,
  fillTintMode: number,
) {
  const lookup = createAtlasLookup(manifest),
    sprites = new Map<string, Phaser.GameObjects.Image>(),
    labels = new Map<string, Phaser.GameObjects.Text>();
  const ground = scene.add.graphics().setDepth(DEPTH.items + 1),
    signals = scene.add.graphics().setDepth(DEPTH.effects + 2);
  return {
    render() {
      const battle = session.battlePresentation,
        tick = session.tick;
      ground.clear();
      signals.clear();
      for (const [id, sprite] of sprites)
        if (!battle?.enemies.some((e) => e.id === id)) {
          sprite.destroy();
          sprites.delete(id);
          labels.get(id)?.destroy();
          labels.delete(id);
        }
      if (!battle) return;
      for (const e of battle.enemies) {
        const animation = animations.get(enemyAnimation(e));
        if (!animation) throw new Error(`Missing enemy playback: ${e.kind}`);
        const elapsed =
            e.phase === 'windup' || e.phase === 'active' ? e.phaseTicks * 20 : tick * 20,
          index = Math.floor(elapsed / (animation.frames[0]?.durationMs ?? 140));
        const f =
          animation.frames[
            animation.loop
              ? index % animation.frames.length
              : Math.min(index, animation.frames.length - 1)
          ];
        if (!f) throw new Error('Missing enemy frame');
        const packed = lookup({ texture: animation.texture, ...f });
        let sprite = sprites.get(e.id);
        if (!sprite) {
          sprite = scene.add.image(e.position.x, e.position.y, packed.page, packed.id);
          sprites.set(e.id, sprite);
          labels.set(
            e.id,
            scene.add
              .text(0, 0, '', {
                fontFamily: 'monospace',
                fontSize: '7px',
                color: '#fff6d9',
                backgroundColor: '#18382d',
              })
              .setOrigin(0.5, 1)
              .setDepth(DEPTH.effects + 3),
          );
        }
        sprite
          .setTexture(packed.page, packed.id)
          .setOrigin(animation.foot.x / f.width, animation.foot.y / f.height)
          .setPosition(e.position.x, e.position.y)
          .setDepth(DEPTH.feet + e.position.y)
          .clearTint();
        const alpha = e.deathTick === null ? 1 : Math.max(0, 1 - (tick - e.deathTick) / 25);
        sprite.setAlpha(alpha);
        if (tick < e.hurtUntil) sprite.setTint(0xffe4a0).setTintMode(fillTintMode);
        const label = labels.get(e.id);
        label
          ?.setPosition(e.position.x, e.position.y - 20)
          .setText(
            e.health <= 0
              ? ''
              : `${e.kind} ${e.phase === 'detect' ? '!' : e.phase === 'windup' ? '…' : e.phase === 'return' ? '↩' : ''}`,
          )
          .setVisible(e.health > 0);
        if (e.health <= 0) continue;
        signals
          .fillStyle(0x18382d, 0.9)
          .fillRect(e.position.x - 9, e.position.y - 18, 18, 2)
          .fillStyle(0xe78863)
          .fillRect(e.position.x - 9, e.position.y - 18, (18 * e.health) / e.maximumHealth, 2);
        if (e.phase === 'windup' || e.phase === 'active') {
          const colour = e.phase === 'windup' ? 0xffd77e : 0xff7963;
          signals.lineStyle(1, colour, 0.85).strokeCircle(e.position.x, e.position.y - 3, 11);
          if (e.kind === 'goblin')
            signals
              .lineStyle(1, colour, 0.7)
              .lineBetween(e.position.x, e.position.y - 3, e.aim.x, e.aim.y - 3);
          else {
            const box = attackBox(
              e.position,
              e.attackFacing,
              e.kind === 'bat' || e.kind === 'slime' ? 12 : 20,
              16,
            );
            signals.lineStyle(1, colour, 0.65).strokeRect(box.x, box.y, box.width, box.height);
          }
        }
      }
      for (const drop of battle.drops)
        if (!drop.claimed)
          ground
            .fillStyle(0xffce70)
            .fillCircle(drop.position.x, drop.position.y - 3, 3)
            .lineStyle(1, 0x9e743c)
            .strokeCircle(drop.position.x, drop.position.y - 3, 3);
      for (const p of battle.projectiles) {
        const length = Math.hypot(p.velocity.x, p.velocity.y) || 1,
          dx = (p.velocity.x / length) * 7,
          dy = (p.velocity.y / length) * 7;
        signals
          .lineStyle(1, p.faction === 'player' ? 0xd6e9ee : 0xffb36d)
          .lineBetween(
            p.position.x - dx,
            p.position.y - dy,
            p.position.x + dx / 2,
            p.position.y + dy / 2,
          )
          .fillStyle(0xf8efcd)
          .fillCircle(p.position.x + dx / 2, p.position.y + dy / 2, 1.5);
      }
      const a = session.actor;
      if (battle.guard) {
        const v = directionVector(a.facing);
        signals
          .lineStyle(2, 0x9fd7f0)
          .strokeCircle(a.position.x + v.x * 7, a.position.y - 4 + v.y * 7, 5);
      }
      if (battle.action?.kind === 'sword') {
        const t = battle.action.elapsedTicks;
        if (
          t >= COMBAT_RULES.sword.windup &&
          t < COMBAT_RULES.sword.windup + COMBAT_RULES.sword.active
        ) {
          const box = attackBox(a.position, battle.action.facing);
          signals.lineStyle(1, 0xffedb3, 0.75).strokeRect(box.x, box.y, box.width, box.height);
        }
      }
    },
    hero(actor: Phaser.GameObjects.Sprite, moving: boolean) {
      const battle = session.battlePresentation;
      if (!battle) return false;
      const state = session.actor,
        tick = session.tick;
      let action: HeroAction = moving ? 'walk' : 'idle',
        elapsed = tick * 20,
        duration = 0;
      if (battle.death?.phase === 'pending') {
        action = 'death';
        elapsed = (tick - battle.lastDamageTick) * 20;
      } else if (tick < battle.hurtUntil) {
        action = 'hit';
        elapsed = (tick - battle.lastDamageTick) * 20;
      } else if (battle.action) {
        action =
          battle.action.kind === 'sword' ? 'sword' : battle.action.kind === 'bow' ? 'bow' : 'roll';
        elapsed = battle.action.elapsedTicks * 20;
        duration =
          battle.action.kind === 'roll'
            ? COMBAT_RULES.rollTicks * 20
            : (COMBAT_RULES[battle.action.kind].windup +
                COMBAT_RULES[battle.action.kind].active +
                COMBAT_RULES[battle.action.kind].recovery) *
              20;
      } else if (battle.guard) action = moving ? 'shield-walk' : 'shield-idle';
      const animation = heroAnimations.find(
        (a) => a.id === `${session.snapshot.hero}-${action}-${state.facing}`,
      );
      if (!animation) return true;
      const total = animation.frames.reduce((sum, f) => sum + f.durationMs, 0),
        clock = duration
          ? (elapsed / duration) * total
          : animation.loop
            ? elapsed % total
            : Math.min(elapsed, total - 1);
      let remaining = clock;
      let selected = animation.frames[0];
      for (const f of animation.frames) {
        selected = f;
        if (remaining < f.durationMs) break;
        remaining -= f.durationMs;
      }
      if (!selected) return true;
      const f = lookup({ texture: animation.texture, ...selected });
      actor.anims.stop();
      actor
        .setTexture(f.page, f.id)
        .setOrigin(animation.foot.x / selected.width, animation.foot.y / selected.height)
        .clearTint()
        .setAlpha(tick < battle.invulnerableUntil && tick % 6 < 3 ? 0.6 : 1);
      if (tick < battle.hurtUntil) actor.setTint(0xffb29b).setTintMode(fillTintMode);
      return true;
    },
  };
}
