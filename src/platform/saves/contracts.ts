import { z } from 'zod';
export const slotIdSchema = z.uuid();
export const slotRowSchema = z.strictObject({
  id: slotIdSchema,
  name: z.string().trim().min(1).max(48),
  revision: z.number().int().positive().safe(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  current: z.string(),
  previous: z.string().nullable(),
});
export type SlotRow = z.infer<typeof slotRowSchema>;
export interface SaveRepository {
  list(): Promise<unknown[]>;
  read(id: string): Promise<unknown>;
  active(): Promise<string | null>;
  commit(input: {
    id: string;
    name: string;
    expectedRevision: number;
    encoded: string;
    timestamp: string;
    activate: boolean;
  }): Promise<SlotRow>;
  select(id: string, expectedRevision: number): Promise<void>;
  close(): void;
}
export class SaveConflictError extends Error {
  constructor() {
    super(
      'This adventure changed in another tab. Save a copy or reload it; the newer checkpoint was not overwritten.',
    );
    this.name = 'SaveConflictError';
  }
}
export function storageMessage(error: unknown): string {
  if (error instanceof SaveConflictError) return error.message;
  const name = error instanceof Error ? error.name : '';
  if (name === 'QuotaExceededError')
    return 'Browser storage is full. Your session is still available: export a backup, then free space and retry.';
  if (
    [
      'SecurityError',
      'MissingAPIError',
      'InvalidStateError',
      'DatabaseClosedError',
      'OpenFailedError',
    ].includes(name)
  )
    return 'Browser storage is unavailable. Export a backup or retry; no successful save has been reported.';
  return error instanceof Error
    ? error.message
    : 'The checkpoint could not be written. Your session is still available for retry or export.';
}
