import { TOOL_RULES as R } from '../content/tools';
import { TRAIL_FEATURES, TRAIL_ID, TRAIL_COLOR_ID, featurePosition } from '../content/tool-trail';
import type { TrailFeature } from '../content/tool-trail';
import type { SaveState, RetainedArea, Position } from './model';
import type { RegionDefinition } from './world';
import { solidEntriesFor, targetInReach } from './world';
import { freeFoot, footRect, overlaps, segmentBlocked, moveFoot } from './motion';
import type { Rect } from './motion';
import { directionVector, damageEnemy, damagePlayer } from './combat';
import type { BattleContext } from './combat';
import type { ToolCommand, ToolEffect, ActiveTool } from './tool-model';
import { toolIdSchema } from './ids';
export interface ToolContext {
  state: SaveState;
  area: RetainedArea;
  definition: RegionDefinition;
  solids: () => Rect[];
  battle: BattleContext | null;
  changed: (message: string) => void;
}
const distance = (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y);
const has = (a: readonly string[], id: string) => a.includes(id);
export const hookPulling = (state: SaveState) =>
  state.tools.effects.some((e) => e.kind === 'hook' && e.phase === 'pull');
export function trailFeatures(regionId: string) {
  return regionId === TRAIL_ID ? TRAIL_FEATURES : [];
}
export function trailFeaturePosition(area: RetainedArea, f: TrailFeature) {
  return area.geometry.objects.find((o) => o.id === f.id)?.position ?? featurePosition(f);
}
function objectRect(area: RetainedArea, f: TrailFeature) {
  const p = trailFeaturePosition(area, f),
    base = featurePosition(f);
  return { ...f.rect, x: f.rect.x + p.x - base.x, y: f.rect.y + p.y - base.y };
}
function onPlate(state: SaveState, area: RetainedArea, plate: TrailFeature) {
  if (
    state.player.regionId === TRAIL_ID &&
    overlaps(footRect(state.player.actor.position), plate.rect)
  )
    return true;
  return TRAIL_FEATURES.some(
    (f) =>
      ['crate', 'heavy', 'pot'].includes(f.kind) &&
      !has(area.changes.removedObjects, f.id) &&
      overlaps(objectRect(area, f), plate.rect),
  );
}
/** Mechanisms derive collision from the same retained flags/positions that are drawn. */
export function toolSolidEntries(
  state: SaveState,
  definition: RegionDefinition,
  area: RetainedArea,
) {
  const base = solidEntriesFor(definition, area);
  if (definition.id !== TRAIL_ID) return base;
  const orange = has(area.changes.openedObjects, TRAIL_COLOR_ID),
    actor = footRect(state.player.actor.position);
  const filtered = base.filter((s) => {
    const f = TRAIL_FEATURES.find((f) => f.id === s.owner);
    if (!f) return true;
    let open = false;
    if (f.kind === 'plate-gate')
      open = TRAIL_FEATURES.some((p) => f.links.includes(p.id) && onPlate(state, area, p));
    if (f.kind === 'blue-gate') open = orange;
    if (f.kind === 'orange-gate') open = !orange;
    if (
      ['plate-gate', 'blue-gate', 'orange-gate'].includes(f.kind) &&
      ((state.player.regionId === TRAIL_ID && overlaps(actor, s.rect)) ||
        [...state.world.savedCombats, ...(state.combat ? [state.combat] : [])].some(
          (b) =>
            b.regionId === TRAIL_ID &&
            b.enemies.some((e) => e.health > 0 && overlaps(footRect(e.position), s.rect)),
        ))
    )
      open = true;
    return !open;
  });
  if (!has(state.player.permanent.tools, 'tool:swim') && !hookPulling(state))
    for (const f of TRAIL_FEATURES.filter((f) => f.kind === 'water'))
      filtered.push({ owner: f.id, rect: f.rect });
  return filtered;
}
function feedback(c: ToolContext, text: string, checkpoint = false) {
  c.state.tools.feedback = text;
  if (checkpoint) c.changed(text);
}
function nonce(c: ToolContext) {
  if (!Number.isSafeInteger(c.state.nextTransaction + 1))
    throw new Error('Transaction limit reached.');
  c.state.nextTransaction++;
}
function mark(
  c: ToolContext,
  ids: readonly string[],
  set: 'openedPassages' | 'openedObjects' | 'removedObjects' | 'claimedRewards',
) {
  const before = c.area.changes[set].length;
  for (const id of ids) {
    const object = c.area.geometry.objects.find((o) => o.id === id);
    if (object && !c.area.changes[set].includes(object.id)) c.area.changes[set].push(object.id);
  }
  return before !== c.area.changes[set].length;
}
function blocked(c: ToolContext, from: Position, to: Position, except?: string) {
  return toolSolidEntries(c.state, c.definition, c.area).some(
    (s) =>
      s.owner !== except &&
      !TRAIL_FEATURES.some((f) => f.id === s.owner && f.kind === 'water') &&
      segmentBlocked(from, to, s.rect),
  );
}
function hazardous(c: ToolContext, p: Position, water = true) {
  return trailFeatures(c.definition.id).some(
    (f) =>
      (['pit', 'acid'].includes(f.kind) || (water && f.kind === 'water')) &&
      overlaps(footRect(p), f.rect),
  );
}
function clearLanding(c: ToolContext, p: Position, except?: string) {
  return (
    !hazardous(c, p) &&
    freeFoot(
      p,
      c.definition.width,
      c.definition.height,
      toolSolidEntries(c.state, c.definition, c.area)
        .filter((s) => s.owner !== except)
        .map((s) => s.rect),
    )
  );
}
function spawn(
  c: ToolContext,
  kind: ToolEffect['kind'],
  phase: ToolEffect['phase'],
  position: Position,
): ToolEffect {
  const tools = c.state.tools;
  if (tools.effects.length >= 32 || !Number.isSafeInteger(tools.nextId + 1))
    throw new Error('Wait for an active tool to finish.');
  const e: ToolEffect = {
    id: tools.nextId++,
    kind,
    phase,
    position: { ...position },
    origin: { ...c.state.player.actor.position },
    target: null,
    direction: c.state.player.actor.facing,
    age: 0,
    hitIds: [],
    cargo: null,
    objectId: null,
  };
  tools.effects.push(e);
  return e;
}
function ready(c: ToolContext, tool: ActiveTool) {
  const s = c.state,
    actor = s.player.actor;
  if (s.combat?.guard && !['push', 'pull'].includes(tool))
    throw new Error('Lower your shield before using that tool.');
  if (actor.resources.health.current <= 0) throw new Error('Return to the village before acting.');
  if (
    s.combat?.action ||
    s.clock.tick < (s.combat?.hurtUntil ?? 0) ||
    hookPulling(s) ||
    s.tools.effects.some((e) => e.phase === 'windup')
  )
    throw new Error('Finish the action or recover first.');
  if (actor.cooldowns.some((cd) => cd.toolId === `tool:${tool}`))
    throw new Error('That tool is still recovering.');
  if (!['push', 'pull', 'bow'].includes(tool) && !has(s.player.permanent.tools, `tool:${tool}`))
    throw new Error('Collect the permanent trail tool before using it.');
  if (s.tools.effects.some((e) => e.kind === tool && ['boomerang', 'hook'].includes(tool)))
    throw new Error('Wait for this tool to return.');
}
function cool(c: ToolContext, tool: ActiveTool) {
  c.state.player.actor.cooldowns.push({
    toolId: toolIdSchema.parse(`tool:${tool}`),
    remainingTicks: R.cooldown[tool],
  });
}
function nearestMovable(c: ToolContext) {
  const a = c.state.player.actor;
  return trailFeatures(c.definition.id)
    .filter(
      (f) =>
        ['heavy', 'crate', 'pot'].includes(f.kind) &&
        !has(c.area.changes.removedObjects, f.id) &&
        targetInReach(a.position, a.facing, trailFeaturePosition(c.area, f), 30),
    )
    .sort(
      (a, b) =>
        distance(trailFeaturePosition(c.area, a), c.state.player.actor.position) -
        distance(trailFeaturePosition(c.area, b), c.state.player.actor.position),
    )[0];
}
function moveWeight(c: ToolContext, mode: 'push' | 'pull') {
  const f = nearestMovable(c);
  if (!f) throw new Error('Stand near and face a weight or crate.');
  if (f.kind === 'pot')
    throw new Error('Lift and throw the clay pot; use a crate or heavy weight for pushing.');
  const actor = c.state.player.actor,
    object = c.area.geometry.objects.find((o) => o.id === f.id);
  if (!object) throw new Error('That weight is missing.');
  const v = directionVector(actor.facing),
    sign = mode === 'push' ? 1 : -1,
    next = { x: object.position.x + v.x * 16 * sign, y: object.position.y + v.y * 16 * sign },
    player = { x: actor.position.x + v.x * 16 * sign, y: actor.position.y + v.y * 16 * sign },
    shape = {
      ...objectRect(c.area, f),
      x: next.x - f.rect.width / 2,
      y: next.y - f.rect.height / 2,
    },
    solids = toolSolidEntries(c.state, c.definition, c.area)
      .filter((s) => s.owner !== f.id)
      .map((s) => s.rect);
  if (
    shape.x < 8 ||
    shape.y < 8 ||
    shape.x + shape.width > c.definition.width - 8 ||
    shape.y + shape.height > c.definition.height - 8 ||
    solids.some((s) => overlaps(shape, s)) ||
    !freeFoot(player, c.definition.width, c.definition.height, [...solids, shape]) ||
    hazardous(c, next) ||
    hazardous(c, player)
  )
    throw new Error('There is no safe space for that move. Try another side or reset the weights.');
  object.position = next;
  actor.position = player;
  cool(c, mode);
  feedback(c, `${mode === 'push' ? 'Pushed' : 'Pulled'} ${f.name.toLowerCase()} one step.`);
}
function throwCarried(c: ToolContext) {
  const s = c.state,
    a = s.player.actor,
    v = directionVector(a.facing);
  if (s.tools.carriedBomb !== null) {
    const e = s.tools.effects.find((e) => e.id === s.tools.carriedBomb && e.kind === 'bomb');
    if (!e) throw new Error('The bomb has already detonated.');
    e.target = { x: a.position.x + v.x * 64, y: a.position.y + v.y * 64 };
    e.origin = { ...a.position };
    s.tools.carriedBomb = null;
    feedback(c, 'Threw the live bomb. Its original fuse continues.');
    return;
  }
  const object = c.area.geometry.objects.find((o) => o.id === s.player.carrying),
    f = TRAIL_FEATURES.find((f) => f.id === object?.id);
  if (!object || !f || !['pot', 'crate'].includes(f.kind))
    throw new Error('Lift a trail pot, crate or live bomb before throwing.');
  const e = spawn(c, 'thrown', 'flight', a.position);
  e.objectId = object.id;
  e.target = { x: a.position.x + v.x * 64, y: a.position.y + v.y * 64 };
  s.player.carrying = null;
  feedback(c, `Threw ${f.name.toLowerCase()}.`);
}
/** Run on a detached command candidate; rejected operations never publish partial changes. */
export function toolCommand(c: ToolContext, command: ToolCommand) {
  if (
    c.state.player.actor.resources.health.current <= 0 ||
    c.state.combat?.action ||
    c.state.clock.tick < (c.state.combat?.hurtUntil ?? 0) ||
    hookPulling(c.state) ||
    c.state.tools.effects.some((e) => e.phase === 'windup')
  )
    throw new Error('Finish the action or recover first.');
  if (command.type === 'tool.throw') {
    throwCarried(c);
    return;
  }
  if (command.type === 'tool.lift-bomb') {
    if (c.state.player.carrying || c.state.tools.carriedBomb !== null)
      throw new Error('Set down the carried object first.');
    const bomb = c.state.tools.effects.find(
      (e) =>
        e.kind === 'bomb' &&
        e.phase === 'fuse' &&
        distance(e.position, c.state.player.actor.position) <= 26,
    );
    if (!bomb) throw new Error('Move closer to a live bomb.');
    c.state.tools.carriedBomb = bomb.id;
    feedback(c, 'Lifted a live bomb. X / RT throws it; the fuse keeps burning.');
    return;
  }
  const tool = command.tool;
  ready(c, tool);
  if (c.state.player.carrying || c.state.tools.carriedBomb !== null) {
    throwCarried(c);
    return;
  }
  if (tool === 'push' || tool === 'pull') {
    moveWeight(c, tool);
    return;
  }
  const cost = tool === 'bomb' ? R.bombEnergy : tool === 'magic' ? R.magicEnergy : 0;
  if (c.state.player.actor.resources.energy.current < cost)
    throw new Error('Wait for energy to recover; no ammunition is consumed.');
  let landing: Position | null = null,
    anchor: TrailFeature | undefined;
  if (tool === 'hook') {
    const a = c.state.player.actor,
      v = directionVector(a.facing);
    anchor = trailFeatures(c.definition.id)
      .filter((f) => f.kind === 'anchor')
      .find((f) => {
        const p = featurePosition(f),
          dx = p.x - a.position.x,
          dy = p.y - a.position.y;
        return (
          distance(p, a.position) <= R.range &&
          dx * v.x + dy * v.y > 16 &&
          Math.abs(dx * v.y - dy * v.x) <= 8 &&
          !blocked(c, a.position, p, f.id)
        );
      });
    if (!anchor) throw new Error('Face a visible brass anchor within hook range.');
    const p = featurePosition(anchor);
    landing = { x: p.x - v.x * 24, y: p.y - v.y * 24 };
    if (!clearLanding(c, landing, anchor.id))
      throw new Error('The anchor has no safe dry landing.');
  }
  const a = c.state.player.actor,
    e = spawn(
      c,
      tool === 'bow' ? 'arrow' : tool,
      tool === 'bomb' ? 'fuse' : tool === 'hook' ? 'out' : 'windup',
      a.position,
    );
  e.target = tool === 'hook' ? landing : null;
  if (anchor) e.objectId = anchor.id;
  if (tool === 'bomb') {
    const v = directionVector(a.facing),
      p = { x: a.position.x + v.x * 18, y: a.position.y + v.y * 18 };
    if (!clearLanding(c, p)) throw new Error('Place the bomb on clear dry ground.');
    e.position = p;
  }
  a.resources.energy.current -= cost;
  cool(c, tool);
  feedback(
    c,
    tool === 'bomb'
      ? 'Placed a bomb. Two-second fuse; keep clear of its marked blast circle.'
      : `${tool === 'magic' ? 'Magic rod' : tool} committed ${a.facing}.`,
  );
}
export function interactTrail(c: ToolContext, id: string) {
  const f = trailFeatures(c.definition.id).find((f) => f.id === id);
  if (!f) throw new Error('Unknown trail mechanism.');
  if (f.kind === 'kit' || f.kind === 'flippers') {
    const tools = f.kind === 'kit' ? ['bow', 'bomb', 'boomerang', 'hook', 'magic'] : ['swim'];
    if (tools.every((t) => has(c.state.player.permanent.tools, `tool:${t}`)))
      return `${f.name} already owned permanently.`;
    for (const name of tools) {
      const id = toolIdSchema.parse(`tool:${name}`);
      if (!c.state.player.permanent.tools.includes(id)) c.state.player.permanent.tools.push(id);
    }
    mark(c, [f.id], 'openedObjects');
    return f.kind === 'kit'
      ? 'Trail tools are permanently owned. Select them in the pack. Bombs and magic use regenerating energy; arrows and returns need no ammunition.'
      : 'Flippers owned permanently. Walk into and out of water freely; acid and pits remain hazardous.';
  }
  if (f.kind === 'reset') {
    const ids = TRAIL_FEATURES.filter((f) => ['crate', 'pot', 'heavy'].includes(f.kind)).map(
      (f) => f.id,
    );
    for (const object of c.area.geometry.objects) {
      const original = TRAIL_FEATURES.find((f) => f.id === object.id && ids.includes(f.id));
      if (original) object.position = featurePosition(original);
    }
    c.area.changes.removedObjects = c.area.changes.removedObjects.filter((id) => !ids.includes(id));
    c.state.tools.effects = [];
    c.state.tools.carriedBomb = null;
    c.state.player.carrying = null;
    const spawn = c.definition.spawns[0];
    if (!spawn) throw new Error('Missing trail entrance');
    c.state.player.actor.position = { ...spawn.position };
    c.state.tools.safe = { regionId: c.state.player.regionId, position: { ...spawn.position } };
    return 'Movable weights restored. Permanent passages, claims and tool ownership were retained.';
  }
  if (f.kind === 'lever') {
    const opened = c.area.changes.openedObjects;
    if (opened.includes(TRAIL_COLOR_ID))
      c.area.changes.openedObjects = opened.filter((id) => id !== TRAIL_COLOR_ID);
    else opened.push(TRAIL_COLOR_ID);
    return `Raised ${has(c.area.changes.openedObjects, TRAIL_COLOR_ID) ? 'orange O' : 'blue B'} barriers; the other group is lowered.`;
  }
  return f.hint;
}
/** Shared by combat arrows and environmental projectiles. Solid occlusion is checked before target effects. */
export function toolWorldHit(
  c: ToolContext,
  kind: 'arrow' | 'boomerang' | 'magic',
  from: Position,
  to: Position,
  effect?: ToolEffect,
) {
  for (const f of trailFeatures(c.definition.id)) {
    if (!segmentBlocked(from, to, f.rect) || blocked(c, from, featurePosition(f), f.id)) continue;
    if (effect?.hitIds.includes(f.id)) continue;
    const matches =
      (f.kind === 'target' && kind === 'arrow') ||
      (f.kind === 'remote' && kind === 'boomerang') ||
      (f.kind === 'brazier' && kind === 'magic');
    if (matches) {
      const changed =
        mark(c, [f.id], 'openedObjects') ||
        !f.links.every((id) => has(c.area.changes.openedPassages, id));
      mark(c, f.links, 'openedPassages');
      if (changed) {
        feedback(c, `${f.name} activated. Its linked passage is permanently open.`, true);
      }
      effect?.hitIds.push(f.id);
    } else if (
      f.kind === 'lever' &&
      kind === 'boomerang' &&
      effect &&
      !effect.hitIds.includes(TRAIL_COLOR_ID)
    ) {
      effect.hitIds.push(f.id, TRAIL_COLOR_ID);
      feedback(c, interactTrail(c, f.id), true);
    }
    if (
      f.kind === 'coin' &&
      kind === 'boomerang' &&
      effect &&
      !effect.cargo &&
      !has(c.area.changes.claimedRewards, f.id)
    )
      effect.cargo = f.id;
  }
}
function collectCargo(c: ToolContext, e: ToolEffect) {
  if (!e.cargo) return;
  const drop = c.state.combat?.drops.find((d) => d.id === e.cargo && !d.claimed),
    f = trailFeatures(c.definition.id).find(
      (f) => f.id === e.cargo && f.kind === 'coin' && !has(c.area.changes.claimedRewards, f.id),
    );
  if (!drop && !f) return;
  const amount = drop?.money ?? 1;
  if (c.state.player.carried.money > Number.MAX_SAFE_INTEGER - amount) {
    feedback(c, 'The coin balance is full. The retrieved reward remains unclaimed at its source.');
    return;
  }
  nonce(c);
  if (drop) drop.claimed = true;
  if (f) mark(c, [f.id], 'claimedRewards');
  c.state.player.carried.money += amount;
  feedback(c, 'The boomerang returned with a coin. Collected once.', true);
}
function hitEnemies(c: ToolContext, e: ToolEffect, from: Position, to: Position, damage: number) {
  if (!c.battle || e.kind === 'trap') return false;
  let hit = false;
  for (const enemy of c.battle.state.enemies) {
    const id = `${e.phase}:${enemy.id}`;
    if (
      enemy.health <= 0 ||
      e.hitIds.includes(id) ||
      !segmentBlocked(from, to, {
        x: enemy.position.x - 7,
        y: enemy.position.y - 12,
        width: 14,
        height: 14,
      }) ||
      blocked(c, from, enemy.position)
    )
      continue;
    e.hitIds.push(id);
    hit = true;
    if (e.kind === 'hook') enemy.hurtUntil = Math.max(enemy.hurtUntil, c.state.clock.tick + 25);
    else damageEnemy(c.battle, enemy, damage, from);
  }
  return hit;
}
function finishThrown(c: ToolContext, e: ToolEffect) {
  const f = TRAIL_FEATURES.find((f) => f.id === e.objectId),
    object = c.area.geometry.objects.find((o) => o.id === e.objectId);
  if (!f || !object) return;
  if (f.kind === 'pot') {
    mark(c, [f.id], 'removedObjects');
    feedback(c, 'The pot broke on impact. The reset stone can restore it.', true);
    return;
  }
  const solids = toolSolidEntries(c.state, c.definition, c.area)
    .filter((s) => s.owner !== f.id)
    .map((s) => s.rect);
  const landing = [e.position, object.position, featurePosition(f)].find(
    (p) =>
      clearLanding(c, p, f.id) &&
      !overlaps(
        {
          x: p.x - f.rect.width / 2,
          y: p.y - f.rect.height / 2,
          width: f.rect.width,
          height: f.rect.height,
        },
        footRect(c.state.player.actor.position),
      ) &&
      !solids.some((s) =>
        overlaps(
          {
            x: p.x - f.rect.width / 2,
            y: p.y - f.rect.height / 2,
            width: f.rect.width,
            height: f.rect.height,
          },
          s,
        ),
      ),
  );
  if (!landing) {
    feedback(
      c,
      'The crate could not settle safely. Use a reset stone to restore movable weights.',
      true,
    );
    return;
  }
  object.position = { ...landing };
  c.area.changes.removedObjects = c.area.changes.removedObjects.filter((id) => id !== f.id);
  feedback(c, 'The thrown crate landed; its weight can still solve a plate.', true);
}
function blast(c: ToolContext, e: ToolEffect) {
  if (c.state.tools.carriedBomb === e.id) c.state.tools.carriedBomb = null;
  const destroyed = trailFeatures(c.definition.id).filter(
    (f) =>
      distance(featurePosition(f), e.position) <= R.blastRadius + 8 &&
      ['bomb-wall', 'crate', 'pot'].includes(f.kind),
  );
  for (const f of destroyed)
    mark(c, [f.id], f.kind === 'bomb-wall' ? 'openedPassages' : 'removedObjects');
  if (c.battle) {
    for (const enemy of c.battle.state.enemies)
      if (
        enemy.health > 0 &&
        distance(enemy.position, e.position) <= R.blastRadius &&
        !blocked(c, e.position, enemy.position)
      )
        damageEnemy(c.battle, enemy, R.bombDamage, e.position);
    if (
      distance(c.state.player.actor.position, e.position) <= R.blastRadius &&
      !blocked(c, e.position, c.state.player.actor.position)
    )
      damagePlayer(c.battle, R.bombDamage, e.position);
  }
  feedback(
    c,
    destroyed.some((f) => f.kind === 'bomb-wall')
      ? 'The cracked wall opened permanently.'
      : 'Bomb blast — keep clear of its marked footprint.',
    true,
  );
}
function toward(from: Position, to: Position, speed: number) {
  const d = distance(from, to);
  return d <= speed
    ? { ...to }
    : { x: from.x + ((to.x - from.x) * speed) / d, y: from.y + ((to.y - from.y) * speed) / d };
}
export function toolMovement(
  c: ToolContext,
  desired: { position: Position; facing: SaveState['player']['actor']['facing'] },
) {
  const hook = c.state.tools.effects.find((e) => e.kind === 'hook' && e.phase === 'pull');
  if (hook?.target) {
    if (!clearLanding(c, hook.target, hook.objectId ?? undefined)) {
      c.state.player.actor.position = { ...hook.origin };
      hook.phase = 'back';
      feedback(c, 'The landing became blocked. The tether returned you safely.');
      return { position: { ...hook.origin }, facing: hook.direction };
    }
    const next = toward(c.state.player.actor.position, hook.target, 12);
    return {
      position: moveFoot(
        c.state.player.actor.position,
        next.x - c.state.player.actor.position.x,
        next.y - c.state.player.actor.position.y,
        c.definition.width,
        c.definition.height,
        c.solids(),
      ),
      facing: hook.direction,
    };
  }
  if (c.state.tools.effects.some((e) => e.phase === 'windup'))
    return { position: { ...c.state.player.actor.position }, facing: c.state.player.actor.facing };
  return desired;
}
/** Fixed-step effect lifetimes and hazards use gameplay ticks; menus and closed-game time cannot advance them. */
export function stepTools(c: ToolContext) {
  const s = c.state,
    a = s.player.actor,
    tick = s.clock.tick;
  if (!c.battle)
    a.resources.energy.current = Math.min(
      a.resources.energy.maximum,
      a.resources.energy.current + R.energyPerSecond / 50,
    );
  if (
    !hazardous(c, a.position) &&
    !hookPulling(s) &&
    freeFoot(a.position, c.definition.width, c.definition.height, c.solids())
  )
    s.tools.safe = { regionId: s.player.regionId, position: { ...a.position } };
  const remove = new Set<number>();
  for (const e of [...s.tools.effects]) {
    e.age++;
    if (e.age > 1000) {
      remove.add(e.id);
      continue;
    }
    if (e.kind === 'bomb') {
      if (s.tools.carriedBomb === e.id) e.position = { ...a.position };
      else if (e.target && distance(e.position, e.target) > 0) {
        const next = toward(e.position, e.target, 8);
        if (blocked(c, e.position, next)) e.target = null;
        else e.position = next;
      }
      if (e.phase === 'fuse' && e.age >= R.bombFuse) {
        e.phase = 'blast';
        e.age = 0;
        blast(c, e);
      } else if (e.phase === 'blast' && e.age >= R.blastTicks) remove.add(e.id);
      continue;
    }
    if (e.phase === 'windup') {
      if (e.age <= (e.kind === 'arrow' ? R.arrowWindup : R.castWindup)) continue;
      e.phase = 'out';
    }
    if (e.kind === 'hook' && e.phase === 'pull') {
      if (e.target && distance(a.position, e.target) < 1) {
        e.phase = 'back';
        feedback(c, 'Hook landing complete on dry ground.');
      }
      continue;
    }
    const v = directionVector(e.direction),
      from = { ...e.position },
      back = e.phase === 'back',
      speed =
        e.kind === 'boomerang'
          ? 7
          : e.kind === 'hook'
            ? 12
            : e.kind === 'magic'
              ? 6
              : e.kind === 'thrown'
                ? 8
                : 8;
    let to = back
      ? toward(from, a.position, speed)
      : { x: from.x + v.x * speed, y: from.y + v.y * speed };
    if (e.kind === 'thrown' && e.target) to = toward(from, e.target, speed);
    const outside =
        to.x < 8 || to.y < 8 || to.x > c.definition.width - 8 || to.y > c.definition.height - 8,
      wall = !back && blocked(c, from, to),
      hit = hitEnemies(
        c,
        e,
        from,
        to,
        e.kind === 'boomerang' ? R.boomerangDamage : e.kind === 'magic' ? R.magicDamage : 3,
      );
    if (e.kind === 'arrow' || e.kind === 'boomerang' || e.kind === 'magic')
      toolWorldHit(c, e.kind, from, to, e);
    if (e.kind === 'trap') {
      if (c.battle && segmentBlocked(from, to, footRect(a.position)))
        damagePlayer(c.battle, 2, from);
      if (segmentBlocked(from, to, footRect(a.position))) remove.add(e.id);
    }
    if (e.kind === 'hook') {
      if (back) {
        if (distance(to, a.position) <= 2) remove.add(e.id);
        else e.position = to;
        continue;
      }
      const anchor = TRAIL_FEATURES.find((f) => f.id === e.objectId),
        p = anchor ? featurePosition(anchor) : null;
      if (p && distance(to, p) <= 12) {
        e.position = p;
        e.phase = 'pull';
        continue;
      }
      if (wall || hit || outside || distance(to, e.origin) > R.range) {
        e.phase = 'back';
        feedback(c, 'Hook retracted without a latch.');
      } else e.position = to;
      continue;
    }
    if (e.kind === 'boomerang') {
      if (!e.cargo) {
        const drop = s.combat?.drops.find(
          (d) => !d.claimed && distance(d.position, to) <= 12 && !blocked(c, from, d.position),
        );
        if (drop) e.cargo = drop.id;
      }
      if (back && distance(to, a.position) <= 8) {
        collectCargo(c, e);
        remove.add(e.id);
        continue;
      }
      if (!back && (wall || outside || distance(to, e.origin) >= R.range)) {
        e.phase = 'back';
      } else e.position = to;
      continue;
    }
    if (e.kind === 'thrown') {
      if (wall || outside || hit || (e.target && distance(to, e.target) < 1)) {
        if (!wall && !outside) e.position = to;
        finishThrown(c, e);
        remove.add(e.id);
      } else e.position = to;
      continue;
    }
    if (wall || outside || hit || distance(to, e.origin) >= R.range) remove.add(e.id);
    else e.position = to;
  }
  s.tools.effects = s.tools.effects.filter((e) => !remove.has(e.id));
  if (s.tools.carriedBomb !== null && !s.tools.effects.some((e) => e.id === s.tools.carriedBomb))
    s.tools.carriedBomb = null;
  if (c.battle && a.resources.health.current > 0) {
    for (const f of trailFeatures(c.definition.id)) {
      if (f.kind === 'trap' && tick % 150 === 50 && s.tools.effects.length < 30) {
        const mouth = featurePosition(f);
        const e = spawn(c, 'trap', 'out', { x: mouth.x, y: mouth.y - 3 });
        e.direction = f.direction;
        e.origin = { ...e.position };
      }
      if (!overlaps(footRect(a.position), f.rect)) continue;
      if (f.kind === 'push-tile') {
        const v = directionVector(f.direction);
        a.position = moveFoot(
          a.position,
          v.x * 0.8,
          v.y * 0.8,
          c.definition.width,
          c.definition.height,
          c.solids(),
        );
      }
      if (f.kind === 'spikes' && tick % 100 >= 40 && tick % 100 < 75)
        damagePlayer(c.battle, 2, featurePosition(f));
      if (f.kind === 'acid' || f.kind === 'pit') {
        const safe =
          s.tools.safe?.regionId === s.player.regionId
            ? s.tools.safe.position
            : c.definition.spawns[0]?.position;
        damagePlayer(c.battle, 2, featurePosition(f));
        if (safe && clearLanding(c, safe)) a.position = { ...safe };
        feedback(
          c,
          `${f.kind === 'pit' ? 'The pit' : 'Acid'} hurt you. Returned to safe dry ground.`,
          true,
        );
      }
    }
  }
}
export function toolsView(state: SaveState, definition: RegionDefinition, area: RetainedArea) {
  const a = state.player.actor,
    features = trailFeatures(definition.id),
    near = features
      .filter((f) => distance(trailFeaturePosition(area, f), a.position) < 52)
      .sort(
        (x, y) =>
          distance(trailFeaturePosition(area, x), a.position) -
          distance(trailFeaturePosition(area, y), a.position),
      )[0];
  return {
    active: features.length > 0,
    feedback: state.tools.feedback,
    nearby: near ? { id: near.id, name: near.name, hint: near.hint } : null,
    carriedBomb: state.tools.carriedBomb !== null,
    orange: has(area.changes.openedObjects, TRAIL_COLOR_ID),
    solved: features
      .filter((f) => ['target', 'remote', 'brazier', 'bomb-wall'].includes(f.kind))
      .map((f) => ({
        id: f.id,
        name: f.name,
        solved: has(
          f.kind === 'bomb-wall' ? area.changes.openedPassages : area.changes.openedObjects,
          f.id,
        ),
      })),
    effects: state.tools.effects.map((e) => ({ id: e.id, kind: e.kind, phase: e.phase })),
  };
}

export function trailPresentation(
  state: SaveState,
  definition: RegionDefinition,
  area: RetainedArea,
) {
  const solids = toolSolidEntries(state, definition, area);
  return trailFeatures(definition.id).map((f) => ({
    ...f,
    position: trailFeaturePosition(area, f),
    rect: objectRect(area, f),
    blocked: solids.some((s) => s.owner === f.id),
    removed: area.changes.removedObjects.includes(f.id),
    opened: area.changes.openedObjects.includes(f.id) || area.changes.openedPassages.includes(f.id),
    claimed: area.changes.claimedRewards.includes(f.id),
  }));
}
