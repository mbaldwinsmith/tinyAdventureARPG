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
