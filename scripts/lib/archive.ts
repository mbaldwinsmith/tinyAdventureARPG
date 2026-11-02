import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { unzipSync } from 'fflate';

export const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
export function isSafeMember(name: string): boolean {
  return (
    name.length > 0 &&
    !name.startsWith('/') &&
    !name.includes('\\') &&
    !name.split('/').includes('..')
  );
}
export function readPngSize(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (
    bytes.length < 24 ||
    view.getUint32(0) !== 0x89504e47 ||
    view.getUint32(4) !== 0x0d0a1a0a ||
    view.getUint32(12) !== 0x49484452
  )
    throw new Error('Invalid PNG signature or IHDR header.');
  const width = view.getUint32(16),
    height = view.getUint32(20);
  if (!width || !height || width > 8192 || height > 8192)
    throw new Error('PNG dimensions exceed the supported source budget.');
  return { width, height };
}
export function readArchive(
  bytes: Uint8Array,
  select: (name: string) => boolean = () => true,
): Record<string, Uint8Array> {
  if (bytes.length > 8 * 1024 * 1024) throw new Error('Archive exceeds 8 MiB compressed budget.');
  let entries = 0,
    expandedBytes = 0;
  return unzipSync(bytes, {
    filter: (entry) => {
      if (++entries > 4096) throw new Error('Archive exceeds member-count budget.');
      if (!isSafeMember(entry.name)) throw new Error(`Unsafe archive member: ${entry.name}`);
      if (entry.name.endsWith('/') || !select(entry.name)) return false;
      expandedBytes += entry.originalSize;
      if (entry.originalSize > 4 * 1024 * 1024 || expandedBytes > 32 * 1024 * 1024)
        throw new Error('Archive exceeds expanded-size budget.');
      return true;
    },
  });
}
export async function loadArchive(
  root: string,
  archive: string,
  select?: (name: string) => boolean,
) {
  if (!/^[^/\\]+\.zip$/.test(archive)) throw new Error(`Invalid archive name: ${archive}`);
  const bytes = await readFile(path.join(root, 'src/raw sprites', archive));
  return { sha256: sha256(bytes), bytes: bytes.length, members: readArchive(bytes, select) };
}
