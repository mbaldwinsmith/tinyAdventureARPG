import type { Dungeon, Region } from './model';
import { copyData } from './data';

/** Pure transitions only. M00/M06 choose when the game requests the safe boundary. */
export function defeatAnchor(dungeon: Dungeon): Dungeon {
  if (dungeon.anchor.phase === 'living')
    return { ...copyData(dungeon), anchor: { ...dungeon.anchor, phase: 'defeated' } };
  return copyData(dungeon);
}
export function requestRegeneration(dungeon: Dungeon, occupied: boolean): Dungeon {
  if (occupied || dungeon.anchor.phase === 'living' || dungeon.anchor.phase === 'retired')
    throw new Error('Dungeon cannot regenerate at this boundary');
  return { ...copyData(dungeon), anchor: { ...dungeon.anchor, phase: 'pending-regeneration' } };
}
export function retireInstance(dungeon: Dungeon, occupied: boolean): Dungeon {
  if (occupied || dungeon.anchor.phase !== 'pending-regeneration')
    throw new Error('Instance is not safe to retire');
  return { ...copyData(dungeon), anchor: { ...dungeon.anchor, phase: 'retired' } };
}
export function setSurfaceActivity(region: Region, active: boolean): Region {
  if (region.kind !== 'surface' || region.phase === 'unvisited')
    throw new Error('Surface has no retained geometry');
  return { ...copyData(region), phase: active ? 'active' : 'dormant' };
}
