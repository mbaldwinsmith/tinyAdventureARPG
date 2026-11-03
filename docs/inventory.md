# Pack, equipment and selected tools

M08 connects carried possessions, equipment and local chests to the same core commands and durable checkpoints. React owns selection, focus, form text and confirmation visibility. It never moves possessions or computes authoritative equipment bonuses. `inventory-model.ts`, `inventory.ts` and `equipment.ts` own validation, detached transactions and derived stats; `GameSession` validates current location, pause reasons and transaction identity before adopting a result.

## Try it

Walk to the clearing's travel chest, stand nearby and open **Local storage**. **Collect starter supplies** grants 12 wood, an iron sword, a shield and a separate Keen +2 iron sword, once per adventure. Permanent sword and shield ownership are granted in the same checkpoint. The complete kit must fit; a rejected claim consumes no item IDs, ownership, coins or claim flag. Depositing or merging possessions can make room before retrying.

Open the pack with **I**, the **Open pack** button or standard controller **View/Select (8)**. Select an item to inspect its properties, rolled enchantments, required permanent tool and current loss category. Equip a compatible hand item, split a quantity into a new stack, merge compatible stacks, reorder a stack or deliberately discard it. Equipped items still occupy carried stack positions. A full pack can swap equipped items without needing another position. Close with I, Escape, the close button or controller cancel/View.

Keyboard Tab/Shift-Tab and native activation reach the controls; arrows select neighbouring carried items. Standard controller D-pad/stick navigation moves focus, south confirms, and left/right changes a focused select or numeric quantity. Valuable/unique discard opens a separate modal, initially focuses **Keep item** and requires an explicit acknowledgement checkbox before confirmation. Controller activation handles that checkbox too. Unequip before depositing or discarding an item. Discard never revokes permanent tool ownership or route access.

## Ownership and limits

| Operation        | Core guarantee                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Split            | Positive, smaller-than-stack quantity; free position required; source keeps identity, new stack receives a fresh world-scoped ID.                            |
| Merge            | Same template and stored properties/enchantments; distinct source/target; quantity and maximum stack checked before mutation. Unique equipment cannot merge. |
| Move             | Reorders one carried instance to an occupied position without copying it.                                                                                    |
| Equip            | Carried quantity-one item, compatible slot and permanent tool ownership required. Replaces the old slot reference; retains both carried instances.           |
| Unequip          | Removes only the equipment reference, retaining item identity and properties.                                                                                |
| Deposit/withdraw | Both inventories preflight together. Complete unique-item transfers retain identity; partial stacks receive another ID only when a new stack is needed.      |
| Discard          | Explicit confirmation and fresh transaction token; equipped items rejected; permanent capabilities untouched.                                                |
| Pickup           | Whole reward accepted or retained at its source; no silent overflow or partial claim.                                                                        |

The existing preview defaults are 20 carried stacks, wood stacks of 99 and main-hand/off-hand/body/relic slots. The current content supplies only hand equipment. These are integration defaults, not approval of campaign capacity, acquisition order or M10 procedural loot budgets. The starter kit is fixed authored preview content. Renewable generated supply points now award two wood plus their existing one coin; their offscreen later-day refresh rule is unchanged. Coin-only drops do not consume stack space.

Every possession or selected-tool command carries a shared `expectedTransaction` token. Successful inventory/chest changes, material/coin pickup and death resolution advance it. Invalid/stale commands change neither owner nor allocation counter. Menus pause simulation; inventory operations are allowed under inventory/storage pauses and rejected under unrelated modal/background/death pauses. Equipment changes also reject an active combat action or hurt recovery.

## Effective stats and descriptions

Saved `actor.stats` remain the base. Equipment adds its validated template modifiers and the instance's saved enchantment magnitudes. Active status multipliers apply after those additions, once per stack. Effective stats clamp at zero and reject non-finite results. Re-equipping and reloading never accumulate bonuses into the saved base.

The preview iron sword adds one attack; Keen +2 adds two more. A base attack of one therefore becomes four. Melee damage uses the existing `swordDamage + effectiveAttack - 1` formula; bow damage remains its fixed projectile balance. A shield adds one defence to physical damage handling. Effective movement speed reaches the actual fixed-step motion resolver. The pack shows base and effective values, and descriptions explicitly say modifiers apply while equipped. No additional item ability effects are currently supplied; procedural abilities and comparisons belong to M10.

## Selected tool

Choose sword, shield, roll or bow in the hotbar or pack selector. **X / standard RT (7)** uses the selected action; hold it for a selected shield. The existing Space/Q/R/F and controller west/LB/north/RB bindings remain available. Prompts follow active device and remaps. Selection is saved independently of equipped instances. The four actions remain the borrowed practice/expedition kit: selecting a bow does not grant permanent route ownership. No consumable ammunition is added.

Cooldown readouts derive from saved ready ticks in 0.1-second display steps; energy/cost feedback uses existing combat balances. Combat rules enforce recovery, energy, pause and availability even if a button is pressed while recovering. Opening a modal clears held actions and lowers the shield; neutral controller input is required before rearming.

## Saves, loss and failure

Schema 3 adds only `pack.selectedTool` and `pack.starterClaimed`. Envelope version remains 2. Explicit v1 → v2 → v3 migration preserves geometry, discoveries, item identities, enchantments, equipment and random continuation; earlier saves default to sword selection and unclaimed supplies, without automatically granting a kit. The synthetic v2 fixture includes a carried/equipped enchanted sword.

All inventory commands use the existing durable-first coordinator. A detached candidate, including IDs and nonce, is committed before live ownership, equipment stats or success feedback change. Failed writes keep the previous live pack and expose retry/export/recovery inside the modal. A lost acknowledgement retries the exact encoded checkpoint; it cannot grant a second kit or discard twice. See [save architecture](saves.md).

Item descriptions show the actual agreed rule: each carried material unit has a 25% loss chance; equipment is protected, including unequipped equipment. Deposited items are protected in their local chest. Ten percent of carried money is lost, rounded down. Permanent tools, discoveries and progress remain protected. The saved death report is the resolved outcome; it does not reroll on reload. Practice remains loss-free. Selection and equipment identity survive death.

Automated coverage exercises rejected/accepted transactions, identity/stat/migration rules, real combat/motion effects, failed writes/retries, browser pack/chest/money controls, discard acknowledgement, keyboard and emulated standard controllers, reload and protected equipment through expedition death. Physical controller hardware still needs playtesting.
