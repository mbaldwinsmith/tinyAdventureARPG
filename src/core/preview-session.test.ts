import { describe, expect, it } from 'vitest';
import { PreviewSession } from './preview-session';

describe('preview pause ownership', () => {
  it('keeps the background pause after closing the menu', () => {
    const session = new PreviewSession();
    session.setPause('menu', true);
    session.setPause('background', true);
    session.setPause('menu', false);
    expect(session.snapshot).toMatchObject({ paused: true, pauseReasons: ['background'] });
    session.setPause('background', false);
    expect(session.snapshot.paused).toBe(false);
  });

  it('is idempotent and does not expose the mutable pause set', () => {
    const session = new PreviewSession();
    session.setPause('menu', true);
    session.setPause('menu', true);
    session.snapshot.pauseReasons.length = 0;
    expect(session.snapshot.pauseReasons).toEqual(['menu']);
    session.setPause('menu', false);
    expect(session.snapshot.paused).toBe(false);
  });
});
