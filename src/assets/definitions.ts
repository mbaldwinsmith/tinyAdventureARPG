import { z } from 'zod';
import sources from './sources.json';

const safeArchive = z.string().regex(/^[^/\\]+\.zip$/);
const safePath = z
  .string()
  .min(1)
  .refine(
    (value) => !value.startsWith('/') && !value.includes('\\') && !value.split('/').includes('..'),
    'Archive member must stay inside its archive.',
  );
export const sourceSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    archive: safeArchive,
    path: safePath,
    frameWidth: z.number().int().positive().optional(),
    frameHeight: z.number().int().positive().optional(),
  })
  .refine(
    (entry) => (entry.frameWidth === undefined) === (entry.frameHeight === undefined),
    'Provide both frame dimensions.',
  );

export const assetSources = z.array(sourceSchema).parse(sources);
if (new Set(assetSources.map((source) => source.id)).size !== assetSources.length) {
  throw new Error('Asset definitions contain duplicate logical IDs.');
}

export const manifestSchema = z.object({
  version: z.literal(1),
  assets: z.array(
    z.object({
      id: z.string(),
      file: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
      frameWidth: z.number().int().positive().optional(),
      frameHeight: z.number().int().positive().optional(),
    }),
  ),
});
export type AssetManifest = z.infer<typeof manifestSchema>;
