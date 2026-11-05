# Tools and the authored trail

M09 adds an authored tool trail reached through the north woodland path. Its final cracked shortcut leads to the existing persistent forest. The forest, crypt anchor, reward/exit boundary and retained generated geography keep their existing rules. Opening the shortcut also earns the optional [Trailblazer build prize](builds.md). The trail kit and balances are preview defaults.

## Playing the trail

Collect the village chest kit, follow the woodland path north and enter **TOOLS**. The trail's first pedestal permanently grants bow, bombs, boomerang, hook and magic. Choose a tool in the pack or hotbar, then use **X / standard RT**. Context buttons issue the same validated commands. The dedicated bow binding still works. Push and Pull are body actions; they need no item instance. Later flippers grant permanent swimming access.

| Route cue                      | Required action                                                                      | Retained result                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Arrow target A                 | Face north in its lane and release an arrow after its windup.                        | Gate A opens permanently.                                                   |
| Weight plate P                 | Push a heavy weight east onto the plate; Pull reverses a step.                       | The object's saved position holds the gate open.                            |
| X-marked cracked stones        | Place a bomb, leave its marked circle, or lift and throw the live bomb.              | The blasted passage remains open.                                           |
| Brass hook anchor              | Face a visible anchor across water; launch, latch and reach the checked dry landing. | Tool ownership persists; tether state resumes if saved in flight.           |
| Diamond levers / B and O       | Toggle either matching lever, locally or with a boomerang.                           | One saved group is raised; the other is lowered. Letters accompany colours. |
| Magic brazier M                | Cast a magic projectile at its unlit target.                                         | Gate M opens permanently.                                                   |
| Return switch R and loose coin | Throw a boomerang north and let it return.                                           | Gate R opens; the coin is claimed once on catch.                            |
| Flipper channel                | Collect permanent flippers, then enter and leave the water.                          | Swimming ownership survives death and equipment loss.                       |
| Forest shortcut X              | Blast the final cracked wall and cross into the persistent forest.                   | The shortcut remains open through reload and defeat.                        |

The trail has reset stones on both sides of its puzzle sections. They restore movable pots/weights, clear unsettled effects and return the player to the safe entrance. Solved permanent passages, coins, tool ownership and enemy outcomes are retained. Heavy weights cannot be lifted. E / south lifts or sets down light pots/crates; X / RT throws them. Pots break on impact; crates land in the world and retain their weight. Reset stones recover misplaced or broken puzzle objects.

A pressure gate derives its current collision from its plate and saved weight positions. Colour gates derive theirs from the saved lever group. Occupied doorways stay open until their occupants clear them. The levers are reachable from either side. Permanent target/brazier/bomb passages use saved world changes rather than transient display state.

## Resources, timing and combat

Arrows, hooks and boomerangs have no ammunition stacks and consume no energy. Bows retain their cardinal aim, 12-tick windup and 50-tick cooldown. The first arrow is released after the complete windup. Bombs cost three energy and magic costs two; waiting restores energy under the existing active-play rules. Recovery and animation limits reject repeated actions rather than creating more projectiles.

A bomb's original 100-tick fuse continues when it is lifted or thrown. The blast resolves once, has a marked 40-pixel radius, damages combat actors and permanently opens supported cracked stones. A returning boomerang can hit an enemy once on each leg; world switches toggle once per throw. Retrieved coins stay unclaimed until the tool reaches the player, and a full coin balance leaves them at their source. Magic projectiles damage enemies and activate supported braziers. Hooks can intercept/stun enemies; only eligible anchors produce a pull. A blocked or unsafe latch retracts instead of placing the player inside terrain or hazards.

Pots and crates have checked throw/landing behaviour. Tool actions cannot bypass an active combat animation, hurt recovery, a modal pause or permanent ownership requirements. Hook movement is a core-owned replacement for ordinary movement during the pull, with one committed actor position per fixed step. The Phaser adapter draws the resulting tether and poses; it never teleports the authoritative actor independently.

## Hazards and recovery

Timed spikes show a warning before rising. Arrow mouths show a warning before firing; guarding, evasion and cover use the same combat rules as enemy attacks. Marked directional tiles push while leaving opposing walking movement available. Pits and acid hurt and return the actor to retained safe dry ground. Water is impassable in this route without flippers, while an eligible hook can cross it to dry ground. Acid remains hazardous with flippers. The earlier village pond remains an explicitly cosmetic swimming preview.

All cycles use the owned gameplay clock. Menus, background pause and closed-game time do not advance a fuse, trap, hook, projectile or cooldown. Trail defeat uses the agreed expedition loss/respawn policy; practice remains loss-free. Deposits, equipment, permanent tools and discoveries stay protected. Retained solved passages and the generated crypt are preserved.

## Ownership and persistence

`tool-model.ts` defines serializable effect identities, phases, positions, aim, origins, target contacts, carried bomb and return cargo. `tools.ts` owns command preflight, mechanisms, effects, hazards and forced movement; `tool-invariants.ts` rejects malformed identities/references/phases. Validated content lives in `content/tools.ts` and `content/tool-trail.ts`.

The bridge exposes typed actions and focused UI snapshots. React owns form/focus state and descriptions; continuous effect/actor positions stay in Phaser's read model. Native modal focus is restored after a durable write so repeated controller selections can continue. Read-only development observations support browser regression tests and are absent from production controls.

Tool activation, manipulation, grants and travel use durable-first command candidates. Failed writes retain the previous live owner and offer exact retry/export. Simulation outcomes such as blasts, catches and solved targets checkpoint their complete post-step state. Acknowledgement failure retries the exact encoded checkpoint, without charging energy or allocating an effect twice.

Travel cancels unsettled projectiles and restores any unlanded thrown objects at their pre-lift world positions. A held live bomb must be released before travel. Settled passages, moved weights, enemy outcomes and claimed coins remain retained. Respawn clears unsettled tool effects together with the saved return/loss transition.

Schema 4 adds tool effect state and the expanded selected-tool set. Envelope version remains 2. Explicit v1 → v2 → v3 → v4 migration adds the authored annex and its woodland entry once, preserving every older region/dungeon layout, object delta, item/enchantment, deposit, permanent discovery and random continuation. Geography is not regenerated from a seed during migration.

M10 adds preview build modifiers. Physical controller hardware and final campaign acquisition and balance remain outside this integration milestone. Automated controllers emulate the standard browser Gamepad API.
