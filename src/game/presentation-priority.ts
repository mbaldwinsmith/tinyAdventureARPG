import type { HeroAction } from '../assets/hero-animations';
/** Forced hit/death/attack/tool phases lock locomotion; terrain and carrying choose base motion. */
export function presentationAction(state: {
  forced: HeroAction | null;
  swimming: boolean;
  carrying: boolean;
  moving: boolean;
}): HeroAction {
  if (state.forced !== null) return state.forced;
  if (state.swimming) return state.moving ? 'swim' : 'swim-idle';
  if (state.carrying) return state.moving ? 'carry-walk' : 'carry-idle';
  return state.moving ? 'walk' : 'idle';
}
