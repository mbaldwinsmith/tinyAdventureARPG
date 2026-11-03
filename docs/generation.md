# Persistent expeditions (M06)

The agreed topology is hybrid: the village and region connections are fixed; each wilderness region generates once per save. The southwest village trail leads to Whispering forest, which connects to Amber dunes, Winter hollows, Tidewood coast and the anchored crypt. The old clearing, cottage, woodland and practice field remain available. These are integration regions, not approval of the full campaign's content budget or tool order.

## Generated geography

`generation.ts` assembles nine outdoor clearings or interior rooms from three authored, entrance-safe templates. A seeded rotation/reflection and template selection vary their geography. A seven-room required route has brass-key, sun-switch and permanent-axe gates, an encounter slot, a warden and a reward. Two side branches contain renewable supplies and a hidden one-time cache; an axe-opened shortcut connects the supply clearing to the warden route. Three stones form a recognisable landmark. Surfaces have natural canopy, dune, snow or coastal-water boundaries; crypts have masonry boundaries. The v1 generator deliberately uses a small, learnable graph family rather than arbitrary layouts.

The validator explores `(room, key/switch/tool capabilities)` states, rejects missing/non-adjacent/duplicate edges and self-locked dependencies, and verifies required reward/anchor placement. A second pass validates the stored tile connectivity, room centres, entrance and object positions. Generation makes at most three candidate attempts, then validates one known-safe orientation. Rejection of that fallback returns an error; it never loops indefinitely. Regional ARC4 streams use a stable bounded derivation of world seed, region, generation, attempt and version, independently of session loot/encounter/death streams.

Full tile geometry, room/edge/placement metadata, regional seed and generator version are saved in the core checkpoint. The seed is diagnostic information, not a replacement for stored geometry. `changes` independently records opened objects, passages, rewards, explored rooms, discovered markers and refresh day. Phaser derives collision and display from the retained data and does not run a generator. Geometry definitions are cached by their immutable geometry object; gates filter collision through authoritative changes.

## Travel, encounters and refresh

Travel operates on a detached state draft: generate if needed, validate the destination spawn and invariants, then commit the whole state to `GameSession`. Invalid destinations leave the live state untouched. The world scene observes transition sequence as well as region identity. The same foot solver, interaction reach/facing/line of sight and fixed 20ms clock serve both authored and generated regions.

One active combat record is owned by the session. Other areas' records move into `world.savedCombats`, keyed by region and nullable dungeon instance. They retain actor identities, health, deaths and drops. Actions, guard and projectiles clear on travel. Enemy movement/phase counters do not run offscreen; absolute global-tick recovery deadlines can expire. A geometry anchor slot and its live combat actor have distinct stable IDs; the actor's defeat updates that slot's anchor lifecycle exactly once.

| State                                                                                          | Refresh policy                                                                                                       |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Terrain, landmarks, solved gates, keys/switches, discoveries, caches and surface warden/reward | Never refresh within that surface                                                                                    |
| Wild-supply gathering point                                                                    | Becomes available on the first offscreen return during a later calendar day; grants one preview coin                 |
| Ordinary surface slime                                                                         | May respawn on that later-day return only after death **and** collection of its old coin; receives a new lifetime ID |
| Unclaimed coin or living ordinary enemy                                                        | Retained; no erasure or full-health reset                                                                            |
| Crypt enemies/resources                                                                        | Retained for the instance; replacement only with a safe successor                                                    |

Rest advances the calendar in a durable checkpoint; it does not itself regenerate occupied terrain. Same-day re-entry cannot repeatedly farm renewables. Checkpoint continuation retains the refresh day and drop claim state.

## Anchored crypt boundary

1. A living warden always retains its instance and geometry across leaving, village trips, defeat and checkpoint reload.
2. Actual sword/bow combat defeats the six-health skeleton warden. Its anchor becomes `defeated`; the occupied map and reward remain intact.
3. The five-coin anchor reward can be claimed once. Leaving without it preserves the defeated instance for another visit.
4. After reward collection, exiting marks the now-unoccupied instance `pending-regeneration`.
5. The next entry validates a successor, retires the old instance and advances the persisted generation and instance identity. Merely exiting never creates the successor.

The repeatable integration successor is another skeleton warden in a fresh v1 layout. Old records remain in the checkpoint for identity/history safety; the schema currently bounds retained instances to 1,000 and reports the limit rather than reusing an ID. Campaign boss variety, the King fight and long-term retention/compaction remain later work. Permanent tools, unlocks, discoveries, King victory and restoration live outside these instances and are never reset by regeneration.

The expedition borrows M05's sword/shield/roll/bow kit. The trail axe is a real permanent route capability acquired through interaction; this does not implement M09 axe combat or approve the campaign's acquisition sequence. Expedition defeat applies the confirmed materials-only policy: independent 25% loss per carried material unit and 10% carried-money loss rounded down. Equipment, deposits, permanent tools and discoveries remain protected. The precise result, random continuation and village respawn commit together while retaining the encounter. Practice remains loss-free; see [saves](saves.md).

## Discovery, reproduction and validation

The explored map pauses the shared gameplay clock with its own composed reason. It shows unknown rooms as `?`, known connections and persisted entrance/landmark/secret/shortcut markers. Diagnostics include world and regional seeds, region ID, nullable instance ID, generator version, generation, attempt and fallback status. They expose no gameplay mutation API. Continuous positions stay outside React snapshots.

The corpus covers 100 seeds across five region types (500 layouts), all eight orientations, physical floor connectivity, spawn/placement clearance, dependency solvability and a coarse 15-second regression ceiling. Separate fixtures cover self-locked keys/switches/tools, invalid edges, corrupt geometry, bounded fallback/rejection, three village round trips, repeated deaths and checkpoint continuation, claimed/unclaimed refresh rules, real warden combat, reward idempotence and successor preservation of permanent victory. Browser flows walk actual geometry and operate real gates/maps/combat rather than mutating the browser's session.

**Durable browser checkpoints are implemented in M07.** Reload resumes the active slot, including full geometry, gates, claims, anchor history and saved encounters. Explicit v1-to-v2 migration preserves older synthetic checkpoints; unsupported/corrupt data is blocked and recoverable originals are retained. See [saves](saves.md) for browser limits and backup/recovery flows.
