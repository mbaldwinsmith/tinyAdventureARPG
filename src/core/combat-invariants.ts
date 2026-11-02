import type { SaveState } from './model';
import { COMBAT_RULES } from '../content/combat';
export function assertCombatInvariants(state: SaveState) {
  const combat = state.combat;
  if (!combat) return;
  const region = state.world.regions.find((r) => r.id === combat.regionId);
  if (!region || region.kind !== 'surface' || region.phase === 'unvisited')
    throw new Error('Combat region is unavailable');
  const width = region.geometry.width * region.geometry.tilePixels,
    height = region.geometry.height * region.geometry.tilePixels;
  const inBounds = (p: { x: number; y: number }) =>
    p.x >= 0 && p.y >= 0 && p.x <= width && p.y <= height;
  const identities = new Set<string>();
  for (const e of combat.enemies) {
    if (identities.has(e.id) || e.id === state.player.actor.id)
      throw new Error('Duplicate combat actor');
    identities.add(e.id);
    if (
      e.health > e.maximumHealth ||
      (e.health === 0) !== (e.phase === 'dead') ||
      (e.phase === 'dead') !== (e.deathTick !== null)
    )
      throw new Error('Invalid enemy health/death state');
    if (!inBounds(e.position) || !inBounds(e.home) || e.path.some((p) => !inBounds(p)))
      throw new Error('Combat actor outside region');
  }
  if (combat.completed !== combat.enemies.every((e) => e.health === 0))
    throw new Error('Invalid encounter completion');
  const ids = new Set<string>();
  for (const p of combat.projectiles) {
    if (ids.has(p.id)) throw new Error('Duplicate projectile');
    ids.add(p.id);
    if (!inBounds(p.position) || p.remainingTicks === 0)
      throw new Error('Invalid projectile lifetime/position');
    if (p.faction === 'player' ? p.owner !== state.player.actor.id : !identities.has(p.owner))
      throw new Error('Invalid projectile owner/faction');
  }
  const drops = new Set<string>();
  for (const d of combat.drops) {
    if (
      drops.has(d.id) ||
      !inBounds(d.position) ||
      !combat.enemies.some((e) => e.health === 0 && d.id === `${e.id}:drop`)
    )
      throw new Error('Invalid combat drop');
    drops.add(d.id);
  }
  if (combat.action) {
    const a = combat.action,
      duration =
        a.kind === 'roll'
          ? COMBAT_RULES.rollTicks
          : COMBAT_RULES[a.kind].windup +
            COMBAT_RULES[a.kind].active +
            COMBAT_RULES[a.kind].recovery;
    if (
      a.elapsedTicks >= duration ||
      new Set(a.hitIds).size !== a.hitIds.length ||
      a.hitIds.some((id) => !identities.has(id)) ||
      combat.guard
    )
      throw new Error('Invalid combat action');
  }
  if ((state.player.actor.resources.health.current === 0) !== (combat.death?.phase === 'pending'))
    throw new Error('Invalid player health/defeat state');
  if (
    combat.death?.phase === 'pending' &&
    (state.player.actor.resources.health.current !== 0 || state.player.regionId !== combat.regionId)
  )
    throw new Error('Invalid pending player defeat');
  if (combat.death && combat.death.id >= combat.nextSequence)
    throw new Error('Death sequence would be reused');
}
