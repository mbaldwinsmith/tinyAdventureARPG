import { EXPEDITIONS } from './expeditions';
import { ContentRegistry } from './schemas';
import { saveSchema } from '../core/model';
import { RandomStreams } from '../core/random';
import { CLEARING, clearingPathAt, PREVIEW_SPEED_PIXELS_PER_SECOND } from './clearing';
import { PREVIEW_WORLD, woodlandPathAt } from './world';

/** Editable contract examples, not an approved release content budget or balance sheet. */
export const PREVIEW_CONTENT = new ContentRegistry({
  version: 1,
  tools: [
    'sword',
    'shield',
    'bow',
    'bomb',
    'hook',
    'boomerang',
    'magic',
    'axe',
    'hoe',
    'pickaxe',
    'watering-can',
    'fishing-rod',
  ].map((id) => ({ id: `tool:${id}`, name: id })),
  slots: [
    { id: 'slot:main-hand', name: 'Main hand' },
    { id: 'slot:off-hand', name: 'Off hand' },
    { id: 'slot:body', name: 'Body' },
    { id: 'slot:relic', name: 'Relic' },
  ],
  unlocks: [
    {
      id: 'unlock:woodland-route',
      name: 'Woodland route',
      requiresTools: ['tool:axe'],
      requiresUnlocks: [],
    },
  ],
  items: [
    {
      id: 'item:iron-sword',
      name: 'Iron sword',
      kind: 'equipment',
      maxStack: 1,
      tags: ['weapon', 'blade'],
      equipmentSlots: ['slot:main-hand'],
      requiredTool: 'tool:sword',
    },
    {
      id: 'item:wood',
      name: 'Wood',
      kind: 'material',
      maxStack: 99,
      tags: ['material'],
      equipmentSlots: [],
      requiredTool: null,
    },
    {
      id: 'item:shield',
      name: 'Shield',
      kind: 'equipment',
      maxStack: 1,
      tags: ['armour'],
      equipmentSlots: ['slot:off-hand'],
      requiredTool: 'tool:shield',
    },
  ],
  enchantments: [
    {
      id: 'enchantment:keen',
      name: 'Keen',
      allowedTags: ['blade'],
      exclusiveGroup: 'edge',
      stat: 'attack',
      minimum: 1,
      maximum: 5,
    },
  ],
  statuses: [
    {
      id: 'status:slowed',
      name: 'Slowed',
      maxStacks: 1,
      stat: 'movementSpeedPixelsPerSecond',
      multiplier: 0.5,
    },
  ],
});
export function createPreviewSave(seed = 'tiny-adventure-preview-v1') {
  return saveSchema.parse({
    schemaVersion: 1,
    contentVersion: 1,
    world: {
      id: 'world:preview',
      seed,
      generatorVersions: { terrain: 1, dungeon: 1, loot: 1 },
      nextId: 1,
      regions: [
        ...PREVIEW_WORLD.regions.map((region) => ({
          id: region.id,
          kind: 'surface',
          phase: region.id === 'region:clearing' ? 'active' : 'dormant',
          generatorVersion: 1,
          geometry: {
            version: 1,
            width: region.width / 16,
            height: region.height / 16,
            tilePixels: 16,
            tiles: Array.from({ length: (region.width / 16) * (region.height / 16) }, (_, i) => {
              const x = i % (region.width / 16),
                y = Math.floor(i / (region.width / 16));
              return region.style === 'clearing'
                ? clearingPathAt(x, y)
                  ? 1
                  : 0
                : region.style === 'woodland'
                  ? woodlandPathAt(x, y)
                    ? 1
                    : 0
                  : 0;
            }),
            objects: region.objects.map((object) => ({
              id: object.id,
              position: { ...object.position },
            })),
          },
          changes: {
            removedObjects: [],
            openedPassages: [],
            claimedRewards: [],
            openedObjects: [],
          },
        })),
        ...EXPEDITIONS.map((e) =>
          e.biome === 'crypt'
            ? { id: e.id, kind: 'dungeon', currentInstance: null }
            : { id: e.id, kind: 'surface', phase: 'unvisited' },
        ),
      ],
      dungeons: [],
    },
    player: {
      actor: {
        id: 'entity:player',
        position: { ...CLEARING.spawn },
        facing: 'down',
        stats: {
          attack: 1,
          defence: 0,
          movementSpeedPixelsPerSecond: PREVIEW_SPEED_PIXELS_PER_SECOND,
        },
        resources: { health: { current: 10, maximum: 10 }, energy: { current: 10, maximum: 10 } },
        resistances: [],
        statuses: [],
        cooldowns: [],
      },
      hero: 1,
      regionId: 'region:clearing',
      instanceId: null,
      permanent: {
        tools: [],
        unlocks: [],
        discoveredRegions: ['region:clearing'],
        kingDefeated: false,
        kingdomRestored: false,
      },
      carried: { capacity: 20, items: [], money: 0 },
      equipment: [],
      deposits: [],
    },
    clock: { tick: 0, remainderMs: 0, eventSequence: 0 },
    calendar: { day: 1, elapsedTicks: 0 },
    timeRules: { ticksPerDay: 30000, daysPerSeason: 28, startHour: 6 },
    random: new RandomStreams(seed).snapshot(),
  });
}
