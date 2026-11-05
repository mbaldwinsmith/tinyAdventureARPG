# Enchantments, relics and abilities

Open the pack and expand **Build prizes** to see which rewards you can claim. The travel chest heirloom is available after collecting starter supplies while facing the chest. Each prize is available once per adventure. The crypt's ordinary anchor reward still controls when a new crypt can generate. You can claim its optional build prize later if the pack is full.

| Prize                       | Requirement                                                 | Contents                                                       |
| --------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| Travel chest heirloom       | Collect starter supplies and face the clearing travel chest | Level 1 elemental iron sword and permanent Battle Focus unlock |
| Mixed trial prize           | Finish the mixed practice trial                             | Swift Coil and permanent Tool Focus unlock                     |
| Crypt warden heirloom       | Defeat the crypt warden and collect its anchor reward       | Level 2 elemental Keen iron sword and Bastion Stone            |
| Trailblazer challenge prize | Blast open the tool trail forest shortcut                   | Level 2 Fortified shield and Ember Lens                        |

The Trailblazer challenge uses the existing saved shortcut objective. It serves as the preview quest reward source. The starter acquisition order, numerical balance and reward tables are preview defaults for playtesting.

## Affixes and gear

| Enchantment | Compatible gear | Effect while equipped                                                |
| ----------- | --------------- | -------------------------------------------------------------------- |
| Fire        | Blade           | +1–3 damage to animals on sword hits, including bats and rats        |
| Holy        | Blade           | +1–3 damage to undead on sword hits, including skeletons and zombies |
| Ice         | Blade           | +1–3 damage to slimes on sword hits                                  |
| Keen        | Blade           | Adds attack, which increases sword damage against every enemy        |
| Fortified   | Armour          | +1–2 defence against physical hits                                   |

Goblins receive normal sword damage and general attack bonuses. A blade can have one element. Level 1 has three roll points and one affix. Level 2 has five roll points and up to two compatible affixes. Every point of magnitude costs one roll point. A rolled blade gets an element first. The remaining level 2 budget can add Keen. The old starter Keen sword retains its authored roll and instance identity.

The equipment panel shows rolled magnitudes, target families and base stats. Select an item and expand its comparison to see the equipped item's effects for the same slot. Equipment and relics are protected on death under the existing material-loss rule.

## Relics and abilities

Equip one relic at a time. Swift Coil reduces bow, bomb, boomerang, hook and magic cooldowns by 20%. Bastion Stone adds two defence. Ember Lens cuts bomb and magic costs by one energy. The pack's hotbar shows the energy costs for the current build.

Select one unlocked ability in the pack. Press **Z / left trigger** or click its activation button during play. Battle Focus boosts damage by 25%. Tool Focus reduces the same five tool cooldowns by 25% and cuts bomb and magic costs by one energy. Both spend two energy, last four seconds of active play and share a ten-second cooldown measured from activation. The active effect ends on respawn. The unlock and cooldown are saved.

Combat applies base and equipped stat additions before existing status multipliers. Sword damage adds its matching family bonus before applying Battle Focus at contact. Tool cooldown reductions add together, cap at 40%, and round up to a whole gameplay tick at activation. Energy discounts cap at one and preserve a minimum cost of one for bombs and magic. Arrows, boomerangs and hooks remain energy-free. Fuse lengths, puzzle distances and permanent tool ownership follow the existing tool rules, so any build can solve a required route.

## Checkpoints

Save schema 5 adds build claims, unlocked and selected abilities, temporary effect and cooldown state, and optional levels on new item instances. Migration preserves old possessions, geography and RNG and recognizes a completed mixed practice trial in a retained encounter. Effects and cooldowns freeze during menus and offline time.

Build claims stage item allocation, loot RNG, contents, ability unlock and claim together. A full pack leaves all of them available for retry. Successful rolls save their item IDs, tier and exact magnitudes. Reload reads those results from the checkpoint.
