import type { SaveState } from './model';
export function assertToolInvariants(state: SaveState) {
  const effects = state.tools.effects,
    ids = effects.map((e) => e.id);
  if (new Set(ids).size !== ids.length || ids.some((id) => id >= state.tools.nextId))
    throw new Error('Tool effect identity would be reused.');
  const region = state.world.regions.find((r) => r.id === state.player.regionId),
    geometry =
      region?.kind === 'surface' && region.phase !== 'unvisited'
        ? region.geometry
        : state.world.dungeons.find((d) => d.id === state.player.instanceId)?.geometry;
  if (!geometry) throw new Error('Missing tool geometry.');
  const inBounds = (p: { x: number; y: number }) =>
    p.x >= 0 &&
    p.y >= 0 &&
    p.x <= geometry.width * geometry.tilePixels &&
    p.y <= geometry.height * geometry.tilePixels;
  const objects = new Set(geometry.objects.map((o) => o.id));
  for (const e of effects) {
    if (!inBounds(e.position) || !inBounds(e.origin) || (e.target && !inBounds(e.target)))
      throw new Error('Tool effect is outside its active region.');
    if (new Set(e.hitIds).size !== e.hitIds.length) throw new Error('Duplicate tool contact.');
    if (e.objectId && !objects.has(e.objectId))
      throw new Error('Tool references a missing world object.');
    if (e.kind === 'bomb' && !['fuse', 'blast'].includes(e.phase))
      throw new Error('Invalid bomb phase.');
    if (
      e.kind === 'hook' &&
      (!e.objectId || !e.target || !['out', 'back', 'pull'].includes(e.phase))
    )
      throw new Error('Invalid hook tether.');
    if (
      e.kind === 'thrown' &&
      (!e.objectId ||
        e.phase !== 'flight' ||
        !e.target ||
        !state.world.regions.some(
          (r) =>
            r.kind === 'surface' &&
            r.phase !== 'unvisited' &&
            r.changes.removedObjects.includes(e.objectId ?? state.player.actor.id),
        ))
    )
      throw new Error('Invalid thrown object ownership.');
    if (
      ['arrow', 'magic', 'boomerang'].includes(e.kind) &&
      !['windup', 'out', 'back'].includes(e.phase)
    )
      throw new Error('Invalid returning/projectile phase.');
  }
  if (
    state.tools.carriedBomb !== null &&
    (!effects.some(
      (e) => e.id === state.tools.carriedBomb && e.kind === 'bomb' && e.phase === 'fuse',
    ) ||
      state.player.carrying !== null)
  )
    throw new Error('Invalid carried bomb reference.');
  if (state.tools.safe) {
    const safe = state.tools.safe,
      region = state.world.regions.find((r) => r.id === safe.regionId);
    const geometry =
      region?.kind === 'surface' && region.phase !== 'unvisited'
        ? region.geometry
        : region?.kind === 'dungeon'
          ? state.world.dungeons.find((d) => d.id === region.currentInstance)?.geometry
          : null;
    if (
      !geometry ||
      safe.position.x < 0 ||
      safe.position.y < 0 ||
      safe.position.x > geometry.width * geometry.tilePixels ||
      safe.position.y > geometry.height * geometry.tilePixels
    )
      throw new Error('Safe ground references an invalid region or position.');
  }
}
