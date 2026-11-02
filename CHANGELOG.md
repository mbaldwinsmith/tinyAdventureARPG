# Changelog

All notable changes to Tiny Adventure are recorded here.

The first full game release is planned as **1.0.0**. No game version has been released yet.

## Update contract

- Update this file in the **same commit/change** whenever an item in `PLAN.md` moves from `[ ]` to `[x]`.
- Include its stable task ID, the concrete result and concise validation evidence.
- Group related IDs in one entry when they describe one coherent delivered change; ensure every newly completed ID is covered.
- Use `Added`, `Changed`, `Fixed`, `Removed`, `Validation` and `Known limitations` as useful. Do not create empty sections for their own sake.
- Record completed work, not aspirations. An implementation task remains open if its acceptance criteria are unmet.
- If a task is reopened, record the reason under `Changed` or `Fixed`; retain the earlier history.
- Keep ongoing entries under `Unreleased`. At release, move them into a dated version heading; do not rewrite earlier entries to conceal regressions.
- List checks actually run. Clearly distinguish automated checks, manual play checks and checks blocked by the environment.

## [Unreleased]

### Added — world movement, rendering and input

- **M04-001, M04-002, M04-003:** Separate boot, asset-loading and world scenes, with visible asset failures and a working retry. Add explicit terrain/detail/shadow/item/feet/canopy/effect depth bands, nearest sampling, rounded cameras and a responsive 480×272 FIT viewport. Retain supplied pixels; add the supplied cottage floor/heavy box and promote controller prompts. Current import totals are 316 sources, 172 runtime / 144 inspection-only and 3,849 padded frames on one 2048px atlas.
- **M04-004, M04-005, M04-006:** Resolve action-based smooth movement with normalised diagonals and cardinal facing through swept 8×6 foot collision, separate from animation bounds. Preserve one core 20ms commit boundary, sliding and thin-wall clipping. Add bounded smooth camera follow, centred small interiors and safe entry placement. Existing movement/facing choices remain reversible preview defaults pending M00.
- **M04-007:** Resolve forced action previews (including attack/hit) before swim, carry, walk and idle. Drive presentation durations from core simulated time. Carrying a retained world box and pond contact exercise the real base-state priorities; previews remain cosmetic without damage/combat.
- **M04-008, M04-009:** Add validated unique key/action-button remapping, reserved arrows, nearby pointer activation and standard-mapped Gamepad API input. Add radial stick dead zones, edge-based UI navigation, connection/replacement/disconnect handling and actual keyboard/Xbox/PlayStation/Switch/generic prompts. Bindings are session-only.
- **M04-010, M04-011:** Clear held input across focus, pause, modal, disconnect and region changes. Require controller neutral before rearming. Native React dialogs own menu/settings/interaction focus; pause reasons compose and closing nested controls preserves the menu. Explicit initial/return focus fixes controller selection ambiguity and prevents held confirm/movement leaking into the world.
- **M04-012, M04-013:** Validate nearest interaction range, facing and line of sight. Add doors, sign/NPC information, empty-chest open state, farm-plot inspection and safe pickup/drop of one world box. Connect clearing, cottage and larger woodland with validated explicit incoming spawns, retained geometry/deltas and discovery events. Add prerelease schema-v1 defaults for opened-object IDs and a nullable carried-world-object identity, preserving M03 checkpoint parsing.
- **M04-014, M04-015:** Add development-only feet/solid/reach/region/scene/tick overlays and read-only browser observations. Test actual wall collision at 30/60/144 render rates, swept clipping/sliding, clear spawns and routes to every authored target, retained chest/box state, safe two-way doors, animation priority and controller neutral/edge handling.

### World/input validation and scope

- `npm run check` and `npm run build` pass, with 53 Vitest tests. Full catalogue/archive hashes and all padded atlas frames are verified. Raw purchased archives and LICENSE remain unchanged.
- Fifteen Playwright browser flows pass with the documented Chromium override, including loading failure/retry, source pixels, animation/effect/pause/calendar/lifecycle regression checks, collision, pointer and keyboard interaction, remapping, door travel, carrying/swimming, bounded woodland camera, and emulated standard-controller interaction/nested menus/disconnect. Install the test clock before navigating so boot/loading scene timing uses one clock.
- Production WebGL QA passes at 1440px and 800px: all three regions and return travel, larger-world scrolling, centred cottage, nested controls/pause, no overflow, one canvas, bundled notices and no page errors. Screenshots were inspected.
- M04's authored-preview gate is complete. Standard-controller tests emulate the browser Gamepad API; physical controllers were unavailable and hardware/browser compatibility still needs playtesting. Nonstandard mappings are ignored. The preview keeps M00 movement, mapping, topology and balance choices open. Chests contain no inventory, NPCs are not recruited, farm plots do not grow, carrying is one world prop, and pond swimming grants no campaign ability. Combat, damage, transactions, durable saves, generated regions and farming remain later work.

### Added — core state, time and ownership

- **M03-001, M03-002, M03-003:** Add branded stable ID domains, world-scoped monotonic allocation, strict versioned JSON world/player/checkpoint schemas and validated content registries. Keep optional nulls distinct from missing/invalid IDs; reject duplicate/cyclic/broken content references. Retain the clearing's authored grid and stable chest/sign identities without claiming a generated world.
- **M03-004, M03-005, M03-015:** Pin seedrandom 3.0.5 with separate explicit-seed terrain, loot, encounter and death streams. Store full validated PRNG state plus generator versions for exact checkpoint continuation. Verify golden draws, independent loot outcomes and mixed-render-rate/pause behaviour. Include seedrandom and its bundled Alea licence headers in generated notices.
- **M03-006, M03-007, M03-008, M03-014:** Separate permanent progression/tool ownership, carried items/money and individually located deposits. Define unique item instances, rolled enchantments, stack identity, equipment requirements, actor stats, resource pools, damage/resistance/status/cooldown data. Reject duplicate possession IDs, bad capacities/stacks, impossible equipment, missing tool ownership and contradictory progression/location/anchor data.
- **M03-009, M03-010:** Establish GameSession as the sole state/time/random owner with bounded 20ms gameplay steps. Phaser resolves movement/bounds once per step; core commits once and then advances timed state. Share composable menu/background/workbench/loading/failure pauses across the gameplay clock. Keep loading/failure pause authority outside UI commands. Remove the old competing preview-session owner.
- **M03-011, M03-012:** Implement active-play day/season/year time and an atomic, stale-safe rest command without wall-clock/offline catch-up. Add the visible calendar and Rest until tomorrow control. Validate commands, sequence domain events against committed state, reject reentrant delivery and publish frozen stable snapshots without streaming actor positions/ticks into React.
- **M03-013:** Define unvisited/active/dormant surfaces and living/defeated/pending-regeneration/retired dungeon anchors. Pure guarded transitions preserve geometry/deltas, reject living or occupied regeneration and keep exact reset timing/successor policy open for M00/M06.
- Add a Stop explosion control in the workbench after browser regression testing exposed an unchanged-value slider race during playback. Explicit stop and scrubbing now retain the selected frame.

### Core validation and scope

- `npm run assets:build`, `npm run check` and `npm run build` passed. Forty-one Vitest tests cover core save/content/inventory/lifecycle/time/random invariants, 30/60/144Hz resolved-movement equivalence, detached serialization, stable snapshots and ordered non-reentrant bridge delivery, alongside asset/archive checks.
- Eleven real-browser flows passed with the documented Chromium override. The new flow verifies active time, menu/workbench pause and the day-2 rest transition; all existing rendering, lifecycle, missing-texture, pixel-source and effect/pause checks pass. Focused production WebGL QA passed at 1440px and 800px, including movement, clock/rest/pause, notices, exactly one canvas and no overflow/page errors.
- M03's pure-rule/state-ownership acceptance gate is complete. Preview calendar/pool/capacity/content settings are versioned configurable defaults, not approval of open M00 balances. Rest currently advances calendar only; recovery, crop growth and durable saves are later integrations. Combat, AI, inventory operations, procedural regions and real dungeon encounters are not implemented by these contracts. Raw archives and LICENSE remain unchanged.

### Added — completed asset pipeline

- **M02-014:** Define four inspected 4px-border nine-slice panels, normal/pressed buttons, heart/drop/star and descriptive status icons, 14 bitmap font variants with 88 glyphs/fallback metrics, and physical keyboard/controller/mouse prompts. Add resizable panel/font/icon inspectors. Use the green panel on the accessible pause dialog and actual keyboard prompts in the clearing.
- **M02-015:** Replace standalone runtime sheets with a deterministic padded atlas pipeline and manifest v2. Pack 3,763 explicit source rectangles from 167 runtime sources into one 2048×2048 page, with 2px edge/corner extrusion, no trimming/rotation and source/page/crop hashes. Migrate Phaser animations/scenery, React portraits and key prompts to packed frames. Validate all 314 sources from 16 unchanged selected archives; 147 inspection-only records remain outside production pixels.
- **M02-018:** Add death/fall reuse with a bounded fade and bomb/throw-item reuse with a code-authored six-frame explosion. There are 720 hero sequences / 30 action families. Reuse one effect object, hold throw endpoints, pause timers with the scene and clear/restart effects on completion/replacement. Add finite effect playback to the workbench.
- **M02-019:** Add LICENSE-ASSETS provenance and authored-adaptation records. Generate bundled third-party licence texts from the locked installed runtime graph and archive/PNG tools, including Phaser's vendored Earcut, Simplify, Matter and embedded attributions. Ship credits/notices with the build and check staleness. Preserve LICENSE and source archive bytes; exclude ZIPs and standalone/full catalogue art from the distributable.

### Asset pipeline validation

- `npm run assets:build`, `npm run check` and `npm run build` passed. Thirty Vitest tests include exact RGBA preservation, input-order independence, every emitted crop hash, all padded borders, nonoverlapping padded regions, inspection exclusion, panel partitioning, glyph fallback/spacing and finite effect boundaries.
- Ten real-browser flows passed using the documented Chromium override. New checks compare resized panel corners with supplied pixels, verify bitmap fallback and the atlas-backed pause skin, freeze actual death/explosion rendering under shared pause, and hold/restart finite effect playback.
- Production WebGL QA passed at 1440px and 800px with one game canvas, no horizontal overflow or page errors, readable panel/portrait/key UI, effect pause/resume and replacement recovery. Credit/notice URLs load successfully. Source archive reconciliation covers all 23 ZIPs, 1,436 PNG occurrences and 716 canonical images; production excludes source sheets, inspection pixels and development workbench modules.
- M02 import/presentation acceptance is complete. The new effects are art previews; damage, energy, player death/loss/respawn, controller input, collision and campaign systems remain later milestones. Final gameplay timings and offsets will be validated with those systems.
- The first remote run passed clean install, asset/check and production build, then exposed a host/browser clock race and a default timeout during repeated software-WebGL screenshots. Use an explicit future virtual-clock target and a 60-second budget for the two capture-heavy flows; retain the exact frozen-pixel assertions.

### Added — terrain and layered scenery

- **M02-012:** Define 35 terrain profiles: all 47 normalized New Style cases for three surfaces across five palettes, and separate Old Style border/island/concave patches with explicit unsupported topology. Select the updated 192×96 shoreline and define its two modes/four phases. Add neighbour/shape/shore controls to the workbench.
- **M02-013:** Define 279 scenery compositions/source views for layered original/biome/palm trees, 24 house variants, furniture, large props and separate hull/sail/fitting/rider boat parts. Preserve 48×64 broad-tree cells and the trimmed 63px fittings sheet. Add layer toggles, feet/sockets and assembled previews.
- Replace the clearing's geometric ground shapes with supplied tiled paths and grass; add a layered cottage/bench and animated pond with an empty composed boat. Trees and the actor share foot sorting. These remain authored scenery without collision or interaction systems.
- Validate 286 curated source records from 14 unchanged archives; emit 165 runtime PNGs and retain 121 inspection-only records without their pixels in production.

### Terrain/scenery validation

- `npm run assets:build`, `npm run check` and `npm run build` passed. Twenty-five Vitest tests include topology normalization, Old Style failure handling, updated shoreline dimensions, composition bounds and complete nonoverlapping building partitions.
- Eight real-browser flows passed with the documented Chromium override. New checks classify the actual source pixels for 235 New Style dirt cases, reconstruct building pixels, toggle roof layers, assemble four boat directions, play shoreline phases and verify shared pause/resume against rendered water pixels.
- Production WebGL smoke and focused source/rendered visual checks passed, including 1440px and 800px widths without horizontal overflow. Raw archives and LICENSE are unchanged; full catalogue/inspection art and workbench modules remain excluded from production.

### Terrain/scenery limitations

- Old Style has no supplied thin-cap/cross vocabulary, so those cases are marked unsupported. HousesUpdate's irregular sheet remains a catalogue alternative. Reference boat rider/attachment offsets and layer cuts remain presentation choices; boarding, collision, procedural regions, interiors and village growth remain later systems. M02 still needs GUI definitions, padded atlases, presentation gaps and final notices.

### Added — tool, enemy and King presentation

- **M02-008:** Add farming, fishing, hook and magic art metadata across all six appearances: 672 total hero sequences and five supplied tool colours. Separate sockets bind held poses to future hook/tether, spell, fishing-line and farming-target effects without duplicating baked tools. All 28 action families can be previewed in the clearing.
- **M02-010:** Define updated goblin/skeleton/zombie, all ten Enemies Vol1 sheets, four Biomes monsters, Castle soldier/mimic and legacy bat/rat/slime action rectangles. Preserve recolour blocks, omit baked label rows, retain trimmed strip sizes and distinguish missing/shared actions. Updated enemy direction rows are down/right/up/left; named legacy source pixels provide a four-direction browser regression.
- **M02-011:** Define the King's 32px body, 32×48 death, mixed 64×64/64×32 tongue strips and independently attachable body/middle/tip pieces. Add four-direction variable-reach assembly to the workbench. Non-looping playback holds the final pose and can restart explicitly.
- Extend `assets:check` to validate 1,736 additional presentation sequences, expected labelled-sheet dimensions, frame bounds/header exclusions, required IDs, attachment rectangles and required hero tool sockets. The 211-record curated manifest emits only 158 runtime PNGs; 53 inspection-only sources stay out of the production pixel collection.

### Tool/enemy increment validation

- `npm run assets:build`, `npm run check` and `npm run build` passed. Twenty Vitest tests cover missing sockets/references, baked-header rejection, mixed-frame bounds, coverage, duplicate IDs and bounded contiguous tongue assembly alongside existing rule/bridge/archive checks.
- Six real-browser Playwright flows passed using the documented packaged-Chromium override, including exact source-pixel direction matching, hook preview selection, held King death endpoint and all four tongue assembly directions. The first browser launch found the previous temporary executable empty; re-extracting the existing packaged browser resolved it without changing project dependencies.
- Production WebGL smoke and focused visual captures passed for the tool preview and King/workbench assembly. Verified that the build contains 158 runtime PNGs and excludes all inspection-only PNGs, raw ZIPs and the workbench module.
- Inspected source pixels for every newly registered source family, including colour blocks, directional exceptions, trimmed strips and mixed King frames. Playback timings, sockets and reference feet remain authored presentation defaults. Raw archive hashes reconcile to the original audit; no archive or licence changes.

### Tool/enemy increment limitations

- Art definitions do not implement AI, combat, tool travel, fishing, farming, inventory or saves. The King and enemy workbench remains development-only. Terrain/layer/UI definitions, padded atlases, missing effects and final notices remain open, so M02 is not yet complete.

### Added — sprite catalogue and hero-animation workbench

- **M02-001, M02-002, M02-003:** Import the reviewed audit metadata, reconcile all 23 unchanged ZIPs against SHA-256 baselines and generate a versioned inventory of 1,466 entries / 1,436 PNG occurrences / 716 distinct images. Content-derived canonical IDs retain every exact source alias, companion group and the three duplicate archive pairs without duplicating image bytes.
- **M02-004:** Select updated base/plus/carry/additional sheets for all six hero appearances and explicit updated goblin/skeleton/zombie sources. Document retained legacy alternatives and distinguish source selection from pending enemy frame definitions.
- **M02-005:** Share bounded, deterministic archive reading between catalogue and runtime extraction, rejecting unsafe paths and oversized input. Runtime output now contains 116 curated PNGs from five source archives with canonical IDs and hash checks.
- **M02-006, M02-007, M02-009:** Define 456 sequences (six appearances × 19 actions × four directions) with explicit rectangles, frame timing, loop/shared-direction policy and foot anchors. Add a clearing action preview. Modern boomerang artwork deliberately adapts the throw-item pose; this does not implement boomerang flight or combat.
- **M02-016:** Validate missing/duplicate references, full required hero/action/direction coverage, frame bounds/grid agreement, anchors, source hashes and catalogue reconciliation through the real asset/check commands.
- **M02-017:** Add a development-only searchable sprite workbench with companion sets, source/version details, animation playback, zoom/frame controls, grids, foot anchors and editable hitbox guides. Inspection guides do not define gameplay collision or damage. The workbench and full preview-art collection are excluded from production builds.

### Sprite increment validation

- `npm run catalogue:build`, `npm run assets:build`, `npm run check` and `npm run build` passed. Fifteen Vitest tests include hostile archive paths, selected extraction, invalid PNGs, full animation coverage and invalid frame/reference fixtures.
- All four Playwright real-browser flows passed with packaged Chromium 153 through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, including workbench search, updated enemy-source selection, animation progression and pause/resume controls. The same environment-specific browser installation limitation documented below applies.
- Source-sheet pixels were inspected for directional order, mixed 16px/32px frames and reference foot placement. The managed cloud-browser preview could load the interface but could not create a WebGL context; canvas verification used the passing packaged-Chromium browser flows. This is not a claim that every animation has completed final gameplay/visual acceptance.
- The merged foundation's remote GitHub Actions run passed. This increment's remote checks are reported separately after the PR opens. All source ZIPs and the proprietary licence remain unchanged.

### Sprite increment limitations

- M02 is partially complete. Farming/fishing/hook/magic attachments, complete enemy/King frames, terrain/layer/UI definitions, padded atlases, presentation gaps and full release notices remain open. No collision, combat, inventory, storage, persistence or farming gameplay is introduced.

### Added — application foundation

- **M01-001, M01-002, M01-003, M01-004:** Add a runnable Phaser 4.2.1 / React / TypeScript / Vite application, pinned Node 24.22.1/npm dependencies and lockfile, strict type/index/optional checks, and concrete module boundaries.
- **M01-005, M01-006, M01-007, M01-010, M01-015:** Add framework-free core lint boundaries, consistent formatting, real development/build/asset/check scripts, generated/source exclusions, and a GitHub Actions clean-install/check/build/browser workflow.
- **M01-008, M01-009:** Configure Vitest and Playwright with meaningful pause/bridge/asset-boundary checks and actual-browser UI, missing-texture and lifecycle flows.
- **M01-011, M01-012, M01-013, M01-014:** Add scoped Phaser lifecycle ownership with cancellable startup, typed commands/events/snapshots, focused Zustand display state, composed menu/background pauses and visible loading failures. An authored clearing with six appearance options and keyboard walking exercises the integration.
- **M01-016:** Replace planning-only setup with actual clean-install commands, preview controls, browser requirements and architectural/provenance documentation. Keep campaign features and unresolved M00 decisions explicitly pending.

### Foundation validation

- A clean `npm ci`, `npm run assets:build`, `npm run check` and `npm run build` passed. Ten Vitest tests cover pause ownership, bridge/controller lifecycle and bounded asset definitions; all three Playwright WebGL flows passed.
- The standard Playwright browser download returned an invalid archive in this environment. Actual browser checks used a separately installed packaged Chromium 153 executable through the documented `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override. The browser binary is outside the repository; standard CI still installs Playwright Chromium.
- Inspected actual rendered pages at 1440px and 800px widths: one canvas, readable controls and no horizontal overflow. The asset checker verifies 20 generated PNGs against unchanged archive bytes. Production artefacts exclude raw ZIPs and source-only previews. A real-browser production-preview smoke check also passed with one canvas, successful asset loading and no development controls.
- Remote GitHub Actions results are separate from these local checks; adding a workflow does not claim it has run remotely.

### Foundation limitations

- The clearing is an integration preview. Trees/chest/sign are scenery; collision, combat, interaction, storage, farming, generated regions, saves and controller support remain later milestones.
- The importer covers selected idle/walk/prop sheets; the full catalogue, canonical aliases, remaining animation definitions and packed atlases remain M02 work.
- Walking/facing defaults and appearance choices are provisional preview choices, not owner confirmation of the remaining M00 design decisions.

### Added

- **M00-001:** Replace the placeholder README with the game concept, agreed persistence/death/farming rules, stack, development status, planned workflow and licensing boundaries.
- **M00-002:** Add a staged first-release plan with stable task IDs, explicit open decisions, milestone acceptance criteria and a final release checklist.
- **M00-003:** Add this changelog and require task-completion entries with validation evidence.
- **M00-004:** Add detailed agent instructions covering state ownership, asset imports, procedural generation, save consistency, testing and documentation updates.

### Validation

- **M00-001–M00-004:** Cross-checked the documentation against the agreed design and the current repository, which contains a placeholder README, proprietary `LICENSE` and raw asset archives. Passed documentation checks for all 275 unique task IDs across 19 milestones, coverage of the four completed documentation tasks in this changelog, existing local link targets, balanced code fences, final newlines and trailing whitespace. `git diff --check` passed. No application tests were run because the application has not been bootstrapped.

### Documentation baseline limitations (historical)

- That initial change was documentation only. The application, build scripts, dependencies, tests and CI workflow are not yet implemented.
- The standalone sprite catalogue is not yet imported into the repository. The 716 unique-image count is an audit result, not a runtime atlas or verified animation manifest.
- Content budgets, exact loss rules, day/season lengths and other balance decisions remain open in milestone M00.
