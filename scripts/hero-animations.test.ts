import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { heroAnimations, validateHeroAnimations } from '../src/assets/hero-animations';
import { manifestSchema } from '../src/assets/definitions';

const textures = manifestSchema.parse(
  JSON.parse(readFileSync('public/generated/manifest.json', 'utf8')),
).assets;
describe('explicit animation coverage', () => {
  it('validates all six appearances, action families, directions and source rectangles', () => {
    expect(() => validateHeroAnimations(heroAnimations, textures)).not.toThrow();
  });
  it('rejects missing directions, index/rectangle mismatches and missing textures', () => {
    expect(() => validateHeroAnimations(heroAnimations.slice(1), textures)).toThrow(
      'Missing required',
    );
    const first = heroAnimations[0];
    if (!first) throw new Error('Missing fixture');
    expect(() =>
      validateHeroAnimations(
        [{ ...first, texture: 'absent' }, ...heroAnimations.slice(1)],
        textures,
      ),
    ).toThrow('no framed source');
    const frame = first.frames[0];
    if (!frame) throw new Error('Missing fixture frame');
    expect(() =>
      validateHeroAnimations(
        [{ ...first, frames: [{ ...frame, index: 999 }] }, ...heroAnimations.slice(1)],
        textures,
      ),
    ).toThrow('disagree');
  });
});
