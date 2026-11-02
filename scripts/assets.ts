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
import { loadArchive, readPngSize, sha256 } from './lib/archive';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/generated');
const staging = path.join(root, 'public/.generated-staging');
const mode = process.argv[2];
if (mode !== 'build' && mode !== 'check') throw new Error('Usage: assets.ts build|check');
const archives = new Map<string, Record<string, Uint8Array>>();
const manifest: AssetManifest = { version: 1, assets: [] };
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
    file,
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
  if (source.inspectionOnly) continue;
  if (mode === 'build') await writeFile(path.join(staging, file), bytes);
  else if (sha256(await readFile(path.join(output, file))) !== hash)
    throw new Error(`Generated asset differs from source: ${file}. Run npm run assets:build.`);
}
manifestSchema.parse(manifest);
validateHeroAnimations(heroAnimations, manifest.assets);
validatePresentationAnimations(presentationAnimations, manifest.assets);
validateSpriteAttachments(manifest.assets);
validateToolSockets(heroAnimations);
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
    ...manifest.assets.filter((asset) => !asset.inspectionOnly).map((asset) => asset.file),
    'manifest.json',
  ].sort();
  if (JSON.stringify((await readdir(output)).sort()) !== JSON.stringify(expected))
    throw new Error('Unexpected files in generated assets.');
}
console.log(
  `${mode === 'build' ? 'Built' : 'Verified'} ${manifest.assets.filter((asset) => !asset.inspectionOnly).length} runtime PNGs, ${manifest.assets.filter((asset) => asset.inspectionOnly).length} inspection-only records, ${heroAnimations.length} hero and ${presentationAnimations.length} presentation sequences and ${archives.size} unchanged source archives.`,
);
