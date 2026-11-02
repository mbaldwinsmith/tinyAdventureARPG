import { z } from 'zod';
const source = z.object({
  archive: z.string(),
  path: z.string(),
  bytes: z.number(),
  sha256: z.string(),
});
const asset = z.object({
  id: z.string(),
  auditId: z.string(),
  sha256: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  category: z.string(),
  identity: z.string(),
  groups: z.array(z.string()),
  relatedGroups: z.array(z.string()),
  suggestedUse: z.string(),
  notes: z.array(z.string()),
  suggestedCell: z.array(z.number()).nullable(),
  framingBasis: z.string(),
  versionPolicy: z.string(),
  preferredSource: source,
  sources: z.array(source),
});
export const catalogueSchema = z.object({
  version: z.literal(1),
  auditDate: z.string(),
  counts: z.object({
    archives: z.number(),
    file_entries: z.number(),
    png_entries: z.number(),
    unique_pngs: z.number(),
    support_text_entries: z.number(),
    duplicate_png_occurrences: z.number(),
  }),
  archives: z.array(
    z.object({
      name: z.string(),
      sha256: z.string(),
      bytes: z.number(),
      files: z.number(),
      pngs: z.number(),
      identicalArchives: z.array(z.string()),
    }),
  ),
  assets: z.array(asset),
  inventory: z.array(
    z.object({
      archive: z.string(),
      path: z.string(),
      bytes: z.number(),
      sha256: z.string(),
      assetId: z.string().nullable(),
    }),
  ),
});
