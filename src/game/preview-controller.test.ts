import { describe, expect, it } from 'vitest';
import { GameBridge } from '../bridge/game-bridge';
import { PreviewController } from './preview-controller';

describe('preview runtime ownership', () => {
  it('accepts pause ownership during loading, rejects appearance changes and hydrates ready state', () => {
    const bridge = new GameBridge();
    const runtime = new PreviewController(bridge);
    expect(bridge.send({ type: 'appearance.set', hero: 3 }).ok).toBe(false);
    bridge.send({ type: 'pause.set', reason: 'background', active: true });
    runtime.ready();
    expect(bridge.snapshot).toMatchObject({ status: 'ready', paused: true, hero: 1 });
    bridge.send({ type: 'appearance.set', hero: 3 });
    expect(runtime.session.snapshot.hero).toBe(3);
    expect(bridge.snapshot.hero).toBe(3);
    runtime.dispose();
    expect(bridge.send({ type: 'appearance.set', hero: 1 }).ok).toBe(false);
  });
  it('publishes calendar changes without streaming render frames or positions into React', () => {
    const bridge = new GameBridge(),
      runtime = new PreviewController(bridge);
    runtime.ready();
    const seen: unknown[] = [];
    bridge.subscribe((snapshot) => seen.push(snapshot));
    for (let i = 0; i < 100; i++)
      runtime.advance(10, (context) => ({
        position: { ...context.position },
        facing: context.facing,
      }));
    expect(seen.length).toBeLessThanOrEqual(4);
    expect(bridge.snapshot).not.toHaveProperty('position');
    expect(bridge.snapshot).not.toHaveProperty('tick');
    const day = bridge.snapshot.calendar.day;
    expect(bridge.send({ type: 'calendar.sleep', expectedDay: day })).toEqual({ ok: true });
    expect(bridge.snapshot.calendar.day).toBe(day + 1);
    expect(bridge.send({ type: 'calendar.sleep', expectedDay: day })).toMatchObject({
      ok: false,
      code: 'stale-command',
    });
    runtime.dispose();
  });
});
