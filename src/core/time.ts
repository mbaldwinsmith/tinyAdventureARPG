import { z } from 'zod';

export const pauseReasonSchema = z.enum([
  'menu',
  'background',
  'workbench',
  'settings',
  'interaction',
  'loading',
  'failure',
]);
export type PauseReason = z.infer<typeof pauseReasonSchema>;
export class PauseReasons {
  private reasons = new Set<PauseReason>();
  get paused() {
    return this.reasons.size > 0;
  }
  snapshot(): readonly PauseReason[] {
    return Object.freeze([...this.reasons].sort());
  }
  set(reason: PauseReason, active: boolean): boolean {
    const previous = this.reasons.has(reason);
    if (active) this.reasons.add(reason);
    else this.reasons.delete(reason);
    return previous !== active;
  }
}
export const STEP_MS = 20;
export const MAX_FRAME_MS = 250;
export const clockSchema = z.strictObject({
  tick: z.number().int().nonnegative().safe(),
  remainderMs: z.number().min(0).lt(STEP_MS),
  eventSequence: z.number().int().nonnegative().safe(),
});
export const calendarSchema = z.strictObject({
  day: z.number().int().min(1).max(1000000),
  elapsedTicks: z.number().int().nonnegative(),
});
export const timeRulesSchema = z.strictObject({
  ticksPerDay: z.number().int().min(1).max(4320000),
  daysPerSeason: z.number().int().min(1).max(365),
  startHour: z.number().int().min(0).max(23),
});
export type Calendar = z.infer<typeof calendarSchema>;
export type TimeRules = z.infer<typeof timeRulesSchema>;
export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;
export function calendarView(calendar: Calendar, rules: TimeRules) {
  const seasonIndex = Math.floor((calendar.day - 1) / rules.daysPerSeason) % 4;
  return {
    day: calendar.day,
    dayOfSeason: ((calendar.day - 1) % rules.daysPerSeason) + 1,
    season: SEASONS[seasonIndex] ?? 'Spring',
    year: Math.floor((calendar.day - 1) / (rules.daysPerSeason * 4)) + 1,
    minuteOfDay:
      (rules.startHour * 60 + Math.floor((calendar.elapsedTicks * 1440) / rules.ticksPerDay)) %
      1440,
  };
}
/** Render elapsed time is bounded; no wall-clock timestamps or closed-game catch-up. */
export function frameBudget(elapsedMs: number, remainderMs: number) {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) throw new Error('Invalid frame duration');
  const total = remainderMs + Math.min(elapsedMs, MAX_FRAME_MS),
    steps = Math.floor((total + 1e-8) / STEP_MS);
  return {
    steps,
    remainderMs: Math.max(0, total - steps * STEP_MS),
    droppedMs: Math.max(0, elapsedMs - MAX_FRAME_MS),
  };
}
