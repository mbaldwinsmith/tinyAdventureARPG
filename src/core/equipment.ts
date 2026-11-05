import type { ContentRegistry } from '../content/schemas';
import type { SaveState, ItemInstance } from './model';
export type Stats = SaveState['player']['actor']['stats'];
export const STAT_LABELS = {
  attack: 'Attack',
  defence: 'Defence',
  movementSpeedPixelsPerSecond: 'Movement speed',
} as const;
/** Actor stats remain the saved base; equipment/status effects are derived, never accumulated. */
export function effectiveStats(player: SaveState['player'], content: ContentRegistry): Stats {
  const result = { ...player.actor.stats };
  for (const equipped of player.equipment) {
    const item = player.carried.items.find((i) => i.id === equipped.itemId);
    if (!item) throw new Error('Equipped item is not carried');
    const base = content.item(item.templateId).statModifiers;
    for (const stat of ['attack', 'defence', 'movementSpeedPixelsPerSecond'] as const)
      result[stat] += base[stat];
    for (const enchantment of item.enchantments)
      result[content.enchantment(enchantment.id).stat] += enchantment.magnitude;
  }
  for (const status of player.actor.statuses) {
    const definition = content.status(status.id);
    result[definition.stat] *= definition.multiplier ** status.stacks;
  }
  for (const stat of ['attack', 'defence', 'movementSpeedPixelsPerSecond'] as const) {
    if (!Number.isFinite(result[stat]))
      throw new Error('Equipment/status stats exceed the supported range');
    result[stat] = Math.max(0, result[stat]);
  }
  return result;
}
export function describeItem(
  item: ItemInstance,
  player: SaveState['player'],
  content: ContentRegistry,
  materialChance: number,
  deposited = false,
) {
  const template = content.item(item.templateId);
  const equipped = player.equipment.find((e) => e.itemId === item.id);
  return {
    ...item,
    name: template.name,
    description: template.description,
    kind: template.kind,
    maxStack: template.maxStack,
    equipped: !!equipped,
    equippedSlot: equipped?.slot ?? null,
    slots: template.equipmentSlots.map((id) => ({ id, name: content.slot(id).name })),
    properties: (['attack', 'defence', 'movementSpeedPixelsPerSecond'] as const)
      .filter((stat) => template.statModifiers[stat] !== 0)
      .map((stat) => ({ stat, label: STAT_LABELS[stat], value: template.statModifiers[stat] })),
    enchantments: item.enchantments.map((e) => ({
      ...e,
      name: content.enchantment(e.id).name,
      effect: `${STAT_LABELS[content.enchantment(e.id).stat]} ${e.magnitude >= 0 ? '+' : ''}${e.magnitude} while equipped`,
    })),
    tool:
      template.requiredTool === null
        ? null
        : {
            id: template.requiredTool,
            name: content.tool(template.requiredTool).name,
            owned: player.permanent.tools.includes(template.requiredTool),
          },
    lossRisk: deposited
      ? 'Protected in this local chest.'
      : template.kind === 'material' && template.requiredTool === null && !equipped
        ? `${Math.round(materialChance * 100)}% loss chance for each carried unit.`
        : 'Protected on death under the current materials-only rule.',
    unique: template.maxStack === 1 || item.enchantments.length > 0,
  };
}
