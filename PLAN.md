# Tiny Adventure — First Full Release Plan

**Target:** 1.0.0 desktop browser release. **Current stage:** M01 runnable foundation preview; campaign implementation remains ahead.

This is the implementation backlog. `[x]` means delivered and verified, not merely designed. Completed M00 items record the documentation baseline. M01 now delivers the application foundation; the authored clearing is an integration preview, not completion of later combat, world or campaign milestones.

## How to use this plan

1. Read `AGENTS.md`, this plan and the latest `CHANGELOG.md` entries before implementation.
2. Select the next small, coherent set of tasks whose dependencies are available. Build working slices; do not create empty implementations just to complete a phase.
3. Preserve task IDs. Add follow-up IDs rather than renumbering history. Break oversized tasks into suffixed children and define completion of their parent explicitly.
4. Check an item only after its result exists, its acceptance criteria are met and appropriate checks have passed. Record blocked work beside the item and leave it unchecked.
5. **For every newly checked task, update `CHANGELOG.md` in the same change with its ID, concrete result and validation evidence.** Update the README when commands, status or supported features change.
6. A milestone is complete only when its unchecked tasks and acceptance criteria are resolved. Any deferred release scope must be explicitly recorded, not silently checked off.
7. Validate proportionately: rule tests for consequential behaviour, integration tests for boundaries, browser checks for real flows and manual play for feel. Do not add tests merely to mirror implementation.

## Agreed design constraints

- TypeScript; Phaser 4; Vite for development/builds; React for UI.
- Plain TypeScript rules, Phaser world presentation, React UI and a typed bridge; one authoritative game state.
- Persistent surface geography after generation; forests are outdoor dungeons in their structure.
- Interior layouts persist through travel, save/load and death. Only defeating the anchor boss permits regeneration.
- Permanent tools, unlocks and discoveries survive death; banked possessions remain safe; eligible carried possessions face random loss.
- Defeat the evil King, represented by the supplied crowned tongue-attacking boss, and restore the Kingdom.
- Cardinal-direction attacks and readable enemy behaviour; procedural enchanted items, relics and abilities.
- No consumable ammunition. Bows/hooks/boomerangs use cooldowns; magic/bombs use regenerating energy.
- A visibly growing village, rescued residents and substantial day/season farming.
- Menus pause game time; sleeping starts a new day; closed-game time does not advance simulation.
- Desktop first. Preserve a route to mobile/tablet and desktop Steam releases.

## Planning baseline and scope decisions

The following is a **proposed budget for planning**, not an already approved content promise: one fixed village and farm; woodland with autumn variation, desert, winter and a small coastal area; reusable ruins and castle interior themes; two lesser anchor encounters and the final King; six recruitable residents; eight crop types; twelve enemy behaviours; twelve relics; eight enchantment definitions; simple fishing and a small boat route. Use owned packs across these systems without forcing every decorative sprite into the game.

Confirm or adjust these budgets under M00 before expanding content production. The first release should include a complete beginning-to-ending progression path, functional farming and reliable saves. Mobile layouts, native/Steam packaging, multiplayer, procedural dialogue and an unrestricted building system are outside this release baseline.

## Milestone dependency guide

| Milestone                              | Main prerequisites                                             |
| -------------------------------------- | -------------------------------------------------------------- |
| M00 decisions / M01 bootstrap          | Current documentation and repository                           |
| M02 assets / M03 core                  | M01; use the completed sprite audit as evidence                |
| M04 world / M05 combat                 | Usable M02 assets and M03 rules                                |
| M06 generation / M07 saves             | Core IDs, lifecycle and world representation; develop together |
| M08 inventory / M09 tools              | Core inventory contracts, collision, saves and basic combat    |
| M10 builds / M11 village / M12 farming | Core rules, content definitions, saves, UI bridge              |
| M13 coast / M14 campaign               | Movement, tools, generation, progression and village systems   |
| M15 UI / M16 presentation              | Iterate throughout; finish against integrated gameplay         |
| M17 verification / M18 release         | Complete playable campaign and agreed content budget           |

---

## M00 — Documentation and design decisions

- [x] **M00-001** Write the project README with centred heading, honest badges, concept, stack, status and licence boundaries.
- [x] **M00-002** Write this granular release plan with stable IDs, dependencies and acceptance gates.
- [x] **M00-003** Establish `CHANGELOG.md` and its task-completion update contract.
- [x] **M00-004** Write detailed repository-wide agent instructions in `AGENTS.md`.
- [ ] **M00-005** Confirm the first-release content budget and explicitly record any adjustments to the proposed baseline.
- [ ] **M00-006** Decide whether the wider overworld is fixed, seeded per save or a hybrid; keep discovered surface regions persistent.
- [ ] **M00-007** Confirm fixed village geography, reserved expansion plots and how recruited residents change its appearance.
- [ ] **M00-008** Define exact dungeon reset timing, successor anchor encounters and behaviour after a player exits a defeated instance.
- [ ] **M00-009** Define post-King play and restoration state, preserving victory when repeatable dungeons regenerate.
- [ ] **M00-010** Define carried-item loss eligibility, equipped-item treatment, probabilities, stack losses and money handling.
- [ ] **M00-011** Define permanent tool ownership separately from losable enchanted equipment and temporary effects.
- [ ] **M00-012** Decide storage accessibility: local chests, shared storage, money deposits and withdrawal rules.
- [ ] **M00-013** Choose smooth movement/facing rules, diagonal movement policy, collision footprint and cardinal attack direction selection.
- [ ] **M00-014** Set initial day length, season length, sleep/late-night rules and behaviour when the application loses focus.
- [ ] **M00-015** Choose inventory capacity/stack rules, equipment slots and ability/relic limits.
- [ ] **M00-016** Define tool unlock order, mandatory route gates and how ammunition-free tools remain usable outside combat.
- [ ] **M00-017** Confirm selectable hero appearances, naming and how appearance choice is stored without assigning gameplay classes.
- [ ] **M00-018** Define keyboard/controller mappings, supported desktop viewport range and target performance hardware.

**Acceptance:** agreed rules and open balances are distinguishable. No later task quietly overrides a design constraint. Decisions live in versioned project documentation and are linked from relevant tasks.

## M01 — Application and development foundation

- [x] **M01-001** Bootstrap a Phaser 4 + React + TypeScript + Vite application using the official integration template as reference.
- [x] **M01-002** Select compatible dependency versions, pin the supported Node.js version and commit one npm lockfile.
- [x] **M01-003** Enable strict TypeScript, unchecked-index safeguards and consistent module/path conventions.
- [x] **M01-004** Establish `core`, `game`, `bridge`, `ui`, `platform`, `content` and asset-definition boundaries.
- [x] **M01-005** Add ESLint rules, including import restrictions that keep framework/platform dependencies out of the core.
- [x] **M01-006** Add Prettier configuration, line-ending conventions and generated/vendor exclusions.
- [x] **M01-007** Implement the planned dev/build/preview/typecheck/lint/format/test scripts and document actual usage.
- [x] **M01-008** Configure Vitest for pure rules and focused integration tests without booting Phaser.
- [x] **M01-009** Configure Playwright, browser installation instructions and a Vite-backed real-browser launch smoke check.
- [x] **M01-010** Add CI jobs for clean install, typecheck, lint, formatting, tests and production build.
- [x] **M01-011** Add an owned Phaser mount/unmount lifecycle with subscription cleanup and safe React development remounts.
- [x] **M01-012** Define the typed command/event/snapshot bridge and error results for rejected commands.
- [x] **M01-013** Add a Zustand UI store with focused subscriptions and no duplicated authoritative inventory/world state.
- [x] **M01-014** Establish a visible development error screen and useful diagnostics for missing content/assets.
- [x] **M01-015** Add gitignore/build exclusions for caches, generated artefacts, local saves and purchased-asset extraction output.
- [x] **M01-016** Update README setup instructions and status to match the working bootstrap.

**Acceptance:** a clean checkout can install, launch and build through documented commands. One Phaser instance mounts cleanly under React; CI checks are meaningful and runnable.

### M01 delivery evidence

Implemented a Phaser 4.2.1 / React / TypeScript / Vite preview with 20 curated PNGs, six appearance choices, keyboard movement, composed pause handling, a typed bridge and disposable mount lifecycle. Rule/bridge/asset-boundary checks and real-browser UI/lifecycle/error flows pass; see `CHANGELOG.md` for exact validation and environment notes. CI is configured but its remote run is reported separately.

The partial asset importer supports this milestone. M02 remains open for the full catalogue, canonical aliases, complete action metadata and packed atlases. No M00 design decisions are silently closed by preview defaults.

## M02 — Asset inventory and explicit imports

- [x] **M02-001** Import the sprite audit's metadata/source mappings into a versioned repository catalogue without duplicating raw archives.
- [x] **M02-002** Reconcile the current archives against the audit's hashes and explain any changed counts.
- [x] **M02-003** Define canonical logical asset IDs and exact aliases for repeated PNGs and the three identical archive pairs.
- [x] **M02-004** Select compatible updated hero, goblin, skeleton and zombie sources; retain documented legacy alternatives.
- [x] **M02-005** Build repeatable archive reading/extraction with bounded paths and deterministic output ordering.
- [x] **M02-006** Define explicit frame rectangles, direction rows, frame durations, loop rules and stable foot anchors for base hero actions.
- [x] **M02-007** Define bow/shield, pickup/carry/throw, roll/hit, push/pull and swim action metadata for supported appearances.
- [x] **M02-008** Define farming, fishing, hook and magic action metadata and their separate tool/effect attachments.
- [x] **M02-009** Resolve the legacy dedicated boomerang pose versus modern throw-item adaptation and record the chosen presentation.
- [x] **M02-010** Define enemy action blocks/recolours and exclude baked labels from runtime frames.
- [x] **M02-011** Define the King's mixed-size body/tongue/death frames and attachable divided tongue pieces.
- [x] **M02-012** Define terrain adjacency/corner sets; keep old/new biome edge styles distinct and select updated shoreline art.
- [x] **M02-013** Define layered tree, building, furniture, boat hull/sail/fitting and oversized prop rectangles.
- [ ] **M02-014** Define GUI slices, bitmap font mappings, status icons and device prompt mappings.
- [ ] **M02-015** Generate runtime textures/atlases with pixel-safe padding and explicit manifests; preserve source archives byte-for-byte.
- [x] **M02-016** Implement `assets:check` for bounds, missing references, duplicate IDs and required animation coverage.
- [x] **M02-017** Build a development asset viewer with animation playback, scale, foot-anchor and hitbox overlays.
- [ ] **M02-018** Fill identified presentation gaps such as hero death and bomb explosions through approved reuse or deliberately authored effects.
- [ ] **M02-019** Record asset provenance and third-party notices; keep standalone paid source packs out of distributable builds.

**Acceptance:** assets can be regenerated from a clean checkout; representative animations play without cropped limbs, labels, shifting feet or texture bleeding. Large sprites are never forced into a universal 16px frame size.

### M02 catalogue and hero-animation delivery

Fifteen tasks are complete across the catalogue, animation and terrain/scenery increments. Coverage now includes 672 hero and 1,736 additional presentation sequences, 35 terrain profiles and 279 layered scenery compositions/source views. New Style has all 47 adjacency cases; Old Style retains its explicit patch limitations. The clearing demonstrates tiled paths, an animated pond and layered tree/cottage/boat art. Only 165 runtime PNGs are emitted; 121 inspection-only source records remain behind development middleware. See `docs/sprites/animation-layouts.md`, `docs/sprites/terrain-scenery.md` and `CHANGELOG.md` for scope and validation. GUI definitions, atlas packing, missing effects and final notices remain open; the milestone acceptance gate is not complete.

## M03 — Core data, time and state ownership

- [ ] **M03-001** Define stable entity, region, instance, content and item-instance IDs.
- [ ] **M03-002** Define serialisable save/world/player models using data rather than Phaser objects or React references.
- [ ] **M03-003** Define validated content schemas and distinguish missing/invalid IDs from intentionally optional data.
- [ ] **M03-004** Implement isolated seeded random streams for terrain generation, loot, encounters and death losses.
- [ ] **M03-005** Store random-stream state and generator versions needed to resume ongoing play consistently.
- [ ] **M03-006** Define permanent progression, tool ownership, carried possessions and deposited possessions as distinct domains.
- [ ] **M03-007** Define item templates, unique instances, enchantments, stack identity and equipment compatibility.
- [ ] **M03-008** Define actor stats, damage types, resource pools, status effects and cooldown data.
- [ ] **M03-009** Establish one fixed-step gameplay clock and a documented interface with Phaser movement/collision updates.
- [ ] **M03-010** Implement composable pause reasons shared by combat, cooldowns, AI and farming time.
- [ ] **M03-011** Implement active-play day/season time and explicit sleep transitions without closed-game catch-up.
- [ ] **M03-012** Define authoritative command handlers, event ordering and stable snapshots for the bridge.
- [ ] **M03-013** Define region lifecycle and dungeon anchor lifecycle states, including defeated/pending-regeneration states.
- [ ] **M03-014** Add focused invariant checks for invalid inventories, impossible equipment and broken progression references.
- [ ] **M03-015** Verify reproducible generation streams, independent loot randomness and consistent pause/time behaviour.

**Acceptance:** rules run in Vitest without a browser. One documented owner controls each kind of state and time; serialised state has no framework objects.

## M04 — Movement, world rendering and input

- [ ] **M04-001** Implement boot/loading/world scene flow with recoverable loading errors.
- [ ] **M04-002** Render base terrain, ground details, items, props, actors, canopies and effects in explicit depth order.
- [ ] **M04-003** Configure nearest-neighbour sampling, pixel-safe camera behaviour and an initial desktop scale strategy.
- [ ] **M04-004** Implement smooth movement and the agreed facing/diagonal policy using action-based input.
- [ ] **M04-005** Implement actor foot collision bodies and solid-world collision separate from artwork bounds.
- [ ] **M04-006** Add camera follow, bounds and smooth region-entry placement without trapping the player.
- [ ] **M04-007** Resolve movement, idle, carrying, swimming, attack and hit animation priority consistently.
- [ ] **M04-008** Add keyboard bindings, pointer targeting where agreed and remappable action definitions.
- [ ] **M04-009** Add controller navigation, stick dead zones, connect/disconnect handling and prompt switching.
- [ ] **M04-010** Clear held input on blur, pause, modal transitions and controller disconnect.
- [ ] **M04-011** Route menu focus to React and prevent combat/interactions from leaking through UI overlays.
- [ ] **M04-012** Implement interaction targeting and prompts for doors, signs, NPCs, chests and farm plots.
- [ ] **M04-013** Implement region transitions with validated destinations and explicit incoming spawn locations.
- [ ] **M04-014** Add development overlays for feet, collision, interaction reach and active scene state.
- [ ] **M04-015** Verify movement/collision at different render rates and play representative tree/door/narrow-path layouts.

**Acceptance:** a player can traverse a small layered scene, interact and pause with keyboard/controller. UI focus cannot accidentally trigger world actions.

## M05 — Cardinal combat and enemy behaviour

- [ ] **M05-001** Define cardinal attack arcs, windup/active/recovery frames and movement commitment.
- [ ] **M05-002** Implement sword attacks with explicit hitboxes and one-hit-per-swing tracking.
- [ ] **M05-003** Implement damage, knockback, hurt response and bounded invulnerability windows.
- [ ] **M05-004** Implement directional shield blocking with clear success/failure feedback.
- [ ] **M05-005** Implement dodge rolls, collision behaviour, cooldown and defined invulnerability timing.
- [ ] **M05-006** Implement health/energy regeneration and cooldown presentation independently of frame rate.
- [ ] **M05-007** Implement faction/owner-aware projectiles, collision, lifetime and cleanup.
- [ ] **M05-008** Add enemy state machines with visible detection, pursuit, windup, attack, recovery and disengagement.
- [ ] **M05-009** Implement basic melee skeleton and slow-pressure zombie behaviours.
- [ ] **M05-010** Implement goblin archer spacing, aim telegraph and projectile release.
- [ ] **M05-011** Implement bat/rat/slime movement patterns using available direction coverage deliberately.
- [ ] **M05-012** Implement enemy death, drops and encounter completion without duplicate reward events.
- [ ] **M05-013** Implement path requests/steering for room obstacles without frame-by-frame full-world pathfinding.
- [ ] **M05-014** Implement player death entry and a single authoritative loss/respawn transition.
- [ ] **M05-015** Add readable targeting, impact feedback and adjustable screen-shake settings.
- [ ] **M05-016** Verify cardinal hit boundaries, blocking, repeated overlaps, pause behaviour and death-event idempotency.
- [ ] **M05-017** Playtest small mixed encounters for readable behaviour and fair recovery opportunities.

**Acceptance:** combat is playable and predictable. Damage timing is explicit; held overlap does not repeatedly apply a single hit. Enemy recolours do not masquerade as distinct behaviour implementations.

## M06 — Persistent surfaces and anchor dungeons

- [ ] **M06-001** Define region topology, entrances, exits, room tags, tool requirements and encounter/reward slots.
- [ ] **M06-002** Build a small set of hand-authored room templates with validated entrances and collision.
- [ ] **M06-003** Generate connected dungeon graphs with required tool/reward/boss routes and optional branches.
- [ ] **M06-004** Validate reachability using the player's obtainable tool set; reject or repair unsolvable layouts.
- [ ] **M06-005** Place keys, switches and puzzle dependencies without locking required items behind themselves.
- [ ] **M06-006** Generate forest clearings/trails as outdoor rooms and corridors with natural-looking boundaries.
- [ ] **M06-007** Add recognisable landmarks, secret clearings and shortcuts to persistent forest layouts.
- [ ] **M06-008** Generate desert/winter/coastal surface regions using the confirmed first-release topology policy.
- [ ] **M06-009** Persist first-generated surface geometry and save subsequent object changes separately.
- [ ] **M06-010** Define renewable enemy/resource refresh rules separately from terrain, one-time treasure and solved puzzles.
- [ ] **M06-011** Preserve an anchored interior's instance across leaving, death, saving and reloading.
- [ ] **M06-012** Mark anchor defeat and clear rewards without immediately destroying the occupied instance.
- [ ] **M06-013** Create a successor dungeon only at the agreed safe lifecycle boundary and increment its generation identity.
- [ ] **M06-014** Preserve campaign unlocks and restoration flags across repeatable dungeon generations.
- [ ] **M06-015** Add explored/unexplored map discovery with persistent entrance/shortcut markers.
- [ ] **M06-016** Provide seed/region/instance diagnostics and reproducible generation fixtures for bugs.
- [ ] **M06-017** Check a representative seed corpus for connectivity, gate solvability, exit placement and bounded generation time.
- [ ] **M06-018** Verify surface persistence and dungeon lifecycle across multiple full village round trips and deaths.

**Acceptance:** the world can be learned. A living anchor always preserves its dungeon; only the specified defeated-anchor transition generates a successor. Required routes remain solvable.

## M07 — Saving, storage and death consistency

- [ ] **M07-001** Define a versioned save envelope, content/generator versions and validation failure reporting.
- [ ] **M07-002** Implement a save repository interface and Dexie/IndexedDB browser adapter.
- [ ] **M07-003** Persist player, inventories, deposits, farm, village, quests and region/instance records consistently.
- [ ] **M07-004** Save generated region geometry as well as seeds and changed-object records.
- [ ] **M07-005** Add new-game, save-slot listing, continue and explicit save/load flows.
- [ ] **M07-006** Add safe autosave checkpoints at transitions, deposits, sleep, significant unlocks and boss outcomes.
- [ ] **M07-007** Implement atomic chest transfers so moved possessions cannot be duplicated or lost between owners.
- [ ] **M07-008** Implement atomic money deposits/withdrawals and validate insufficient funds/capacity conditions.
- [ ] **M07-009** Resolve death-loss eligibility using the agreed permanent-versus-carried rules.
- [ ] **M07-010** Apply random item/stack/money losses once and persist the outcome with the respawn state.
- [ ] **M07-011** Display retained/lost possessions accurately and preserve deposits, permanent tools and discoveries.
- [ ] **M07-012** Persist anchor defeat, rewards and pending regeneration without repeat claims after reload.
- [ ] **M07-013** Restore active dungeon instances, open gates and collected one-time rewards correctly.
- [ ] **M07-014** Implement explicit schema migration infrastructure and test the first supported migration fixture.
- [ ] **M07-015** Add save export/import with schema validation, duplicate-slot policy and readable errors.
- [ ] **M07-016** Handle unavailable storage, quota errors and write failures visibly while retaining recoverable session state.
- [ ] **M07-017** Recover from interrupted transitions using a documented transaction/checkpoint strategy.
- [ ] **M07-018** Verify round-trip saves and failure/reload scenarios around deposits, death, sleep and boss defeat.
- [ ] **M07-019** Document browser storage limitations, export backups and how future desktop save adapters will differ.

**Acceptance:** browser reload preserves the active adventure. Banking/death/boss transitions cannot duplicate possessions or erase protected progress. Failed saves are never falsely reported as successful.

## M08 — Inventory, equipment and chest UI

- [ ] **M08-001** Implement stack merging/splitting, item movement and capacity checks using core commands.
- [ ] **M08-002** Implement unique enchanted item identity so incompatible stacks cannot silently merge.
- [ ] **M08-003** Implement equipment slot rules, stat updates and validated equip/unequip commands.
- [ ] **M08-004** Build React inventory/equipment panels with keyboard/controller selection and pointer support.
- [ ] **M08-005** Add readable item descriptions showing base properties, enchantments and relevant ability effects.
- [ ] **M08-006** Build paired player/chest views with deposit/withdraw/split actions and clear ownership.
- [ ] **M08-007** Build money deposit/withdraw controls with clear carried/deposited totals.
- [ ] **M08-008** Add pickup feedback and deliberate handling for full inventories and uncollectable rewards.
- [ ] **M08-009** Implement hotbar/tool selection with binding prompts and cooldown/energy feedback.
- [ ] **M08-010** Add discard confirmation appropriate to valuable unique items and prevent discarding permanent unlock ownership.
- [ ] **M08-011** Show loss-risk categories without promising unchosen probabilities or hidden guarantees.
- [ ] **M08-012** Verify chest/equipment operations through UI commands, save/load and death transitions.

**Acceptance:** deposits and equipment work through the same rules on every input device. React cannot independently mutate authoritative possessions.

## M09 — Tools and environmental puzzles

- [ ] **M09-001** Implement bow aiming in cardinal directions, release timing and cooldown without ammunition stacks.
- [ ] **M09-002** Implement bomb placement/throw, fuse, blast footprint and regenerating energy cost.
- [ ] **M09-003** Implement boomerang outward/return travel, target-hit policy and catch/cooldown lifecycle.
- [ ] **M09-004** Implement boomerang pickup retrieval and supported remote switch activation.
- [ ] **M09-005** Implement hook target eligibility, launch/tether/retraction and safe landing positions.
- [ ] **M09-006** Implement magic rod casting, effect/projectile interaction and regenerating energy cost.
- [ ] **M09-007** Implement pickup/carry/throw interactions for supported pots, crates and bombs.
- [ ] **M09-008** Implement push/pull rules and distinguish movable heavy weights from liftable objects.
- [ ] **M09-009** Implement pressure plates and linked doors with saved solution states where appropriate.
- [ ] **M09-010** Implement blue/orange lever-and-barrier groups with non-colour-only state feedback.
- [ ] **M09-011** Implement spikes, shooting traps, directional pushing tiles and pit/acid/water hazards.
- [ ] **M09-012** Implement swimming/water entry/exit and tool-gated crossings without softlocking the player.
- [ ] **M09-013** Mark and implement bombable walls, hook anchors and permanent forest shortcuts consistently.
- [ ] **M09-014** Validate each tool's combat/exploration roles and energy recovery in required puzzle routes.
- [ ] **M09-015** Deliver a vertical slice: village chest → persistent forest → anchored dungeon → boss defeat → safe regeneration.

**Acceptance:** the slice survives death and reload. Every required puzzle has a recoverable solution without consumable ammunition; visual cues explain interactable surfaces.

## M10 — Enchantments, relics and abilities

- [ ] **M10-001** Define item level/tier budgets and compatible enchantment pools in validated content data.
- [ ] **M10-002** Generate enchanted items with reproducible rolls and persist rolled results rather than rerolling on load.
- [ ] **M10-003** Prevent incompatible or contradictory affix combinations and cap extreme numerical effects.
- [ ] **M10-004** Implement a reusable modifier/effect resolution order for damage, cooldowns, energy and tool effects.
- [ ] **M10-005** Implement the confirmed initial enchantment set with meaningful visible differences.
- [ ] **M10-006** Implement relic acquisition, slot limits, stacking rules and saved ownership/loss classification.
- [ ] **M10-007** Implement the confirmed initial relic set, including interactions across multiple tools.
- [ ] **M10-008** Implement ability unlocks, selection, activation and their permanent/temporary classification.
- [ ] **M10-009** Define encounter, chest, boss and quest loot tables with progression constraints.
- [ ] **M10-010** Explain build effects accurately in inventory, equipment comparisons and ability descriptions.
- [ ] **M10-011** Verify modifier order, stacking caps, loss eligibility and enchanted-instance save round trips.
- [ ] **M10-012** Playtest several distinct builds against the same encounters and tool puzzles.

**Acceptance:** builds differ in play rather than only in item names. Random equipment never replaces permanent progression ownership or creates mandatory-route dead ends.

## M11 — Village growth, NPCs and quests

- [ ] **M11-001** Author the village map, farm area, storage access, expansion spaces and initial services.
- [ ] **M11-002** Add entering/exiting building interiors with consistent saved positions and interactions.
- [ ] **M11-003** Define recruitable NPC identities, appearance sources, dialogue and unlock requirements.
- [ ] **M11-004** Implement rescue/recruitment state transitions that cannot recruit the same person twice.
- [ ] **M11-005** Place recruited residents and visibly update their buildings, plots or services.
- [ ] **M11-006** Implement dialogue nodes, choices, conditions and one-time effects through validated data.
- [ ] **M11-007** Implement quest states, objectives and rewards with duplicate-claim protection.
- [ ] **M11-008** Add a journal with current objectives, discoveries and clear next-step hints.
- [ ] **M11-009** Implement shop buy/sell rules, price data and inventory/money transactions.
- [ ] **M11-010** Add NPC emotes, readable interaction prompts and simple routines appropriate to the release scope.
- [ ] **M11-011** Connect resident services to farming, equipment, fishing and campaign progression as agreed.
- [ ] **M11-012** Add visible restoration stages that preserve earlier village progress.
- [ ] **M11-013** Save and restore dialogue flags, recruitment, services, quests and restoration consistently.
- [ ] **M11-014** Playtest the opening village loop and an entire recruit-to-service-unlock flow.

**Acceptance:** finding people changes the village visibly and functionally. Dialogue, shops and quest rewards use authoritative transactions and survive reloads.

## M12 — Farming, days and seasons

- [ ] **M12-001** Define crop/seed data, seasonal suitability, growth stages, watering needs and harvest yields.
- [ ] **M12-002** Map the agreed crop set to supplied sprites using the pack's right-to-left crop guide where applicable.
- [ ] **M12-003** Implement farm-plot identity, soil state and saved crop occupancy.
- [ ] **M12-004** Implement hoe use, valid planting targets and seed inventory transactions.
- [ ] **M12-005** Implement watering-can action, wet/dry feedback and an explicit water/refill rule.
- [ ] **M12-006** Implement crop growth on day transitions, including missed watering and invalid-season handling.
- [ ] **M12-007** Implement harvest and repeat-harvest behaviour for crop types that support it.
- [ ] **M12-008** Implement day/season HUD, current date and clear sleep interaction.
- [ ] **M12-009** Apply sleeping, day advance, energy restoration and crop updates as one consistent saved transition.
- [ ] **M12-010** Implement season changes and the confirmed late-night/day-boundary rules.
- [ ] **M12-011** Add seed buying and produce selling through village shop transactions.
- [ ] **M12-012** Add axe/pickaxe interactions for farm obstacles and supported renewable resource nodes.
- [ ] **M12-013** Implement only the confirmed crafting/supply recipes needed by the release progression.
- [ ] **M12-014** Add livestock/wildlife presence and any explicitly agreed animal-care mechanics within the content budget.
- [ ] **M12-015** Persist soil, crop growth, watering, harvest states and calendar without closed-game catch-up.
- [ ] **M12-016** Verify crops/calendar across pause, sleep, season rollover, death and interrupted save/reload.
- [ ] **M12-017** Play a multi-day farming loop and tune its effort, income and relationship to expeditions.

**Acceptance:** planting, daily care, growth, harvest and sales form a complete playable loop. Pausing and reloading cannot grow crops twice or advance unintended days.

## M13 — Coast, fishing and boat travel

- [ ] **M13-001** Author/generate the persistent coastal region and accessible fishing positions.
- [ ] **M13-002** Implement fishing cast, wait, bite and pull states using inspected frame definitions.
- [ ] **M13-003** Define catch tables, junk/treasure outcomes and progression-appropriate rewards.
- [ ] **M13-004** Deliver catches through validated inventory transactions with full-inventory handling.
- [ ] **M13-005** Implement a boat route or bounded sailing area under the confirmed release budget.
- [ ] **M13-006** Compose hull, sail, upgrades and rider with direction-specific attachment offsets.
- [ ] **M13-007** Implement boarding, disembarking and safe shore placement with saved travel state.
- [ ] **M13-008** Connect the coastal resident/service and island discoveries to the main adventure loop.
- [ ] **M13-009** Verify fishing/travel cancellation, pause, save/load and unavailable landing locations.

**Acceptance:** the Coast pack supports a complete small activity/travel loop. No player can become stranded by boarding or loading a boat state.

## M14 — Campaign, encounters and the evil King

- [ ] **M14-001** Author the main progression graph from opening village through tool unlocks to the royal castle.
- [ ] **M14-002** Place required tool unlocks, recruit encounters and route hints within reachable progression stages.
- [ ] **M14-003** Complete the agreed biome content budgets with cohesive terrain, props and encounters.
- [ ] **M14-004** Expand the enemy roster to the confirmed behaviour budget using appropriate supplied species.
- [ ] **M14-005** Design two lesser anchor encounters using existing art or explicitly scoped additions, with distinct readable patterns.
- [ ] **M14-006** Implement lesser anchor rewards and repeat-generation behaviour without duplicate campaign unlocks.
- [ ] **M14-007** Author castle approach, room templates, key gates, shortcuts and treasure encounters.
- [ ] **M14-008** Implement soldiers and mimics with fair telegraphs and appropriate rewards.
- [ ] **M14-009** Implement the evil King's movement, bite and directional tongue attack with explicit active hit regions.
- [ ] **M14-010** Implement King phases, recovery windows and clearly signalled escalation within the supplied animation coverage.
- [ ] **M14-011** Implement final defeat, rewards, victory presentation and Kingdom restoration state.
- [ ] **M14-012** Preserve the King's permanent defeat and follow the confirmed post-victory play policy.
- [ ] **M14-013** Add an opening tutorial that teaches movement, cardinal attacks, banking risk and the first tool interaction.
- [ ] **M14-014** Finish quest/dialogue text, ending text and navigational hints across the campaign.
- [ ] **M14-015** Complete a new-save-to-victory playthrough without debug grants or skipped progression.

**Acceptance:** a player can finish the campaign, understand why bosses anchor dungeons and see restoration. Victory remains intact across saving and any repeatable content.

## M15 — Complete UI, accessibility and desktop usability

- [ ] **M15-001** Complete title, new/continue, save selection, pause, settings and credits flows.
- [ ] **M15-002** Finish HUD health/energy, equipment, cooldown, calendar and contextual interaction feedback.
- [ ] **M15-003** Finish inventory, chest, shop, dialogue, journal and map flows against real game state.
- [ ] **M15-004** Add consistent keyboard/controller focus order, visible focus and cancel/back behaviour.
- [ ] **M15-005** Add remapping, prompt updates and persistent settings for keyboard/controller actions.
- [ ] **M15-006** Add UI scale/text readability options and verify the confirmed desktop viewport range.
- [ ] **M15-007** Communicate hazards, rarity and switch states through shapes/text as well as colour.
- [ ] **M15-008** Add reduced-motion, flash/shake controls and independent audio volume options.
- [ ] **M15-009** Add accessible names/semantics to React controls and ensure pointer-only gestures have alternatives.
- [ ] **M15-010** Explain death outcomes, save failures, full storage and unavailable interactions without blocking loops.
- [ ] **M15-011** Validate focus after scene changes, modal closure, controller disconnect and loading errors.
- [ ] **M15-012** Manually verify a complete keyboard-only and controller-only village-to-dungeon session.

**Acceptance:** first-release actions are usable with either supported input scheme. Text, focus and state feedback remain legible without relying solely on pixel-art colour distinctions.

## M16 — Audio, effects and visual polish

- [ ] **M16-001** Select/create appropriately licensed music and sound effects and record provenance.
- [ ] **M16-002** Add music transitions for village, exploration, dungeon, boss and victory states.
- [ ] **M16-003** Add clear attack, block, hit, tool, pickup, UI, farming and interaction sounds.
- [ ] **M16-004** Handle audio unlock, pause/background policy and volume restoration consistently.
- [ ] **M16-005** Add bounded impact particles, tool trails, pickup effects and death/respawn presentation.
- [ ] **M16-006** Polish day/season presentation while preserving readable combat and original pixel scale.
- [ ] **M16-007** Check animation anchors, tree depth, doorway visibility and coast/boat alignment across all supported appearances.
- [ ] **M16-008** Respect reduced-motion settings and cap effect lifetimes, pooled objects and concurrent audio.

**Acceptance:** effects communicate actions and remain bounded over long sessions. No missing/misaligned critical animation or unlicensed presentation asset ships.

## M17 — Balance, performance and integrated verification

- [ ] **M17-001** Set measurable loading, frame-time, memory, generation-time and save-size budgets for the agreed target hardware.
- [ ] **M17-002** Profile dense forests, busy rooms, boss attacks, large inventories and long-lived saves on a production build.
- [ ] **M17-003** Fix texture/object/subscription leaks across repeated region transitions and React scene remounts.
- [ ] **M17-004** Bound pathfinding, generation, effects and UI snapshot work; use workers only where profiling justifies them.
- [ ] **M17-005** Balance combat damage, enemy timings, healing, energy and tool cooldowns across progression.
- [ ] **M17-006** Balance loot/enchantments/relics and random death losses without removing permanent route access.
- [ ] **M17-007** Balance farming, shops, deposits and expedition rewards so both home and adventure remain useful.
- [ ] **M17-008** Run the generation corpus and progression-solvability checks against release content.
- [ ] **M17-009** Run browser end-to-end flows for new/continue, chest transfer, death, anchored revisit, boss reset and sleep/harvest.
- [ ] **M17-010** Exercise save failures, interrupted transitions, import errors and schema migrations on representative saves.
- [ ] **M17-011** Verify supported desktop browsers and keyboard/controller combinations against a documented matrix.
- [ ] **M17-012** Run a long session including several in-game days, dungeon generations, reloads and region revisits.
- [ ] **M17-013** Conduct external/manual playtesting, record actionable findings and resolve release-blocking issues.
- [ ] **M17-014** Complete a clean-install full campaign playthrough on the release candidate and archive concise evidence.

**Acceptance:** release budgets are met or explicit limitations are documented. Core persistence/progression invariants pass; no known blocker prevents finishing the campaign or keeping a valid save.

## M18 — Release preparation and 1.0.0

- [ ] **M18-001** Reconcile the agreed content budget, milestone gates and all deferred work with the owner-approved release scope.
- [ ] **M18-002** Remove debug grants/menus from release defaults while retaining useful opt-in diagnostics.
- [ ] **M18-003** Verify the distributable excludes raw ZIPs, source-only previews, local saves and private development data.
- [ ] **M18-004** Finalise credits, licence notices, controls, storage/export guidance and supported-platform information.
- [ ] **M18-005** Replace planning-only README sections with accurate setup instructions, screenshots and links to the actual playable build.
- [ ] **M18-006** Produce reproducible production artefacts from the locked dependency set and document hosting/base-path requirements.
- [ ] **M18-007** Smoke-test the production artefact at its intended hosting path, including reloads and asset loading.
- [ ] **M18-008** Run final typecheck, lint, formatting, asset validation, rule tests, browser checks and build; record results.
- [ ] **M18-009** Prepare dated 1.0.0 changelog/release notes with known limitations and save compatibility information.
- [ ] **M18-010** Publish/tag the approved release using the requested delivery workflow and verify the delivered game.

**Acceptance:** 1.0.0 is a complete, playable, documented desktop browser game. Publishing follows the user's current authorization; a completed build is not itself a published release.

---

## Final release checklist

These are release gates, not extra task IDs. Each must be supported by completed tasks and recorded evidence.

- [ ] A new player can reach the King, defeat him and observe Kingdom restoration.
- [ ] Surface regions retain generated geography, discoveries and changes through death/reload.
- [ ] Living-anchor dungeon instances persist; defeated-anchor regeneration follows the defined safe boundary.
- [ ] Random death losses apply once; permanent progress and deposited possessions remain safe.
- [ ] Farming, seasons, sleep, recruitment and visible village growth form complete loops.
- [ ] Tools work without consumable ammunition and required routes remain solvable.
- [ ] Enchantments, relics and abilities provide the agreed build variety.
- [ ] Saves, migration, error recovery and export/import pass consequential checks.
- [ ] Keyboard/controller UI, accessibility options and desktop performance meet the agreed scope.
- [ ] Build/asset provenance and software/third-party licensing are documented accurately.
- [ ] README and changelog describe the delivered release and its actual checks.

## Later milestones — outside 1.0.0

- Dedicated mobile/tablet interface, touch controls, safe areas and device performance validation.
- Desktop packaging for Windows/macOS/Linux; Steam services, achievements, cloud saves and controller/Deck verification.
- Additional regions, residents, crops, relics, encounters and story expansions after the first campaign is stable.
- Wider farming/animal-care/building systems only when deliberately scoped.
