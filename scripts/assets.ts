import { readFile, writeFile, mkdir, readdir, rm, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetSources, manifestSchema } from '../src/assets/definitions';
import type { AssetManifest } from '../src/assets/definitions';
import { heroAnimations, validateHeroAnimations } from '../src/assets/hero-animations';
import {
  presentationAnimations,
  validatePresentationAnimations,
} from '../src/assets/presentation-animations';
import { validateSpriteAttachments, validateToolSockets } from '../src/assets/sprite-attachments';
import { validateTerrain } from '../src/assets/terrain';
import { validateScenery, sceneryDefinitions } from '../src/assets/scenery';
import { buildNotices } from './lib/notices';
import { PNG } from 'pngjs';
import { buildAtlases } from './lib/atlas-builder';
import { collectRuntimeFrames } from './lib/runtime-frames';
import { validateGui } from '../src/assets/gui';
import { validateEffects } from '../src/assets/effects';
import { createAtlasLookup } from '../src/assets/atlas';
import { loadArchive, readPngSize, sha256 } from './lib/archive';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/generated');
const staging = path.join(root, 'public/.generated-staging');
const mode = process.argv[2];
if (mode !== 'build' && mode !== 'check') throw new Error('Usage: assets.ts build|check');
const archives = new Map<string, Record<string, Uint8Array>>();
const manifest: AssetManifest = { version: 2, assets: [], pages: [], frames: [] };
const decodedSources = new Map<string, PNG>();
if (mode === 'build') {
  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });
}
for (const source of [...assetSources].sort((a, b) => a.id.localeCompare(b.id, 'en'))) {
  let members = archives.get(source.archive);
  if (!members) {
    const archive = await loadArchive(root, source.archive, (name) =>
      assetSources.some((asset) => asset.archive === source.archive && asset.path === name),
    );
    members = archive.members;
    archives.set(source.archive, members);
  }
  const bytes = members[source.path];
  if (!bytes) throw new Error(`Missing PNG: ${source.archive} → ${source.path}`);
  const { width, height } = readPngSize(bytes);
  if (
    source.frameWidth &&
    source.frameHeight &&
    (width % source.frameWidth || height % source.frameHeight)
  )
    throw new Error(`Frame dimensions do not fit ${source.id}: ${width}×${height}`);
  const file = `${source.id}.png`,
    hash = sha256(bytes);
  const record = {
    id: source.id,
    sourceFile: file,
    inspectionOnly: source.inspectionOnly ?? false,
    width,
    height,
    sha256: hash,
    canonicalId: `sprite-${hash.slice(0, 16)}`,
    ...(source.frameWidth && source.frameHeight
      ? { frameWidth: source.frameWidth, frameHeight: source.frameHeight }
      : {}),
  };
  manifest.assets.push(record);
  if (!source.inspectionOnly) decodedSources.set(source.id, PNG.sync.read(Buffer.from(bytes)));
}

validateHeroAnimations(heroAnimations, manifest.assets);
validatePresentationAnimations(presentationAnimations, manifest.assets);
validateSpriteAttachments(manifest.assets);
validateToolSockets(heroAnimations);
validateTerrain(manifest.assets);
validateScenery(manifest.assets);
validateGui(manifest.assets);
validateEffects();
const atlas = buildAtlases(collectRuntimeFrames(manifest.assets), decodedSources);
manifest.pages = atlas.pages.map((page) => page.record);
manifest.frames = atlas.frames;
manifestSchema.parse(manifest);
createAtlasLookup(manifest);
for (const page of atlas.pages) {
  if (mode === 'build') {
    await writeFile(path.join(staging, page.record.image), page.image);
    await writeFile(path.join(staging, page.record.data), page.data);
  } else {
    if (
      sha256(await readFile(path.join(output, page.record.image))) !== page.record.imageSha256 ||
      sha256(await readFile(path.join(output, page.record.data))) !== page.record.dataSha256
    )
      throw new Error(
        `Generated atlas differs from source frames: ${page.record.id}. Run npm run assets:build.`,
      );
  }
}
const notices = await buildNotices(root);
const credits = await readFile(path.join(root, 'LICENSE-ASSETS.md'), 'utf8');
if (mode === 'build') {
  await writeFile(path.join(staging, 'THIRD_PARTY_NOTICES.txt'), notices);
  await writeFile(path.join(staging, 'CREDITS.txt'), credits);
  await writeFile(path.join(root, 'THIRD_PARTY_NOTICES.md'), notices);
} else if (
  (await readFile(path.join(output, 'THIRD_PARTY_NOTICES.txt'), 'utf8')) !== notices ||
  (await readFile(path.join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8')) !== notices ||
  (await readFile(path.join(output, 'CREDITS.txt'), 'utf8')) !== credits
)
  throw new Error('Third-party notices are stale. Run npm run assets:build.');
const serialised = JSON.stringify(manifest, null, 2) + '\n';
if (mode === 'build') {
  await writeFile(path.join(staging, 'manifest.json'), serialised);
  await mkdir(path.dirname(output), { recursive: true });
  await rm(output, { recursive: true, force: true });
  await rename(staging, output);
} else {
  if ((await readFile(path.join(output, 'manifest.json'), 'utf8')) !== serialised)
    throw new Error('Generated manifest is stale. Run npm run assets:build.');
  const expected = [
    ...manifest.pages.flatMap((page) => [page.image, page.data]),
    'manifest.json',
    'THIRD_PARTY_NOTICES.txt',
    'CREDITS.txt',
  ].sort();
  if (JSON.stringify((await readdir(output)).sort()) !== JSON.stringify(expected))
    throw new Error('Unexpected files in generated assets.');
}
console.log(
  `${mode === 'build' ? 'Built' : 'Verified'} ${manifest.assets.filter((asset) => !asset.inspectionOnly).length} runtime sources → ${manifest.frames.length} padded frames on ${manifest.pages.length} atlas pages, ${manifest.assets.filter((asset) => asset.inspectionOnly).length} inspection-only records, ${sceneryDefinitions.length} scenery compositions, ${heroAnimations.length} hero and ${presentationAnimations.length} presentation sequences and ${archives.size} unchanged source archives.`,
);
