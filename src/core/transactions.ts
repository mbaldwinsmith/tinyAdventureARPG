import type { ItemInstance, SaveState } from './model';
import type { ContentRegistry } from '../content/schemas';
import { copyData } from './data';
import { stackIdentity } from './invariants';
type Inventory = SaveState['player']['carried'];
/** Preflight both inventories before returning a complete, detached transfer. */
export function transferItem(
  source: Inventory,
  destination: Inventory,
  itemId: string,
  quantity: number,
  content: ContentRegistry,
  allocate: () => ItemInstance['id'],
) {
  if (!Number.isSafeInteger(quantity) || quantity < 1)
    throw new Error('Choose a positive whole quantity.');
  const item = source.items.find((i) => i.id === itemId);
  if (!item || item.quantity < quantity) throw new Error('That quantity is no longer available.');
  const maximum = content.item(item.templateId).maxStack,
    identity = stackIdentity(item);
  const target = copyData(destination);
  let remaining = quantity;
  for (const stack of target.items)
    if (stackIdentity(stack) === identity) {
      const moved = Math.min(remaining, maximum - stack.quantity);
      stack.quantity += moved;
      remaining -= moved;
    }
  if (remaining > 0 && target.items.length >= target.capacity)
    throw new Error('The destination has no space.');
  const next = copyData(source),
    original = next.items.find((i) => i.id === itemId);
  if (!original) throw new Error('Missing source item');
  original.quantity -= quantity;
  next.items = next.items.filter((i) => i.quantity > 0);
  if (remaining > 0)
    target.items.push({
      ...copyData(item),
      id: quantity === item.quantity ? item.id : allocate(),
      quantity: remaining,
    });
  return { source: next, destination: target };
}
export function transferMoney(source: Inventory, destination: Inventory, amount: number) {
  if (!Number.isSafeInteger(amount) || amount < 1)
    throw new Error('Choose a positive whole amount.');
  if (source.money < amount) throw new Error('Not enough money.');
  if (destination.money > Number.MAX_SAFE_INTEGER - amount)
    throw new Error('The destination cannot hold that much money.');
  return {
    source: { ...copyData(source), money: source.money - amount },
    destination: { ...copyData(destination), money: destination.money + amount },
  };
}
