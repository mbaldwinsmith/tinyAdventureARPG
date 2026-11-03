# Core state, time and ownership

M03 supplies framework-independent rules and serializable data contracts. M04 also routes three authored regions, validated interactions and retained object changes through this owner, alongside active-play time and rest. M05 adds serializable combat actions, enemies, projectiles, drops and defeat transitions in a separate practice region; [combat rules](combat.md) describe their fixed-step integration. M06 adds stored generated surfaces, crypt instances, map discoveries and inactive encounter checkpoints; see [generation](generation.md). Inventory actions, farming and durable browser saving remain later milestones.

## One authoritative owner

`GameSession` in `src/core/session.ts` owns world/player data, permanent progression, possessions, the fixed-step clock, calendar and four random streams. It validates initial/imported data once, keeps it private and returns detached checkpoints or frozen views. No Phaser, React, DOM or storage objects enter its state. `PreviewController` owns loading/failure status and cosmetic preview requests, connects this core to the bridge and disposes its handler with the scene.

React sends validated commands and reads display snapshots. Zustand holds those snapshots rather than a second editable player/world. Phaser supplies resolved movement to the core and renders the resulting position. The old separate PreviewSession is removed.

## Stable identity and data

`ids.ts` defines branded, validated IDs for worlds, entities, regions, dungeon instances, item templates, unique item instances, tools, unlocks, enchantments, statuses and equipment slots. Display names are separate. Generated entity/instance/item-instance IDs use the persisted world-scoped monotonic `nextId` counter, never wall-clock time or loot randomness. Import checks reject counters that would reuse an allocated identity. Authored region/content IDs remain stable keys within the saved world.

`model.ts` defines strict schema-version-1 envelopes with content/generator versions. State includes retained tile geometry, object identities and object deltas; player location, appearance, stats, resource pools, resistances, timed statuses and cooldowns; progression; and possessions. The clearing's retained path grid and terrain renderer use the same authored geography function. Authored objects have stable identities and explicit collision/interaction records in `content/world.ts`. Additive prerelease schema-v1 fields `changes.openedObjects` and `player.carrying` default to an empty array and null when absent, preserving M03 checkpoint parsing.

Permanent tools, unlocks, discoveries, King victory and restoration are independent of carried item instances. Carried inventory/money and individually located deposit containers are separate. A deposit records its chest, region and optional dungeon-instance identity; this defines provenance, not a global withdrawal service. Equipment references carried instances rather than duplicating items. Enchantments store their rolled magnitude once. Stack identity depends on template and sorted rolled enchantments, excluding the unique instance ID.

Content schemas and `ContentRegistry` distinguish explicit optional `null` references from invalid/unknown IDs. Duplicate definitions, unknown requirements and cyclic unlock graphs fail. Semantic state checks reject duplicate possession/slot identities, capacity/stack overflow, invalid equipment, missing permanent tool ownership, incompatible/out-of-range enchantments, broken progression/location/anchor references, invalid resources/statuses and contradictory restoration flags.

## Fixed-step and Phaser interface

The core uses **20ms steps (50Hz)**. For each render frame:

1. Ignore elapsed time while any pause reason remains active. The renderer also freezes actor/shore/effect presentation.
2. Accept at most 250ms of elapsed render time, combine it with the saved fractional remainder and determine whole gameplay steps. Drop excess stall time rather than simulating closed-game catch-up.
3. For each step, pass an immutable `StepContext` to the movement adapter: next tick, step milliseconds, current position/facing, region ID and speed in pixels per second.
4. The adapter resolves action input through swept axis-separated 8×6 foot collision and bounds, then returns `{position, facing}`. The core validates and commits that result once; it does not integrate the same velocity again.
5. Advance the authoritative tick, decrement cooldown/status durations, then advance the calendar and emit a day transition if required.
6. Render the final core position. Only changed display values and ordered domain events reach React.

There is no second physics loop or automatic collision integration in this clearing. The core independently rejects a final position overlapping an authored solid; no second integration or Arcade Physics clock runs. A seeded stream does not imply deterministic cross-platform physics.

Menu, settings, interaction, background, workbench, loading, failure and death pause reasons compose. The bridge can control menu/settings/background/workbench; loading/failure belong to the runtime and interaction/death pauses belong to their authoritative commands. Removing one reason leaves the others active. Combat and AI use these gameplay steps. Future farming updates must use these same gameplay steps; they must not introduce independent real-time timers.

## Calendar and rest

Calendar state is an absolute one-based day plus elapsed gameplay ticks. A derived view supplies season/day-of-season/year and displayed minute. Natural rollover starts the next day. `calendar.sleep` checks the expected current day, advances once and resets the day/fractional remainder; replaying a stale command fails. The transition and its event are synchronous, so a checkpoint cannot contain half of a sleep change.

Rest changes the calendar only at this stage. It does not simulate overnight combat, heal the player, grow nonexistent crops or write a durable save. Existing cooldown/status durations remain measured in subsequent active-play ticks. M07/M12 will connect persistence, recovery and crop rules to the day transition.

The editable **preview defaults** in `content/preview.ts` are a ten-minute day, 28 days per season, four seasons and a 06:00 day start. The actor retains the existing 60px/second preview speed. Sample pools, slots, a 20-stack carried capacity and example item/enchantment definitions exercise contracts; the player starts without equipment or granted tools. These do not approve the first-release budgets, late-night policy, recovery rules, equipment/loss/storage rules or other open M00 decisions. Rules are stored in the envelope so later default changes do not silently rewrite a loaded calendar.

## Randomness and checkpoints

`RandomStreams` wraps the pinned `seedrandom` 3.0.5 ARC4 generator in independent `terrain`, `loot`, `encounters` and `death` streams. Each explicit string seed includes the stream name and version. Drawing terrain/encounters/death values does not consume loot state. Full PRNG permutations/cursors and terrain/dungeon/loot generator versions are included in checkpoints. Cosmetic presentation never consumes those streams.

`GameSession.export()` returns detached validated JSON-shaped data; `serialize()` encodes it. Constructing a new session from that data resumes positions, active-time remainder, calendar, random outcomes, ID counters and permanent/possession data. Pause reasons and framework subscriptions are transient, and no timestamps/offline-delta fields are saved. Unsupported schemas/generator/PRNG versions and corrupt permutations fail rather than being silently reinterpreted. Browser storage, save slots, import/export UI, recovery and migrations are M07 work.

## Commands, events and snapshots

Commands validate at the bridge and core boundaries. Ready-state restrictions belong to the runtime; paused rest, stale rest and malformed commands return explicit failures. Appearance is cosmetic and can change while paused. A movement callback cannot issue a reentrant state change/checkpoint/random draw.

For an accepted command, the owner mutates state, allocates monotonically ordered event sequence numbers and builds its immutable display snapshot. The bridge installs that committed snapshot **before** delivering ordered domain events, then sends `snapshot.changed`. Reentrant commands during delivery are rejected, preventing interleaved batches. Events are drained, not retained as an unbounded UI history or replayed on load. Event sequence state is saved; transient animation requests are not.

Snapshots retain their object identity until status, appearance, pause, preview request, region/nearby target, interaction message, carrying/swimming, quantised combat HUD, discrete discoveries/anchor state, input preferences/device, debug visibility, failure notice or displayed calendar values change. They exclude positions and simulation ticks. With the current day length, calendar publication is roughly 2.4 changes/second rather than 50 updates/second; explicit commands publish immediately. When future HUD fields arrive, their subscriptions should remain similarly focused/bounded.

## Region and anchor lifecycle

Surface regions distinguish unvisited from active/dormant retained geometry. Activity transitions preserve geography and object deltas. Dungeon instances carry their own immutable identity, generation/version, geometry and changes, with anchor states `living`, `defeated`, `pending-regeneration` and `retired`.

M04 door commands validate destinations and incoming spawns against current retained solids, switch source/destination activity without changing geography, record discoveries, clear fractional time and emit a region-entered event. Interaction targeting validates range, facing and line of sight. Opening a chest records one stable ID. Pickup/drop moves a single world object and its solid without duplicating inventory. The active carried object must belong to the current surface and be absent from the ground.

Pure lifecycle functions permit defeat without replacing geometry, reject regeneration of a living or occupied instance, and require an unoccupied pending instance before retirement. The schema rejects occupying pending/retired instances. Travel, death, rest and checkpoints do not reset an anchor or erase permanent progress. M06 applies the confirmed reward-plus-exit/next-entry boundary: the occupied defeated map survives, exit marks pending only after reward collection, and a validated successor is created on the next entry. Permanent progress remains outside the generation. The current repeatable warden is integration content; campaign successors remain open.

## Verification

Pure Vitest checks cover typed IDs/counter continuation, content references/cycles, equipment and possession failures, detached checkpoints, golden/random-stream continuation, mixed render rates, pause composition, status/cooldown boundaries, season/year rollover, stale rest and retained anchor geometry. Bridge/controller tests verify committed-state event ordering, reentrant rejection and bounded snapshot publication. Browser checks exercise active time, menu/workbench pauses and rest alongside all earlier rendering flows. See CHANGELOG for the checks actually run.
