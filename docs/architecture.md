# Foundation architecture

This first iteration implements **M01**, with a small authored clearing used to exercise integration. It is not the campaign world, a generated forest, or the M09 vertical slice.

## Ownership

- `PreviewController` is the runtime owner. Its plain TypeScript `PreviewSession` owns pause reasons and appearance selection. Future campaign state will replace/extend this deliberately small preview state.
- `GameBridge` transports typed commands, command failures and snapshots. It has one runtime handler and independently disposable subscriptions. It does not make gameplay decisions.
- React's Zustand store contains a display snapshot. Buttons send commands; they never edit the session directly. Continuous sprite positions and animation frames stay outside React.
- `mountGame` creates its own controller, asynchronously loads/validates assets and imports Phaser. Cleanup cancels startup, detaches the handler, removes browser listeners and destroys that mount's game. This accommodates React StrictMode's development mount/cleanup/mount cycle.
- Phaser owns the preview actor's unsaved transform and animation. Preview movement uses elapsed render time with a bounded step; it does not implement the future fixed-step gameplay/physics system. No authoritative campaign positions or saves exist yet.
- Menu and background pause reasons compose: closing a menu cannot clear an inactive-window pause. Browser listeners are installed and disposed by the runtime. Movement also requires focus inside the clearing, preventing held keys from moving the actor through UI controls.

## Preview-only choices

Smooth normalised diagonal movement, six selectable appearances, a fixed clearing and a 60-pixel/second walking speed are reversible integration defaults. They do not close the M00 movement, character-choice, mapping, topology or balance decisions. The chest and sign are scenery; the preview does not imply working interactions or banking. Trees currently provide visual depth, not collision.

Audio, controller support, inventory, combat, calendar/farming, persistence, procedural generation and boss anchors remain future tasks. Browser focus is paused now; final campaign/background policy remains in M00.

## Assets

`src/assets/sources.json` maps 20 curated PNGs to exact paths inside two owned raw archives. It includes all six heroes' updated idle/walk sheets plus basic clearing props. Explicit 16px frame dimensions apply only to the inspected hero/chest sheets; tree and other prop image dimensions are retained.

`npm run assets:build` reads bounded archive members with fflate, checks definitions and PNG/frame dimensions, and writes stable, hash-labelled metadata and unchanged PNGs to ignored `public/generated/`. It never extracts arbitrary archive paths or writes into the raw sources. Files are sorted and stage in an owned temporary directory before replacement.

`npm run assets:check` compares output bytes to the archive sources, checks IDs, frame divisibility, manifest contents and unexpected output files. It does not claim a full asset catalogue, a packed texture atlas or coverage of every action. Those remain M02 tasks.

Vite copies only curated public assets into the build. The source ZIPs are not imported by the application and must not appear in `dist/`.

## Tools and checks

Node **24.22.1**, npm and a committed lockfile define the install. Phaser **4.2.1** was verified against the official Phaser integration pattern; other dependency versions are pinned in `package.json`/`package-lock.json`.

TypeScript checks the application and tools/tests separately, with strict optional/index checks. ESLint prevents direct core imports of framework/platform modules and browser globals. Vitest runs without Phaser or a DOM. Playwright runs the actual WebGL preview under Vite, including command/UI flow, lifecycle remounts and a deliberately missing texture.

The GitHub Actions workflow repeats clean install, assets, checks, production build and Chromium end-to-end checks. Local results do not imply the remote workflow has run.

## Later adapters

Storage will be introduced behind a save repository (Dexie for browsers), with explicit schemas/migrations. Procedural randomness will use isolated streams when generation/loot arrive. Neither dependency is installed solely to occupy an empty directory. Desktop wrappers, Steam services and dedicated touch UI remain later milestones.
