import { z } from 'zod';
import type { ContentRegistry } from '../content/schemas';
import type { SaveState } from './model';
import { copyData } from './data';
export const lossPolicySchema = z.strictObject({
  materialChance: z.number().min(0).max(1),
  moneyFraction: z.number().min(0).max(1),
});
/** Practice stays loss-free. The confirmed expedition policy rolls each material unit independently. */
export const PRACTICE_LOSS_POLICY = lossPolicySchema.parse({ materialChance: 0, moneyFraction: 0 });
export const EXPEDITION_LOSS_POLICY = lossPolicySchema.parse({
  materialChance: 0.25,
  moneyFraction: 0.1,
});
export function resolveDeathLoss(
  player: SaveState['player'],
  content: ContentRegistry,
  policy: z.infer<typeof lossPolicySchema>,
  draw: () => number,
) {
  const result = copyData(player.carried),
    lostItems: SaveState['player']['carried']['items'][number]['id'][] = [],
    losses: {
      id: SaveState['player']['carried']['items'][number]['id'];
      templateId: SaveState['player']['carried']['items'][number]['templateId'];
      quantity: number;
    }[] = [];
  result.items = result.items.filter((item) => {
    const definition = content.item(item.templateId);
    if (
      definition.kind !== 'material' ||
      definition.requiredTool !== null ||
      player.equipment.some((e) => e.itemId === item.id) ||
      policy.materialChance === 0
    )
      return true;
    let quantity = 0;
    for (let unit = 0; unit < item.quantity; unit++) {
      const value = draw();
      if (!Number.isFinite(value) || value < 0 || value >= 1)
        throw new Error('Invalid death random draw');
      if (value < policy.materialChance) quantity++;
    }
    if (quantity > 0) {
      losses.push({ id: item.id, templateId: item.templateId, quantity });
      item.quantity -= quantity;
    }
    if (item.quantity === 0) {
      lostItems.push(item.id);
      return false;
    }
    return true;
  });
  const lostMoney = Math.floor(result.money * policy.moneyFraction);
  result.money -= lostMoney;
  return { carried: result, lostItems, lostMoney, losses };
}
