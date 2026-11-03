import { z } from 'zod';
import {
  itemIdSchema,
  toolIdSchema,
  unlockIdSchema,
  enchantmentIdSchema,
  statusIdSchema,
  slotIdSchema,
} from '../core/ids';
import { freezeData } from '../core/data';

export const statSchema = z.enum(['attack', 'defence', 'movementSpeedPixelsPerSecond']);
export const damageTypeSchema = z.enum(['physical', 'fire', 'frost', 'arcane', 'poison']);
const name = z.string().trim().min(1).max(80);
const tag = z.string().regex(/^[a-z][a-z0-9-]*$/);
export const itemTemplateSchema = z
  .strictObject({
    id: itemIdSchema,
    name,
    kind: z.enum(['material', 'equipment', 'consumable', 'relic']),
    description: z.string().max(400).default('No additional ability effects.'),
    statModifiers: z
      .strictObject({
        attack: z.number().min(-1000).max(1000).default(0),
        defence: z.number().min(-1000).max(1000).default(0),
        movementSpeedPixelsPerSecond: z.number().min(-1000).max(1000).default(0),
      })
      .default({ attack: 0, defence: 0, movementSpeedPixelsPerSecond: 0 }),
    maxStack: z.number().int().min(1).max(999),
    tags: z.array(tag).max(32),
    equipmentSlots: z.array(slotIdSchema).max(16),
    requiredTool: toolIdSchema.nullable(),
  })
  .refine(
    (v) => !v.equipmentSlots.length || v.maxStack === 1,
    'Equippable items must be unique instances',
  );
export const enchantmentSchema = z
  .strictObject({
    id: enchantmentIdSchema,
    name,
    allowedTags: z.array(tag).min(1).max(32),
    exclusiveGroup: tag.nullable(),
    stat: statSchema,
    minimum: z.number().finite(),
    maximum: z.number().finite(),
  })
  .refine((v) => v.minimum <= v.maximum, 'Invalid enchantment range');
export const catalogueSchema = z.strictObject({
  version: z.literal(1),
  tools: z.array(z.strictObject({ id: toolIdSchema, name })),
  slots: z.array(z.strictObject({ id: slotIdSchema, name })),
  unlocks: z.array(
    z.strictObject({
      id: unlockIdSchema,
      name,
      requiresTools: z.array(toolIdSchema),
      requiresUnlocks: z.array(unlockIdSchema),
    }),
  ),
  items: z.array(itemTemplateSchema),
  enchantments: z.array(enchantmentSchema),
  statuses: z.array(
    z.strictObject({
      id: statusIdSchema,
      name,
      maxStacks: z.number().int().min(1).max(100),
      stat: statSchema,
      multiplier: z.number().min(0).max(10),
    }),
  ),
});
export type ContentCatalogue = z.infer<typeof catalogueSchema>;
export type ItemTemplate = z.infer<typeof itemTemplateSchema>;

export class MissingContentError extends Error {
  constructor(kind: string, id: string) {
    super(`Missing ${kind} content: ${id}`);
  }
}
/** Optional references use null explicitly. A non-null unknown ID is always an error. */
export class ContentRegistry {
  readonly data: Readonly<ContentCatalogue>;
  constructor(input: unknown) {
    const data = catalogueSchema.parse(input);
    for (const group of [
      data.tools,
      data.slots,
      data.unlocks,
      data.items,
      data.enchantments,
      data.statuses,
    ])
      if (new Set(group.map((v) => v.id)).size !== group.length)
        throw new Error('Duplicate content ID');
    this.data = freezeData(data);
    for (const item of data.items) {
      if (item.requiredTool !== null) this.tool(item.requiredTool);
      for (const slot of item.equipmentSlots) this.slot(slot);
    }
    const visiting = new Set<string>(),
      done = new Set<string>();
    const visit = (id: string) => {
      if (visiting.has(id)) throw new Error(`Cyclic progression: ${id}`);
      if (done.has(id)) return;
      const unlock = this.unlock(id);
      visiting.add(id);
      for (const tool of unlock.requiresTools) this.tool(tool);
      for (const prerequisite of unlock.requiresUnlocks) visit(prerequisite);
      visiting.delete(id);
      done.add(id);
    };
    for (const unlock of data.unlocks) visit(unlock.id);
  }
  item(id: string) {
    const v = this.data.items.find((v) => v.id === id);
    if (!v) throw new MissingContentError('item', id);
    return v;
  }
  tool(id: string) {
    const v = this.data.tools.find((v) => v.id === id);
    if (!v) throw new MissingContentError('tool', id);
    return v;
  }
  slot(id: string) {
    const v = this.data.slots.find((v) => v.id === id);
    if (!v) throw new MissingContentError('slot', id);
    return v;
  }
  unlock(id: string) {
    const v = this.data.unlocks.find((v) => v.id === id);
    if (!v) throw new MissingContentError('unlock', id);
    return v;
  }
  enchantment(id: string) {
    const v = this.data.enchantments.find((v) => v.id === id);
    if (!v) throw new MissingContentError('enchantment', id);
    return v;
  }
  status(id: string) {
    const v = this.data.statuses.find((v) => v.id === id);
    if (!v) throw new MissingContentError('status', id);
    return v;
  }
}
