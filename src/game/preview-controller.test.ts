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
});
