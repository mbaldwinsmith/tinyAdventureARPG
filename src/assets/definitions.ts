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
    inspectionOnly: z.boolean().optional(),
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
  version: z.literal(2),
  assets: z.array(
    z.object({
      id: z.string(),
      sourceFile: z.string(),
      inspectionOnly: z.boolean(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
      canonicalId: z.string().regex(/^sprite-[a-f0-9]{16}$/),
      frameWidth: z.number().int().positive().optional(),
      frameHeight: z.number().int().positive().optional(),
    }),
  ),
  pages: z.array(
    z.object({
      id: z.string().regex(/^atlas-\d+$/),
      image: z.string().regex(/^atlas-\d+\.png$/),
      data: z.string().regex(/^atlas-\d+\.json$/),
      width: z.number().int().positive().max(2048),
      height: z.number().int().positive().max(2048),
      imageSha256: z.string(),
      dataSha256: z.string(),
    }),
  ),
  frames: z.array(
    z.object({
      id: z.string(),
      page: z.string(),
      source: z.object({
        texture: z.string(),
        x: z.number().int().nonnegative(),
        y: z.number().int().nonnegative(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      }),
      x: z.number().int().nonnegative(),
      y: z.number().int().nonnegative(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      pixelHash: z.string(),
    }),
  ),
});
export type AssetManifest = z.infer<typeof manifestSchema>;
