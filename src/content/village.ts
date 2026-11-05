import { z } from 'zod';
import { entityIdSchema, itemIdSchema } from '../core/ids';

export const SHOP_REGION = 'region:merchant-shop';
export const MERCHANT_ID = entityIdSchema.parse('entity:merchant-tessa');
export const RESCUE_ID = entityIdSchema.parse('entity:forest-tessa');
export const STORE_DOOR = entityIdSchema.parse('entity:merchant-door');
export const STOCK_QUEST = 'quest:merchant-stock';
export const STOCK_WOOD = 3;
export const STOCK_REWARD = 12;
export const MERCHANT = {
  name: 'Tessa',
  texture: 'hero-4-idle',
  service: 'general-store',
} as const;
export const MERCHANT_PLOT = { x: 380, y: 112 };
export const RESERVED_PLOTS = [
  { id: 'entity:workshop-plot', name: 'Workshop reserve', position: { x: 114, y: 188 } },
  { id: 'entity:waterside-plot', name: 'Dock reserve', position: { x: 445, y: 218 } },
] as const;
export const MERCHANT_SHOP = {
  id: SHOP_REGION,
  name: 'Tessa’s General Store',
  style: 'cottage',
  width: 320,
  height: 192,
  spawns: [{ id: 'entry', position: { x: 160, y: 158 }, facing: 'up' }],
  objects: [
    { id: 'entity:merchant-shop-exit', position: { x: 160, y: 184 } },
    { id: MERCHANT_ID, position: { x: 206, y: 102 } },
  ],
  solids: [
    { id: 'north', owner: null, rect: { x: 0, y: 0, width: 320, height: 24 } },
    { id: 'west', owner: null, rect: { x: 0, y: 0, width: 16, height: 192 } },
    { id: 'east', owner: null, rect: { x: 304, y: 0, width: 16, height: 192 } },
    { id: 'south-west', owner: null, rect: { x: 0, y: 176, width: 144, height: 16 } },
    { id: 'south-east', owner: null, rect: { x: 176, y: 176, width: 144, height: 16 } },
    { id: 'counter', owner: null, rect: { x: 112, y: 74, width: 48, height: 8 } },
  ],
  water: [],
  interactions: [
    {
      id: 'entity:merchant-shop-exit',
      position: { x: 160, y: 184 },
      kind: 'door',
      label: 'Leave general store',
      text: '',
      destination: { regionId: 'region:clearing', spawn: 'merchant-return' },
    },
    {
      id: MERCHANT_ID,
      position: { x: 206, y: 102 },
      kind: 'village',
      label: 'Talk to Tessa',
      text: '',
      destination: null,
    },
  ],
};

export const villageNodeSchema = z.enum(['rescue', 'rescued', 'welcome', 'stock', 'shop']);
export const villageChoiceSchema = z.enum([
  'invite',
  'browse',
  'ask-stock',
  'accept-stock',
  'deliver-stock',
  'back',
]);
export type VillageNode = z.infer<typeof villageNodeSchema>;
const condition = z.enum(['route-open', 'quest-new', 'quest-ready']);
const dialogue = z.strictObject({
  title: z.string().min(1).max(80),
  body: z.string().min(1).max(500),
  choices: z
    .array(
      z.strictObject({
        id: villageChoiceSchema,
        label: z.string().min(1).max(80),
        next: villageNodeSchema,
        requires: condition.nullable().default(null),
        effect: z
          .enum(['recruit', 'accept-stock', 'deliver-stock', 'hear-stock'])
          .nullable()
          .default(null),
      }),
    )
    .max(4),
});
export const VILLAGE_DIALOGUE = z.record(villageNodeSchema, dialogue).parse({
  rescue: {
    title: 'Tessa at the trailhead',
    body: 'The brass gate has cut off the safe trail. Open it and I can bring my supplies to the clearing.',
    choices: [
      {
        id: 'invite',
        label: 'Invite Tessa to the village',
        next: 'rescued',
        requires: 'route-open',
        effect: 'recruit',
      },
    ],
  },
  rescued: {
    title: 'Tessa is coming home',
    body: 'I’ll set up my general store on the reserved plot northeast of the clearing. Come by when you get back.',
    choices: [],
  },
  welcome: {
    title: 'Talk to Tessa',
    body: 'The store is open. I trade wood and plain gear, and I could use a hand stocking the shelves.',
    choices: [
      { id: 'browse', label: 'Browse the shop', next: 'shop' },
      { id: 'ask-stock', label: 'Ask about shop supplies', next: 'stock', effect: 'hear-stock' },
    ],
  },
  stock: {
    title: 'Stock the shelves',
    body: 'Bring me three pieces of wood from your pack. I’ll pay twelve coins and stock the shop for the next travellers.',
    choices: [
      {
        id: 'accept-stock',
        label: 'Accept Stock the shelves',
        next: 'stock',
        requires: 'quest-new',
        effect: 'accept-stock',
      },
      {
        id: 'deliver-stock',
        label: 'Deliver 3 Wood',
        next: 'stock',
        requires: 'quest-ready',
        effect: 'deliver-stock',
      },
      { id: 'back', label: 'Back to Tessa', next: 'welcome' },
    ],
  },
  shop: {
    title: 'Tessa’s General Store',
    body: 'I buy and sell wood and plain equipment. Unequip gear before selling it.',
    choices: [{ id: 'back', label: 'Back to Tessa', next: 'welcome' }],
  },
});
for (const node of Object.values(VILLAGE_DIALOGUE)) {
  if (new Set(node.choices.map((choice) => choice.id)).size !== node.choices.length)
    throw new Error('Duplicate village dialogue choice');
}

export const SHOP_STOCK = z
  .array(
    z
      .strictObject({
        item: itemIdSchema,
        buy: z.number().int().min(1).max(999),
        sell: z.number().int().min(1).max(999),
      })
      .refine((row) => row.sell < row.buy, 'Sell price must be below buy price'),
  )
  .refine(
    (stock) => new Set(stock.map((row) => row.item)).size === stock.length,
    'Duplicate shop stock',
  )
  .parse([
    { item: 'item:wood', buy: 2, sell: 1 },
    { item: 'item:iron-sword', buy: 8, sell: 4 },
    { item: 'item:shield', buy: 6, sell: 3 },
  ]);
