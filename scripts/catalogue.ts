import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { catalogueSchema } from '../src/assets/catalogue-schema';
import { loadArchive, readPngSize, sha256 } from './lib/archive';
import type {
  CatalogueAsset,
  CatalogueSource,
  SpriteCatalogue,
} from '../src/assets/catalogue-types';

const root = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv[2];
if (!['build', 'check'].includes(mode ?? '')) throw new Error('Usage: catalogue.ts build|check');
const annotationSchema = z.object({
  auditDate: z.string(),
  annotations: z.array(
    z.object({
      sha256: z.string(),
      visual_id: z.string(),
      category: z.string(),
      identity: z.string(),
      groups: z.array(z.string()),
      related_groups: z.array(z.string()),
      suggested_use: z.string(),
      notes: z.array(z.string()),
      suggested_cell: z.array(z.number()).nullable(),
      framing_basis: z.string(),
      version_policy: z.string(),
    }),
  ),
});
const baseline = z
  .object({
    counts: z.object({
      archives: z.number(),
      file_entries: z.number(),
      png_entries: z.number(),
      unique_pngs: z.number(),
      support_text_entries: z.number(),
      duplicate_png_occurrences: z.number(),
    }),
    archives: z.array(z.object({ name: z.string(), sha256: z.string() })),
  })
  .parse(JSON.parse(await readFile(path.join(root, 'docs/sprites/audit-baseline.json'), 'utf8')));
const audit = annotationSchema.parse(
  JSON.parse(await readFile(path.join(root, 'docs/sprites/audit-annotations.json'), 'utf8')),
);
const annotations = new Map(audit.annotations.map((a) => [a.sha256, a]));
if (annotations.size !== audit.annotations.length)
  throw new Error('Duplicate audit annotation hashes.');
const sources = new Map<string, CatalogueSource[]>();
const dimensions = new Map<string, { width: number; height: number }>();
const blobs = new Map<string, Uint8Array>();
const inventory: SpriteCatalogue['inventory'] = [];
const archives: SpriteCatalogue['archives'] = [];
const archiveNames = (await readdir(path.join(root, 'src/raw sprites')))
  .filter((name) => name.endsWith('.zip'))
  .sort();
if (JSON.stringify(archiveNames) !== JSON.stringify(baseline.archives.map((a) => a.name).sort()))
  throw new Error('Archive list differs from the reviewed baseline. Reconcile the source audit.');
for (const name of archiveNames) {
  const archive = await loadArchive(root, name);
  if (baseline.archives.find((a) => a.name === name)?.sha256 !== archive.sha256)
    throw new Error(`Archive differs from reviewed baseline: ${name}`);
  const members = Object.entries(archive.members).sort(([a], [b]) => a.localeCompare(b, 'en'));
  let pngs = 0;
  for (const [member, bytes] of members) {
    const hash = sha256(bytes),
      isPng = member.toLowerCase().endsWith('.png');
    const assetId = isPng ? `sprite-${hash.slice(0, 16)}` : null;
    inventory.push({ archive: name, path: member, bytes: bytes.length, sha256: hash, assetId });
    if (!isPng) continue;
    pngs++;
    if (!annotations.has(hash)) throw new Error(`Unreviewed PNG: ${name} → ${member}`);
    dimensions.set(hash, readPngSize(bytes));
    blobs.set(hash, bytes);
    const group = sources.get(hash) ?? [];
    group.push({ archive: name, path: member, bytes: bytes.length, sha256: hash });
    sources.set(hash, group);
  }
  archives.push({
    name,
    sha256: archive.sha256,
    bytes: archive.bytes,
    files: members.length,
    pngs,
    identicalArchives: [],
  });
}
for (const archive of archives)
  archive.identicalArchives = archives
    .filter((other) => other.sha256 === archive.sha256 && other.name !== archive.name)
    .map((a) => a.name);
if (sources.size !== annotations.size)
  throw new Error('Some audit annotations no longer resolve to a source PNG.');
const preference = [
  'TAP_anim_v2.zip',
  'TAPp_anim_v2.zip',
  'TDP_anim_v2.zip',
  'TAP_Enemies_v2.zip',
  'TDP_zombie_v2.zip',
  'TFP_anim_v2.zip',
  'Additional Animations.zip',
];
function rank(source: CatalogueSource) {
  const position = preference.indexOf(source.archive);
  return position < 0 ? 100 + (source.archive.includes('(1)') ? 100 : 0) : position;
}
const assets: CatalogueAsset[] = [...sources.entries()]
  .map(([hash, aliases]) => {
    const a = annotations.get(hash),
      size = dimensions.get(hash);
    if (!a || !size) throw new Error(`Missing annotation/dimensions: ${hash}`);
    aliases.sort(
      (left, right) =>
        rank(left) - rank(right) ||
        left.archive.localeCompare(right.archive, 'en') ||
        left.path.localeCompare(right.path, 'en'),
    );
    const preferredSource = aliases[0];
    if (!preferredSource) throw new Error('No canonical source.');
    return {
      id: `sprite-${hash.slice(0, 16)}`,
      auditId: a.visual_id,
      sha256: hash,
      ...size,
      category: a.category,
      identity: a.identity,
      groups: a.groups,
      relatedGroups: a.related_groups,
      suggestedUse: a.suggested_use,
      notes: a.notes,
      suggestedCell: a.suggested_cell,
      framingBasis: a.framing_basis,
      versionPolicy: a.version_policy,
      preferredSource,
      sources: aliases,
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id, 'en'));
if (new Set(assets.map((a) => a.id)).size !== assets.length)
  throw new Error('Canonical ID collision. Extend the hash prefix.');
const pngEntries = inventory.filter((entry) => entry.assetId).length;
const counts = {
  archives: archives.length,
  file_entries: inventory.length,
  png_entries: pngEntries,
  unique_pngs: assets.length,
  support_text_entries: inventory.length - pngEntries,
  duplicate_png_occurrences: pngEntries - assets.length,
};
if (JSON.stringify(counts) !== JSON.stringify(baseline.counts))
  throw new Error(`Audit counts differ: ${JSON.stringify(counts)}`);
const catalogue: SpriteCatalogue = {
  version: 1,
  auditDate: audit.auditDate,
  counts,
  archives,
  assets,
  inventory,
};
catalogueSchema.parse(catalogue);
const groups = new Set(assets.flatMap((asset) => asset.groups));
for (const asset of assets)
  if (asset.relatedGroups.some((group) => !groups.has(group)))
    throw new Error(`Unknown companion group: ${asset.id}`);
const selectedEnemies = z
  .array(z.object({ canonicalId: z.string(), archive: z.string(), path: z.string() }))
  .parse(
    JSON.parse(await readFile(path.join(root, 'docs/sprites/selected-enemy-sources.json'), 'utf8')),
  );
for (const selected of selectedEnemies) {
  const asset = assets.find((asset) => asset.id === selected.canonicalId);
  if (
    !asset?.sources.some(
      (source) => source.archive === selected.archive && source.path === selected.path,
    )
  )
    throw new Error(`Selected enemy source no longer resolves: ${selected.path}`);
}
const json = JSON.stringify(catalogue) + '\n';
const target = path.join(root, 'docs/sprites/catalogue.json');
if (mode === 'check') {
  if ((await readFile(target, 'utf8')) !== json)
    throw new Error('Catalogue is stale. Run npm run catalogue:build.');
} else {
  await writeFile(target, json);
  const cache = path.join(root, '.cache/catalogue');
  await mkdir(cache, { recursive: true });
  await writeFile(path.join(cache, 'index.json'), json);
  for (const asset of assets) {
    const bytes = blobs.get(asset.sha256);
    if (!bytes) throw new Error('Missing preview bytes.');
    await writeFile(path.join(cache, asset.id + '.png'), bytes);
  }
}
console.log(
  `${mode === 'check' ? 'Verified' : 'Built'} catalogue: ${archives.length} archives, ${pngEntries} PNG occurrences, ${assets.length} canonical images; 30 support-text entries retained.`,
);
