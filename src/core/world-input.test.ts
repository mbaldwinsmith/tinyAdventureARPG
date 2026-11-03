import { TRAIL_ID, TRAIL_FEATURES } from '../content/tool-trail';
import { describe, it, expect } from 'vitest';
import { moveFoot, footRect, overlaps, freeFoot, cardinal } from './motion';
import { PadReader, DEFAULT_INPUT, stickVector, padDevice } from './actions';
import type { PadSample } from './actions';
import { GameSession } from './session';
import { PREVIEW_WORLD } from '../content/world';
import { PREVIEW_CONTENT, createPreviewSave } from '../content/preview';
import { WorldRegistry, worldDefinitionSchema } from './world';
import { entityIdSchema, regionIdSchema } from './ids';

function positioned(x: number, y: number, facing: 'up' | 'down' | 'left' | 'right' = 'up') {
  const state = createPreviewSave();
  state.player.actor.position = { x, y };
  state.player.actor.facing = facing;
  return new GameSession(state, PREVIEW_CONTENT, PREVIEW_WORLD);
}
const pad = (x = 0, y = 0, pressed: number[] = []): PadSample => ({
  index: 0,
  id: 'Xbox Controller',
  standard: true,
  axes: [x, y],
  buttons: Array.from({ length: 17 }, (_, i) => pressed.includes(i)),
});
describe('foot collision and authored navigation', () => {
  it('clips swept movement against thin solids, slides and keeps artwork out of collision', () => {
    const walls = [{ x: 50, y: 0, width: 1, height: 100 }];
    expect(moveFoot({ x: 20, y: 30 }, 100, 0, 200, 100, walls)).toEqual({ x: 46, y: 30 });
    expect(moveFoot({ x: 46, y: 30 }, 10, 20, 200, 100, walls)).toEqual({ x: 46, y: 50 });
    expect(moveFoot({ x: 20, y: 30 }, -100, -100, 200, 100, [])).toEqual({ x: 4, y: 6 });
    expect(footRect({ x: 20, y: 30 })).toEqual({ x: 16, y: 24, width: 8, height: 6 });
    expect(cardinal(1, 1, 'left')).toBe('down');
    expect(cardinal(0, 0, 'left')).toBe('left');
  });
  it('stops at the same wall at 30, 60 and 144 render frames per second', () => {
    const positions = [30, 60, 144].map((fps) => {
      const game = positioned(240, 146, 'right');
      for (let i = 0; i < fps * 2; i++)
        game.advance(1000 / fps, (context) => ({
          position: moveFoot(
            context.position,
            (context.movementSpeedPixelsPerSecond * context.stepMs) / 1000,
            0,
            game.regionDefinition.width,
            game.regionDefinition.height,
            game.solids,
          ),
          facing: 'right',
        }));
      expect(game.solids.some((s) => overlaps(footRect(game.actor.position), s))).toBe(false);
      return game.actor.position;
    });
    expect(positions[0]?.x).toBe(268);
    expect(positions[1]).toEqual(positions[0]);
    expect(positions[2]).toEqual(positions[0]);
  });
  it('keeps every authored spawn clear and each interaction reachable through the collision layout with mechanism barriers opened', () => {
    for (const region of PREVIEW_WORLD.regions) {
      const barrierIds = new Set(
        TRAIL_FEATURES.filter((f) =>
          ['bomb-wall', 'root-wall', 'plate-gate', 'blue-gate', 'orange-gate'].includes(f.kind),
        ).map((f) => f.id),
      );
      const solids = region.solids
        .filter((s) => region.id !== TRAIL_ID || s.owner === null || !barrierIds.has(s.owner))
        .map((s) => s.rect);
      for (const spawn of region.spawns)
        expect(freeFoot(spawn.position, region.width, region.height, solids)).toBe(true);
      const first = region.spawns[0];
      if (!first) throw new Error('Missing spawn');
      const queue = [first.position],
        seen = new Set([`${Math.round(first.position.x / 4)},${Math.round(first.position.y / 4)}`]);
      let cursor = 0;
      const reached = new Set<string>();
      while (
        cursor < queue.length &&
        cursor < 100000 &&
        reached.size < region.interactions.length
      ) {
        const p = queue[cursor++];
        if (!p) throw new Error('Missing route cell');
        for (const target of region.interactions)
          if (Math.hypot(p.x - target.position.x, p.y - target.position.y) < 24)
            reached.add(target.id);
        for (const [dx, dy] of [
          [4, 0],
          [-4, 0],
          [0, 4],
          [0, -4],
        ]) {
          if (dx === undefined || dy === undefined) throw new Error('Missing direction');
          const next = moveFoot(p, dx, dy, region.width, region.height, solids),
            key = `${Math.round(next.x / 4)},${Math.round(next.y / 4)}`;
          if (!seen.has(key)) {
            seen.add(key);
            queue.push(next);
          }
        }
      }
      expect(cursor).toBeLessThan(100000);
      expect([...reached].sort()).toEqual(region.interactions.map((t) => t.id).sort());
    }
  });
  it('rejects blocked spawns and missing door destinations', () => {
    const blocked = worldDefinitionSchema.parse(PREVIEW_WORLD.regions),
      first = blocked[0]?.spawns[0];
    if (!first) throw new Error('Missing spawn');
    first.position = { x: 117, y: 100 };
    expect(() => new WorldRegistry(blocked)).toThrow('Blocked spawn');
    const broken = worldDefinitionSchema.parse(PREVIEW_WORLD.regions),
      door = broken[0]?.interactions.find((t) => t.kind === 'door');
    if (!door?.destination) throw new Error('Missing door');
    door.destination.regionId = regionIdSchema.parse('region:missing');
    expect(() => new WorldRegistry(broken)).toThrow('Unknown authored region');
  });
});
describe('authoritative nearby interactions and region changes', () => {
  it('inspects NPCs and farm plots without recruiting residents or growing crops', () => {
    for (const [x, y, kind] of [
      [310, 190, 'npc'],
      [176, 210, 'farm-plot'],
    ] as const) {
      const game = positioned(x, y);
      expect(game.snapshot.nearby?.kind).toBe(kind);
      const before = game.export();
      expect(game.dispatch({ type: 'world.interact', target: null })).toEqual({ ok: true });
      expect(game.snapshot.message?.body.length).toBeGreaterThan(0);
      expect(game.snapshot.pauseReasons).toContain('interaction');
      expect(game.export().player.permanent).toEqual(before.player.permanent);
    }
  });
  it('rejects distant commands, opens a chest once and composes its modal pause', () => {
    const distant = positioned(240, 146),
      before = distant.serialize();
    expect(
      distant.dispatch({ type: 'world.interact', target: 'entity:clearing-chest' }),
    ).toMatchObject({ ok: false, code: 'unavailable' });
    expect(distant.serialize()).toBe(before);
    const game = positioned(211, 168);
    expect(game.snapshot.nearby?.kind).toBe('chest');
    expect(game.dispatch({ type: 'world.interact', target: null })).toEqual({ ok: true });
    expect(game.snapshot.message?.title).toBe('Open travel chest');
    game.dispatch({ type: 'pause.set', reason: 'background', active: true });
    game.dispatch({ type: 'interaction.dismiss' });
    expect(game.snapshot.paused).toBe(true);
    game.dispatch({ type: 'pause.set', reason: 'background', active: false });
    game.dispatch({ type: 'world.interact', target: null });
    game.dispatch({ type: 'interaction.dismiss' });
    expect(game.worldPresentation.opened).toEqual([entityIdSchema.parse('entity:clearing-chest')]);
    expect(
      new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD)
        .worldPresentation.opened,
    ).toEqual(game.worldPresentation.opened);
  });
  it('transitions through both sides of a door with safe positions and retained geometry', () => {
    const game = positioned(117, 127),
      before = game.export().world.regions[0];
    expect(game.dispatch({ type: 'world.interact', target: null })).toEqual({ ok: true });
    expect(game.snapshot.region.id).toBe('region:cottage');
    expect(game.actor.position).toEqual({ x: 160, y: 160 });
    game.advance(20, (c) => ({ position: { ...c.position }, facing: 'down' }));
    expect(game.dispatch({ type: 'world.interact', target: null })).toEqual({ ok: true });
    expect(game.snapshot.region.id).toBe('region:clearing');
    expect(game.actor.position).toEqual({ x: 117, y: 127 });
    expect(game.export().world.regions[0]).toEqual(before);
    expect(game.export().player.permanent.discoveredRegions).toContain('region:cottage');
    expect(game.consumeEvents().filter((e) => e.type === 'world.region-entered')).toHaveLength(2);
  });
  it('carries one world object without inventory duplication and restores its dropped collision position', () => {
    const game = positioned(260, 215);
    expect(game.dispatch({ type: 'world.interact', target: null })).toEqual({ ok: true });
    expect(game.snapshot.carrying).toBe(true);
    expect(game.export().player.carried.items).toHaveLength(0);
    expect(game.worldPresentation.removed).toContain('entity:clearing-box');
    expect(game.dispatch({ type: 'world.interact', target: null })).toEqual({ ok: true });
    expect(game.snapshot.carrying).toBe(false);
    const object = game.worldPresentation.objects.find((o) => o.id === 'entity:clearing-box');
    expect(object?.position).toEqual({ x: 260, y: 197 });
    const restored = new GameSession(JSON.parse(game.serialize()), PREVIEW_CONTENT, PREVIEW_WORLD);
    expect(restored.solids).toEqual(game.solids);
  });
});
describe('standard controller edge and neutral handling', () => {
  it('applies radial dead zones without diagonal speed boosts', () => {
    expect(stickVector(0.1, 0.1)).toEqual({ x: 0, y: 0 });
    const v = stickVector(1, 1);
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(1);
    expect(stickVector(NaN, 0)).toEqual({ x: 0, y: 0 });
  });
  it('requires neutral after connect/reset/disconnect and reports each button edge once', () => {
    const reader = new PadReader();
    expect(reader.read([pad(1, 0, [0])], DEFAULT_INPUT).pressed).toEqual([]);
    expect(reader.read([pad()], DEFAULT_INPUT).x).toBe(0);
    expect(reader.read([pad(1, 0, [0])], DEFAULT_INPUT)).toMatchObject({
      x: 1,
      pressed: ['interact'],
      device: 'xbox',
    });
    expect(reader.read([pad(1, 0, [0])], DEFAULT_INPUT).pressed).toEqual([]);
    reader.reset();
    expect(reader.read([pad(1, 0, [0])], DEFAULT_INPUT).x).toBe(0);
    reader.read([pad()], DEFAULT_INPUT);
    expect(reader.read([pad(0, 0, [9])], DEFAULT_INPUT).pressed).toEqual(['pause']);
    expect(
      reader.read([{ ...pad(1, 0, [0]), id: 'Replacement controller' }], DEFAULT_INPUT).x,
    ).toBe(0);
    expect(reader.read([], DEFAULT_INPUT).connected).toBe(false);
    expect(reader.read([pad(0, 0, [0])], DEFAULT_INPUT).pressed).toEqual([]);
  });
  it('names physical device families and refuses unsupported mappings', () => {
    expect(padDevice('054c DualSense')).toBe('playstation');
    expect(padDevice('Nintendo Switch')).toBe('switch');
    expect(padDevice('Other standard pad')).toBe('generic');
    expect(new PadReader().read([{ ...pad(), standard: false }], DEFAULT_INPUT).connected).toBe(
      false,
    );
  });
});
