# World rendering and action input

M04 supplies a traversable authored clearing, cottage and larger woodland. M05 adds a separate practice field and [combat rules](combat.md); the M04 evidence below records its original preview scope. These exercise collision, retained world objects, safe entry, camera follow and UI focus. M06 extends them with the confirmed fixed connection graph and generated persistent regions; see [generation](generation.md).

## Scene and rendering ownership

One mount owns one Phaser game: `boot` starts `assets`, then `world`. The asset scene loads the validated packed atlas and installs shared animations. A visible loading failure offers a full reload/retry; cleanup removes listeners and the old canvas. Region travel restarts only the world scene, keeping the same authoritative session.

The logical viewport is 480×272. Phaser FIT preserves its aspect ratio inside the responsive desktop frame, including fractional CSS scaling; sampling remains nearest-neighbour (`pixelArt`) and camera coordinates are rounded. This is the initial desktop strategy, not an integer-only window-size constraint. Camera bounds follow each region, the player is placed at a validated entry before follow begins, and a 120ms fade softens entry. Small interiors are centred; the 960×544 woodland exercises scrolling.

| Depth band    | Content                                        |
| ------------- | ---------------------------------------------- |
| 0             | Base grass/interior floor                      |
| 10            | Paths, shore, flowers and inspected soil       |
| 20            | Ground shadows                                 |
| 30            | Loose world item                               |
| 100 + feet Y  | Actor, trunks, facades, props and carried item |
| 2000 + feet Y | Canopies and roofs                             |
| 4000          | Cosmetic effects and interaction marker        |
| 5000          | Development geometry and scene/tick readout    |

`createWorldView` consumes the same retained object state used by interaction/collision. Opening chests changes their frame; dropping the box changes its position and solid. Shore and cosmetic action durations consume simulated time and freeze with the core. Forced action previews, including attack/hit, take priority over swim, carry, walk and idle. The action selector remains cosmetic; real practice actions are resolved by the core combat system.

## Motion and interaction

The actor's 8×6 foot body ends at its reference foot point, independently of variable sprite/frame bounds. Each core 20ms step resolves swept X then Y movement against explicit rectangles and region edges. This clips thin walls without tunnelling and slides along obstacles. There is no second physics clock. The core validates the resulting position before committing it.

The existing preview policy is smooth 60px/second movement, normalised diagonals and cardinal facing, with vertical direction winning an equal-axis tie. Analogue stick magnitude survives radial dead-zone remapping. These remain reversible defaults while M00 movement/balance choices stay open.

A nearby target must be within 26px, in the facing half-plane (4px tolerance), and have clear line of sight excluding its own solid. The nearest valid stable ID wins. E, the bound controller action, the nearby button or clicking the highlighted target sends the same validated command. Pointer input focuses the canvas and targets nearby interactions; it does not aim attacks.

- Doors validate region/spawn identities and current destination foot clearance, preserve both regions' geometry/deltas, update activity/discovery, clear held input and place the actor explicitly before rendering.
- Signs and villagers open contextual dialogue. Tessa can be recruited in Whispering Forest.
- Chests retain an opened ID and visible open frame. Interact to open local storage and access deposits, withdrawals and the clearing’s one-time starter kit. See [inventory](inventory.md).
- Farm plots open the farm dialog for the nearby bed. See [farming](farming.md).
- The small box is a single retained world object. Pickup hides its ground solid; drop checks full-box clearance, bounds and water, then restores it at the new position. Carrying takes interaction priority, so set it down before travel. Heavy-box pickup while swimming is rejected. This is not inventory/tool ownership.
- Pond contact selects swimming animation, without a permanent campaign swim unlock.

## Controls and focus

| Action                  | Keyboard default         | Standard controller default                        |
| ----------------------- | ------------------------ | -------------------------------------------------- |
| Move                    | WASD or reserved arrows  | Left stick or D-pad                                |
| Interact / menu confirm | E / native UI activation | South face button (0)                              |
| Cosmetic sword preview  | Space                    | West face button (2)                               |
| Explored map            | M                        | Right-stick click (11)                             |
| Pause                   | Escape                   | Start (9)                                          |
| Menu cancel             | Escape                   | East face button (1), or bound pause               |
| Menu navigation         | Native Tab/arrows        | D-pad/stick; left/right changes a focused selector |

Controls offers unique session-only key and action-button assignments. Arrows and east-button cancel remain reserved; unsupported and duplicate bindings fail explicitly. Prompts reflect the last active keyboard or standard-mapped Xbox, PlayStation, Switch or generic controller. Nonstandard browser mappings are ignored. The radial stick dead zone is 0.2; menu navigation uses edges instead of frame-dependent repeat timers.

Connecting, replacement/disconnect, focus changes, pause changes, modals and region transitions clear held input. A controller must return its left stick and all buttons to neutral before rearming. This prevents a held confirm or movement from leaking into the world. React native dialogs own focus while open; layered settings/menu pauses compose, and closing settings cannot resume an underlying menu. The pause dialog explicitly starts on its resume button.

Bindings are not durable saves. Standard controller behaviour is tested with an emulated browser Gamepad API; no physical controller was available for this milestone. Physical device/browser compatibility still needs hardware playtesting.

## Development verification

The development-only collision overlay shows foot bodies, solids, interaction reach, active region/scene and tick. Its read-only DOM observations are enabled only with the overlay; positions/ticks are not streamed into React snapshots or exposed as a mutation API. Production rejects enabling debug overlays and excludes the workbench.

Pure tests compare actual wall collision at 30/60/144Hz, swept clipping/sliding, valid spawns, routes to every authored interaction, door retention, chest idempotence, object serialization, animation priority and controller neutral/dead-zone/edge handling. Browser flows traverse doors and narrow paths, test camera bounds/return placement, inspect/carry/swim, remap input, navigate nested controller menus, disconnect and retry failed loading. Existing source-pixel, pause, lifecycle, calendar and effect flows remain required. See CHANGELOG for the exact checks run.

M08 adds **I / View (8)** for the pack and **X / RT (7)** for the selected action, including held shield guarding. Both are remappable through Controls. Pack selection, numeric quantities, selects and discard acknowledgement support native keyboard, pointer and standard controller navigation. All paths send the same typed core commands; menus retain composed pause and neutral-input rearming.

M09 adds a woodland door to the authored tool trail. Its core-owned mechanisms alter collision from retained flags/weights, and its final bombable shortcut reaches the generated forest. Selected X/RT and context buttons share tool commands. The fixed-step resolver substitutes hook movement while latched; Phaser draws poses/tethers without another physics loop. Flippers gate the trail channels; the earlier village pond remains cosmetic. See [tools](tools.md).

## Adventure HUD and route cues

The HUD reads health, energy, carried coins and date from the same snapshot as the rest of the interface. The toolbelt shows the selected slot, unlock state and cooldown. It uses the owned sword, shield and bow icons with the existing input prompt sprites. The fieldbook holds the village journal, exploration summary, rest and saves.

The contextual action beside the scene shows a nearby coin or the object the player is facing. It shares the keyboard and controller’s core commands. The map shows the current clearing, explored links and discovered keys, switches and gates. Route pickups, switches and gates publish a short notification after their checkpoint commits. Readable dialogues still pause for signs, villagers, caches and anchor rewards. This presentation adds no save fields.

The generated crypt uses tile crops from the owned Tiny Dungeon Pack's gray room sheet. Door frames open with their existing saved passages. The pack also supplies stair tiles, torch frames, coins, arrows, switches, treasure chests and trail props. Their visual bounds leave the existing collision and interaction geometry in charge.
