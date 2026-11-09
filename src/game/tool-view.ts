import { fieldArt } from '../assets/adventure-art';
import type Phaser from 'phaser';
import type { AssetManifest } from '../assets/definitions';
import { createAtlasLookup } from '../assets/atlas';
import { heroAnimations } from '../assets/hero-animations';
import type { HeroAction } from '../assets/hero-animations';
import { bombExplosion, effectFrameAt } from '../assets/effects';
import { TRAIL_ID, TRAIL_WALLS } from '../content/tool-trail';
import { TOOL_RULES } from '../content/tools';
import type { GameSession } from '../core/session';
/** Tool geometry is a core-owned read model. Labels/rings never resolve a hit or open a passage. */
export function createToolView(scene: Phaser.Scene, manifest: AssetManifest, session: GameSession) {
  const ground = scene.add.graphics().setDepth(24),
    signals = scene.add.graphics().setDepth(4004),
    labels = new Map<string, Phaser.GameObjects.Text>(),
    props = new Map<string, Phaser.GameObjects.Image>(),
    lookup = createAtlasLookup(manifest);
  if (session.regionDefinition.id === TRAIL_ID) {
    const walls = scene.add.graphics().setDepth(90);
    for (const r of TRAIL_WALLS)
      walls
        .fillStyle(0x465a4b)
        .fillRect(r.x, r.y, r.width, r.height)
        .lineStyle(1, 0xacc19b)
        .strokeRect(r.x, r.y, r.width, r.height);
    scene.add
      .text(64, 124, 'FOREST →', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#fff0bc',
        backgroundColor: '#315946',
      })
      .setDepth(4002);
    scene.add
      .text(16, 500, 'WOODLAND', { fontFamily: 'monospace', fontSize: '7px', color: '#fff0bc' })
      .setDepth(4002);
  }
  return {
    render() {
      ground.clear();
      signals.clear();
      const tick = session.tick;
      for (const f of session.trailPresentation) {
        const p = f.position,
          r = f.rect;
        let glyph = '';
        if (f.kind === 'water')
          ground
            .fillStyle(0x3b91a6)
            .fillRect(r.x, r.y, r.width, r.height)
            .lineStyle(1, 0x9bddd0)
            .strokeRect(r.x, r.y, r.width, r.height);
        else if (f.kind === 'pit' || f.kind === 'acid') {
          ground
            .fillStyle(f.kind === 'pit' ? 0x172d2c : 0xa2b54f)
            .fillRect(r.x, r.y, r.width, r.height)
            .lineStyle(2, f.kind === 'pit' ? 0xb9a980 : 0xe0ed88)
            .strokeRect(r.x, r.y, r.width, r.height);
          glyph = f.kind === 'pit' ? 'PIT' : 'ACID';
        } else if (
          ['bomb-wall', 'root-wall', 'plate-gate', 'blue-gate', 'orange-gate'].includes(f.kind)
        ) {
          glyph =
            f.kind === 'bomb-wall'
              ? 'X'
              : f.kind === 'blue-gate'
                ? 'B'
                : f.kind === 'orange-gate'
                  ? 'O'
                  : f.kind === 'plate-gate'
                    ? 'P'
                    : f.name.slice(-1);
          const colour =
            f.kind === 'blue-gate' ? 0x729fda : f.kind === 'orange-gate' ? 0xe9a35a : 0x8c8470;
          if (f.blocked) ground.fillStyle(colour).fillRect(r.x, r.y, r.width, r.height);
          ground.lineStyle(1, colour).strokeRect(r.x, r.y, r.width, r.height);
          if (!f.blocked) glyph += ' ↓';
        } else if (f.kind === 'plate') {
          const pressed = session.trailPresentation.some(
            (p) => p.kind === 'plate-gate' && !p.blocked,
          );
          ground
            .fillStyle(pressed ? 0xc4bb68 : 0x686e60)
            .fillRect(r.x, r.y, r.width, r.height)
            .lineStyle(1, 0xeee3b4)
            .strokeRect(r.x, r.y, r.width, r.height);
          glyph = 'P';
        } else if (f.kind === 'anchor') {
          ground
            .lineStyle(2, 0xe7c272)
            .strokeCircle(p.x, p.y, 6)
            .lineBetween(p.x - 5, p.y, p.x + 5, p.y)
            .lineBetween(p.x, p.y - 5, p.x, p.y + 5);
          glyph = 'HOOK';
        } else if (f.kind === 'lever') {
          ground
            .fillStyle(0xa9c5a3)
            .fillRect(r.x + 2, r.y + 2, 12, 12)
            .lineStyle(1, 0xf5ebc8)
            .strokeRect(r.x, r.y, r.width, r.height);
          glyph = 'B / O';
        } else if (f.kind === 'spikes') {
          const phase = tick % 100,
            active = phase >= 40 && phase < 75;
          ground
            .fillStyle(active ? 0xc66c50 : phase >= 25 && phase < 40 ? 0xe4ba63 : 0x8c987d)
            .fillRect(r.x, r.y, r.width, r.height);
          for (let x = r.x + 2; x < r.x + r.width; x += 8)
            ground
              .lineStyle(1, 0xf1ead0)
              .strokeTriangle(x, r.y + 12, x + 3, r.y + (active ? 1 : 9), x + 6, r.y + 12);
          glyph = active ? 'SPIKES ↑' : 'SPIKES ↓';
        } else if (f.kind === 'push-tile') {
          ground.fillStyle(0xb3b981).fillRect(r.x, r.y, r.width, r.height);
          glyph = '→ → →';
        } else if (f.kind === 'trap') {
          ground
            .fillStyle(tick % 150 < 50 ? 0xc8a152 : 0x596653)
            .fillRect(r.x, r.y, r.width, r.height);
          glyph = '← TRAP';
        } else if (
          f.kind === 'crate' ||
          f.kind === 'heavy' ||
          f.kind === 'pot' ||
          f.kind === 'coin'
        ) {
          let prop = props.get(f.id);
          if (!prop) {
            const frame = lookup(
              f.kind === 'crate'
                ? fieldArt.crate
                : f.kind === 'heavy'
                  ? fieldArt.weight
                  : f.kind === 'pot'
                    ? fieldArt.vessel
                    : fieldArt.coin,
            );
            prop = scene.add
              .image(p.x, p.y, frame.page, frame.id)
              .setOrigin(0.5, f.kind === 'coin' ? 0.5 : 1);
            props.set(f.id, prop);
          }
          prop
            .setPosition(p.x, p.y)
            .setDepth(100 + p.y)
            .setVisible(!f.removed && !f.claimed);
          if (f.kind === 'heavy' && !f.removed) glyph = 'WEIGHT';
        } else {
          ground
            .fillStyle(f.opened ? 0x8eb17f : 0xe6cc7c)
            .fillRect(r.x + 2, r.y + 2, r.width - 4, r.height - 4)
            .lineStyle(1, 0xfaf0cd)
            .strokeRect(r.x, r.y, r.width, r.height);
          glyph =
            f.kind === 'kit'
              ? 'TOOLS'
              : f.kind === 'reset'
                ? 'RESET'
                : f.kind === 'flippers'
                  ? 'FLIPPERS'
                  : f.kind === 'target'
                    ? 'A'
                    : f.kind === 'remote'
                      ? 'R'
                      : f.kind === 'brazier'
                        ? 'M'
                        : f.name;
          if (f.opened) glyph += ' ✓';
        }
        let label = labels.get(f.id);
        if (!label) {
          label = scene.add
            .text(p.x, p.y - 11, '', {
              fontFamily: 'monospace',
              fontSize: '7px',
              color: '#fff4d2',
              backgroundColor: '#304836',
              padding: { x: 1, y: 1 },
            })
            .setOrigin(0.5, 1)
            .setDepth(4002);
          labels.set(f.id, label);
        }
        label
          .setPosition(p.x, p.y - (f.kind === 'heavy' || f.kind === 'crate' ? 20 : 10))
          .setText(glyph)
          .setVisible(!!glyph);
      }
      const actor = session.actor,
        tools = session.toolsPresentation;
      for (const e of tools.effects) {
        const p = e.position;
        if (e.kind === 'bomb') {
          if (e.phase === 'blast') {
            signals.lineStyle(1, 0xffc978, 0.85).strokeCircle(p.x, p.y, TOOL_RULES.blastRadius);
            const f = effectFrameAt(bombExplosion, e.age * 20);
            for (const cell of f?.cells ?? [])
              signals
                .fillStyle(cell.colour, cell.alpha)
                .fillRect(p.x - 32 + cell.x, p.y - 32 + cell.y, cell.width, cell.height);
          } else {
            signals
              .lineStyle(1, 0xffc978, 0.7)
              .strokeCircle(p.x, p.y, TOOL_RULES.blastRadius)
              .fillStyle(e.age % 10 < 5 ? 0x45445a : 0xa85f50)
              .fillCircle(p.x, p.y - 3, 5)
              .lineStyle(1, 0xffd97b)
              .lineBetween(p.x, p.y - 8, p.x + 3, p.y - 12);
          }
        } else if (e.kind === 'boomerang')
          signals
            .lineStyle(3, 0xffd58a)
            .lineBetween(p.x - 4, p.y, p.x, p.y - 4)
            .lineBetween(p.x, p.y - 4, p.x + 4, p.y);
        else if (e.kind === 'hook')
          signals
            .lineStyle(1, 0xe2d3a5)
            .lineBetween(actor.position.x, actor.position.y - 4, p.x, p.y - 4)
            .lineStyle(2, 0xf3ce70)
            .strokeCircle(p.x, p.y - 3, 3);
        else if (e.kind === 'magic')
          signals
            .fillStyle(0xefb65f)
            .fillCircle(p.x, p.y - 3, 4)
            .fillStyle(0xffefb1)
            .fillCircle(p.x, p.y - 3, 2);
        else if (e.kind === 'thrown')
          signals.fillStyle(0xbb9463).fillRect(p.x - 5, p.y - 10, 10, 10);
        else
          signals
            .lineStyle(2, e.kind === 'trap' ? 0xf0b578 : 0xf4e5b5)
            .lineBetween(p.x - 3, p.y - 3, p.x + 3, p.y - 3);
        if (e.cargo) signals.fillStyle(0xffd66f).fillCircle(p.x, p.y - 10, 3);
      }
    },
    hero(sprite: Phaser.GameObjects.Sprite, moving: boolean) {
      const battle = session.battlePresentation,
        tick = session.tick;
      if (
        battle &&
        (battle.death?.phase === 'pending' ||
          tick < battle.hurtUntil ||
          battle.action ||
          battle.guard)
      )
        return false;
      const tools = session.toolsPresentation,
        e = tools.effects.find(
          (e) => e.phase === 'windup' || e.kind === 'hook' || (e.kind === 'bomb' && e.age < 8),
        );
      let action: HeroAction | null = null;
      if ((battle && session.worldPresentation.carrying) || tools.carriedBomb !== null)
        action = moving ? 'carry-walk' : 'carry-idle';
      else if (e)
        action =
          e.kind === 'arrow'
            ? 'bow'
            : e.kind === 'bomb'
              ? 'bomb'
              : e.kind === 'hook'
                ? 'hook'
                : e.kind === 'boomerang'
                  ? 'boomerang'
                  : e.kind === 'magic'
                    ? 'magic'
                    : null;
      else if (session.regionDefinition.id === TRAIL_ID && session.swimming)
        action = moving ? 'swim' : 'swim-idle';
      else if (
        (session.selectedTool === 'push' || session.selectedTool === 'pull') &&
        session.actor.cooldowns.some((c) => c.toolId === `tool:${session.selectedTool}`)
      )
        action = session.selectedTool;
      if (!action) return false;
      const definition = heroAnimations.find(
          (a) => a.id === `${session.snapshot.hero}-${action}-${session.actor.facing}`,
        ),
        frame =
          definition?.frames[
            Math.floor(((e?.age ?? tick) * 20) / 100) % (definition.frames.length || 1)
          ];
      if (!definition || !frame) return false;
      const packed = lookup({ texture: definition.texture, ...frame });
      sprite.anims.stop();
      sprite
        .setTexture(packed.page, packed.id)
        .setOrigin(definition.foot.x / frame.width, definition.foot.y / frame.height)
        .setAlpha(1)
        .clearTint();
      return true;
    },
  };
}
