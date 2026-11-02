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

> **Project status:** runnable foundation preview. Explore an authored clearing, select one of six appearances, preview 19 action families and use the React pause menu. Combat, collisions, inventory, saves, farming and generated worlds are not implemented yet. The design below describes the intended game; [PLAN.md](PLAN.md) tracks delivered work.

## A world that remembers

| Place                              | What persists                                                          | What can change                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **The village**                    | Residents, deposits, farming and restoration progress                  | Buildings and services grow as people arrive. A fixed village layout is the provisional direction. |
| **Forests and surface labyrinths** | Geography after first generation, discoveries and saved object changes | Enemies and renewable resources can refresh under explicit rules.                                  |
| **Dungeon interiors**              | The current dungeon survives travel, saving and player death           | Defeating its boss removes its anchor and makes a later generation possible.                       |

Forests are outdoor dungeons in their gameplay: clearings become rooms, trails form branching connections, and tools reveal secrets and shortcuts. Their generated layouts remain familiar once discovered.

**A dungeon's boss is its anchor.** Returning to the village or dying does not regenerate the dungeon. The planned safe transition keeps a defeated instance available while the player collects rewards and exits; the next eligible entry can create its successor. Exact reset timing and successor rules are tracked as design decisions in the plan.

## Fight, discover, return

- **Readable combat:** cardinal-direction attacks, predictable enemy behaviours, blocking, dodging and deliberate positioning.
- **Tools with several uses:** swords, bows, bombs, boomerangs, hooks and magic support exploration, puzzles and combat.
- **No consumable ammunition:** use cooldowns and deliberate animations for bows, hooks and boomerangs; regenerating energy limits magic and bombs.
- **Procedural discoveries:** enchanted equipment, relics and abilities create different builds across expeditions.
- **A meaningful return home:** storage chests secure possessions and money; rescued people expand village life.
- **Farming with a rhythm:** a Stardew Valley-inspired day-and-season calendar, crop care and harvests. Sleep starts a new day; menus pause game time; closed-game time does not advance the world.

### Death and safekeeping

Permanent tools, unlocks and discoveries survive death. Deposited items and money remain safe. Eligible carried possessions face random loss rolls rather than a guaranteed total wipe.

Loss probabilities, equipment eligibility, money handling and partial-stack rules are still balance decisions. Enchanted variants must be distinguished from permanent tool ownership so losing an item can never remove a required exploration unlock.

## Project status

**M01 application foundation and the first M02 catalogue/animation increment are implemented.** The preview brings Phaser 4, React and the owned artwork together; it is not yet the complete adventure.

| Available now                                                         | Next systems                                                      |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Walkable authored clearing and six hero appearances                   | Collision, cardinal combat and interactions                       |
| Typed game/UI bridge, composed pause reasons and focused UI snapshots | Authoritative campaign rules, time and progression                |
| Full source catalogue, aliases and 116 curated runtime PNGs           | Remaining action families, terrain/UI metadata and packed atlases |
| Strict TypeScript, lint/format rules, unit tests and browser checks   | Inventory, banking, saves, generation and farming                 |
| CI workflow and production build                                      | Complete desktop campaign and release validation                  |

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

The module boundaries are established. The current session, rendering and UI implement a small integration preview; full campaign rules and platform services remain in the plan.

### Supporting tools

- **Zustand:** React-facing snapshots and interface state.
- **Zod:** validation at save and content boundaries.
- **Dexie:** IndexedDB storage behind a replaceable save interface.
- **seedrandom:** isolated, reproducible random streams for generation, loot and loss rolls.
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

Vite prints its local address. Click the clearing to focus it, then use **WASD or arrow keys** to move. Use **Escape** or the Pause button to open the menu. Selecting a wanderer changes appearance. The action selector plays art previews only; chest/sign/tree interactions and combat are not implemented. Losing browser-window focus pauses the preview.

| Command                                               | Purpose                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                                         | Build curated assets and start Vite on loopback                         |
| `npm run build`                                       | Build assets, type-check and create `dist/`                             |
| `npm run preview`                                     | Serve the production build locally                                      |
| `npm run typecheck`                                   | Check application and tools/tests                                       |
| `npm run lint`                                        | Run ESLint, including core import boundaries                            |
| `npm run format` / `npm run format:check`             | Write/check Prettier formatting                                         |
| `npm run catalogue:build` / `npm run catalogue:check` | Rebuild/check the complete source metadata and local inspector previews |
| `npm run assets:build` / `npm run assets:check`       | Generate/check selected PNGs against raw archives                       |
| `npm run test` / `npm run test:watch`                 | Run/watch Vitest tests                                                  |
| `npm run test:e2e`                                    | Run real-browser Playwright integration checks                          |
| `npm run check`                                       | Typecheck, lint, format, assets and unit checks                         |

Before the first browser test, install Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

Linux CI uses `npx playwright install --with-deps chromium`. Environments with an existing compatible Chromium executable can set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute path. The packaged browser used in this development environment is not a project dependency or a distributable asset.

`npm run check` expects generated assets: run `npm run assets:build` first after a clean install. `npm run dev` and `npm run build` do this automatically. CI uses the same documented commands. Raw ZIPs, local saves, generated outputs and browser reports are excluded from version control/build sources.

The production build uses relative asset URLs, ready for static subdirectory hosting. No deployment is configured by this iteration. To expose a development server deliberately, pass `-- --host 0.0.0.0`; local loopback is the default.

## Artwork and asset workflow

Artwork uses **Vryell's Tiny Adventure family**, including the owned paid companion packs: Adventure Plus, Dungeon, Village, Farm, Biomes, Coast, Castle, Enemies, Neighbours, GUI and control prompts, alongside their updates.

The sprite audit found **23 archives, 1,436 PNG occurrences and 716 distinct PNG images/sheets**. These are file counts, not counts of individual frames, tiles or creatures. Several bundles repeat the base pack, and three archive pairs are exact duplicates.

Most terrain uses a **16×16 pixel grid**, but action frames, trees, boats, buildings and UI components use other dimensions. Import explicit frame rectangles and attachment points; never apply universal 16×16 slicing. Prefer compatible updated character/enemy animations, preserve alternate terrain styles, and exclude baked sheet labels from runtime frames.

The [reviewed source catalogue](docs/sprites/README.md) is now versioned and reproducible from the archives. Development tools include a searchable sprite/animation workbench; the public build contains only selected runtime art. See [asset provenance and rebuilding](docs/assets.md); remaining action families and packed atlases remain in M02. Purchased source art is not relicensed by this repository; see [licensing](#licensing).

## Platforms

The first full release targets **desktop browsers**, with keyboard and controller support in the planning baseline. Design input actions, UI scale and save services so later ports remain possible.

Mobile/tablet layouts, native touch controls and Steam desktop packaging are later milestones. Electron is the current candidate for desktop packaging; platform APIs, achievements and cloud saves require separate integration and verification. No mobile, native or Steam build is available yet.

## Working on the game

Start with [AGENTS.md](AGENTS.md), choose a small coherent group of tasks from [PLAN.md](PLAN.md), and validate the result in context.

**Whenever a task is checked off, update [CHANGELOG.md](CHANGELOG.md) in the same change with its task ID and validation evidence.** Keep the README accurate as runnable features arrive. A new release must satisfy the release gates rather than merely having an attractive feature checklist.

## Licensing

The software and repository documentation are **proprietary**, under the existing [LICENSE](LICENSE). Public visibility is not an open-source licence.

Vryell retains rights to the purchased artwork. Those assets have their own terms and are not covered by the software licence. Preserve the original archives and attribution records; do not publish standalone asset downloads or treat the source packs as freely redistributable. Third-party libraries retain their respective licences.

---

<div align="center">

**Learn the paths. Break the anchor. Bring something home.**

Created by **Mark Baldwin-Smith** · Artwork by [Vryell](https://vryell.itch.io/)

</div>
