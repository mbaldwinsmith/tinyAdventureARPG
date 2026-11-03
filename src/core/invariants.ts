import { validateGeneratedGeometry } from './generation';
import { assertCombatInvariants } from './combat-invariants';
import type { ContentRegistry } from '../content/schemas';
import type { ItemInstance, SaveState } from './model';

export function stackIdentity(item: ItemInstance): string {
  return JSON.stringify([
    item.templateId,
    [...item.enchantments]
      .sort((a, b) => a.id.localeCompare(b.id, 'en'))
      .map((e) => [e.id, e.magnitude]),
  ]);
}
function unique(values: readonly string[], label: string) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`);
}
/** Semantic checks supplement the structural schema, at creation/import/checkpoint boundaries. */
export function assertWorldInvariants(state: SaveState, content: ContentRegistry): void {
  unique(
    state.world.regions.map((r) => r.id),
    'region ID',
  );
  unique(
    state.world.dungeons.map((d) => d.id),
    'instance ID',
  );
  const region = (id: string) => {
    const r = state.world.regions.find((r) => r.id === id);
    if (!r) throw new Error(`Unknown region: ${id}`);
    return r;
  };
  const player = state.player,
    permanent = player.permanent;
  const geometries = [
    ...state.world.regions.flatMap((r) =>
      r.kind === 'surface' && r.phase !== 'unvisited' ? [r.geometry] : [],
    ),
    ...state.world.dungeons.map((d) => d.geometry),
  ];
  const entityIds = [
    player.actor.id,
    ...geometries.flatMap((g) => g.objects.map((o) => o.id)),
    ...[...state.world.savedCombats, ...(state.combat ? [state.combat] : [])].flatMap((c) =>
      c.enemies.map((e) => e.id),
    ),
  ];
  assertCombatInvariants(state);
  unique(entityIds, 'entity ID');
  const knownEntities = new Set(entityIds);
  for (const g of geometries) if (g.generated) validateGeneratedGeometry(g);
  for (const g of geometries)
    for (const object of g.objects)
      if (
        object.position.x < 0 ||
        object.position.y < 0 ||
        object.position.x > g.width * g.tilePixels ||
        object.position.y > g.height * g.tilePixels
      )
        throw new Error('Object outside geometry');
  for (const d of state.world.dungeons)
    if (!knownEntities.has(d.anchor.bossId)) throw new Error('Missing anchor entity');
  for (const dungeon of state.world.dungeons)
    if (dungeon.geometry.generated) {
      const layout = dungeon.geometry.generated,
        combat = [...state.world.savedCombats, ...(state.combat ? [state.combat] : [])].find(
          (c) => c.instanceId === dungeon.id && c.regionId === dungeon.regionId,
        );
      const anchor = combat?.enemies.find((e) => e.id === `${dungeon.anchor.bossId}-actor`),
        reward = layout.placements.find((p) => p.kind === 'reward');
      if (
        !anchor ||
        !reward ||
        layout.generation !== dungeon.generation ||
        !layout.placements.some((p) => p.kind === 'anchor' && p.id === dungeon.anchor.bossId)
      )
        throw new Error('Broken generated anchor reference');
      if ((dungeon.anchor.phase === 'living') !== anchor.health > 0)
        throw new Error('Anchor phase contradicts encounter');
      const claimed = dungeon.changes.claimedRewards.includes(reward.id);
      if (
        (claimed && dungeon.anchor.phase === 'living') ||
        (['pending-regeneration', 'retired'].includes(dungeon.anchor.phase) && !claimed)
      )
        throw new Error('Anchor reward boundary is inconsistent');
    }

  unique(permanent.tools, 'permanent tool');
  unique(permanent.unlocks, 'unlock');
  unique(permanent.discoveredRegions, 'discovery');
  for (const id of permanent.tools) content.tool(id);
  for (const id of permanent.discoveredRegions) region(id);
  for (const id of permanent.unlocks) {
    const unlock = content.unlock(id);
    if (
      unlock.requiresTools.some((id) => !permanent.tools.includes(id)) ||
      unlock.requiresUnlocks.some((id) => !permanent.unlocks.includes(id))
    )
      throw new Error(`Broken progression prerequisite: ${id}`);
  }
  if (permanent.kingdomRestored && !permanent.kingDefeated)
    throw new Error('Restoration requires permanent King victory');
  const current = region(player.regionId);
  if (current.kind === 'surface' && (current.phase === 'unvisited' || player.instanceId !== null))
    throw new Error('Invalid surface location');
  const instance = state.world.dungeons.find((d) => d.id === player.instanceId);
  if (
    current.kind === 'dungeon' &&
    (!instance ||
      instance.regionId !== current.id ||
      instance.id !== current.currentInstance ||
      instance.anchor.phase === 'retired' ||
      instance.anchor.phase === 'pending-regeneration')
  )
    throw new Error('Invalid occupied dungeon');
  for (const d of state.world.dungeons) {
    if (region(d.regionId).kind !== 'dungeon')
      throw new Error('Instance references non-dungeon region');
    if (d.anchor.phase === 'living' && d.changes.removedObjects.includes(d.anchor.bossId))
      throw new Error('Living anchor cannot be removed');
    const ids = new Set(d.geometry.objects.map((o) => o.id));
    for (const id of [
      ...d.changes.discoveredMarkers,
      ...d.changes.removedObjects,
      ...d.changes.openedPassages,
      ...d.changes.claimedRewards,
      ...d.changes.openedObjects,
    ])
      if (!ids.has(id)) throw new Error(`Unknown dungeon object change: ${id}`);
  }
  const changeSets = [
    ...state.world.dungeons.map((d) => d.changes),
    ...state.world.regions.flatMap((r) =>
      r.kind === 'surface' && r.phase !== 'unvisited' ? [r.changes] : [],
    ),
  ];
  for (const changes of changeSets) {
    unique(changes.exploredRooms.map(String), 'explored room');
    unique(changes.discoveredMarkers, 'discovered marker');
    unique(changes.removedObjects, 'removed object');
    unique(changes.openedPassages, 'opened passage');
    unique(changes.claimedRewards, 'claimed reward');
    unique(changes.openedObjects, 'opened object');
  }
  for (const r of state.world.regions) {
    if (
      r.kind === 'dungeon' &&
      r.currentInstance !== null &&
      !state.world.dungeons.some(
        (d) => d.id === r.currentInstance && d.regionId === r.id && d.anchor.phase !== 'retired',
      )
    )
      throw new Error('Broken current instance reference');
    if (r.kind === 'surface' && r.phase !== 'unvisited') {
      unique(
        r.geometry.objects.map((o) => o.id),
        'surface object ID',
      );
      const ids = new Set(r.geometry.objects.map((o) => o.id));
      for (const id of [
        ...r.changes.discoveredMarkers,
        ...r.changes.removedObjects,
        ...r.changes.openedPassages,
        ...r.changes.claimedRewards,
        ...r.changes.openedObjects,
      ])
        if (!ids.has(id)) throw new Error(`Unknown surface object change: ${id}`);
    }
  }
  const geometry = current.kind === 'surface' ? current.geometry : instance?.geometry;
  if (
    !geometry ||
    player.actor.position.x < 0 ||
    player.actor.position.y < 0 ||
    player.actor.position.x > geometry.width * geometry.tilePixels ||
    player.actor.position.y > geometry.height * geometry.tilePixels
  )
    throw new Error('Player outside region bounds');
  if (
    player.carrying !== null &&
    (current.kind !== 'surface' ||
      !current.geometry.objects.some((o) => o.id === player.carrying) ||
      !current.changes.removedObjects.includes(player.carrying))
  )
    throw new Error('Invalid carried object');
  const itemIds = new Set<string>(),
    chestIds = new Set<string>();
  for (const deposit of player.deposits) {
    region(deposit.regionId);
    const location = state.world.regions.find((r) => r.id === deposit.regionId);
    const interior = state.world.dungeons.find(
      (d) => d.id === deposit.instanceId && d.regionId === deposit.regionId,
    );
    const chestKnown =
      deposit.instanceId === null
        ? location?.kind === 'surface' &&
          location.phase !== 'unvisited' &&
          location.geometry.objects.some((o) => o.id === deposit.chestId)
        : location?.kind === 'dungeon' &&
          interior?.geometry.objects.some((o) => o.id === deposit.chestId);
    if (!chestKnown) throw new Error('Deposit chest is missing from its region');
    if (chestIds.has(deposit.chestId)) throw new Error('Duplicate chest');
    chestIds.add(deposit.chestId);
  }
  for (const inventory of [player.carried, ...player.deposits.map((d) => d.inventory)]) {
    if (inventory.items.length > inventory.capacity) throw new Error('Inventory exceeds capacity');
    for (const item of inventory.items) {
      if (itemIds.has(item.id)) throw new Error(`Item appears in multiple possessions: ${item.id}`);
      itemIds.add(item.id);
      const template = content.item(item.templateId);
      if (item.quantity > template.maxStack)
        throw new Error(`Stack exceeds template limit: ${item.id}`);
      unique(
        item.enchantments.map((e) => e.id),
        'enchantment',
      );
      const groups = new Set<string>();
      for (const e of item.enchantments) {
        const definition = content.enchantment(e.id);
        if (
          !definition.allowedTags.some((tag) => template.tags.includes(tag)) ||
          e.magnitude < definition.minimum ||
          e.magnitude > definition.maximum
        )
          throw new Error(`Incompatible enchantment: ${item.id}`);
        if (definition.exclusiveGroup !== null) {
          if (groups.has(definition.exclusiveGroup)) throw new Error('Conflicting enchantments');
          groups.add(definition.exclusiveGroup);
        }
      }
    }
  }
  unique(
    player.equipment.map((e) => e.slot),
    'equipment slot',
  );
  unique(
    player.equipment.map((e) => e.itemId),
    'equipped item',
  );
  for (const equipment of player.equipment) {
    content.slot(equipment.slot);
    const item = player.carried.items.find((i) => i.id === equipment.itemId);
    if (
      !item ||
      item.quantity !== 1 ||
      !content.item(item.templateId).equipmentSlots.includes(equipment.slot)
    )
      throw new Error('Impossible equipment');
    const tool = content.item(item.templateId).requiredTool;
    if (tool !== null && !permanent.tools.includes(tool))
      throw new Error('Equipment requires permanent tool ownership');
  }
  unique(
    player.actor.cooldowns.map((c) => c.toolId),
    'cooldown',
  );
  for (const cooldown of player.actor.cooldowns) content.tool(cooldown.toolId);
  unique(
    player.actor.statuses.map((s) => s.id),
    'status',
  );
  for (const status of player.actor.statuses)
    if (status.stacks > content.status(status.id).maxStacks)
      throw new Error('Status exceeds stack limit');
    else if (status.source !== null && !knownEntities.has(status.source))
      throw new Error('Missing status source');
  unique(
    player.actor.resistances.map((r) => r.type),
    'damage resistance',
  );
  if (state.calendar.elapsedTicks >= state.timeRules.ticksPerDay)
    throw new Error('Calendar exceeds day boundary');
  // Imported counters must be ahead of every already allocated world-scoped identity.
  for (const id of [...entityIds, ...itemIds, ...state.world.dungeons.map((d) => d.id)]) {
    const suffix = id.split(':')[1],
      prefix = state.world.id.slice('world:'.length) + '-';
    if (suffix?.startsWith(prefix)) {
      const number = suffix.slice(prefix.length);
      if (/^\d+$/.test(number) && Number(number) >= state.world.nextId)
        throw new Error('ID sequence would reuse an existing identity');
    }
  }
}
