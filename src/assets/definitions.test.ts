import { describe, expect, it } from 'vitest';
import { sourceSchema } from './definitions';

const source = { id: 'hero', archive: 'owned.zip', path: 'characters/hero.png' };
describe('curated asset boundary', () => {
  it.each(['../hero.png', '/hero.png', 'characters/../../hero.png', 'characters\\hero.png'])(
    'rejects unsafe archive member %s',
    (path) => {
      expect(sourceSchema.safeParse({ ...source, path }).success).toBe(false);
    },
  );
  it('rejects external archive paths and incomplete frame definitions', () => {
    expect(sourceSchema.safeParse({ ...source, archive: '../owned.zip' }).success).toBe(false);
    expect(sourceSchema.safeParse({ ...source, frameWidth: 16 }).success).toBe(false);
    expect(sourceSchema.safeParse({ ...source, frameWidth: 16, frameHeight: 16 }).success).toBe(
      true,
    );
  });
});
