import { z } from 'zod';
import { entityIdSchema, itemIdSchema, regionIdSchema } from '../core/ids';
import { SEASONS } from '../core/time';

export const FARM_REGION = regionIdSchema.parse('region:clearing');
export const FARM_PLOTS = [
  { id: entityIdSchema.parse('entity:clearing-plot-west'), position: { x: 160, y: 202 } },
  { id: entityIdSchema.parse('entity:clearing-plot'), position: { x: 176, y: 202 } },
  { id: entityIdSchema.parse('entity:clearing-plot-east'), position: { x: 192, y: 202 } },
] as const;
export const FARM_BARREL = {
  id: entityIdSchema.parse('entity:farm-barrel'),
  position: { x: 144, y: 218 },
};
export const WATER_CAPACITY = 4;
export const cropIdSchema = z.enum(['turnip', 'carrot', 'blueberry']);
const cropSchema = z
  .strictObject({
    name: z.string().min(1),
    seed: itemIdSchema,
    produce: itemIdSchema,
    seasons: z.array(z.enum(SEASONS)).min(1),
    days: z.number().int().min(2).max(28),
    regrow: z.number().int().positive().nullable(),
    yield: z.number().int().min(1).max(99),
    seedPrice: z.number().int().positive(),
    salePrice: z.number().int().positive(),
    artRow: z.number().int().nonnegative(),
  })
  .refine((crop) => crop.regrow === null || crop.regrow < crop.days);
export const CROPS = z.record(cropIdSchema, cropSchema).parse({
  turnip: {
    name: 'Turnip',
    seed: 'item:turnip-seed',
    produce: 'item:turnip',
    seasons: ['Spring', 'Autumn'],
    days: 2,
    regrow: null,
    yield: 1,
    seedPrice: 2,
    salePrice: 4,
    artRow: 9,
  },
  carrot: {
    name: 'Carrot',
    seed: 'item:carrot-seed',
    produce: 'item:carrot',
    seasons: ['Spring', 'Autumn'],
    days: 3,
    regrow: null,
    yield: 2,
    seedPrice: 3,
    salePrice: 3,
    artRow: 7,
  },
  blueberry: {
    name: 'Blueberry',
    seed: 'item:blueberry-seed',
    produce: 'item:blueberry',
    seasons: ['Spring', 'Summer'],
    days: 4,
    regrow: 2,
    yield: 2,
    seedPrice: 5,
    salePrice: 2,
    artRow: 12,
  },
});
