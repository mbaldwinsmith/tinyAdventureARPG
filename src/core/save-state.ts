import { z } from 'zod';
import { saveSchema } from './model';
import { assertWorldInvariants } from './invariants';
import type { ContentRegistry } from '../content/schemas';
export const versionTwoSaveSchema = saveSchema
  .omit({ pack: true })
  .extend({ schemaVersion: z.literal(2) });
export const legacySaveSchema = versionTwoSaveSchema
  .omit({ nextTransaction: true, domains: true, deathRules: true, lastDeath: true })
  .extend({ schemaVersion: z.literal(1) });
/** Each supported predecessor is explicit; future versions never fall through to defaults. */
export function readSaveState(input: unknown, content: ContentRegistry) {
  const header = z.object({ schemaVersion: z.number().int() }).parse(input);
  if (![1, 2, 3].includes(header.schemaVersion))
    throw new Error(
      `Unsupported save schema ${header.schemaVersion}. The original data has been kept.`,
    );
  const migrated =
    header.schemaVersion === 1 ? { ...legacySaveSchema.parse(input), schemaVersion: 2 } : input;
  const upgraded =
    header.schemaVersion <= 2
      ? { ...versionTwoSaveSchema.parse(migrated), schemaVersion: 3 }
      : migrated;
  const state = saveSchema.parse(upgraded);
  assertWorldInvariants(state, content);
  return state;
}
