import { z } from 'zod';
import { saveSchema } from './model';
import { assertWorldInvariants } from './invariants';
import type { ContentRegistry } from '../content/schemas';
export const legacySaveSchema = saveSchema
  .omit({ nextTransaction: true, domains: true, deathRules: true, lastDeath: true })
  .extend({ schemaVersion: z.literal(1) });
/** Each supported predecessor is explicit; future versions never fall through to defaults. */
export function readSaveState(input: unknown, content: ContentRegistry) {
  const header = z.object({ schemaVersion: z.number().int() }).parse(input);
  if (header.schemaVersion !== 1 && header.schemaVersion !== 2)
    throw new Error(
      `Unsupported save schema ${header.schemaVersion}. The original data has been kept.`,
    );
  const migrated =
    header.schemaVersion === 1 ? { ...legacySaveSchema.parse(input), schemaVersion: 2 } : input;
  const state = saveSchema.parse(migrated);
  assertWorldInvariants(state, content);
  return state;
}
