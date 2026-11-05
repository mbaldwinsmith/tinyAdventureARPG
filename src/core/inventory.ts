import { ABILITIES, ABILITY_COOLDOWN, ABILITY_COST, BUILD_REWARDS } from '../content/builds';
import { rollAffixes } from './builds';
import { RandomStreams } from './random';
import type { ContentRegistry } from '../content/schemas';
import type { SaveState, ItemInstance } from './model';
import { itemInstanceSchema } from './model';
import { allocatedId, itemInstanceIdSchema, toolIdSchema } from './ids';
import { copyData } from './data';
import { stackIdentity } from './invariants';
import { effectiveStats } from './equipment';
import { transferItem } from './transactions';
import type { InventoryCommand } from './inventory-model';
/** All branches preflight detached owners; no failed command can consume an ID or item. */
export function inventoryTransaction(
  state: SaveState,
  content: ContentRegistry,
  command: InventoryCommand,
) {
  const player = copyData(state.player),
    pack = copyData(state.pack),
    build = copyData(state.build);
  let random: RandomStreams | null = null;
  let nextId = state.world.nextId,
    message = '';
  const allocate = () => {
    if (!Number.isSafeInteger(nextId + 1)) throw new Error('Item identity limit reached.');
    return itemInstanceIdSchema.parse(allocatedId(state.world.id, nextId++, 'item-instance'));
  };
  const item =
    'itemId' in command ? player.carried.items.find((i) => i.id === command.itemId) : null;
  if ('itemId' in command && !item) throw new Error('That item is no longer carried.');
  if (command.type === 'inventory.supplies') {
    if (pack.starterClaimed) throw new Error('These supplies have already been collected.');
    for (const [templateId, quantity, enchantments] of [
      ['item:wood', 12, []],
      ['item:iron-sword', 1, []],
      ['item:shield', 1, []],
      ['item:iron-sword', 1, [{ id: 'enchantment:keen', magnitude: 2 }]],
    ] as const) {
      const added = itemInstanceSchema.parse({
        id: allocate(),
        templateId,
        quantity,
        enchantments,
      });
      player.carried = receiveItem(player.carried, added, content);
    }
    for (const id of ['tool:sword', 'tool:shield']) {
      const tool = toolIdSchema.parse(id);
      if (!player.permanent.tools.includes(tool)) player.permanent.tools.push(tool);
    }
    pack.starterClaimed = true;
    message =
      'Collected 12 wood, an iron sword, a shield and a Keen +2 iron sword. Sword and shield ownership are permanent. Open your pack to equip a blade.';
  } else if (command.type === 'inventory.build-claim') {
    if (build.claims.includes(command.reward)) throw new Error('This prize was already claimed.');
    const reward = BUILD_REWARDS[command.reward];
    const names: string[] = [];
    if (reward.gear && reward.tier) {
      random = new RandomStreams(state.world.seed, state.random);
      const enchantments = rollAffixes(reward.gear, reward.tier, content, random);
      player.carried = receiveItem(
        player.carried,
        itemInstanceSchema.parse({
          id: allocate(),
          templateId: reward.gear,
          quantity: 1,
          lootTier: reward.tier,
          enchantments,
        }),
        content,
      );
      names.push(
        content.item(reward.gear).name +
          ' · ' +
          enchantments.map((e) => `${content.enchantment(e.id).name} +${e.magnitude}`).join(', '),
      );
    }
    if (reward.relic) {
      player.carried = receiveItem(
        player.carried,
        itemInstanceSchema.parse({
          id: allocate(),
          templateId: reward.relic,
          quantity: 1,
          enchantments: [],
        }),
        content,
      );
      names.push(content.item(reward.relic).name);
    }
    if (reward.ability) {
      build.unlocked.push(reward.ability);
      build.selected ??= reward.ability;
      names.push(`${ABILITIES[reward.ability].name} permanently unlocked`);
    }
    build.claims.push(command.reward);
    message = `Claimed ${reward.name}: ${names.join('; ')}.`;
  } else if (command.type === 'inventory.ability-select') {
    if (!build.unlocked.includes(command.ability)) throw new Error('Unlock this ability first.');
    if (build.active) throw new Error('Wait for the active ability to end before switching.');
    build.selected = command.ability;
    message = `Selected ${ABILITIES[command.ability].name}.`;
  } else if (command.type === 'inventory.ability-use') {
    if (!build.selected) throw new Error('Select an unlocked ability first.');
    if (state.clock.tick < build.readyTick || build.active)
      throw new Error('The ability is recovering.');
    const energy = player.actor.resources.energy;
    if (energy.current < ABILITY_COST) throw new Error('Wait for energy to recover.');
    if (!Number.isSafeInteger(state.clock.tick + ABILITY_COOLDOWN))
      throw new Error('Tick limit reached.');
    const ability = ABILITIES[build.selected];
    energy.current -= ABILITY_COST;
    build.active = { id: build.selected, remainingTicks: ability.ticks };
    build.readyTick = state.clock.tick + ABILITY_COOLDOWN;
    message = `${ability.name} activated.`;
  } else if (command.type === 'inventory.select') {
    pack.selectedTool = command.tool;
    message = `Selected ${command.tool}. The dedicated sword, shield, roll and bow bindings still work.`;
  } else if (item) {
    const template = content.item(item.templateId),
      equipped = player.equipment.some((e) => e.itemId === item.id);
    if (command.type === 'inventory.equip') {
      if (!template.equipmentSlots.includes(command.slot) || item.quantity !== 1)
        throw new Error('That item cannot use this equipment slot.');
      if (template.requiredTool !== null && !player.permanent.tools.includes(template.requiredTool))
        throw new Error(
          `Own the permanent ${content.tool(template.requiredTool).name} tool before equipping this item.`,
        );
      player.equipment = player.equipment.filter(
        (e) => e.itemId !== item.id && e.slot !== command.slot,
      );
      player.equipment.push({ slot: command.slot, itemId: item.id });
      message = `Equipped ${template.name}.`;
    } else if (command.type === 'inventory.unequip') {
      if (!equipped) throw new Error('That item is not equipped.');
      player.equipment = player.equipment.filter((e) => e.itemId !== item.id);
      message = `Unequipped ${template.name}. It remains carried.`;
    } else if (command.type === 'inventory.move') {
      if (command.position >= player.carried.items.length)
        throw new Error('Choose an occupied pack position.');
      player.carried.items = player.carried.items.filter((i) => i.id !== item.id);
      player.carried.items.splice(command.position, 0, item);
      message = `Moved ${template.name} to position ${command.position + 1}.`;
    } else if (command.type === 'inventory.split') {
      if (equipped || template.maxStack === 1) throw new Error('Unique equipment cannot be split.');
      if (command.quantity >= item.quantity)
        throw new Error('Split a smaller quantity than the complete stack.');
      if (player.carried.items.length >= player.carried.capacity)
        throw new Error('Your pack has no empty stack position. Deposit or merge items first.');
      item.quantity -= command.quantity;
      player.carried.items.push({ ...copyData(item), id: allocate(), quantity: command.quantity });
      message = `Split ${command.quantity} ${template.name} into a separate stack.`;
    } else if (command.type === 'inventory.merge') {
      const target = player.carried.items.find((i) => i.id === command.targetId);
      if (
        !target ||
        target.id === item.id ||
        template.maxStack === 1 ||
        stackIdentity(target) !== stackIdentity(item)
      )
        throw new Error('Only compatible stackable items with identical properties can merge.');
      if (command.quantity > item.quantity)
        throw new Error('That quantity is no longer available.');
      if (target.quantity + command.quantity > template.maxStack)
        throw new Error('The receiving stack cannot hold that quantity.');
      item.quantity -= command.quantity;
      target.quantity += command.quantity;
      player.carried.items = player.carried.items.filter((i) => i.quantity > 0);
      message = `Merged ${command.quantity} ${template.name}.`;
    } else if (command.type === 'inventory.discard') {
      if (equipped) throw new Error('Unequip that item before discarding it.');
      if (command.quantity > item.quantity)
        throw new Error('That quantity is no longer available.');
      item.quantity -= command.quantity;
      player.carried.items = player.carried.items.filter((i) => i.quantity > 0);
      message = `Discarded ${command.quantity} ${template.name}. Permanent tool ownership is unchanged.`;
    }
  }
  effectiveStats(player, content);
  return { player, pack, build, random, nextId, message };
}
/** A complete reward is accepted or left unclaimed. It never silently drops overflow. */
export function receiveItem(
  inventory: SaveState['player']['carried'],
  item: ItemInstance,
  content: ContentRegistry,
) {
  try {
    return transferItem(
      { capacity: 1, items: [item], money: 0 },
      inventory,
      item.id,
      item.quantity,
      content,
      () => {
        throw new Error('Whole rewards retain their identity');
      },
    ).destination;
  } catch (error) {
    if (error instanceof Error && error.message.includes('no space'))
      throw new Error(
        'Your pack is full. Deposit, merge or deliberately discard items, then collect this reward. It remains unclaimed.',
        { cause: error },
      );
    throw error;
  }
}
