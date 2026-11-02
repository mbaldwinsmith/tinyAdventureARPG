import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, rm, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';
import { assetSources, manifestSchema } from '../src/assets/definitions';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/generated');
const staging = path.join(root, 'public/.generated-staging');
const mode = process.argv[2];
if (mode !== 'build' && mode !== 'check')
  throw new Error('Usage: tsx scripts/assets.ts build|check');

const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const archives = new Map<string, Record<string, Uint8Array>>();
const manifest: {
  version: 1;
  assets: {
    id: string;
    file: string;
    width: number;
    height: number;
    sha256: string;
    frameWidth?: number;
    frameHeight?: number;
  }[];
} = { version: 1, assets: [] };
if (mode === 'build') {
  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });
}

for (const source of [...assetSources].sort((a, b) => a.id.localeCompare(b.id, 'en'))) {
  let archive = archives.get(source.archive);
  if (!archive) {
    const archiveBytes = await readFile(path.join(root, 'src/raw sprites', source.archive));
    if (archiveBytes.length > 8 * 1024 * 1024)
      throw new Error(`Archive exceeds import budget: ${source.archive}`);
    archive = unzipSync(archiveBytes, {
      filter: (entry) =>
        entry.originalSize <= 4 * 1024 * 1024 &&
        assetSources.some((asset) => asset.archive === source.archive && asset.path === entry.name),
    });
    archives.set(source.archive, archive);
  }
  const bytes = archive[source.path];
  if (!bytes) throw new Error(`Missing PNG: ${source.archive} → ${source.path}`);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length < 24 || view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a)
    throw new Error(`Not a valid PNG header: ${source.id}`);
  const width = view.getUint32(16),
    height = view.getUint32(20);
  if (
    source.frameWidth &&
    source.frameHeight &&
    (width % source.frameWidth || height % source.frameHeight)
  )
    throw new Error(`Frame dimensions do not fit ${source.id}: ${width}×${height}`);
  const file = `${source.id}.png`;
  const record = {
    id: source.id,
    file,
    width,
    height,
    sha256: hash(bytes),
    ...(source.frameWidth && source.frameHeight
      ? { frameWidth: source.frameWidth, frameHeight: source.frameHeight }
      : {}),
  };
  manifest.assets.push(record);
  if (mode === 'build') await writeFile(path.join(staging, file), bytes);
  else if (hash(await readFile(path.join(output, file))) !== record.sha256)
    throw new Error(`Generated asset differs from source: ${file}. Run npm run assets:build.`);
}
manifestSchema.parse(manifest);
const serialised = JSON.stringify(manifest, null, 2) + '\n';
if (mode === 'build') {
  await writeFile(path.join(staging, 'manifest.json'), serialised);
  await mkdir(path.dirname(output), { recursive: true });
  await rm(output, { recursive: true, force: true });
  await rename(staging, output);
} else {
  if ((await readFile(path.join(output, 'manifest.json'), 'utf8')) !== serialised)
    throw new Error('Generated manifest is stale. Run npm run assets:build.');
  const actualFiles = (await readdir(output)).sort();
  const expectedFiles = [...manifest.assets.map((asset) => asset.file), 'manifest.json'].sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles))
    throw new Error('Unexpected files in generated assets.');
}
console.log(
  `${mode === 'build' ? 'Built' : 'Verified'} ${manifest.assets.length} curated PNGs from ${archives.size} unchanged source archives.`,
);
