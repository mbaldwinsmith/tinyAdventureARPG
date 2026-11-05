import { z } from 'zod';
import { readSaveState } from '../../core/save-state';
import type { SaveState } from '../../core/model';
import type { ContentRegistry } from '../../content/schemas';
import { slotIdSchema } from './contracts';
export const MAX_SAVE_BYTES = 32 * 1024 * 1024;
const metadata = z.strictObject({
  slotId: slotIdSchema,
  name: z.string().trim().min(1).max(48),
  revision: z.number().int().positive().safe(),
  savedAt: z.iso.datetime(),
});
const envelope = z.strictObject({
  format: z.literal('tiny-adventure-save'),
  version: z.literal(2),
  metadata,
  state: z.unknown(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
});
export type SaveMetadata = z.infer<typeof metadata>;
function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  return (
    '{' +
    Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, v]) => JSON.stringify(key) + ':' + canonical(v))
      .join(',') +
    '}'
  );
}
async function digest(value: unknown) {
  const bytes = new TextEncoder().encode(canonical(value));
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
}
export async function encodeSave(state: SaveState, meta: SaveMetadata) {
  const value = {
    format: 'tiny-adventure-save' as const,
    version: 2 as const,
    metadata: metadata.parse(meta),
    state,
  };
  const encoded = JSON.stringify({ ...value, sha256: await digest(value) });
  if (new TextEncoder().encode(encoded).length > MAX_SAVE_BYTES)
    throw new Error(
      'This checkpoint exceeds the supported 32 MiB size. Export your current session and keep it available.',
    );
  return encoded;
}
export async function decodeSave(text: string, content: ContentRegistry) {
  if (new TextEncoder().encode(text).length > MAX_SAVE_BYTES)
    throw new Error('The save exceeds the supported 32 MiB size. The original data has been kept.');
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    throw new Error('The save is not valid JSON. The original data has been kept.');
  }
  const header = z.record(z.string(), z.unknown()).safeParse(input);
  if (!header.success) throw new Error('The save must be a JSON object.');
  if (header.data.format === undefined) {
    return {
      state: readSaveState(input, content),
      metadata: null,
      migrated: [1, 2, 3, 4].includes(Number(header.data.schemaVersion)),
    };
  }
  if (header.data.version !== 2)
    throw new Error('Unsupported save envelope version. The original data has been kept.');
  const value = envelope.parse(input),
    { sha256, ...body } = value;
  if ((await digest(body)) !== sha256)
    throw new Error('The checkpoint integrity check failed. The original data has been kept.');
  return {
    state: readSaveState(value.state, content),
    metadata: value.metadata,
    migrated: z.object({ schemaVersion: z.number() }).parse(value.state).schemaVersion < 5,
  };
}
