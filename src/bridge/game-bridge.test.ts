import { describe, expect, it, vi } from 'vitest';
import { GameBridge, INITIAL_SNAPSHOT } from './game-bridge';
import { PreviewController } from '../game/preview-controller';

describe('game bridge lifecycle', () => {
  it('rejects commands before a runtime attaches and after it detaches', () => {
    const bridge = new GameBridge();
    const command = { type: 'pause.set', reason: 'menu', active: true } as const;
    expect(bridge.send(command).ok).toBe(false);
    const handler = vi.fn(() => ({ ok: true as const }));
    const detach = bridge.attach(handler);
    expect(bridge.send(command)).toEqual({ ok: true });
    expect(handler).toHaveBeenCalledWith(command);
    expect(() => bridge.attach(handler)).toThrow('already attached');
    detach();
    expect(bridge.send(command).ok).toBe(false);
  });

  it('immediately hydrates subscribers and cleans up only their own subscription', () => {
    const bridge = new GameBridge();
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribe = bridge.subscribe(first);
    bridge.subscribe(second);
    expect(first).toHaveBeenCalledWith(INITIAL_SNAPSHOT);
    unsubscribe();
    bridge.publish({ ...INITIAL_SNAPSHOT, status: 'ready' });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);
  });
  it('delivers ordered events against committed state and rejects reentrant commands', () => {
    const bridge = new GameBridge(),
      controller = new PreviewController(bridge);
    controller.ready();
    const received: string[] = [],
      sequences: number[] = [];
    bridge.onEvent((event) => {
      if (event.type === 'domain.event') {
        received.push(event.event.type);
        sequences.push(event.event.sequence);
        if (event.event.type === 'player.appearance-changed') {
          expect(bridge.snapshot.hero).toBe(4);
          expect(bridge.send({ type: 'appearance.set', hero: 2 })).toMatchObject({
            ok: false,
            code: 'busy',
          });
        }
      } else received.push('snapshot');
    });
    received.length = 0;
    expect(bridge.send({ type: 'appearance.set', hero: 4 })).toEqual({ ok: true });
    expect(received).toEqual(['player.appearance-changed', 'snapshot']);
    expect(sequences).toHaveLength(1);
    const snapshot = bridge.snapshot;
    bridge.send({ type: 'appearance.set', hero: 4 });
    expect(bridge.snapshot).toBe(snapshot);
    expect(
      bridge.send(JSON.parse('{"type":"pause.set","reason":"loading","active":false}')),
    ).toMatchObject({ ok: false, code: 'invalid-command' });
    controller.dispose();
  });
});
