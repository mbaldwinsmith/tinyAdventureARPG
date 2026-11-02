import { z } from 'zod';
import definitions from './hero-animations.json';
import { HERO_IDS } from '../core/model';
import type { AssetManifest } from './definitions';

export const HERO_ACTIONS = [
  'idle',
  'walk',
  'sword',
  'bow',
  'shield-idle',
  'shield-walk',
  'fall',
  'item-pose',
  'pickup',
  'carry-idle',
  'carry-walk',
  'throw',
  'boomerang',
  'hit',
  'roll',
  'push',
  'pull',
  'swim-idle',
  'swim',
  'axe',
  'hoe',
  'pickaxe',
  'water',
  'fish-cast',
  'fish-wait',
  'fish-pull',
  'hook',
  'magic',
  'death',
  'bomb',
] as const;
export type HeroAction = (typeof HERO_ACTIONS)[number];
export const DIRECTIONS = ['down', 'left', 'up', 'right'] as const;
export type Direction = (typeof DIRECTIONS)[number];
const coordinate = z.number().int().nonnegative();
export const heroAnimationSchema = z.object({
  id: z.string(),
  hero: z.number().int().min(1).max(6),
  action: z.enum(HERO_ACTIONS),
  direction: z.enum(DIRECTIONS),
  texture: z.string(),
  loop: z.boolean(),
  foot: z.object({ x: coordinate, y: coordinate }),
  directionSource: z.enum(['shared', 'directional']),
  adaptation: z.string().optional(),
  frames: z
    .array(
      z.object({
        index: coordinate,
        x: coordinate,
        y: coordinate,
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        durationMs: z.number().int().positive(),
        sockets: z.array(z.object({ id: z.string(), x: coordinate, y: coordinate })).optional(),
      }),
    )
    .min(1),
});
export type HeroAnimation = z.infer<typeof heroAnimationSchema>;
export const heroAnimations = z.array(heroAnimationSchema).parse(definitions);

export function validateHeroAnimations(
  animations: readonly HeroAnimation[],
  textures: AssetManifest['assets'],
): void {
  const ids = new Set<string>();
  for (const animation of animations) {
    if (ids.has(animation.id)) throw new Error(`Duplicate animation ID: ${animation.id}`);
    ids.add(animation.id);
    const texture = textures.find((asset) => asset.id === animation.texture);
    if (!texture?.frameWidth || !texture.frameHeight)
      throw new Error(`Animation has no framed source: ${animation.id}`);
    for (const frame of animation.frames) {
      if (
        frame.width !== texture.frameWidth ||
        frame.height !== texture.frameHeight ||
        frame.x + frame.width > texture.width ||
        frame.y + frame.height > texture.height ||
        frame.x % frame.width ||
        frame.y % frame.height
      )
        throw new Error(`Frame out of bounds or off grid: ${animation.id}`);
      if (
        frame.index !==
        (frame.y / frame.height) * (texture.width / frame.width) + frame.x / frame.width
      )
        throw new Error(`Frame index/rectangle disagree: ${animation.id}`);
      if (animation.foot.x > frame.width || animation.foot.y > frame.height)
        throw new Error(`Foot anchor outside frame: ${animation.id}`);
      for (const socket of frame.sockets ?? []) {
        if (socket.x > frame.width || socket.y > frame.height)
          throw new Error(`Attachment socket outside frame: ${animation.id}`);
      }
    }
  }
  for (const hero of HERO_IDS)
    for (const action of HERO_ACTIONS)
      for (const direction of DIRECTIONS) {
        const id = `${hero}-${action}-${direction}`;
        if (!ids.has(id)) throw new Error(`Missing required hero animation: ${id}`);
      }
}
