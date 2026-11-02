import { expect, it } from 'vitest';
import { presentationAction } from './presentation-priority';
it('keeps hit/attack phases above swimming/carrying and uses coherent idle/move families', () => {
  expect(presentationAction({ forced: 'hit', swimming: true, carrying: true, moving: true })).toBe(
    'hit',
  );
  expect(
    presentationAction({ forced: 'sword', swimming: true, carrying: true, moving: true }),
  ).toBe('sword');
  expect(presentationAction({ forced: null, swimming: true, carrying: false, moving: false })).toBe(
    'swim-idle',
  );
  expect(presentationAction({ forced: null, swimming: false, carrying: true, moving: true })).toBe(
    'carry-walk',
  );
  expect(presentationAction({ forced: null, swimming: false, carrying: true, moving: false })).toBe(
    'carry-idle',
  );
});
