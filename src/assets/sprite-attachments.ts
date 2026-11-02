import type { AssetManifest } from './definitions';
import type { Direction, HeroAnimation } from './hero-animations';

export interface SpritePart {
  texture: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export const toolEffectParts = {
  'hook-head': { texture: 'tool-hook-pole', x: 3, y: 3, width: 9, height: 10 },
  'tether-vertical': { texture: 'tool-hook-pole', x: 6, y: 16, width: 3, height: 16 },
  'tether-horizontal': { texture: 'tool-hook-pole', x: 22, y: 23, width: 3, height: 2 },
} satisfies Record<string, SpritePart>;
export const toolEffectBindings = [
  {
    actions: ['hook'],
    socket: 'hook-launch',
    effect: 'hook-head',
    note: 'Rotate the detached head/tether into the launch direction; the held hook is already baked in.',
  },
  {
    actions: ['magic'],
    socket: 'magic-launch',
    effect: 'magic-detached',
    note: 'Spawn the detached 16px effect after the held-rod cast. Combat timing is defined later.',
  },
  {
    actions: ['fish-cast', 'fish-wait', 'fish-pull'],
    socket: 'fishing-line',
    effect: 'line',
    note: 'Separate authored line to a world-space float; never duplicate the baked rod. No ammunition.',
  },
  {
    actions: ['axe', 'hoe', 'pickaxe', 'water'],
    socket: 'tool-target',
    effect: 'baked',
    note: 'Held tool and action pixels are already supplied. This socket marks an authored target guide, not damage.',
  },
] as const;
export interface TongueParts {
  body: SpritePart;
  middle: SpritePart;
  tip: SpritePart;
  mouth: { x: number; y: number };
}
const part = (x: number, y: number, width: number, height: number): SpritePart => ({
  texture: 'king-tongue-pieces',
  x,
  y,
  width,
  height,
});
export const tongueParts: Record<Direction, TongueParts> = {
  down: {
    body: part(0, 0, 32, 32),
    middle: part(11, 48, 10, 16),
    tip: part(11, 80, 10, 16),
    mouth: { x: 16, y: 32 },
  },
  right: {
    body: part(32, 0, 32, 32),
    middle: part(48, 54, 16, 4),
    tip: part(48, 86, 16, 4),
    mouth: { x: 32, y: 24 },
  },
  up: {
    body: part(64, 0, 32, 32),
    middle: part(75, 48, 10, 16),
    tip: part(75, 80, 10, 16),
    mouth: { x: 16, y: 0 },
  },
  left: {
    body: part(96, 0, 32, 32),
    middle: part(112, 54, 16, 4),
    tip: part(112, 86, 16, 4),
    mouth: { x: 0, y: 24 },
  },
};
/** Placement is relative to the body origin. Repeating only the cropped opaque span leaves no gaps. */
export function composeTongue(direction: Direction, middleCount: number) {
  if (!Number.isInteger(middleCount) || middleCount < 0 || middleCount > 12)
    throw new Error('Tongue reach must be an integer from 0 to 12.');
  const parts = tongueParts[direction];
  const placements = [{ part: parts.body, x: 0, y: 0 }];
  for (let i = 0; i <= middleCount; i++) {
    const selected = i === middleCount ? parts.tip : parts.middle;
    const vertical = direction === 'up' || direction === 'down';
    const x = vertical
      ? parts.mouth.x - selected.width / 2
      : direction === 'right'
        ? parts.mouth.x + i * 16
        : parts.mouth.x - (i + 1) * 16;
    const y = vertical
      ? direction === 'down'
        ? parts.mouth.y + i * 16
        : parts.mouth.y - (i + 1) * 16
      : parts.mouth.y - selected.height / 2;
    placements.push({ part: selected, x, y });
  }
  const minX = Math.min(...placements.map((p) => p.x)),
    minY = Math.min(...placements.map((p) => p.y));
  const width = Math.max(...placements.map((p) => p.x + p.part.width)) - minX;
  const height = Math.max(...placements.map((p) => p.y + p.part.height)) - minY;
  return {
    placements,
    width,
    height,
    offsetX: -minX,
    offsetY: -minY,
    foot: { x: 16 - minX, y: 30 - minY },
  };
}
export function validateSpriteAttachments(textures: AssetManifest['assets']): void {
  const parts = [
    ...Object.values(toolEffectParts),
    ...Object.values(tongueParts).flatMap((p) => [p.body, p.middle, p.tip]),
  ];
  for (const part of parts) {
    const texture = textures.find((t) => t.id === part.texture);
    if (
      !texture ||
      part.x < 0 ||
      part.y < 0 ||
      part.width <= 0 ||
      part.height <= 0 ||
      part.x + part.width > texture.width ||
      part.y + part.height > texture.height
    )
      throw new Error(`Attachment source missing or out of bounds: ${part.texture}`);
  }
}

export function validateToolSockets(animations: readonly HeroAnimation[]): void {
  for (const animation of animations) {
    const binding = toolEffectBindings.find((entry) =>
      entry.actions.some((action) => action === animation.action),
    );
    if (!binding) continue;
    for (const frame of animation.frames) {
      if (!frame.sockets?.some((socket) => socket.id === binding.socket))
        throw new Error(`Missing tool attachment socket: ${animation.id} → ${binding.socket}`);
    }
  }
}
