import { describe, expect, it } from 'vitest';
import { zipSync } from 'fflate';
import { readArchive, readPngSize, sha256 } from './archive';

describe('bounded archive reader', () => {
  it('rejects traversal even in an unselected member', () => {
    const zip = zipSync({ '../escape.png': new Uint8Array([1, 2]) });
    expect(() => readArchive(zip, () => false)).toThrow('Unsafe');
  });
  it('returns only selected members without rewriting their bytes', () => {
    const bytes = new Uint8Array([2, 5, 7]);
    const result = readArchive(
      zipSync({ 'a.png': bytes, 'notes.txt': new Uint8Array([8]) }),
      (name) => name.endsWith('.png'),
    );
    expect(Object.keys(result)).toEqual(['a.png']);
    expect(result['a.png']).toEqual(bytes);
    expect(sha256(result['a.png'] ?? new Uint8Array())).toBe(sha256(bytes));
  });
  it('rejects unsupported PNG dimensions and malformed headers', () => {
    expect(() => readPngSize(new Uint8Array([1, 2, 3]))).toThrow('Invalid PNG');
    const bytes = new Uint8Array(24);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, 0x89504e47);
    view.setUint32(4, 0x0d0a1a0a);
    view.setUint32(12, 0x49484452);
    view.setUint32(16, 9000);
    view.setUint32(20, 16);
    expect(() => readPngSize(bytes)).toThrow('dimensions');
  });
});
