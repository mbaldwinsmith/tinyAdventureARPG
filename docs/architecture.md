# Foundation architecture

The foundation implements **M01** and the **M02** catalogue, animation and terrain/scenery increments. A small authored clearing exercises the integration. It is not the campaign world, a generated forest, or the M09 vertical slice.

## Ownership

- `PreviewController` is the runtime owner. Its plain TypeScript `PreviewSession` owns pause reasons and appearance selection. Future campaign state will replace/extend this deliberately small preview state.
- `GameBridge` transports typed commands, command failures and snapshots. It has one runtime handler and independently disposable subscriptions. It does not make gameplay decisions.
- React's Zustand store contains a display snapshot. Buttons send commands; they never edit the session directly. Continuous sprite positions and animation frames stay outside React.
- `mountGame` creates its own controller, asynchronously loads/validates assets and imports Phaser. Cleanup cancels startup, detaches the handler, removes browser listeners and destroys that mount's game. This accommodates React StrictMode's development mount/cleanup/mount cycle.
- Phaser owns the preview actor's unsaved transform and animation. Preview movement uses elapsed render time with a bounded step; it does not implement the future fixed-step gameplay/physics system. No authoritative campaign positions or saves exist yet.
- Menu, background and workbench pause reasons compose: closing a menu cannot clear an inactive-window pause. Browser listeners are installed and disposed by the runtime. Movement also requires focus inside the clearing, preventing held keys from moving the actor through UI controls.

## Preview-only choices

Smooth normalised diagonal movement, six selectable appearances, a fixed clearing and a 60-pixel/second walking speed are reversible integration defaults. They do not close the M00 movement, character-choice, mapping, topology or balance decisions. The chest and sign are scenery; the preview does not imply working interactions or banking. Trees currently provide visual depth, not collision.

Audio, controller support, inventory, combat, calendar/farming, persistence, procedural generation and boss anchors remain future tasks. Browser focus is paused now; final campaign/background policy remains in M00.

## Assets

`src/assets/sources.json` maps 286 curated sources across 14 archives, with 121 explicitly marked inspection-only and 165 emitted runtime PNGs. `hero-animations.json` defines 672 direction-specific/shared sequences with explicit rectangles, durations, anchors and loop flags. A single validator checks all six appearances and required action families. Game playback and the workbench consume the same definitions.

The full reviewed catalogue is metadata-only under `docs/sprites/`. Its generator verifies every archive hash/count, matches reviewed annotations by full PNG hash and assigns content-derived canonical IDs with source aliases. Selected updated enemy sources are checked too.

`assets:build` and `assets:check` share a bounded archive reader with the catalogue generator. They generate/verify selected textures and validate all registered sequence bounds, indices and coverage. Enemy/tool-variant/King/component metadata adds 1,736 validated sequences. Label exclusions, nonstandard direction orders, mixed-size rectangles and detached attachment geometry are explicit. Terrain adds 35 profiles with style-specific adjacency contracts; scenery adds 279 explicit compositions/source views with bounded parts and sockets. Packed atlases and GUI slicing remain later work.

The development-only workbench uses Vite middleware to inspect previews from `.cache/catalogue/`. React lazy-loads the inspector only in development. Its editable hitbox guides and attachment sockets are review tools, not gameplay definitions. The King's divided tongue can be assembled in four directions with bounded, contiguous segment placement. Non-looping animations hold their final frame. The public preview adds presentation-only action commands through the existing typed bridge; no combat effects are implied.

Vite copies only curated public assets into the build. Inspection-only textures stay in the development catalogue cache and are skipped by the game preloader. `createClearingScenery` owns the authored tile/shore/prop illustration and named Phaser texture rectangles. Its shoreline clock advances only after the shared session pause check; it is not the later authoritative gameplay clock. Actor and scenery feet share one depth band.

The source ZIPs are not imported by the application and must not appear in `dist/`.

## Tools and checks

Node **24.22.1**, npm and a committed lockfile define the install. Phaser **4.2.1** was verified against the official Phaser integration pattern; other dependency versions are pinned in `package.json`/`package-lock.json`.

TypeScript checks the application and tools/tests separately, with strict optional/index checks. ESLint prevents direct core imports of framework/platform modules and browser globals. Vitest runs without Phaser or a DOM. Playwright runs the actual WebGL preview under Vite, including command/UI flow, lifecycle remounts and a deliberately missing texture.

The GitHub Actions workflow repeats clean install, assets, checks, production build and Chromium end-to-end checks. Local results do not imply the remote workflow has run.

## Later adapters

Storage will be introduced behind a save repository (Dexie for browsers), with explicit schemas/migrations. Procedural randomness will use isolated streams when generation/loot arrive. Neither dependency is installed solely to occupy an empty directory. Desktop wrappers, Steam services and dedicated touch UI remain later milestones.
