import { describe, expect, it, vi } from 'vitest';
import { GameBridge, INITIAL_SNAPSHOT } from './game-bridge';

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
});
