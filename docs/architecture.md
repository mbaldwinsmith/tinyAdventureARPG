# Foundation architecture

The foundation implements **M01** and **M02** asset inventory/imports and **M03** core state/time plus **M04** world/input and **M05** cardinal combat/enemy behaviours. A clearing, cottage, larger woodland and separate combat practice field exercise the integration. It is not the campaign world, a generated forest, or the M09 vertical slice.

## Ownership

- `GameSession` is the sole plain TypeScript state/time/randomness owner. `PreviewController` owns loading status and presentation requests and connects it to the bridge. See [core state/time](core-state.md) for the full contract.
- `GameBridge` transports typed commands, command failures and snapshots. It has one runtime handler and independently disposable subscriptions. It does not make gameplay decisions.
- React's Zustand store contains a display snapshot. Buttons send commands; they never edit the session directly. Continuous sprite positions and animation frames stay outside React.
- `mountGame` creates its own controller, asynchronously loads/validates assets and imports Phaser. Cleanup cancels startup, detaches the handler, removes browser listeners and destroys that mount's game. This accommodates React StrictMode's development mount/cleanup/mount cycle.
- The Phaser adapter resolves action input through pure swept-foot collision once per requested 20ms core step; GameSession commits the result once and Phaser renders that core position. Core position, clock remainder and random state have validated JSON checkpoint APIs. Durable storage remains future work.
- Menu, settings, interaction, background and workbench pause reasons compose: closing a menu cannot clear an inactive-window pause. Browser listeners are installed and disposed by the runtime. Movement also requires focus inside the clearing, preventing held keys from moving the actor through UI controls.

## Preview-only choices

Smooth normalised diagonal movement with cardinal facing (vertical ties), six selectable appearances, three authored regions and a 60-pixel/second walking speed are reversible integration defaults. They do not close M00 movement, character-choice, mapping, topology or balance decisions. Trees, bushes, rocks, buildings and props have foot solids. Door travel and sign/NPC/chest/farm-plot inspections work. Chests are empty inspections, not banking; the box is one retained world object, not inventory. Swimming exercises animation priority without granting a campaign ability.

The practice field adds sword, shield, roll and bow combat, six enemy behaviours, fixed-step projectiles, one-time drops/completion and loss-free defeat/respawn. See [combat](combat.md) for exact timings and scope. Audio, inventory transactions, campaign equipment, farming, durable persistence, generation and boss encounters remain future tasks. Standard-mapped controller input is implemented; physical hardware playtesting remains outstanding. M03 now defines their data/anchor lifecycle contracts and implements the shared active-time calendar. Browser focus is paused now; final campaign/background policy remains in M00.

## Assets

`src/assets/sources.json` maps 316 curated sources across 16 archives, with 129 explicitly marked inspection-only and 187 runtime sources packed into one atlas. `hero-animations.json` defines 720 direction-specific/shared sequences with explicit rectangles, durations, anchors and loop flags. A single validator checks all six appearances and required action families. Game playback and the workbench consume the same definitions.

The full reviewed catalogue is metadata-only under `docs/sprites/`. Its generator verifies every archive hash/count, matches reviewed annotations by full PNG hash and assigns content-derived canonical IDs with source aliases. Selected updated enemy sources are checked too.

`assets:build` and `assets:check` share a bounded archive reader with the catalogue generator. They generate/verify selected textures and validate all registered sequence bounds, indices and coverage. Enemy/tool-variant/King/component metadata adds 1,736 validated sequences. Label exclusions, nonstandard direction orders, mixed-size rectangles and detached attachment geometry are explicit. Terrain adds 35 profiles with style-specific adjacency contracts; scenery adds 279 explicit compositions/source views with bounded parts and sockets. Manifest v2 maps 3,985 stable source rectangles to padded atlas frames. GUI slicing, bitmap glyphs, physical prompts and authored effects are documented in [their contract](sprites/gui-atlases-effects.md).

The development-only workbench uses Vite middleware to inspect previews from `.cache/catalogue/`. React lazy-loads the inspector only in development. Its editable hitbox guides and attachment sockets are review tools, not gameplay definitions. The King's divided tongue can be assembled in four directions with bounded, contiguous segment placement. Non-looping animations hold their final frame. The public preview adds presentation-only action commands through the existing typed bridge; death/bomb action-selector visuals remain cosmetic; combat hit/defeat/respawn belongs to the separate core practice encounter.

Vite copies only curated public assets into the build. Inspection-only textures stay in the development catalogue cache and are skipped by the game preloader. `createWorldView` owns authored terrain, shore, props, actor-adjacent items and canopies using packed frames. Its shoreline clock consumes core simulated milliseconds. Actor and scenery feet share a depth band below canopies/roofs. Boot, asset-loading and world scenes share one Phaser game per mount. See [world/input](world-input.md) for layering, collision, controls, focus and travel.

The source ZIPs are not imported by the application and must not appear in `dist/`.

## Tools and checks

Node **24.22.1**, npm and a committed lockfile define the install. Phaser **4.2.1** was verified against the official Phaser integration pattern; other dependency versions are pinned in `package.json`/`package-lock.json`.

TypeScript checks the application and tools/tests separately, with strict optional/index checks. ESLint prevents direct core imports of framework/platform modules and browser globals. Vitest runs without Phaser or a DOM. Playwright runs the actual WebGL preview under Vite, including command/UI flow, lifecycle remounts and a deliberately missing texture.

The GitHub Actions workflow repeats clean install, assets, checks, production build and Chromium end-to-end checks. Local results do not imply the remote workflow has run.

## Later adapters

Storage will be introduced behind a save repository (Dexie for browsers), with explicit schemas/migrations. Procedural randomness will use isolated streams when generation/loot arrive. Neither dependency is installed solely to occupy an empty directory. Desktop wrappers, Steam services and dedicated touch UI remain later milestones.
