# Tool, enemy and King presentation layouts

These are inspected source rectangles and authored playback defaults, not combat rules. Active damage frames, targeting, projectile motion, cooldowns and energy costs are separate milestones. Coordinates are source pixels, with a local reference foot anchor independent of collision.

## Hero tools

`src/assets/hero-animations.json` contains 672 sequences: six appearances × 28 actions × four cardinal directions. The nine new actions are axe, hoe, pickaxe, water, fish-cast, fish-wait, fish-pull, hook and magic.

| Source family          | Inspected layout                                                                                  | Presentation policy                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Farm axe, hoe, pickaxe | 128×640; five colour blocks, each four 32px rows ordered left/right/down/up, four temporal frames | Default silver tool in the clearing; four additional colours per appearance in the workbench. Reference foot is 16,30. Colours do not imply implemented equipment tiers. |
| Watering can           | 128×160; five colour rows, four directional columns ordered left/down/right/up                    | One supplied pose per direction, held for 450ms; foot 16,22. Never play the directions as a temporal strip.                                                              |
| Fishing rod            | 128×128; rows down/left/up/right, four 32px poses                                                 | Authored cast = poses 0→1, wait = pose 2, pull = poses 3→0. These are presentation stages awaiting the fishing state machine. Foot 16,22.                                |
| Hook                   | 128×32; four directional poses down/right/up/left                                                 | One held pose per direction; travel and tether are separate. Foot 16,22.                                                                                                 |
| Magic rod              | 128×128; rows left/right/down/up, four temporal frames                                            | Held rod/cast sparkles are baked in. Detached magic uses its own 64×16 strip. Foot 16,22.                                                                                |

Each new hero frame has a named attachment socket. The workbench's magenta square and coordinate readout mark that authored reference point. `src/assets/sprite-attachments.ts` binds hook launch, spell launch, fishing line and farming target sockets to their intended presentation roles. Do not overlay another held tool on baked pixels. The fishing line is an authored primitive to a future world-space float; no supplied bobber or implemented fishing mechanic is claimed.

## Enemies

`src/assets/presentation-animations.ts` expands explicit action blocks into source rectangles. It includes the updated goblin/skeleton/zombie, all ten Enemies Vol1 sheets, four Biomes monsters, Castle soldier/mimic, and the legacy bat/rat/slime strips. Nonidentical old goblin/skeleton/zombie strips remain catalogue alternatives rather than competing runtime defaults.

Updated enemy and most labelled-sheet rows run **down/right/up/left**, unlike the hero's down/left/up/right order. The browser regression compares all four updated goblin idle directions against the named legacy source pixels. Recolours remain presentation variants, never extra AI behaviours.

| Sheet              | Colour variants | Source cell / action exception                                                |
| ------------------ | --------------: | ----------------------------------------------------------------------------- |
| Bear               |               4 | 16px; idle, walk, attack, single hit, three death frames                      |
| Creature           |               5 | Same action columns as Bear                                                   |
| Ghost              |               6 | Same columns; death includes supplied dissolution effects                     |
| Shadow             |               5 | Shared three-frame collapse in the second actor row                           |
| Toad               |               5 | Shared two-frame collapse vertically in the final column                      |
| Imp                |               5 | Separate four-frame directional projectile block                              |
| Beholder           |               5 | Projectile block, four hit frames, four death frames                          |
| Mushrooms          |               6 | Four hit and four death frames                                                |
| Necromancer        |               4 | Shared idle/walk block; projectile art reuses the supplied front-facing strip |
| Spider             |               5 | No dedicated attack block; hit at columns 8–11, shared death at 12–15         |
| Evil Flower        |               3 | Stationary idle/attack, projectile, hit and death; no invented walk animation |
| Fall Ghost         |               3 | Idle/walk/attack plus separate projectile, hit and death blocks               |
| Santa goblin       |               3 | Single supplied projectile pose and three death frames                        |
| Vulture            |               3 | Two rows per colour, left/right only; two attack frames, one hit, three death |
| Soldier            |               1 | 32px; idle columns 0–3, column 4 excluded, walk 5–8, attack 9–12              |
| Mimic              |               1 | 16px; one closed pose, four awakening poses and four attack poses             |
| Bat                |               1 | Two 16px frames in each left/right strip                                      |
| Rat                |               1 | Two 16px up/down frames; side strips use 19×11 rectangles                     |
| Slime / tiny slime |          4 each | Six 13×14 / two 9×9 frames; supplied front/back orientations only             |

Labelled sheets exclude their top 16px header. Validation checks exact expected dimensions, header exclusion, rectangles, anchors, unique IDs and required registered coverage. Unsupported orientations/actions are not silently invented; shared-source adaptations are labelled in the workbench.

## The King

| Animation        | Source rectangles                                        | Reference foot |
| ---------------- | -------------------------------------------------------- | -------------- |
| Idle, walk, bite | Four 32×32 frames per direction; rows down/right/up/left | 16,30          |
| Death            | Six 32×48 frames, one shared front-facing strip          | 16,46          |
| Tongue down      | Eight 64×64 frames at y=0                                | 32,30          |
| Tongue right     | Eight 64×32 frames at y=64                               | 16,30          |
| Tongue up        | Eight 64×64 frames at y=96                               | 32,62          |
| Tongue left      | Eight 64×32 frames at y=192                              | 48,30          |

The 512×224 tongue sheet is not a uniform 64px grid. The animation inspector respects non-looping endpoints and holds the final death frame; pressing Play again restarts it. `About Boss.txt` explicitly permits holding that final frame.

The divided sheet supplies four body poses plus repeatable middle and terminal tip pieces. Their opaque spans are cropped to 10×16 vertically and 16×4 horizontally. `composeTongue` places them contiguously from a directional mouth socket, keeping the body fixed. The workbench offers four directions and 0–12 middle segments; that bound is an inspection limit, not a selected gameplay range. Tests verify joins and bounds at minimum and maximum reach.

## Build boundary

The curated manifest describes 286 source records from 14 unchanged archives. Only **165 PNGs** are emitted for the clearing's hero previews and scenery. The other **121 records** are marked `inspectionOnly`: enemy/King, detached tool and alternate terrain/scenery art is inspected through development catalogue middleware, with its pixels excluded from `public/generated/` and the production build. Its frame/attachment metadata remains validated by `assets:check`.

When a gameplay system starts using an inspection-only source, deliberately promote that source in `src/assets/sources.json` and add its real renderer. Do not copy the full catalogue into the distributable. Terrain adjacency and layered scenery are now covered by [their contract](terrain-scenery.md). UI slicing, atlas packing, presentation gaps and full release notices remain M02 work.
