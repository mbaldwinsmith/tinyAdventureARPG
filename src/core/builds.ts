import { ABILITIES, BUILD_REWARDS, LOOT_TIERS } from '../content/builds';
import type { ContentRegistry } from '../content/schemas';
import type { ItemInstance, SaveState } from './model';
import type { RandomStreams } from './random';

export function rollAffixes(
  templateId: string,
  tier: keyof typeof LOOT_TIERS,
  content: ContentRegistry,
  random: RandomStreams,
): ItemInstance['enchantments'] {
  const template = content.item(templateId);
  const { maxAffixes, budget } = LOOT_TIERS[tier];
  const compatible = content.data.enchantments.filter((definition) =>
    definition.allowedTags.some((tag) => template.tags.includes(tag)),
  );
  const affixes: ItemInstance['enchantments'] = [];
  const groups = new Set<string>();
  let remaining = budget;
  for (let index = 0; index < maxAffixes; index++) {
    const pool = compatible.filter(
      (definition) =>
        (index !== 0 || !template.tags.includes('blade') || definition.enemyFamily !== null) &&
        definition.minimum <= remaining &&
        !affixes.some((affix) => affix.id === definition.id) &&
        (definition.exclusiveGroup === null || !groups.has(definition.exclusiveGroup)),
    );
    if (!pool.length) break;
    const definition = pool[random.integer('loot', pool.length)]!;
    const maximum = Math.min(
      definition.maximum,
      remaining - (index + 1 < maxAffixes && remaining > definition.minimum ? 1 : 0),
    );
    const magnitude = definition.minimum + random.integer('loot', maximum - definition.minimum + 1);
    affixes.push({ id: definition.id, magnitude });
    remaining -= magnitude;
    if (definition.exclusiveGroup) groups.add(definition.exclusiveGroup);
  }
  return affixes;
}

export function validateBuildState(state: SaveState) {
  const { claims, unlocked, selected, active } = state.build;
  if (new Set(claims).size !== claims.length || new Set(unlocked).size !== unlocked.length)
    throw new Error('Duplicate build reward or ability');
  const earned = claims.map((claim) => BUILD_REWARDS[claim].ability).filter((id) => id !== null);
  if (unlocked.length !== earned.length || unlocked.some((id) => !earned.includes(id)))
    throw new Error('An ability has no matching reward');
  if (selected !== null && !unlocked.includes(selected))
    throw new Error('Selected ability is locked');
  if (
    active &&
    (active.id !== selected ||
      active.remainingTicks > ABILITIES[active.id].ticks ||
      state.build.readyTick - state.clock.tick < active.remainingTicks)
  )
    throw new Error('Invalid active ability');
}
