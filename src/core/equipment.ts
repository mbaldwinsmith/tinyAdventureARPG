import { ABILITIES, LOOT_TIERS } from '../content/builds';
import type { EnemyFamily } from '../content/builds';
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
    for (const enchantment of item.enchantments) {
      const stat = content.enchantment(enchantment.id).stat;
      if (stat) result[stat] += enchantment.magnitude;
    }
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
export function buildEffects(state: SaveState, content: ContentRegistry) {
  const relic = state.player.equipment.find((item) => item.slot === 'slot:relic');
  const carried = state.player.carried.items.find((item) => item.id === relic?.itemId);
  const template = carried ? content.item(carried.templateId) : null;
  const active = state.build.active ? ABILITIES[state.build.active.id] : null;
  return {
    damageMultiplier: active?.damageMultiplier ?? 1,
    cooldownFactor: 1 - Math.min(0.4, (template?.toolRecovery ?? 0) + (active?.recovery ?? 0)),
    energyDiscount: Math.min(
      1,
      (template?.toolEnergyDiscount ?? 0) + (active?.energyDiscount ?? 0),
    ),
  };
}
export function toolEnergyCost(cost: number, discount: number) {
  return cost === 0 ? 0 : Math.max(1, cost - discount);
}
export function swordFamilyBonus(
  player: SaveState['player'],
  content: ContentRegistry,
  family: EnemyFamily | null,
) {
  if (family === null) return 0;
  const equipped = player.equipment.find((item) => item.slot === 'slot:main-hand');
  const sword = player.carried.items.find((item) => item.id === equipped?.itemId);
  return (
    sword?.enchantments.reduce(
      (bonus, affix) =>
        bonus + (content.enchantment(affix.id).enemyFamily === family ? affix.magnitude : 0),
      0,
    ) ?? 0
  );
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
    level: item.lootTier ? LOOT_TIERS[item.lootTier].level : null,
    kind: template.kind,
    maxStack: template.maxStack,
    equipped: !!equipped,
    equippedSlot: equipped?.slot ?? null,
    slots: template.equipmentSlots.map((id) => ({ id, name: content.slot(id).name })),
    properties: (['attack', 'defence', 'movementSpeedPixelsPerSecond'] as const)
      .filter((stat) => template.statModifiers[stat] !== 0)
      .map((stat) => ({ stat, label: STAT_LABELS[stat], value: template.statModifiers[stat] })),
    enchantments: item.enchantments.map((e) => {
      const definition = content.enchantment(e.id);
      return {
        ...e,
        name: definition.name,
        effect: definition.stat
          ? `${STAT_LABELS[definition.stat]} +${e.magnitude} while equipped`
          : `Sword hits deal +${e.magnitude} ${definition.name.toLowerCase()} damage against ${definition.enemyFamily}.`,
      };
    }),
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
