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
