import { TRAIL_ID } from '../content/tool-trail';
import { changesSchema } from './model';
import type { SaveState, RetainedArea, Geometry } from './model';
import type { CombatState } from './combat-model';
import { allocatedId, regionIdSchema, instanceIdSchema } from './ids';
import { generateRegion } from './generation';
import { generatedDefinition } from './generated-world';
import { EXPEDITIONS } from '../content/expeditions';
import { createBattle } from './combat';
import { entityIdSchema } from './ids';
import type { WorldRegistry, RegionDefinition } from './world';
import { solidEntriesFor } from './world';
import { freeFoot } from './motion';
export function retainedArea(
  state: SaveState,
  regionId: string = state.player.regionId,
  instanceId: SaveState['player']['instanceId'] = state.player.instanceId,
): RetainedArea {
  const region = state.world.regions.find((r) => r.id === regionId);
  if (region?.kind === 'surface' && region.phase !== 'unvisited') return region;
  const instance = state.world.dungeons.find((d) => d.id === instanceId && d.regionId === regionId);
  if (!instance) throw new Error('Missing retained area');
  return instance;
}
const definitionCache = new WeakMap<Geometry, RegionDefinition>();
export function areaDefinition(
  state: SaveState,
  world: WorldRegistry,
  regionId: string = state.player.regionId,
  instanceId: SaveState['player']['instanceId'] = state.player.instanceId,
): RegionDefinition {
  const area = retainedArea(state, regionId, instanceId);
  if (!area.geometry.generated) return world.region(regionId);
  let definition = definitionCache.get(area.geometry);
  if (!definition) {
    definition = generatedDefinition(area.geometry, regionId);
    definitionCache.set(area.geometry, definition);
  }
  return definition;
}
function expeditionBattle(
  state: SaveState,
  area: RetainedArea,
  regionId: string,
  instanceId: SaveState['player']['instanceId'],
): CombatState {
  const battle = createBattle('mixed', area.geometry.generated?.generation ?? 1, state.clock.tick);
  battle.regionId = regionIdSchema.parse(regionId);
  battle.instanceId = instanceId;
  battle.feedback =
    'Expedition kit: sword, shield, roll and energy arrows. Return to the village to rest.';
  battle.enemies = battle.enemies
    .filter((e) => e.kind === 'skeleton' || e.kind === 'slime')
    .map((e) => {
      const slot = area.geometry.generated?.placements.find(
        (p) => p.kind === (e.kind === 'skeleton' ? 'anchor' : 'encounter'),
      );
      if (!slot) throw new Error('Missing encounter slot');
      return {
        ...e,
        id: entityIdSchema.parse(`${slot.id}-actor`),
        position: { ...slot.position },
        home: { ...slot.position },
        health: e.kind === 'skeleton' ? 6 : e.health,
        maximumHealth: e.kind === 'skeleton' ? 6 : e.maximumHealth,
      };
    });
  return battle;
}
/** Called on the session's transactional draft. Geometry creation and retirement precede location commit. */
export function enterArea(
  state: SaveState,
  world: WorldRegistry,
  destinationId: string,
  spawnId = 'entry',
): void {
  if (state.tools.carriedBomb !== null)
    throw new Error('Throw or put down the live bomb before travelling.');
  const destination = state.world.regions.find((r) => r.id === destinationId);
  if (!destination) throw new Error('Unknown destination');
  const config = EXPEDITIONS.find((e) => e.id === destinationId);
  let instanceId: SaveState['player']['instanceId'] = null;
  if (destination.kind === 'surface' && destination.phase === 'unvisited') {
    if (!config) throw new Error('Missing regional generator');
    const geometry = generateRegion(state.world.seed, destinationId, config.biome);
    Object.assign(destination, {
      phase: 'dormant',
      generatorVersion: 1,
      geometry,
      changes: changesSchema.parse({ removedObjects: [], openedPassages: [], claimedRewards: [] }),
    });
  } else if (destination.kind === 'dungeon') {
    let current = state.world.dungeons.find((d) => d.id === destination.currentInstance);
    if (!current || current.anchor.phase === 'pending-regeneration') {
      if (!config || state.world.dungeons.length >= 1000)
        throw new Error('Dungeon generation limit reached');
      if (!Number.isSafeInteger(state.world.nextId + 1))
        throw new Error('Dungeon identity limit reached');
      const generation = (current?.generation ?? 0) + 1;
      const geometry = generateRegion(state.world.seed, destinationId, config.biome, generation);
      const anchor = geometry.generated?.placements.find((p) => p.kind === 'anchor');
      if (!anchor) throw new Error('Missing anchor');
      const next = {
        id: instanceIdSchema.parse(allocatedId(state.world.id, state.world.nextId++, 'instance')),
        regionId: destination.id,
        generation,
        generatorVersion: 1 as const,
        geometry,
        changes: changesSchema.parse({
          removedObjects: [],
          openedPassages: [],
          claimedRewards: [],
        }),
        anchor: { bossId: anchor.id, phase: 'living' as const },
      };
      if (current) current.anchor.phase = 'retired';
      state.world.dungeons.push(next);
      destination.currentInstance = next.id;
      current = next;
    }
    if (!current) throw new Error('Missing generated instance');
    instanceId = current.id;
  }
  const area = retainedArea(state, destinationId, instanceId),
    definition = areaDefinition(state, world, destinationId, instanceId),
    spawn = definition.spawns.find((s) => s.id === spawnId);
  if (
    !spawn ||
    !freeFoot(
      spawn.position,
      definition.width,
      definition.height,
      solidEntriesFor(definition, area).map((s) => s.rect),
    )
  )
    throw new Error('Destination doorway is blocked');
  const previous = state.world.dungeons.find((d) => d.id === state.player.instanceId);
  if (
    previous &&
    previous.id !== instanceId &&
    previous.anchor.phase === 'defeated' &&
    previous.geometry.generated?.placements.some(
      (p) => p.kind === 'reward' && previous.changes.claimedRewards.includes(p.id),
    )
  )
    previous.anchor.phase = 'pending-regeneration';
  const oldArea = retainedArea(state);
  for (const effect of state.tools.effects)
    if (effect.kind === 'thrown' && effect.objectId) {
      // Unlanded throws retain their pre-lift position in saved geometry.
      oldArea.changes.removedObjects = oldArea.changes.removedObjects.filter(
        (id) => id !== effect.objectId,
      );
    }
  state.tools.effects = [];
  state.tools.carriedBomb = null;
  state.tools.safe = null;
  if (state.combat) {
    state.combat.guard = false;
    state.combat.action = null;
    state.combat.projectiles = [];
    state.world.savedCombats.push(state.combat);
    state.combat = null;
  }
  const index = state.world.savedCombats.findIndex(
    (c) => c.regionId === destinationId && c.instanceId === instanceId,
  );
  if (index >= 0) state.combat = state.world.savedCombats.splice(index, 1)[0] ?? null;
  else if (area.geometry.generated)
    state.combat = expeditionBattle(state, area, destinationId, instanceId);
  else if (destinationId === TRAIL_ID) {
    const battle = createBattle('mixed', 1, state.clock.tick);
    battle.regionId = regionIdSchema.parse(TRAIL_ID);
    battle.enemies = battle.enemies
      .filter((e) => ['skeleton', 'slime'].includes(e.kind))
      .map((e, i) => ({
        ...e,
        id: entityIdSchema.parse(`entity:trail-enemy-${e.kind}`),
        position: { x: i ? 688 : 896, y: i ? 120 : 80 },
        home: { x: i ? 688 : 896, y: i ? 120 : 80 },
      }));
    battle.feedback =
      'Tool trail: puzzle tools also affect enemies. Death uses the agreed carried-material rule.';
    state.combat = battle;
  }
  if (state.combat)
    state.combat.nextSequence = Math.max(
      state.combat.nextSequence,
      ...state.world.savedCombats.map((c) => c.nextSequence),
    );
  if (
    area.geometry.generated &&
    destination.kind === 'surface' &&
    area.changes.refreshDay < state.calendar.day
  ) {
    const resource = area.geometry.generated.placements.find((p) => p.kind === 'resource');
    if (resource)
      area.changes.openedObjects = area.changes.openedObjects.filter((id) => id !== resource.id);
    const slot = area.geometry.generated.placements.find((p) => p.kind === 'encounter'),
      battle = state.combat;
    if (slot && battle) {
      const index = battle.enemies.findIndex((e) => e.kind === 'slime'),
        enemy = battle.enemies[index];
      const drop = battle.drops.find((d) => d.id === `${enemy?.id}:drop`);
      if (enemy?.health === 0 && drop?.claimed) {
        battle.drops = battle.drops.filter((d) => d !== drop);
        const fresh = expeditionBattle(state, area, destinationId, instanceId).enemies.find(
          (e) => e.kind === 'slime',
        );
        if (fresh) {
          fresh.id = entityIdSchema.parse(`${slot.id}-actor-d${state.calendar.day}`);
          battle.enemies[index] = fresh;
          battle.completed = false;
        }
      }
    }
    area.changes.refreshDay = state.calendar.day;
  }
  for (const r of state.world.regions)
    if (r.kind === 'surface' && r.phase !== 'unvisited')
      r.phase = r.id === destinationId ? 'active' : 'dormant';
  state.player.regionId = destination.id;
  state.player.instanceId = instanceId;
  state.player.actor.position = { ...spawn.position };
  state.player.actor.facing = spawn.facing;
  if (!state.player.permanent.discoveredRegions.includes(destination.id))
    state.player.permanent.discoveredRegions.push(destination.id);
  state.clock.remainderMs = 0;
}
