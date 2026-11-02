import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { manifestSchema } from '../src/assets/definitions';
import {
  presentationAnimations,
  validatePresentationAnimations,
} from '../src/assets/presentation-animations';
import {
  composeTongue,
  validateSpriteAttachments,
  validateToolSockets,
} from '../src/assets/sprite-attachments';
import { heroAnimations, DIRECTIONS } from '../src/assets/hero-animations';

const textures = manifestSchema.parse(
  JSON.parse(readFileSync('public/generated/manifest.json', 'utf8')),
).assets;
const first = presentationAnimations[0];
if (!first) throw new Error('No presentation fixture');
const frame = first.frames[0];
if (!frame) throw new Error('No frame fixture');
describe('reviewed enemy and tool presentation sources', () => {
  it('validates mixed-size sequences, recolour blocks and attachment sources against actual generated textures', () => {
    validatePresentationAnimations(presentationAnimations, textures);
    validateSpriteAttachments(textures);
    validateToolSockets(heroAnimations);
  });
  it('rejects baked label rows, missing coverage and oversized mixed-layout frames', () => {
    expect(() =>
      validatePresentationAnimations(
        [{ ...first, frames: [{ ...frame, y: 0 }] }, ...presentationAnimations.slice(1)],
        textures,
      ),
    ).toThrow('baked header');
    expect(() => validatePresentationAnimations(presentationAnimations.slice(1), textures)).toThrow(
      'Missing required',
    );
    expect(() =>
      validatePresentationAnimations(
        [{ ...first, frames: [{ ...frame, x: 9999 }] }, ...presentationAnimations.slice(1)],
        textures,
      ),
    ).toThrow('out of bounds');
    expect(() =>
      validatePresentationAnimations([first, ...presentationAnimations], textures),
    ).toThrow('Duplicate');
    expect(() =>
      validateSpriteAttachments(textures.filter((t) => t.id !== 'king-tongue-pieces')),
    ).toThrow('Attachment source');
  });
});
it('rejects a tool action missing its separate effect socket', () => {
  const tool = heroAnimations.find((a) => a.action === 'hook');
  if (!tool) throw new Error('No hook fixture');
  expect(() =>
    validateToolSockets([
      { ...tool, frames: tool.frames.map((frame) => ({ ...frame, sockets: [] })) },
    ]),
  ).toThrow('Missing tool attachment socket');
});
describe('divided King tongue joins', () => {
  it('keeps the body fixed and every segment contiguous in all directions at minimum and maximum reach', () => {
    for (const direction of DIRECTIONS)
      for (const reach of [0, 1, 12]) {
        const composition = composeTongue(direction, reach);
        expect(composition.placements).toHaveLength(reach + 2);
        expect(composition.placements[0]).toMatchObject({ x: 0, y: 0 });
        const parts = composition.placements.slice(1);
        for (const [i, part] of parts.entries()) {
          const previous = i === 0 ? composition.placements[0] : parts[i - 1];
          if (!previous) throw new Error('Missing previous part');
          if (direction === 'right') expect(part.x).toBe(previous.x + previous.part.width);
          if (direction === 'left') expect(part.x + part.part.width).toBe(previous.x);
          if (direction === 'down') expect(part.y).toBe(previous.y + previous.part.height);
          if (direction === 'up') expect(part.y + part.part.height).toBe(previous.y);
          expect(part.x + composition.offsetX).toBeGreaterThanOrEqual(0);
          expect(part.y + composition.offsetY).toBeGreaterThanOrEqual(0);
          expect(part.x + composition.offsetX + part.part.width).toBeLessThanOrEqual(
            composition.width,
          );
          expect(part.y + composition.offsetY + part.part.height).toBeLessThanOrEqual(
            composition.height,
          );
        }
      }
  });
  it('rejects unbounded or fractional reach before allocating sprites', () => {
    for (const reach of [-1, 13, 0.5, NaN, Infinity])
      expect(() => composeTongue('down', reach)).toThrow('Tongue reach');
  });
});
