export const HERO_IDS = [1, 2, 3, 4, 5, 6] as const;
export type HeroId = (typeof HERO_IDS)[number];
export type PauseReason = 'menu' | 'background';

/** Preview-only state owner. No campaign rules or persistence are implied. */
export class PreviewSession {
  private reasons = new Set<PauseReason>();
  private hero: HeroId = 1;

  get snapshot() {
    return {
      hero: this.hero,
      paused: this.reasons.size > 0,
      pauseReasons: [...this.reasons].sort(),
    };
  }

  setPause(reason: PauseReason, active: boolean): void {
    if (active) this.reasons.add(reason);
    else this.reasons.delete(reason);
  }

  setHero(hero: HeroId): void {
    this.hero = hero;
  }
}
