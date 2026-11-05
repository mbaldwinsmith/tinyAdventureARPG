import {
  MERCHANT,
  MERCHANT_ID,
  MERCHANT_PLOT,
  RESCUE_ID,
  SHOP_REGION,
  SHOP_STOCK,
  STOCK_QUEST,
  STOCK_REWARD,
  STOCK_WOOD,
  STORE_DOOR,
  VILLAGE_DIALOGUE,
} from '../content/village';
import type { VillageNode } from '../content/village';
import type { ContentRegistry } from '../content/schemas';
import type { Geometry, Position, SaveState } from './model';
import { itemInstanceSchema } from './model';
import { allocatedId } from './ids';
import { roomCenter } from './generation';
import { freeFoot, segmentBlocked } from './motion';
import type { Interaction, RegionDefinition } from './world';
import { receiveItem } from './inventory';
import type { VillageCommand } from './village-model';

export const merchantRecruited = (state: SaveState) =>
  state.domains.village.residents.some(
    (resident) => resident.id === MERCHANT_ID && resident.recruited,
  );
const stockQuest = (state: SaveState) =>
  state.domains.quests.find((quest) => quest.id === STOCK_QUEST);
const carriedWood = (state: SaveState) =>
  state.player.carried.items.reduce(
    (count, item) => count + (item.templateId === 'item:wood' ? item.quantity : 0),
    0,
  );
export function rescueRouteOpen(state: SaveState) {
  const forest = state.world.regions.find((region) => region.id === 'region:forest');
  return (
    forest?.kind === 'surface' &&
    forest.phase !== 'unvisited' &&
    forest.geometry.generated?.placements.some(
      (placement) =>
        placement.kind === 'gate-key' && forest.changes.openedPassages.includes(placement.id),
    )
  );
}

const rescueSites = new WeakMap<Geometry, Position>();
export function forestRescueSite(geometry: Geometry, definition: RegionDefinition) {
  const cached = rescueSites.get(geometry);
  if (cached) return cached;
  const layout = geometry.generated;
  const entry = layout?.rooms.find((room) => room.id === 0);
  if (!layout || !entry) throw new Error('Missing forest entry');
  const center = roomCenter(entry);
  const solids = definition.solids.map((solid) => solid.rect);
  for (const [dx, dy] of [
    [48, 48],
    [-48, 48],
    [48, -48],
    [-48, -48],
    [48, 24],
    [-48, 24],
    [48, -24],
    [-48, -24],
  ] as const) {
    const candidate = { x: center.x + dx, y: center.y + dy };
    if (
      !freeFoot(candidate, definition.width, definition.height, solids) ||
      layout.placements.some(
        (placement) =>
          Math.hypot(placement.position.x - candidate.x, placement.position.y - candidate.y) < 44,
      )
    )
      continue;
    const reachable = (
      [
        [0, 18],
        [-18, 0],
        [18, 0],
        [0, -18],
      ] as const
    ).some(([x, y]) => {
      const approach = { x: candidate.x + x, y: candidate.y + y };
      return (
        freeFoot(approach, definition.width, definition.height, solids) &&
        !solids.some((solid) => segmentBlocked(approach, candidate, solid))
      );
    });
    if (reachable) {
      rescueSites.set(geometry, candidate);
      return candidate;
    }
  }
  return null;
}

export function villageActor(
  state: SaveState,
  geometry: Geometry,
  definition: RegionDefinition,
  minuteOfDay: number,
) {
  if (definition.id === 'region:forest' && !merchantRecruited(state)) {
    const position = forestRescueSite(geometry, definition);
    return position ? { id: RESCUE_ID, position, emote: rescueRouteOpen(state) ? '!' : '?' } : null;
  }
  if (definition.id === SHOP_REGION) {
    const restocking = minuteOfDay >= 720 && minuteOfDay < 840;
    return {
      id: MERCHANT_ID,
      position: restocking ? { x: 226, y: 118 } : { x: 206, y: 102 },
      emote: restocking ? '…' : '•',
    };
  }
  return null;
}

export function rescueInteraction(actor: ReturnType<typeof villageActor>): Interaction[] {
  if (actor?.id !== RESCUE_ID) return [];
  return [
    {
      id: actor.id,
      position: actor.position,
      kind: 'village',
      label: 'Talk to Tessa at the trailhead',
      text: '',
      destination: null,
    },
  ];
}
export function storefrontSolid(state: SaveState) {
  return state.player.regionId === 'region:clearing' && merchantRecruited(state)
    ? [
        {
          owner: STORE_DOOR,
          rect: { x: MERCHANT_PLOT.x - 29, y: MERCHANT_PLOT.y - 20, width: 58, height: 13 },
        },
      ]
    : [];
}

export function villageChoices(state: SaveState, node: VillageNode) {
  const quest = stockQuest(state);
  return VILLAGE_DIALOGUE[node].choices.filter((choice) => {
    switch (choice.requires) {
      case 'route-open':
        return !merchantRecruited(state) && !!rescueRouteOpen(state);
      case 'quest-new':
        return !quest;
      case 'quest-ready':
        return quest?.phase === 'active' && carriedWood(state) >= STOCK_WOOD;
      default:
        return true;
    }
  });
}
function addMoney(state: SaveState, amount: number) {
  const next = state.player.carried.money + amount;
  if (!Number.isSafeInteger(next) || next < 0)
    throw new Error(amount < 0 ? 'You do not have enough coins.' : 'Your coin balance is full.');
  state.player.carried.money = next;
}

/** Mutates only the detached transaction draft. The caller adopts it after all checks. */
export function applyVillageCommand(
  state: SaveState,
  content: ContentRegistry,
  node: VillageNode,
  command: VillageCommand,
): VillageNode {
  if (command.type === 'village.choose') {
    const choice =
      command.node === node &&
      villageChoices(state, node).find((option) => option.id === command.choice);
    if (!choice) throw new Error('That dialogue choice is no longer available.');
    if (choice.effect === 'recruit') {
      state.domains.village.residents.push({
        id: MERCHANT_ID,
        recruited: true,
        service: MERCHANT.service,
      });
    } else if (choice.effect === 'hear-stock') {
      if (!state.domains.village.dialogueFlags.includes('heard-about-stock'))
        state.domains.village.dialogueFlags.push('heard-about-stock');
    } else if (choice.effect === 'accept-stock') {
      state.domains.quests.push({
        id: STOCK_QUEST,
        phase: 'active',
        progress: 0,
        rewardClaimed: false,
      });
    } else if (choice.effect === 'deliver-stock') {
      const quest = stockQuest(state);
      if (quest?.phase !== 'active' || quest.rewardClaimed)
        throw new Error('This quest reward was already claimed.');
      addMoney(state, STOCK_REWARD);
      let remaining = STOCK_WOOD;
      for (const item of state.player.carried.items) {
        if (item.templateId !== 'item:wood') continue;
        const quantity = Math.min(item.quantity, remaining);
        item.quantity -= quantity;
        remaining -= quantity;
      }
      state.player.carried.items = state.player.carried.items.filter((item) => item.quantity > 0);
      quest.phase = 'completed';
      quest.progress = STOCK_WOOD;
      quest.rewardClaimed = true;
    }
    return choice.next;
  }
  if (node !== 'shop' || state.player.regionId !== SHOP_REGION || !merchantRecruited(state))
    throw new Error('Talk to Tessa and browse the store before trading.');
  if (command.type === 'village.buy') {
    const offer = SHOP_STOCK.find((row) => row.item === command.item);
    if (!offer?.buy) throw new Error('The store does not stock that item.');
    if (command.quantity > content.item(offer.item).maxStack)
      throw new Error('Choose a quantity within the stack limit.');
    if (!Number.isSafeInteger(state.world.nextId + 1))
      throw new Error('Item identity limit reached.');
    addMoney(state, -offer.buy * command.quantity);
    state.player.carried = receiveItem(
      state.player.carried,
      itemInstanceSchema.parse({
        id: allocatedId(state.world.id, state.world.nextId++, 'item-instance'),
        templateId: offer.item,
        quantity: command.quantity,
        enchantments: [],
      }),
      content,
    );
  } else {
    const item = state.player.carried.items.find((entry) => entry.id === command.itemId);
    const offer = item && SHOP_STOCK.find((row) => row.item === item.templateId);
    if (!item || !offer?.sell || item.enchantments.length || item.lootTier)
      throw new Error('Tessa buys wood, farm produce and plain equipment.');
    if (state.player.equipment.some((entry) => entry.itemId === item.id))
      throw new Error('Unequip the item before selling it.');
    if (item.quantity < command.quantity) throw new Error('You do not carry that quantity.');
    addMoney(state, offer.sell * command.quantity);
    item.quantity -= command.quantity;
    state.player.carried.items = state.player.carried.items.filter((entry) => entry.quantity > 0);
  }
  return 'shop';
}

export function villageView(state: SaveState, content: ContentRegistry, node: VillageNode | null) {
  const recruited = merchantRecruited(state),
    quest = stockQuest(state);
  const stocked = !!quest?.rewardClaimed;
  const stage = stocked
    ? 'Market stocked'
    : recruited
      ? 'General store open'
      : 'Reserved plots marked';
  const hint = stocked
    ? 'Buy and sell supplies at the general store.'
    : quest
      ? 'Return to Tessa with three pieces of wood.'
      : recruited
        ? 'Visit the northeast plot and ask Tessa about shop supplies.'
        : rescueRouteOpen(state)
          ? 'Invite Tessa at the Whispering Forest trailhead.'
          : 'Find Tessa at the Whispering Forest trailhead and unlock its brass gate.';
  return {
    recruited,
    stage,
    hint,
    quest: quest
      ? {
          complete: stocked,
          wood: stocked ? STOCK_WOOD : Math.min(STOCK_WOOD, carriedWood(state)),
          required: STOCK_WOOD,
        }
      : null,
    transaction: state.nextTransaction,
    dialogue: node
      ? { node, choices: villageChoices(state, node).map(({ id, label }) => ({ id, label })) }
      : null,
    shop:
      node === 'shop'
        ? {
            money: state.player.carried.money,
            offers: SHOP_STOCK.flatMap(({ item, buy }) =>
              buy === null
                ? []
                : [{ item, buy, name: content.item(item).name, max: content.item(item).maxStack }],
            ),
            sales: state.player.carried.items.flatMap((item) => {
              const offer = SHOP_STOCK.find((row) => row.item === item.templateId);
              return offer?.sell &&
                !item.enchantments.length &&
                !item.lootTier &&
                !state.player.equipment.some((entry) => entry.itemId === item.id)
                ? [
                    {
                      id: item.id,
                      name: content.item(item.templateId).name,
                      quantity: item.quantity,
                      max: content.item(item.templateId).maxStack,
                      price: offer.sell,
                    },
                  ]
                : [];
            }),
          }
        : null,
  };
}
