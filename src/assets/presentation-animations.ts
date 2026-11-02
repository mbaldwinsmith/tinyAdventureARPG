import { z } from 'zod';
import type { AssetManifest } from './definitions';
import { DIRECTIONS } from './hero-animations';
import { toolEffectParts, tongueParts } from './sprite-attachments';
import type { Direction } from './hero-animations';

const coordinate = z.number().int().nonnegative();
export const presentationAnimationSchema = z.object({
  id: z.string().min(1),
  texture: z.string().min(1),
  direction: z.enum(DIRECTIONS),
  loop: z.boolean(),
  foot: z.object({ x: coordinate, y: coordinate }),
  directionSource: z.enum(['shared', 'directional']),
  adaptation: z.string(),
  frames: z
    .array(
      z.object({
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
export type PresentationAnimation = z.infer<typeof presentationAnimationSchema>;
type Frame = PresentationAnimation['frames'][number];
type Block = {
  action: string;
  column: number;
  count: number;
  durationMs: number;
  loop?: boolean;
  shared?: boolean;
};
type EnemyLayout = {
  texture: string;
  variants: number;
  columns: number;
  header: number;
  blocks: readonly Block[];
  directions?: readonly Direction[];
};
const idleBlock: Block = { action: 'idle', column: 0, count: 4, durationMs: 220, loop: true };
const projectileBlock: Block = {
  action: 'projectile',
  column: 12,
  count: 4,
  durationMs: 100,
  loop: true,
};
const ENEMY_DIRECTIONS = ['down', 'right', 'up', 'left'] as const;
const standard: readonly Block[] = [
  { action: 'idle', column: 0, count: 4, durationMs: 220, loop: true },
  { action: 'walk', column: 4, count: 4, durationMs: 120, loop: true },
  { action: 'attack', column: 8, count: 4, durationMs: 150 },
  { action: 'hit', column: 12, count: 1, durationMs: 250 },
  { action: 'death', column: 13, count: 3, durationMs: 180 },
];
const projectile: readonly Block[] = [
  ...standard.slice(0, 3),
  { action: 'projectile', column: 12, count: 4, durationMs: 100, loop: true },
  { action: 'hit', column: 16, count: 1, durationMs: 250 },
  { action: 'death', column: 17, count: 3, durationMs: 180 },
];
const fourFrameHit: readonly Block[] = [
  ...standard.slice(0, 3),
  { action: 'hit', column: 12, count: 4, durationMs: 100 },
  { action: 'death', column: 16, count: 4, durationMs: 180 },
];
/** Reviewed sheet blocks. Header, recolour stride and nonstandard action columns are explicit. */
export const enemyLayouts: readonly EnemyLayout[] = [
  { texture: 'enemy-bear', variants: 4, columns: 16, header: 16, blocks: standard },
  { texture: 'enemy-creature', variants: 5, columns: 16, header: 16, blocks: standard },
  { texture: 'enemy-ghost', variants: 6, columns: 16, header: 16, blocks: standard },
  {
    texture: 'enemy-shadow',
    variants: 5,
    columns: 16,
    header: 16,
    blocks: standard.filter((b) => b.action !== 'death'),
  },
  {
    texture: 'enemy-toad',
    variants: 5,
    columns: 14,
    header: 16,
    blocks: standard.filter((b) => b.action !== 'death'),
  },
  { texture: 'enemy-imp', variants: 5, columns: 20, header: 16, blocks: projectile },
  {
    texture: 'enemy-beholder',
    variants: 5,
    columns: 24,
    header: 16,
    blocks: [
      ...standard.slice(0, 3),
      projectileBlock,
      { action: 'hit', column: 16, count: 4, durationMs: 100 },
      { action: 'death', column: 20, count: 4, durationMs: 180 },
    ],
  },
  { texture: 'enemy-mushrooms', variants: 6, columns: 20, header: 16, blocks: fourFrameHit },
  {
    texture: 'enemy-necromancer',
    variants: 4,
    columns: 16,
    header: 16,
    blocks: [
      { action: 'idle-walk', column: 0, count: 4, durationMs: 180, loop: true },
      { action: 'attack', column: 4, count: 4, durationMs: 150 },
      { action: 'projectile', column: 8, count: 4, durationMs: 100, loop: true, shared: true },
      ...standard.slice(3),
    ],
  },
  {
    texture: 'enemy-spider',
    variants: 5,
    columns: 16,
    header: 16,
    blocks: [
      ...standard.slice(0, 2),
      { action: 'hit', column: 8, count: 4, durationMs: 120 },
      { action: 'death', column: 12, count: 4, durationMs: 180, shared: true },
    ],
  },
  {
    texture: 'enemy-evil-flower',
    variants: 3,
    columns: 20,
    header: 16,
    blocks: [
      idleBlock,
      { action: 'attack', column: 4, count: 4, durationMs: 150 },
      { action: 'projectile', column: 8, count: 4, durationMs: 100, loop: true, shared: true },
      ...fourFrameHit.slice(3),
    ],
  },
  {
    texture: 'enemy-fall-ghost',
    variants: 3,
    columns: 24,
    header: 16,
    blocks: [
      ...standard.slice(0, 3),
      { action: 'projectile', column: 12, count: 4, durationMs: 100, loop: true, shared: true },
      { action: 'hit', column: 16, count: 4, durationMs: 100 },
      { action: 'death', column: 20, count: 4, durationMs: 180 },
    ],
  },
  {
    texture: 'enemy-santa-goblin',
    variants: 3,
    columns: 17,
    header: 16,
    blocks: [
      ...standard.slice(0, 3),
      { action: 'projectile', column: 12, count: 1, durationMs: 100, loop: true, shared: true },
      { action: 'hit', column: 13, count: 1, durationMs: 250 },
      { action: 'death', column: 14, count: 3, durationMs: 180 },
    ],
  },
  // Vulture has a two-frame attack, then one hit frame and a three-frame corpse sequence.
  {
    texture: 'enemy-vulture',
    variants: 3,
    directions: ['left', 'right'],
    columns: 14,
    header: 16,
    blocks: [
      idleBlock,
      { action: 'fly', column: 4, count: 4, durationMs: 120, loop: true },
      { action: 'attack', column: 8, count: 2, durationMs: 180 },
      { action: 'hit', column: 10, count: 1, durationMs: 220 },
      { action: 'death', column: 11, count: 3, durationMs: 180 },
    ],
  },
];

const definitions: PresentationAnimation[] = [];
function add(
  id: string,
  texture: string,
  direction: Direction,
  frames: Frame[],
  foot = { x: 8, y: 14 },
  loop = false,
  shared = false,
  adaptation = 'Playback timing and reference feet are authored presentation defaults; gameplay hit timing remains separate.',
) {
  definitions.push({
    id,
    texture,
    direction,
    frames,
    foot,
    loop,
    directionSource: shared ? 'shared' : 'directional',
    adaptation,
  });
}
function strip(
  column: number,
  row: number,
  count: number,
  width: number,
  height: number,
  durationMs: number,
): Frame[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (column + i) * width,
    y: row * height,
    width,
    height,
    durationMs,
  }));
}
for (const sheet of enemyLayouts) {
  for (let variant = 0; variant < sheet.variants; variant++) {
    for (const [row, direction] of (sheet.directions ?? ENEMY_DIRECTIONS).entries()) {
      for (const block of sheet.blocks) {
        const sourceRow = block.shared ? 0 : row;
        add(
          `${sheet.texture}-v${variant + 1}-${block.action}-${direction}`,
          sheet.texture,
          direction,
          strip(
            block.column,
            sheet.header / 16 + variant * (sheet.directions?.length ?? 4) + sourceRow,
            block.count,
            16,
            16,
            block.durationMs,
          ),
          undefined,
          block.loop,
          block.shared,
        );
      }
      // These sheets put a shared two/three-frame collapse vertically beside the actor rows.
      if (sheet.texture === 'enemy-toad' || sheet.texture === 'enemy-shadow') {
        const count = sheet.texture === 'enemy-toad' ? 2 : 3;
        const frames = Array.from({ length: count }, (_, i) => ({
          x: (sheet.texture === 'enemy-toad' ? 13 : 13 + i) * 16,
          y:
            sheet.header +
            (variant * 4 + 1 - (sheet.texture === 'enemy-toad' && i === 0 ? 1 : 0)) * 16,
          width: 16,
          height: 16,
          durationMs: 180,
        }));
        add(
          `${sheet.texture}-v${variant + 1}-death-${direction}`,
          sheet.texture,
          direction,
          frames,
          undefined,
          false,
          true,
        );
      }
    }
  }
}
for (const [species, actions] of [
  ['goblin', ['idle', 'walk', 'bow']],
  ['skeleton', ['idle', 'walk']],
  ['zombie', ['idle', 'walk']],
] as const) {
  for (const action of actions)
    for (const [row, direction] of ENEMY_DIRECTIONS.entries())
      add(
        `enemy-${species}-${action}-${direction}`,
        `enemy-${species}-${action}`,
        direction,
        strip(0, row, 4, 16, 16, action === 'idle' ? 220 : 140),
        undefined,
        action !== 'bow',
      );
}
for (const [row, direction] of ENEMY_DIRECTIONS.entries()) {
  for (const [action, column, count, loop] of [
    ['idle', 0, 4, true],
    ['walk', 5, 4, true],
    ['attack', 9, 4, false],
  ] as const)
    add(
      `enemy-soldier-${action}-${direction}`,
      'enemy-soldier',
      direction,
      strip(column, row, count, 32, 32, 140),
      { x: 16, y: 30 },
      loop,
    );
}
add(
  'enemy-mimic-closed',
  'enemy-mimic',
  'down',
  strip(0, 0, 1, 16, 16, 500),
  undefined,
  true,
  true,
);
add('enemy-mimic-wake', 'enemy-mimic', 'down', strip(0, 1, 4, 16, 16, 160), undefined, false, true);
add(
  'enemy-mimic-attack',
  'enemy-mimic',
  'down',
  strip(0, 2, 4, 16, 16, 140),
  undefined,
  false,
  true,
);

// Legacy strips retain inspected 19×11, 13×14 and 9×9 cells.
add(
  'enemy-bat-left-fly',
  'enemy-bat-left',
  'left',
  strip(0, 0, 2, 16, 16, 140),
  { x: 8, y: 14 },
  true,
);
add(
  'enemy-bat-right-fly',
  'enemy-bat-right',
  'right',
  strip(0, 0, 2, 16, 16, 140),
  { x: 8, y: 14 },
  true,
);
add(
  'enemy-rat-down-walk',
  'enemy-rat-down',
  'down',
  strip(0, 0, 2, 16, 16, 140),
  { x: 8, y: 14 },
  true,
);
add(
  'enemy-rat-left-walk',
  'enemy-rat-left',
  'left',
  strip(0, 0, 2, 19, 11, 140),
  { x: 9, y: 9 },
  true,
);
add(
  'enemy-rat-right-walk',
  'enemy-rat-right',
  'right',
  strip(0, 0, 2, 19, 11, 140),
  { x: 9, y: 9 },
  true,
);
add('enemy-rat-up-walk', 'enemy-rat-up', 'up', strip(0, 0, 2, 16, 16, 140), { x: 8, y: 14 }, true);
add(
  'enemy-slime-blue-down-bounce',
  'enemy-slime-blue-down',
  'down',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-blue-up-bounce',
  'enemy-slime-blue-up',
  'up',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-green-down-bounce',
  'enemy-slime-green-down',
  'down',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-green-up-bounce',
  'enemy-slime-green-up',
  'up',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-orange-down-bounce',
  'enemy-slime-orange-down',
  'down',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-orange-up-bounce',
  'enemy-slime-orange-up',
  'up',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-pink-down-bounce',
  'enemy-slime-pink-down',
  'down',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-slime-pink-up-bounce',
  'enemy-slime-pink-up',
  'up',
  strip(0, 0, 6, 13, 14, 140),
  { x: 6, y: 12 },
  true,
);
add(
  'enemy-tiny-slime-blue-down-bounce',
  'enemy-tiny-slime-blue-down',
  'down',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-blue-up-bounce',
  'enemy-tiny-slime-blue-up',
  'up',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-green-down-bounce',
  'enemy-tiny-slime-green-down',
  'down',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-green-up-bounce',
  'enemy-tiny-slime-green-up',
  'up',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-orange-down-bounce',
  'enemy-tiny-slime-orange-down',
  'down',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-orange-up-bounce',
  'enemy-tiny-slime-orange-up',
  'up',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-pink-down-bounce',
  'enemy-tiny-slime-pink-down',
  'down',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);
add(
  'enemy-tiny-slime-pink-up-bounce',
  'enemy-tiny-slime-pink-up',
  'up',
  strip(0, 0, 2, 9, 9, 140),
  { x: 4, y: 7 },
  true,
);

for (const action of ['idle', 'walk', 'bite'] as const)
  for (const [row, direction] of ENEMY_DIRECTIONS.entries())
    add(
      `king-${action}-${direction}`,
      `king-${action}`,
      direction,
      strip(0, row, 4, 32, 32, action === 'idle' ? 220 : 150),
      { x: 16, y: 30 },
      action !== 'bite',
    );
add(
  'king-death',
  'king-death',
  'down',
  strip(0, 0, 6, 32, 48, 200).map((f, i) => ({ ...f, durationMs: i === 5 ? 1200 : f.durationMs })),
  { x: 16, y: 46 },
  false,
  true,
  'Six 32×48 frames; retain the last frame after completion. Source About Boss.txt permits a held final corpse pose.',
);
for (const [direction, y, height, foot] of [
  ['down', 0, 64, { x: 32, y: 30 }],
  ['right', 64, 32, { x: 16, y: 30 }],
  ['up', 96, 64, { x: 32, y: 62 }],
  ['left', 192, 32, { x: 48, y: 30 }],
] as const) {
  add(
    `king-tongue-${direction}`,
    'king-tongue',
    direction,
    Array.from({ length: 8 }, (_, i) => ({
      x: i * 64,
      y,
      width: 64,
      height,
      durationMs: [180, 120, 100, 100, 260, 100, 100, 180][i] ?? 100,
    })),
    foot,
    false,
    false,
    'Mixed 64×64 vertical and 64×32 horizontal strips. Use the divided tongue for variable reach; never slice this entire 512×224 sheet as 64×64.',
  );
}
// Farm tool colour variants stay distinct from hero appearance identity. Default silver lives in heroAnimations.
for (let hero = 1; hero <= 6; hero++)
  for (let variant = 1; variant < 5; variant++) {
    for (const action of ['axe', 'hoe', 'pickaxe', 'water'])
      for (const [row, direction] of (['left', 'right', 'down', 'up'] as const).entries()) {
        const frames =
          action === 'water'
            ? strip({ left: 0, down: 1, right: 2, up: 3 }[direction], variant, 1, 32, 32, 450)
            : strip(0, variant * 4 + row, 4, 32, 32, 140);
        add(
          `hero-${hero}-${action}-colour${variant + 1}-${direction}`,
          `hero-${hero}-${action}`,
          direction,
          frames,
          { x: 16, y: action === 'water' ? 22 : 30 },
          false,
          false,
          'Supplied tool colour variant, not a new appearance or guaranteed equipment tier. Held tool and action effect are baked into the frames.',
        );
      }
  }
for (const [id, part] of Object.entries(toolEffectParts))
  add(
    id,
    part.texture,
    'down',
    [{ ...part, durationMs: 500 }],
    { x: Math.floor(part.width / 2), y: part.height },
    true,
    true,
    'Detached attachment source; launch sockets belong to hero action frames.',
  );
add(
  'magic-detached',
  'tool-magic-effect',
  'down',
  strip(0, 0, 4, 16, 16, 100),
  { x: 8, y: 8 },
  true,
  true,
  'Detached spell presentation, separate from the baked held rod.',
);
for (const direction of DIRECTIONS)
  for (const key of ['body', 'middle', 'tip'] as const) {
    const part = tongueParts[direction][key];
    add(
      `king-tongue-piece-${key}-${direction}`,
      part.texture,
      direction,
      [{ ...part, durationMs: 500 }],
      { x: Math.floor(part.width / 2), y: part.height },
      true,
      false,
      'Cropped opaque span for contiguous tongue assembly. Use the composition controls to inspect joins.',
    );
  }
export const presentationAnimations = z.array(presentationAnimationSchema).parse(definitions);
const requiredIds = new Set(presentationAnimations.map((a) => a.id));
export function validatePresentationAnimations(
  animations: readonly PresentationAnimation[],
  textures: AssetManifest['assets'],
): void {
  const ids = new Set<string>();
  for (const animation of animations) {
    presentationAnimationSchema.parse(animation);
    if (ids.has(animation.id)) throw new Error(`Duplicate presentation animation: ${animation.id}`);
    ids.add(animation.id);
    const texture = textures.find((t) => t.id === animation.texture);
    if (!texture) throw new Error(`Missing presentation texture: ${animation.id}`);
    const layout = enemyLayouts.find((s) => s.texture === animation.texture);
    if (
      layout &&
      (texture.width !== layout.columns * 16 ||
        texture.height !== layout.header + layout.variants * (layout.directions?.length ?? 4) * 16)
    )
      throw new Error(`Enemy layout no longer matches source dimensions: ${animation.texture}`);
    for (const frame of animation.frames) {
      if (frame.x + frame.width > texture.width || frame.y + frame.height > texture.height)
        throw new Error(`Presentation frame out of bounds: ${animation.id}`);
      if (layout && frame.y < layout.header)
        throw new Error(`Frame includes baked header: ${animation.id}`);
      if (animation.foot.x > frame.width || animation.foot.y > frame.height)
        throw new Error(`Presentation anchor outside frame: ${animation.id}`);
      for (const socket of frame.sockets ?? [])
        if (socket.x > frame.width || socket.y > frame.height)
          throw new Error(`Presentation socket outside frame: ${animation.id}`);
    }
  }
  for (const id of requiredIds)
    if (!ids.has(id)) throw new Error(`Missing required presentation animation: ${id}`);
}
