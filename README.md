<div align="center">

# ⚔️ Tiny Adventure

### A little village. A changing dungeon. A kingdom worth restoring.

**A Zelda-inspired action RPG with procedural treasure, persistent wilderness and a growing farming village.**

[![Status: Foundation](https://img.shields.io/badge/status-foundation-e6b566?style=for-the-badge)](#project-status)
[![Target: Desktop](https://img.shields.io/badge/first_target-desktop-749eb5?style=for-the-badge)](#platforms)
[![Licence: Proprietary](https://img.shields.io/badge/licence-proprietary-9c728a?style=for-the-badge)](LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Phaser 4](https://img.shields.io/badge/Phaser-4-7664ac)](https://phaser.io/phaser4)
[![React](https://img.shields.io/badge/React-UI-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-dev_%26_build-646cff?logo=vite&logoColor=white)](https://vite.dev/)

[The adventure](#the-adventure) · [World rules](#a-world-that-remembers) · [Release plan](PLAN.md) · [Changelog](CHANGELOG.md) · [Agent guide](AGENTS.md)

</div>

---

## The adventure

Leave a familiar village for forests, ruins and forgotten places. Read an enemy's movements, strike in a cardinal direction, and use a growing collection of tools to reach the treasure you passed on an earlier journey.

Bring discoveries home. Deposit valuables, plant and tend crops, and welcome the people you find into a village that visibly grows. Prepare another expedition with enchanted equipment, relics and newly discovered abilities.

At the heart of the Kingdom waits its evil King: the crowned, tongue-attacking boss from Vryell's Tiny Castle Pack. Defeating him and restoring the Kingdom is the main objective.

> **Project status:** runnable foundation preview. Explore three authored regions with foot collision, doors, nearby interactions, carrying and swimming previews; use remappable keyboard controls or a standard-mapped controller. Select one of six appearances, preview 30 action families, watch active-play day/season time and rest until tomorrow. Enter a separate practice field for sword, shield, roll and bow combat against six enemy behaviours. Follow the southwest forest trail into persistent forest, desert, winter and coast regions, solve key/switch/tool routes and explore an anchored crypt. Local banking, browser save slots, backups and recovery are available. Pack/equipment controls, selected tools and local chest transfers are available; procedural loot and farming remain later work. The design below describes the intended game; [PLAN.md](PLAN.md) tracks delivered work.

## A world that remembers

| Place                              | What persists                                                          | What can change                                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **The village**                    | Residents, deposits, farming and restoration progress                  | Buildings and services grow as people arrive. Fixed village and region connections; wilderness generates once per save. |
| **Forests and surface labyrinths** | Geography after first generation, discoveries and saved object changes | Enemies and renewable resources can refresh under explicit rules.                                                       |
| **Dungeon interiors**              | The current dungeon survives travel, saving and player death           | Defeating its boss removes its anchor and makes a later generation possible.                                            |

Forests are outdoor dungeons in their gameplay: clearings become rooms, trails form branching connections, and tools reveal secrets and shortcuts. Their generated layouts remain familiar once discovered.

**A dungeon's boss is its anchor.** Returning to the village or dying does not regenerate the dungeon. The agreed safe transition keeps a defeated instance available until its reward is collected and the player exits; the next entry creates its successor. The current crypt repeats a skeleton warden; campaign successor variety remains later work.

## Fight, discover, return

- **Readable combat:** cardinal-direction attacks, predictable enemy behaviours, blocking, dodging and deliberate positioning.
- **Tools with several uses:** swords, bows, bombs, boomerangs, hooks and magic support exploration, puzzles and combat.
- **No consumable ammunition:** use cooldowns and deliberate animations for bows, hooks and boomerangs; regenerating energy limits magic and bombs.
- **Procedural discoveries:** enchanted equipment, relics and abilities create different builds across expeditions.
- **A meaningful return home:** storage chests secure possessions and money; rescued people expand village life.
- **Farming with a rhythm:** a Stardew Valley-inspired day-and-season calendar, crop care and harvests. Sleep starts a new day; menus pause game time; closed-game time does not advance the world.

### Death and safekeeping

Permanent tools, unlocks and discoveries survive death. Deposited items and money remain safe. Eligible carried possessions face random loss rolls rather than a guaranteed total wipe.

The agreed rule rolls a 25% loss chance independently for each carried material unit, permits partial stacks and protects all equipment. Ten percent of carried money is lost, rounded down; deposited possessions remain safe in separate local chests. Enchanted variants must be distinguished from permanent tool ownership so losing an item can never remove a required exploration unlock.

## Project status

**M01–M08 are implemented: application/assets, core state/time, world/input, cardinal combat, persistent expeditions, durable saves and inventory/equipment.** The preview brings Phaser 4, React and the owned artwork together; it is not yet the complete adventure.

| Available now                                                                           | Next systems                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Authored village, four persistent biomes, tool gates, discoveries and an anchored crypt | Campaign progression and final equipment         |
| Typed game/UI bridge, explored map, composed pause reasons and focused snapshots        | Campaign progression and complete tool actions   |
| Full catalogue, 4,271 padded atlas frames, GUI mappings and credits                     | Procedural equipment, enchantments and abilities |
| Sword/shield/roll/bow, six enemy behaviours, anchor rewards and retained death/respawn  | Campaign equipment variety and progression       |
| Strict TypeScript, lint/format rules, unit tests and browser checks                     | Farming, recruitment and campaign progression    |
| CI workflow and production build                                                        | Complete desktop campaign and release validation |

The status/stack badges describe the project, not a promise that every planned feature is present. See [foundation architecture](docs/architecture.md) for ownership and preview-only choices.

## Architecture

One repository and one application, with clear ownership boundaries:

| Module             | Responsibility                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `src/core/`        | Plain TypeScript rules: inventory, items, farming, quests, generation, progression and loss calculations |
| `src/game/`        | Phaser scenes, rendering, animation, movement, collision, combat presentation, cameras and audio         |
| `src/bridge/`      | Typed commands, events and UI snapshots connecting the game and React                                    |
| `src/ui/`          | React HUD, inventory, equipment, storage, shops, dialogue, journal, map and settings                     |
| `src/platform/`    | Save repositories, browser services, input bindings and future desktop integrations                      |
| `src/content/`     | Validated item, crop, enemy, quest, room and progression definitions                                     |
| `src/assets/`      | Curated source definitions, frame metadata and generated-asset references                                |
| `src/raw sprites/` | Original purchased archives, preserved unchanged                                                         |

**The game owns authoritative gameplay state.** React sends commands and consumes focused snapshots. Phaser runs continuous world activity; React does not receive every entity position on every frame. The game core remains independent of React, Phaser, the DOM and storage APIs.

GameSession now owns validated world/player data, independent resumable random streams, 20ms gameplay steps, composable pauses and the day/season calendar. Phaser commits resolved movement once per step; React receives focused snapshots. See the [core state/time contract](docs/core-state.md) for schemas, event order, checkpoint APIs and configurable preview defaults. See [combat rules and scope](docs/combat.md) and the [world/input contract](docs/world-input.md) for collision, rendering, travel and controls. See the [persistent generation contract](docs/generation.md) for topology, room validation, renewables, discoveries and safe crypt successors. Full campaign rules and durable storage remain in the plan.

### Supporting tools

- **Zustand:** React-facing snapshots and interface state.
- **Zod:** validation at save and content boundaries.
- **Dexie:** IndexedDB storage behind a replaceable save interface.
- **seedrandom:** pinned independent terrain, loot, encounter and death streams with serialized continuation state.
- **Vitest:** focused rule and integration tests.
- **Playwright:** real-browser smoke and end-to-end checks.
- **ESLint, Prettier and GitHub Actions:** consistent code and automated checks.

Use a tested, compatible dependency set with a committed lockfile. Vite supplies the development server and production build; Vitest supplies the test runner.

## Development setup

Use **Node.js 24.22.1** (also pinned in `.nvmrc`) and npm. From a clean checkout:

```bash
npm ci
npm run dev
```

Vite prints its local address. Click the clearing to focus it, then use **WASD or arrow keys** to move. Use **E** near a highlighted door, sign, NPC, chest, farm plot or small box; click the highlighted target as an alternative. Use **Space** for a sword attack in practice or expeditions (cosmetic elsewhere), **Q** to hold a shield, **R** to roll and **F** to fire a bow. Use **I** for the pack and **X** to use its selected tool (hold for a selected shield). The clearing’s travel chest offers one starter kit; equip a blade in the pack to apply its bonuses. Split, merge, reorder or deliberately discard carried items through the same validated commands. See [inventory and equipment](docs/inventory.md). Use **Escape** or the Pause button for the menu. Open **Controls** to remap keys and action buttons for this session; arrows remain available. Standard-mapped controllers use the left stick/D-pad, south face button to interact/confirm, west face button for the sword, left bumper for shield, north face for roll, right bumper for bow, View/Select to open the pack, RT for the selected tool, Start to pause and east face button to cancel. Release sticks/buttons after connecting or closing a modal. Select an encounter and **Enter practice field** for actual combat; **Start new trial** resets that encounter and refills pools. Defeat pauses the field and offers one return to its entrance while retaining possessions, dead enemies and unclaimed coins. The south exit returns to the clearing. The southwest **FOREST** marker starts persistent expeditions. Find the brass key, sun switch and trail axe, open gates with **E**, and use **Open explored map** for paused discoveries and generation diagnostics. Crypt defeat returns to the village while keeping the living instance. Defeat the warden, collect its reward and exit; the next entry creates a successor. Surface geometry never rerolls. Browser checkpoints retain these changes across reload. Open **Saved adventures** to save now, continue another slot, create a new adventure, export a JSON backup or import one as a new slot. Stand near an authored chest and choose **Open local storage** to bank separate items and money. Expedition defeat risks each carried material unit at 25% and loses 10% of carried money, rounded down; equipment, deposits, permanent tools and discoveries are protected. The exact outcome and village return save together. See [durable saves and recovery](docs/saves.md) for checkpoints, migrations, conflicts and browser storage limits. Selecting a wanderer changes appearance. The action selector plays art previews only; chests have local storage, farm plots are inspections and the carried box is one world prop. Losing browser-window focus pauses the preview. The calendar advances only during active play; menus and the workbench pause it. **Rest until tomorrow** starts the next calendar day. Rest checkpoints the next day; crop growth and rest healing remain later integrations. Day/season lengths and other balance values remain configurable preview defaults pending M00 decisions.

| Command                                               | Purpose                                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`                                         | Build curated assets and start Vite on loopback                                     |
| `npm run build`                                       | Build assets, type-check and create `dist/`                                         |
| `npm run preview`                                     | Serve the production build locally                                                  |
| `npm run typecheck`                                   | Check application and tools/tests                                                   |
| `npm run lint`                                        | Run ESLint, including core import boundaries                                        |
| `npm run format` / `npm run format:check`             | Write/check Prettier formatting                                                     |
| `npm run catalogue:build` / `npm run catalogue:check` | Rebuild/check the complete source metadata and local inspector previews             |
| `npm run assets:build` / `npm run assets:check`       | Generate/check padded atlases, frame metadata and notices                           |
| `npm run test` / `npm run test:watch`                 | Run/watch Vitest tests                                                              |
| `npm run test:production`                             | Check the built game, responsive forest and paused map without development controls |
| `npm run test:e2e`                                    | Run real-browser Playwright integration checks                                      |
| `npm run check`                                       | Typecheck, lint, format, assets and unit checks                                     |

Before the first browser test, install Chromium:

```bash
npx playwright install chromium
npm run test:e2e
npm run build
npm run test:production
```

Linux CI uses `npx playwright install --with-deps chromium`. Environments with an existing compatible Chromium executable can set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path. The packaged browser used in this development environment is not a project dependency or a distributable asset.

`npm run check` expects generated assets: run `npm run assets:build` first after a clean install. `npm run dev` and `npm run build` do this automatically. CI uses the same documented commands. Local saves, generated outputs and browser reports are excluded from version control. Original ZIPs remain development inputs and are excluded from distributable builds.

The production build uses relative asset URLs, ready for static subdirectory hosting. The owner-private Site preview is published separately from the GitHub source; no credentials or Site identity are stored in this application repository. To expose a development server deliberately, pass `-- --host 0.0.0.0`; local loopback is the default.

## Artwork and asset workflow

Artwork uses **Vryell's Tiny Adventure family**, including the owned paid companion packs: Adventure Plus, Dungeon, Village, Farm, Biomes, Coast, Castle, Enemies, Neighbours, GUI and control prompts, alongside their updates.

The sprite audit found **23 archives, 1,436 PNG occurrences and 716 distinct PNG images/sheets**. These are file counts, not counts of individual frames, tiles or creatures. Several bundles repeat the base pack, and three archive pairs are exact duplicates.

Most terrain uses a **16×16 pixel grid**, but action frames, trees, boats, buildings and UI components use other dimensions. Import explicit frame rectangles and attachment points; never apply universal 16×16 slicing. Prefer compatible updated character/enemy animations, preserve alternate terrain styles, and exclude baked sheet labels from runtime frames.

The [reviewed source catalogue](docs/sprites/README.md) is now versioned and reproducible from the archives. Development tools include a searchable sprite/animation workbench; the public build contains only selected runtime art. See [asset provenance and rebuilding](docs/assets.md); tool/enemy/King frame contracts are documented in [animation layouts](docs/sprites/animation-layouts.md). Terrain adjacency and layered scenery are documented in the [terrain/scenery contract](docs/sprites/terrain-scenery.md). The [GUI/atlas/effects contract](docs/sprites/gui-atlases-effects.md) records the completed M02 packing, UI mappings and authored effect previews. Purchased source art is not relicensed by this repository; see [licensing](#licensing).

## Platforms

The first full release targets **desktop browsers**, with remappable keyboard and standard-mapped controller input in the preview. Controller paths have been tested with an emulated browser Gamepad API; physical hardware compatibility still needs playtesting. Design input actions, UI scale and save services so later ports remain possible.

Mobile/tablet layouts, native touch controls and Steam desktop packaging are later milestones. Electron is the current candidate for desktop packaging; platform APIs, achievements and cloud saves require separate integration and verification. No mobile, native or Steam build is available yet.

## Working on the game

Start with [AGENTS.md](AGENTS.md), choose a small coherent group of tasks from [PLAN.md](PLAN.md), and validate the result in context.

**Whenever a task is checked off, update [CHANGELOG.md](CHANGELOG.md) in the same change with its task ID and validation evidence.** Keep the README accurate as runnable features arrive. A new release must satisfy the release gates rather than merely having an attractive feature checklist.

## Licensing

The software and repository documentation are **proprietary**, under the existing [LICENSE](LICENSE). Public visibility is not an open-source licence.

Vryell retains rights to the purchased artwork. Those assets have their own terms and are not covered by the software licence. Preserve the original archives and attribution records; do not publish standalone asset downloads or treat the source packs as freely redistributable. Third-party libraries retain their respective licences. See [artwork provenance](LICENSE-ASSETS.md) and [bundled software notices](THIRD_PARTY_NOTICES.md); both are included in production assets.

---

<div align="center">

**Learn the paths. Break the anchor. Bring something home.**

Created by **Mark Baldwin-Smith** · Artwork by [Vryell](https://vryell.itch.io/)

</div>
