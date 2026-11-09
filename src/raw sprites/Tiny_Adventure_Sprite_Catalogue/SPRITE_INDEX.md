# Tiny Adventure — Sprite Index

Audited 2 November 2026. Source: [mbaldwinsmith/tinyAdventureARPG](https://github.com/mbaldwinsmith/tinyAdventureARPG/tree/main/src/raw%20sprites), commit `d3e3add7481c3b3b819c3808eb760ff1346423fc`.

## Coverage and how to use this index

All **23 archives** were opened. They contain **1,466 file entries: 1,436 PNG occurrences and 30 text occurrences**. SHA-256 comparison leaves **716 distinct PNG images/sheets** and **720 repeated PNG occurrences**. All 716 distinct images were visually reviewed in 20 labelled contact sheets. This is a sheet/file catalogue: a sheet can contain many animation frames, tile pieces, recolours or objects. These numbers are not counts of individual sprites or distinct creatures.

Open **index.html** after extracting the ZIP for searchable previews, source locations, companion links and zoom. **sprite-index.csv** is one row per distinct image; **archive-inventory.csv** retains every source occurrence, including support text. **sprite-catalogue.json** is the full structured index with exact duplicate relationships. Image IDs S0001–S0716 are stable for this audited snapshot, not a future asset pipeline naming contract.

Identity comes from source paths/names, visible artwork, baked labels and included text. Proposed gameplay uses are suggestions. Suggested cell dimensions are evidence-based hints, not a validated runtime atlas. Individual unlabeled fish, treasures, furniture components and animation frame timings have not been assigned invented names or hitboxes.

## Important findings

- Six matching hero appearances are available across the updated action packs. Visually, heroes 1/3/5 share the shorter hairstyle across three skin tones; heroes 2/4/6 share the longer hairstyle. These are appearances, not classes or gender assignments.
- All six have modern idle, walk, sword, bow, shield idle/walk, fall, item celebration, pickup, carry idle/walk, throw, hit, roll, push/pull, swim idle/movement, axe, pickaxe, hoe, watering can, fishing, hook and magic-rod poses. They do not have identical frame sizes or numbers of frames.
- A dedicated boomerang-throw set exists for the **two legacy appearances**. The v2 Dungeon update provides throw-item poses for all six; using those for boomerangs is an adaptation to implement, not an extra supplied dedicated animation.
- `Additional Animations.zip` contains roll, hit, push, pull and swim actions. Do not infer these are missing from older product-page descriptions.
- Three archive pairs are byte-identical: `TDP_anim_v2 (1).zip` = `TDP_anim_v2.zip`; `TDP_zombie_v2 (1).zip` = `TDP_zombie_v2.zip`; `Tiny Dungeon Pack (1).zip` = `Tiny Dungeon Pack.zip`.
- Many packs embed the same base Adventure pack. Keep one logical asset with multiple source locations rather than importing every copy.
- Biomes contains both **New Style** and **Old Style** terrain. These are alternative edge layouts; avoid mixing their boundary pieces inside one region without authored transitions.
- Coast includes an old shoreline folder and an explicitly updated no-background shoreline. Prefer the updated counterpart for that rendering approach.
- The collection is based on 16px terrain but includes 32px weapon action cells, 32x48 / 48x48 trees, 64x64 boat hull cells, 32x64 sail pieces, larger buildings and smaller UI pieces. Preserve original pixel scale.
- No dedicated hero death animation sheet or bomb explosion sheet was identified. Hit and fall poses exist, but those do not establish a complete death sequence.
- All source art remains unchanged. Previews in this private catalogue are copies for the owner's project work, not a grant to redistribute the paid art.

## Recommended source precedence

| Family | Prefer | Keep alongside it |
|---|---|---|
| Hero base idle/walk/sword | `TAP_anim_v2.zip` (exact copies also embedded in other packs) | Additional action packs matched by hero number |
| Hero bow/shield/fall/item pose | `TAPp_anim_v2.zip` | Bow/arrow/shield icons and world projectiles |
| Pickup/carry/throw | `TDP_anim_v2.zip` | Bomb, crate, pot, pressure plate; legacy boomerang poses if deliberately used |
| Farming actions | `TFP_anim_v2.zip` | Farm tool icons, resource nodes and crop sheet |
| Roll/hit/push/pull/swim | `Additional Animations.zip` | Crates, water and terrain collision definitions |
| Goblin/skeleton | `TAP_Enemies_v2.zip` | Base portrait/reference poses if useful |
| Zombie | `TDP_zombie_v2.zip` | Other Dungeon enemies |
| Hook/magic | Castle `PNG/PNGs/Char/CharN_*` | Hook components, magic effect, Hook_n_Rod icons |
| Fishing | Coast `Characters/charN_fishingrod*` | Rod icons, baits, catch icons and boat parts |
| Terrain | Choose coherent Old/New Style per region | Exact matching edge/corner pieces and compatible decorations |

“Preferred” is an integration recommendation based on filenames, layout and known update bundles. A nonidentical older file remains indexed; it has not been deleted or declared redundant merely because its name resembles an update.

## Companion sets and Tiny Adventure uses

| Set | Assets that belong together | Proposed role |
|---|---|---|
| Forest outdoor dungeon | Biomes terrain, trees, bushes, mushrooms, flowers; fox/gardener; woodland wildlife and enemy sheets; crates/plates where designed | Generate paths and clearings once, then persist geography, gates, opened treasure and shortcuts. Refresh enemies/resources independently. |
| Desert outdoor dungeon | Desert terrain, cacti, tumbleweed, bones; Sand Wanderer, vulture and scorpion | Persistent branching trails, quicksand hazards and hidden ruins. |
| Winter/autumn regions | Matching seasonal terrain, snowy/coloured trees and bushes; autumn ghost or winter characters | Visually coherent persistent surface regions. Christmas props can be optional rather than defining every winter area. |
| Interior dungeon puzzles | Room colour variants, floor plates, wooden/heavy boxes, toggle lever, blue/orange walls, spike/shooting/pushing traps | Assemble handmade room templates into changing interiors; validate required tools and reachable exits. |
| Castle progression | Castle tiles, large doors, keys, banners, thrones, treasure, soldier, mimic and crowned mouth boss | Later dungeon theme and boss route. Palette swaps alone should not count as new enemy behaviours. |
| Boomerang | Item/outlined icons; legacy throw pose or adapted v2 throw-item; switches and pickups | Returning projectile, remote activation and item retrieval. Flight and effects still need code. |
| Bow | Hero bow action, bow icon and arrow | Combat, switches and projectile puzzles; separate visual sprite from hitbox. |
| Bomb/carry | Pickup/carry/throw poses, bomb/lit bomb, vessels and crates | Carry puzzles, explosives and deliberately marked breakable walls. Explosion visual still needed. |
| Hook | Matching hero hook pose, hook head/line/pole, equipment icon | Gap crossing and object pulling; define anchor eligibility and tether rendering. |
| Magic rod | Matching hero rod action, magic strip, equipment icon | Projectile or remote switch tool. Differentiate magic rod from Coast fishing rod. |
| Village | House facade families, door states, interior walls/floors, colour-matched furniture, NPCs, emotes and signs | Persistent home and services; NPC occupations are authored roles, not source labels. |
| Garden | Crops, wet/dry soil, tools, watering actions, well, gardener and produce | A modest supply garden; assets alone do not require a full farming simulation. |
| Coast/boat | Hull + sail + fittings, animated shore, palm/fruit, crab, fishing actions + rod + bait + catch icons | Persistent coast/islands and optional fishing. Hull, sail and rider need separate placement offsets. |
| UI | Buttons + panels + frames + icons + bitmap fonts + resource bars + current-device prompts | Consistent menus and HUD; use readable scaling and explicit control rebinding labels. |

## Animation and slicing notes

- Modern 64x64 hero idle/move sheets generally arrange four 16px frames across four directional rows. Modern sword/bow sheets use larger 32px cells. View each sheet before defining order and timing.
- Static four-direction reference strips and four-direction hit strips contain four poses, not four sequential frames for one facing direction.
- The legacy walking strips can be 96x17 and sword strips can be 138x23. They are not safe to cut on a universal 16x16 grid. Use explicit rectangles and stable foot anchors, or choose matching modern sheets.
- Farm action sheets include tool colour/material variants. Axe/hoe/pickaxe sheets use 32px action blocks; do not interpret every row as one continuous animation. Watering actions are also laid out in 32px cells.
- Neighbours and labelled monster sheets bake action headers into the PNG. Those labels must not become game frames. Skin/colour variants are row blocks; action blocks have unequal lengths.
- Boat upgrades are 63x80 despite the filename hinting at 16px pieces; the house update sheet is 240x1039. Both need explicit source rectangles.
- The boss uses 32x32 bite/idle/walk, 32x48 death and larger tongue layouts. The 512x224 tongue sheet is not evenly divisible by the filename's 64px cell height; verify rectangles rather than assuming a square grid.
- Castle's `About Boss.txt` explicitly offers the divided tongue pieces to extend attack length. It also suggests holding the final death frame.
- Coast's fishing guide lists throw, idle, fish and pulling frames, but repeats “1st” for pulling. Treat it as an ambiguous reference and inspect the poses before assigning timing.
- Farm's crop guide gives fruits **right-to-left** as apple, peach, orange, pear; crops **right-to-left and top-to-bottom** as black grapes, white grapes, corn, carrots, beetroots, turnips, pineapples, blueberries, tomatoes, then four invented crops. It says the names are suggestions.
- Render trunks and collision below actor feet; canopy parts above actors. Do not make a whole tree image's transparent bounding box a solid collision block.
- For persistent surface regions, save original generated terrain plus changed object states. For changing interiors, keep an expedition instance stable until the expedition ends; leaving a room should not regenerate it.

## Archive inventory

| Archive | File entries | PNG entries | Distinct PNGs inside archive | Identical archive |
|---|---:|---:|---:|---|

| Additional Animations.zip | 36 | 36 | 36 | — |
| Controllers and Keyboard.zip | 16 | 14 | 14 | — |
| TAP_Enemies_v2.zip | 5 | 5 | 5 | — |
| TAP_anim_v2.zip | 24 | 24 | 24 | — |
| TAPp_anim_v2.zip | 54 | 54 | 54 | — |
| TDP_anim_v2 (1).zip | 54 | 54 | 54 | TDP_anim_v2.zip |
| TDP_anim_v2.zip | 54 | 54 | 54 | TDP_anim_v2 (1).zip |
| TDP_zombie_v2 (1).zip | 2 | 2 | 2 | TDP_zombie_v2.zip |
| TDP_zombie_v2.zip | 2 | 2 | 2 | TDP_zombie_v2 (1).zip |
| TFP_anim_v2.zip | 48 | 48 | 48 | — |
| Tiny Adventure Pack Plus.zip | 115 | 115 | 115 | — |
| Tiny Adventure Pack.zip | 48 | 48 | 48 | — |
| Tiny Biomes Vol.1.zip | 109 | 106 | 106 | — |
| Tiny Coast Pack_v2.zip | 98 | 94 | 94 | — |
| Tiny Dungeon Pack (1).zip | 160 | 158 | 158 | Tiny Dungeon Pack.zip |
| Tiny Dungeon Pack.zip | 160 | 158 | 158 | Tiny Dungeon Pack (1).zip |
| Tiny Enemies Vol1.zip | 12 | 10 | 10 | — |
| Tiny Farm Pack.zip | 77 | 74 | 74 | — |
| Tiny Neighbours Vol1.zip | 29 | 26 | 26 | — |
| Tiny Village Pack.zip | 177 | 175 | 175 | — |
| Tiny Village Updates.zip | 1 | 1 | 1 | — |
| TinyCastlePack.zip | 111 | 107 | 107 | — |
| Tiny_GUI_Pack_v2.zip | 74 | 71 | 71 | — |

## Hero action matrix

All six modern hero appearances have the following source coverage. This is animation presence, not verified gameplay implementation.

| Action | Heroes | Primary bundle |
|---|---|---|
| Idle, walk, sword, direction references | 1–6 | TAP_anim_v2.zip |
| Bow, shield idle/walk, fall, item pose | 1–6 | TAPp_anim_v2.zip |
| Pickup, carry idle/walk, throw | 1–6 | TDP_anim_v2.zip |
| Hit, roll, push/pull, swim idle/move | 1–6 | Additional Animations.zip |
| Axe, pickaxe, hoe, watering can | 1–6 | TFP_anim_v2.zip |
| Fishing | 1–6 | Tiny Coast Pack_v2.zip |
| Hook, magic rod | 1–6 | TinyCastlePack.zip |
| Dedicated boomerang throw | Legacy appearances 1–2 | Tiny Dungeon Pack.zip |

## Full image/sheet index

Each entry links to a preview and lists its related assets by ID. All original source occurrences are recorded in the JSON and archive CSV.


### Buildings and interiors


#### S0499 — Interior furnishing: Bedside_table

[Preview](previews/S0499.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bedroom/Bedside_table.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0500 — Interior furnishing: Bed_Blue

[Preview](previews/S0500.png) · **Sheet:** 32 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bedroom/Bed_Blue.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0501 — Interior furnishing: Bed_Brown

[Preview](previews/S0501.png) · **Sheet:** 32 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bedroom/Bed_Brown.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0502 — Interior furnishing: Bed_Green

[Preview](previews/S0502.png) · **Sheet:** 32 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bedroom/Bed_Green.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0503 — Interior furnishing: Bed_Red

[Preview](previews/S0503.png) · **Sheet:** 32 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bedroom/Bed_Red.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0504 — Interior furnishing: Closet

[Preview](previews/S0504.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bedroom/Closet.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0509 — Interior furnishing: Worktop_spritesheet_16x16

[Preview](previews/S0509.png) · **Sheet:** 112 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Kitchen/Worktop_spritesheet_16x16.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0510 — Interior furnishing: Sofa_big_blue

[Preview](previews/S0510.png) · **Sheet:** 192 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Big Sofa/Sofa_big_blue.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0511 — Interior furnishing: Sofa_big_brown

[Preview](previews/S0511.png) · **Sheet:** 192 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Big Sofa/Sofa_big_brown.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0512 — Interior furnishing: Sofa_big_green

[Preview](previews/S0512.png) · **Sheet:** 192 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Big Sofa/Sofa_big_green.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0513 — Interior furnishing: Sofa_big_red

[Preview](previews/S0513.png) · **Sheet:** 192 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Big Sofa/Sofa_big_red.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0514 — Interior furnishing: Sofa_big_spritesheet_48x48

[Preview](previews/S0514.png) · **Sheet:** 192 × 240 px · **Suggested cells:** 48 × 48

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Big Sofa/Sofa_big_spritesheet_48x48.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0515 — Interior furnishing: Sofa_big_white

[Preview](previews/S0515.png) · **Sheet:** 192 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Big Sofa/Sofa_big_white.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0516 — Interior furnishing: Carpet_blue_1

[Preview](previews/S0516.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_blue_1.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0517 — Interior furnishing: Carpet_blue_2

[Preview](previews/S0517.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_blue_2.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0518 — Interior furnishing: Carpet_blue_3

[Preview](previews/S0518.png) · **Sheet:** 48 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_blue_3.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0519 — Interior furnishing: Carpet_green_1

[Preview](previews/S0519.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_green_1.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0520 — Interior furnishing: Carpet_green_2

[Preview](previews/S0520.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_green_2.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0521 — Interior furnishing: Carpet_green_3

[Preview](previews/S0521.png) · **Sheet:** 48 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_green_3.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0522 — Interior furnishing: Carpet_red_1

[Preview](previews/S0522.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_red_1.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0523 — Interior furnishing: Carpet_red_2

[Preview](previews/S0523.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_red_2.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0524 — Interior furnishing: Carpet_red_3

[Preview](previews/S0524.png) · **Sheet:** 48 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Carpet/Carpet_red_3.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0525 — Interior furnishing: Floor

[Preview](previews/S0525.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Floor.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0528 — Interior furnishing: Lil_Table

[Preview](previews/S0528.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Lil_Table.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0530 — Interior furnishing: Picture

[Preview](previews/S0530.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Picture.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0531 — Interior furnishing: Plant_Green

[Preview](previews/S0531.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Plant/Plant_Green.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0532 — Interior furnishing: Plant_Pink

[Preview](previews/S0532.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Plant/Plant_Pink.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0533 — Interior furnishing: Plan_Dark

[Preview](previews/S0533.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Plant/Plan_Dark.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0534 — Interior furnishing: Sofa_small_blue

[Preview](previews/S0534.png) · **Sheet:** 128 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Small Sofa/Sofa_small_blue.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0535 — Interior furnishing: Sofa_small_brown

[Preview](previews/S0535.png) · **Sheet:** 128 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Small Sofa/Sofa_small_brown.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0536 — Interior furnishing: Sofa_small_green

[Preview](previews/S0536.png) · **Sheet:** 128 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Small Sofa/Sofa_small_green.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0537 — Interior furnishing: Sofa_small_red

[Preview](previews/S0537.png) · **Sheet:** 128 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Small Sofa/Sofa_small_red.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0538 — Interior furnishing: Sofa_small_spritesheet_32x32

[Preview](previews/S0538.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Small Sofa/Sofa_small_spritesheet_32x32.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0539 — Interior furnishing: Sofa_small_white

[Preview](previews/S0539.png) · **Sheet:** 128 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Small Sofa/Sofa_small_white.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0540 — Interior furnishing: Trunk_Blue

[Preview](previews/S0540.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Trunk/Trunk_Blue.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0541 — Interior furnishing: Trunk_Brown

[Preview](previews/S0541.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Trunk/Trunk_Brown.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0542 — Interior furnishing: Trunk_Green

[Preview](previews/S0542.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Trunk/Trunk_Green.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0543 — Interior furnishing: Trunk_Red

[Preview](previews/S0543.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Trunk/Trunk_Red.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0544 — Interior furnishing: Trunk_Spritesheet32x16

[Preview](previews/S0544.png) · **Sheet:** 64 × 32 px · **Suggested cells:** 32 × 16

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Trunk/Trunk_Spritesheet32x16.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0548 — Interior furnishing: Wooden_table_brown

[Preview](previews/S0548.png) · **Sheet:** 80 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wooden Table/Wooden_table_brown.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0549 — Interior furnishing: Wooden_table_green

[Preview](previews/S0549.png) · **Sheet:** 80 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wooden Table/Wooden_table_green.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0550 — Interior furnishing: Wooden_table_red

[Preview](previews/S0550.png) · **Sheet:** 80 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wooden Table/Wooden_table_red.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0551 — Interior furnishing: Wooden_table_spritesheet48x48

[Preview](previews/S0551.png) · **Sheet:** 96 × 192 px · **Suggested cells:** 48 × 48

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wooden Table/Wooden_table_spritesheet48x48.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0552 — Interior furnishing: Wooden_table__blue

[Preview](previews/S0552.png) · **Sheet:** 80 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wooden Table/Wooden_table__blue.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0553 — Interior furnishing: Wooden_chair

[Preview](previews/S0553.png) · **Sheet:** 128 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wooden_chair.png`

**Belongs with:** village-interior. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Home, inn, shop or study dressing; preserve colours and orientation families.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0561 — House facade/colour collection: House1_blue

[Preview](previews/S0561.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House1_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0562 — House facade/colour collection: House1_green

[Preview](previews/S0562.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House1_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0563 — House facade/colour collection: House1_red

[Preview](previews/S0563.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House1_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0564 — House facade/colour collection: House1_spritesheet

[Preview](previews/S0564.png) · **Sheet:** 256 × 128 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House1_spritesheet.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0565 — House facade/colour collection: House2_blue

[Preview](previews/S0565.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House2_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0566 — House facade/colour collection: House2_green

[Preview](previews/S0566.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House2_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0567 — House facade/colour collection: House2_red

[Preview](previews/S0567.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House2_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0568 — House facade/colour collection: House2_spritesheet

[Preview](previews/S0568.png) · **Sheet:** 256 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House2_spritesheet.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0569 — House facade/colour collection: House3_blue

[Preview](previews/S0569.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House3_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0570 — House facade/colour collection: House3_green

[Preview](previews/S0570.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House3_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0571 — House facade/colour collection: House3_red

[Preview](previews/S0571.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House3_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0572 — House facade/colour collection: House3_spritesheet

[Preview](previews/S0572.png) · **Sheet:** 320 × 128 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House3_spritesheet.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0573 — House facade/colour collection: House4_blue

[Preview](previews/S0573.png) · **Sheet:** 80 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House4_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0574 — House facade/colour collection: House4_green

[Preview](previews/S0574.png) · **Sheet:** 80 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House4_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0575 — House facade/colour collection: House4_red

[Preview](previews/S0575.png) · **Sheet:** 80 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House4_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0576 — House facade/colour collection: House4_spritesheet

[Preview](previews/S0576.png) · **Sheet:** 320 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/House4_spritesheet.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0577 — House facade/colour collection: Wooden_House1_blue

[Preview](previews/S0577.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House1_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0578 — House facade/colour collection: Wooden_House1_green

[Preview](previews/S0578.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House1_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0579 — House facade/colour collection: Wooden_House1_red

[Preview](previews/S0579.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House1_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0580 — House facade/colour collection: Wooden_House2_blue

[Preview](previews/S0580.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House2_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0581 — House facade/colour collection: Wooden_House2_green

[Preview](previews/S0581.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House2_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0582 — House facade/colour collection: Wooden_House2_red

[Preview](previews/S0582.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House2_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0583, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0583 — House facade/colour collection: Wooden_House3_blue

[Preview](previews/S0583.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House3_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0584, S0585, S0586, S0587, S0588, S0612.

#### S0584 — House facade/colour collection: Wooden_House3_green

[Preview](previews/S0584.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House3_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0585, S0586, S0587, S0588, S0612.

#### S0585 — House facade/colour collection: Wooden_House3_red

[Preview](previews/S0585.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House3_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0586, S0587, S0588, S0612.

#### S0586 — House facade/colour collection: Wooden_House4_blue

[Preview](previews/S0586.png) · **Sheet:** 80 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House4_blue.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0587, S0588, S0612.

#### S0587 — House facade/colour collection: Wooden_House4_green

[Preview](previews/S0587.png) · **Sheet:** 80 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House4_green.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0588, S0612.

#### S0588 — House facade/colour collection: Wooden_House4_red

[Preview](previews/S0588.png) · **Sheet:** 80 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Buildings/Wooden_House4_red.png`

**Belongs with:** village-buildings. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Persistent home, inn or shop exterior; building function is assigned in game data.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0612.

#### S0589 — Village garden element: blue_veggie

[Preview](previews/S0589.png) · **Sheet:** 7 × 5 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/blue_veggie.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0612.

#### S0590 — Village garden element: blue_veggie_2

[Preview](previews/S0590.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/blue_veggie_2.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0612.

#### S0591 — Village garden element: farm_spot_dry

[Preview](previews/S0591.png) · **Sheet:** 9 × 8 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/farm_spot_dry.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0612.

#### S0592 — Village garden element: farm_spot_wet

[Preview](previews/S0592.png) · **Sheet:** 9 × 8 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/farm_spot_wet.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0612.

#### S0593 — Village garden element: orange_veggie

[Preview](previews/S0593.png) · **Sheet:** 7 × 5 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/orange_veggie.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0594, S0595, S0596, S0597, S0598, S0599, S0612.

#### S0594 — Village garden element: orange_veggie_2

[Preview](previews/S0594.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/orange_veggie_2.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0593, S0595, S0596, S0597, S0598, S0599, S0612.

#### S0595 — Village garden element: red_veggie

[Preview](previews/S0595.png) · **Sheet:** 7 × 5 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/red_veggie.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0593, S0594, S0596, S0597, S0598, S0599, S0612.

#### S0596 — Village garden element: red_veggie_2

[Preview](previews/S0596.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/red_veggie_2.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0597, S0598, S0599, S0612.

#### S0597 — Village garden element: sprout

[Preview](previews/S0597.png) · **Sheet:** 7 × 3 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/sprout.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0598, S0599, S0612.

#### S0598 — Village garden element: white_veggie

[Preview](previews/S0598.png) · **Sheet:** 7 × 5 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/white_veggie.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0599, S0612.

#### S0599 — Village garden element: white_veggie_2

[Preview](previews/S0599.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Farm/white_veggie_2.png`

**Belongs with:** farm-crops. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Small gardens, growth states and wet/dry soil.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0459, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0612.

#### S0600 — Village scenery: bench

[Preview](previews/S0600.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Other/bench.png`

**Belongs with:** village-environment. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Village landmarks and interactions.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0601, S0605, S0612.

#### S0601 — Village scenery: mailbox

[Preview](previews/S0601.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Other/mailbox.png`

**Belongs with:** village-environment. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Village landmarks and interactions.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0600, S0605, S0612.

#### S0605 — Village scenery: streetlight

[Preview](previews/S0605.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Other/streetlight.png`

**Belongs with:** village-environment. **Companion groups:** village-buildings, village-interior, village-npcs.

**Use:** Village landmarks and interactions.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0600, S0601, S0612.

### Enemies


#### S0051 — Goblin: Goblin_bow_v2

[Preview](previews/S0051.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TAP_Enemies_v2.zip` → `TAP_Enemies_v2/Goblin/Goblin_bow_v2.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 1.

**Related IDs:** S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0052 — Goblin: Goblin_idle_v2

[Preview](previews/S0052.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TAP_Enemies_v2.zip` → `TAP_Enemies_v2/Goblin/Goblin_idle_v2.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0053 — Goblin: Goblin_walk_v2

[Preview](previews/S0053.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TAP_Enemies_v2.zip` → `TAP_Enemies_v2/Goblin/Goblin_walk_v2.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0054 — Skeleton: Skel_idle_v2

[Preview](previews/S0054.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TAP_Enemies_v2.zip` → `TAP_Enemies_v2/Skel/Skel_idle_v2.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 1.

**Related IDs:** S0055, S0226, S0227, S0228, S0229, S0230, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0055 — Skeleton: Skel_walk_v2

[Preview](previews/S0055.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TAP_Enemies_v2.zip` → `TAP_Enemies_v2/Skel/Skel_walk_v2.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 1.

**Related IDs:** S0054, S0226, S0227, S0228, S0229, S0230, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0134 — Zombie: Zombie_idle_v2

[Preview](previews/S0134.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TDP_zombie_v2.zip` → `TDP_zombie_v2/Zombie/Zombie_idle_v2.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 2.

**Related IDs:** S0135, S0390, S0391, S0392, S0393, S0394, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0135 — Zombie: Zombie_walk_v2

[Preview](previews/S0135.png) · **Sheet:** 64 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `TDP_zombie_v2.zip` → `TDP_zombie_v2/Zombie/Zombie_walk_v2.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Preferred v2 enemy sheet. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0390, S0391, S0392, S0393, S0394, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0213 — Goblin: Goblin_bow_down

[Preview](previews/S0213.png) · **Sheet:** 96 × 18 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Bow/Goblin_bow_down.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0214 — Goblin: Goblin_bow_left

[Preview](previews/S0214.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Bow/Goblin_bow_left.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0215 — Goblin: Goblin_bow_right

[Preview](previews/S0215.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Bow/Goblin_bow_right.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0216 — Goblin: Goblin_bow_up

[Preview](previews/S0216.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Bow/Goblin_bow_up.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0217 — Goblin: Goblin_4sides

[Preview](previews/S0217.png) · **Sheet:** 64 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Goblin_4sides.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0218 — Goblin: Goblin_idle_down

[Preview](previews/S0218.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Idle/Goblin_idle_down.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0219, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0219 — Goblin: Goblin_idle_left

[Preview](previews/S0219.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Idle/Goblin_idle_left.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0220, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0220 — Goblin: Goblin_idle_right

[Preview](previews/S0220.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Idle/Goblin_idle_right.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0221, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0221 — Goblin: Goblin_idle_up

[Preview](previews/S0221.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Idle/Goblin_idle_up.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0222, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0222 — Goblin: Goblin_walk_down

[Preview](previews/S0222.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Walk/Goblin_walk_down.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0223, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0223 — Goblin: Goblin_walk_left

[Preview](previews/S0223.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Walk/Goblin_walk_left.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0224, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0224 — Goblin: Goblin_walk_right

[Preview](previews/S0224.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Walk/Goblin_walk_right.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0225, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0225 — Goblin: Goblin_walk_up

[Preview](previews/S0225.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Enemies/Goblin/Walk/Goblin_walk_up.png`

**Belongs with:** enemy-goblin. **Companion groups:** biome-forest, item-arrow.

**Use:** Ranged archer; pair bow action with arrow projectile.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Related IDs:** S0051, S0052, S0053, S0213, S0214, S0215, S0216, S0217, S0218, S0219, S0220, S0221, S0222, S0223, S0224, S0244, S0245, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0226 — Skeleton: Skel_idle_down

[Preview](previews/S0226.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Idle/Skel_idle_down.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0227, S0228, S0229, S0230, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0227 — Skeleton: Skel_idle_left

[Preview](previews/S0227.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Idle/Skel_idle_left.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0228, S0229, S0230, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0228 — Skeleton: Skel_idle_right

[Preview](previews/S0228.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Idle/Skel_idle_right.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0229, S0230, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0229 — Skeleton: Skel_idle_up

[Preview](previews/S0229.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Idle/Skel_idle_up.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0230, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0230 — Skeleton: Skel_4Sides

[Preview](previews/S0230.png) · **Sheet:** 64 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Skel_4Sides.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0229, S0231, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0231 — Skeleton: Skel_walk_down

[Preview](previews/S0231.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Walk/Skel_walk_down.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0229, S0230, S0232, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0232 — Skeleton: Skel_walk_left

[Preview](previews/S0232.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Walk/Skel_walk_left.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0229, S0230, S0231, S0233, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0233 — Skeleton: Skel_walk_right

[Preview](previews/S0233.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Walk/Skel_walk_right.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0229, S0230, S0231, S0232, S0234, S0412, S0413, S0414, S0415, S0416.

#### S0234 — Skeleton: Skel_walk_up

[Preview](previews/S0234.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack.zip` → `Tiny Adventure Pack/Skeleton/Walk/Skel_walk_up.png`

**Belongs with:** enemy-skeleton. **Companion groups:** dungeon-room.

**Use:** Basic melee pursuer.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 9.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0229, S0230, S0231, S0232, S0233, S0412, S0413, S0414, S0415, S0416.

#### S0282 — Flower monster, recolours and labelled animation sections

[Preview](previews/S0282.png) · **Sheet:** 320 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Monsters/Evil_Flower.png`

**Belongs with:** enemy-evil-flower. **Companion groups:** biome-forest.

**Use:** Stationary or rooted ranged enemy guarding a clearing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0283 — Autumn ghost, recolours and labelled animation sections

[Preview](previews/S0283.png) · **Sheet:** 384 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Monsters/Fall_Ghost.png`

**Belongs with:** enemy-fall-ghost. **Companion groups:** biome-forest.

**Use:** Ambush or ranged encounter in autumn woods.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0284 — Festive goblin, recolours and labelled animation sections

[Preview](previews/S0284.png) · **Sheet:** 272 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Monsters/Santa_goblin.png`

**Belongs with:** enemy-santa-goblin. **Companion groups:** biome-winter, npc-santa.

**Use:** Optional winter encounters and seasonal mini-events.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0281, S0289, S0294, S0303.

#### S0285 — Vulture idle, flight, attack, hit and death sections

[Preview](previews/S0285.png) · **Sheet:** 224 × 112 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Monsters/Vulture.png`

**Belongs with:** enemy-vulture. **Companion groups:** biome-desert.

**Use:** Flying desert enemy; use windup before a swoop.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0275, S0276, S0280, S0290, S0298, S0299.

#### S0368 — Bat: Bat_left

[Preview](previews/S0368.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Bat/Bat_left.png`

**Belongs with:** enemy-bat. **Companion groups:** dungeon-room.

**Use:** Flying swooper.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0369, S0412, S0413, S0414, S0415, S0416.

#### S0369 — Bat: Bat_right

[Preview](previews/S0369.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Bat/Bat_right.png`

**Belongs with:** enemy-bat. **Companion groups:** dungeon-room.

**Use:** Flying swooper.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0368, S0412, S0413, S0414, S0415, S0416.

#### S0370 — Rat: Rat_down

[Preview](previews/S0370.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Rat/Rat_down.png`

**Belongs with:** enemy-rat. **Companion groups:** dungeon-room.

**Use:** Fast small ground enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0371, S0372, S0373, S0412, S0413, S0414, S0415, S0416.

#### S0371 — Rat: Rat_left

[Preview](previews/S0371.png) · **Sheet:** 38 × 11 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Rat/Rat_left.png`

**Belongs with:** enemy-rat. **Companion groups:** dungeon-room.

**Use:** Fast small ground enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0370, S0372, S0373, S0412, S0413, S0414, S0415, S0416.

#### S0372 — Rat: Rat_right

[Preview](previews/S0372.png) · **Sheet:** 38 × 11 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Rat/Rat_right.png`

**Belongs with:** enemy-rat. **Companion groups:** dungeon-room.

**Use:** Fast small ground enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0370, S0371, S0373, S0412, S0413, S0414, S0415, S0416.

#### S0373 — Rat: Rat_up

[Preview](previews/S0373.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Rat/Rat_up.png`

**Belongs with:** enemy-rat. **Companion groups:** dungeon-room.

**Use:** Fast small ground enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0370, S0371, S0372, S0412, S0413, S0414, S0415, S0416.

#### S0374 — Slime: Slime_blue_down

[Preview](previews/S0374.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_blue_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0375 — Slime: Slime_blue_up

[Preview](previews/S0375.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_blue_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0376 — Slime: Slime_green_down

[Preview](previews/S0376.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_green_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0377 — Slime: Slime_green_up

[Preview](previews/S0377.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_green_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0378 — Slime: Slime_orange_down

[Preview](previews/S0378.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_orange_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0379 — Slime: Slime_orange_up

[Preview](previews/S0379.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_orange_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0380 — Slime: Slime_pink_down

[Preview](previews/S0380.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_pink_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0381 — Slime: Slime_pink_up

[Preview](previews/S0381.png) · **Sheet:** 78 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Normal/Slime_pink_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0382 — Slime: Tiny_Slime_blue_down

[Preview](previews/S0382.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_blue_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0383, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0383 — Slime: Tiny_Slime_blue_up

[Preview](previews/S0383.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_blue_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0384, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0384 — Slime: Tiny_Slime_green_down

[Preview](previews/S0384.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_green_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0385, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0385 — Slime: Tiny_Slime_green_up

[Preview](previews/S0385.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_green_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0386, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0386 — Slime: Tiny_Slime_orange_down

[Preview](previews/S0386.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_orange_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0387, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0387 — Slime: Tiny_Slime_orange_up

[Preview](previews/S0387.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_orange_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0388, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0388 — Slime: Tiny_Slime_pink_down

[Preview](previews/S0388.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_pink_down.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0389, S0412, S0413, S0414, S0415, S0416.

#### S0389 — Slime: Tiny_Slime_pink_up

[Preview](previews/S0389.png) · **Sheet:** 18 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Slime/Tiny/Tiny_Slime_pink_up.png`

**Belongs with:** enemy-slime. **Companion groups:** dungeon-room.

**Use:** Hopping enemy; normal/tiny sizes and four colours are variations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0374, S0375, S0376, S0377, S0378, S0379, S0380, S0381, S0382, S0383, S0384, S0385, S0386, S0387, S0388, S0412, S0413, S0414, S0415, S0416.

#### S0390 — Zombie: Zombie_idle_down

[Preview](previews/S0390.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Idle/Zombie_idle_down.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0391, S0392, S0393, S0394, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0391 — Zombie: Zombie_idle_left

[Preview](previews/S0391.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Idle/Zombie_idle_left.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0392, S0393, S0394, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0392 — Zombie: Zombie_idle_right

[Preview](previews/S0392.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Idle/Zombie_idle_right.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0391, S0393, S0394, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0393 — Zombie: Zombie_idle_up

[Preview](previews/S0393.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Idle/Zombie_idle_up.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0391, S0392, S0394, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0394 — Zombie: Zombie_walk_down

[Preview](previews/S0394.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Walk/Zombie_walk_down.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0391, S0392, S0393, S0395, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0395 — Zombie: Zombie_walk_left

[Preview](previews/S0395.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Walk/Zombie_walk_left.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0391, S0392, S0393, S0394, S0396, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0396 — Zombie: Zombie_walk_right

[Preview](previews/S0396.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Walk/Zombie_walk_right.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0391, S0392, S0393, S0394, S0395, S0397, S0412, S0413, S0414, S0415, S0416.

#### S0397 — Zombie: Zombie_walk_up

[Preview](previews/S0397.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Enemies/Zombie/Walk/Zombie_walk_up.png`

**Belongs with:** enemy-zombie. **Companion groups:** dungeon-room.

**Use:** Slow pressure enemy.

**Version:** Legacy enemy; prefer matching v2 sheet where available. **Exact source occurrences:** 2.

**Related IDs:** S0134, S0135, S0390, S0391, S0392, S0393, S0394, S0395, S0396, S0412, S0413, S0414, S0415, S0416.

#### S0436 — Labelled toad animation sheet with colour variants

[Preview](previews/S0436.png) · **Sheet:** 224 × 336 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Toad_16x16.png`

**Belongs with:** enemy-toad. **Companion groups:** biome-forest.

**Use:** Leaping or close-range woodland enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0437 — Labelled bear animation sheet with colour variants

[Preview](previews/S0437.png) · **Sheet:** 256 × 272 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Bear_16x16.png`

**Belongs with:** enemy-bear. **Companion groups:** biome-forest.

**Use:** Heavy close-range woodland threat.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0438 — Labelled beholder animation sheet with colour variants

[Preview](previews/S0438.png) · **Sheet:** 384 × 336 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Beholder_16x16.png`

**Belongs with:** enemy-beholder. **Companion groups:** dungeon-room.

**Use:** Eye monster with ranged projectile pressure.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0412, S0413, S0414, S0415, S0416.

#### S0439 — Labelled creature animation sheet with colour variants

[Preview](previews/S0439.png) · **Sheet:** 256 × 336 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Creature_16x16.png`

**Belongs with:** enemy-creature. **Companion groups:** castle-room.

**Use:** Horned creature; candidate bruiser or elite.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0643.

#### S0440 — Labelled ghost animation sheet with colour variants

[Preview](previews/S0440.png) · **Sheet:** 256 × 400 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Ghost_16x16.png`

**Belongs with:** enemy-ghost. **Companion groups:** dungeon-room.

**Use:** Phasing or floating enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0412, S0413, S0414, S0415, S0416.

#### S0441 — Labelled imp animation sheet with colour variants

[Preview](previews/S0441.png) · **Sheet:** 320 × 336 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Imp_16x16.png`

**Belongs with:** enemy-imp. **Companion groups:** castle-room.

**Use:** Fast ranged skirmisher.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0643.

#### S0442 — Labelled mushrooms animation sheet with colour variants

[Preview](previews/S0442.png) · **Sheet:** 320 × 400 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Mushrooms_16x16.png`

**Belongs with:** enemy-mushrooms. **Companion groups:** biome-forest.

**Use:** Mushroom creature; candidate spore/projectile enemy.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0443 — Labelled necromancer animation sheet with colour variants

[Preview](previews/S0443.png) · **Sheet:** 256 × 272 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Necromancer_16x16.png`

**Belongs with:** enemy-necromancer. **Companion groups:** enemy-skeleton.

**Use:** Caster; possible summoner or elite.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0054, S0055, S0226, S0227, S0228, S0229, S0230, S0231, S0232, S0233, S0234.

#### S0444 — Labelled shadow animation sheet with colour variants

[Preview](previews/S0444.png) · **Sheet:** 256 × 336 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Shadow_16x16.png`

**Belongs with:** enemy-shadow. **Companion groups:** dungeon-room.

**Use:** Dark silhouette creature for ambush encounters.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0412, S0413, S0414, S0415, S0416.

#### S0445 — Labelled spider animation sheet with colour variants

[Preview](previews/S0445.png) · **Sheet:** 256 × 336 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Enemies Vol1.zip` → `Spider_16x16.png`

**Belongs with:** enemy-spider. **Companion groups:** biome-forest.

**Use:** Small crawling enemy for webs/ambush encounters.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Header labels and action blocks are baked into the PNG. Exclude label rows from runtime frames; do not assume all actions have equal frame counts or every recolour is a new species. Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0628 — Crowned mouth/tongue boss: Boss_Bite_32x32

[Preview](previews/S0628.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/BOSS/Boss_Bite_32x32.png`

**Belongs with:** enemy-castle-boss. **Companion groups:** castle-room, castle-throne.

**Use:** Boss encounter using bite, tongue extension, movement and death phases.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Source About Boss.txt confirms mixed frame sizes. Divided tongue components permit variable attack length. Death last frame may be held.

**Related IDs:** S0629, S0630, S0631, S0632, S0633, S0642, S0643.

#### S0629 — Crowned mouth/tongue boss: Boss_Death_32x48

[Preview](previews/S0629.png) · **Sheet:** 192 × 48 px · **Suggested cells:** 32 × 48

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/BOSS/Boss_Death_32x48.png`

**Belongs with:** enemy-castle-boss. **Companion groups:** castle-room, castle-throne.

**Use:** Boss encounter using bite, tongue extension, movement and death phases.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Source About Boss.txt confirms mixed frame sizes. Divided tongue components permit variable attack length. Death last frame may be held.

**Related IDs:** S0628, S0630, S0631, S0632, S0633, S0642, S0643.

#### S0630 — Crowned mouth/tongue boss: Boss_idle_32x32

[Preview](previews/S0630.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/BOSS/Boss_idle_32x32.png`

**Belongs with:** enemy-castle-boss. **Companion groups:** castle-room, castle-throne.

**Use:** Boss encounter using bite, tongue extension, movement and death phases.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Source About Boss.txt confirms mixed frame sizes. Divided tongue components permit variable attack length. Death last frame may be held.

**Related IDs:** S0628, S0629, S0631, S0632, S0633, S0642, S0643.

#### S0631 — Crowned mouth/tongue boss: Boss_TongueAttack_64x64

[Preview](previews/S0631.png) · **Sheet:** 512 × 224 px · **Suggested cells:** 64 × 64

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/BOSS/Boss_TongueAttack_64x64.png`

**Belongs with:** enemy-castle-boss. **Companion groups:** castle-room, castle-throne.

**Use:** Boss encounter using bite, tongue extension, movement and death phases.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Source About Boss.txt confirms mixed frame sizes. Divided tongue components permit variable attack length. Death last frame may be held. Filename says 64x64 but sheet height is 224, not divisible by 64; verify padding/rectangles. Divided tongue alternative is available. Sheet dimensions do not divide evenly by suggested cell size; explicit rectangles required.

**Related IDs:** S0628, S0629, S0630, S0632, S0633, S0642, S0643.

#### S0632 — Crowned mouth/tongue boss: Boss_Walk_32x32

[Preview](previews/S0632.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/BOSS/Boss_Walk_32x32.png`

**Belongs with:** enemy-castle-boss. **Companion groups:** castle-room, castle-throne.

**Use:** Boss encounter using bite, tongue extension, movement and death phases.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Source About Boss.txt confirms mixed frame sizes. Divided tongue components permit variable attack length. Death last frame may be held.

**Related IDs:** S0628, S0629, S0630, S0631, S0633, S0642, S0643.

#### S0633 — Crowned mouth/tongue boss: Tongue_Attack_divided_32x32

[Preview](previews/S0633.png) · **Sheet:** 128 × 96 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/BOSS/Tongue_Attack_divided_32x32.png`

**Belongs with:** enemy-castle-boss. **Companion groups:** castle-room, castle-throne.

**Use:** Boss encounter using bite, tongue extension, movement and death phases.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Source About Boss.txt confirms mixed frame sizes. Divided tongue components permit variable attack length. Death last frame may be held.

**Related IDs:** S0628, S0629, S0630, S0631, S0632, S0642, S0643.

#### S0634 — Chest monster closed, awakening and attack poses

[Preview](previews/S0634.png) · **Sheet:** 64 × 48 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/Mimic_16x16.png`

**Belongs with:** enemy-mimic. **Companion groups:** item-chest, castle-room.

**Use:** Treasure-room surprise with a visible tell before attacking.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0255, S0398, S0615, S0643.

#### S0635 — Armoured soldier directional action sheet

[Preview](previews/S0635.png) · **Sheet:** 416 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Enemies/Soldier_32x32.png`

**Belongs with:** enemy-soldier. **Companion groups:** castle-room, item-shield.

**Use:** Guard encounters and shield/spacing combat.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 32x32 cells; action timing and hitboxes still require definition.

**Related IDs:** S0248, S0249, S0643.

### Hero animations


#### S0001 — Hero 1: hit

[Preview](previews/S0001.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char1/Bump_Hit_16x16.png`

**Belongs with:** hero-1, hero-hit. **Companion groups:** hero-1.

**Use:** Four directional hit/bump poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0003, S0004, S0005, S0006, S0007, S0013, S0019, S0025, S0031, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0002 — Hero 1: swim idle

[Preview](previews/S0002.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char1/Char1_Idle_Swim_16x16.png`

**Belongs with:** hero-1, hero-swim. **Companion groups:** hero-1, coast-water.

**Use:** Tread water.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0003, S0004, S0005, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0003 — Hero 1: pull

[Preview](previews/S0003.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char1/Char1_Pull_16x16.png`

**Belongs with:** hero-1, hero-push-pull. **Companion groups:** hero-1, puzzle-crates.

**Use:** Pull crates and reveal routes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0004, S0005, S0006, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0399, S0400, S0616, S0617.

#### S0004 — Hero 1: push

[Preview](previews/S0004.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char1/Char1_Push_16x16.png`

**Belongs with:** hero-1, hero-push-pull. **Companion groups:** hero-1, puzzle-crates.

**Use:** Push crates and environmental obstacles.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0005, S0006, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0399, S0400, S0616, S0617.

#### S0005 — Hero 1: roll

[Preview](previews/S0005.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char1/Char1_Roll_16x16.png`

**Belongs with:** hero-1, hero-roll. **Companion groups:** hero-1.

**Use:** Dodge roll or movement burst; invulnerability is a design choice.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0006, S0011, S0017, S0023, S0029, S0035, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0006 — Hero 1: swim

[Preview](previews/S0006.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char1/Char1_Swim_16x16.png`

**Belongs with:** hero-1, hero-swim. **Companion groups:** hero-1, coast-water.

**Use:** Water movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0007 — Hero 2: hit

[Preview](previews/S0007.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char2/Char2_Bump_Hit_16x16.png`

**Belongs with:** hero-2, hero-hit. **Companion groups:** hero-2.

**Use:** Four directional hit/bump poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0008, S0009, S0010, S0011, S0012, S0013, S0019, S0025, S0031, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0008 — Hero 2: swim idle

[Preview](previews/S0008.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char2/Char2_Idle_Swim_16x16.png`

**Belongs with:** hero-2, hero-swim. **Companion groups:** hero-2, coast-water.

**Use:** Tread water.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0007, S0009, S0010, S0011, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0009 — Hero 2: pull

[Preview](previews/S0009.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char2/Char2_Pull_16x16.png`

**Belongs with:** hero-2, hero-push-pull. **Companion groups:** hero-2, puzzle-crates.

**Use:** Pull crates and reveal routes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0007, S0008, S0010, S0011, S0012, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0010 — Hero 2: push

[Preview](previews/S0010.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char2/Char2_Push_16x16.png`

**Belongs with:** hero-2, hero-push-pull. **Companion groups:** hero-2, puzzle-crates.

**Use:** Push crates and environmental obstacles.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0007, S0008, S0009, S0011, S0012, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0011 — Hero 2: roll

[Preview](previews/S0011.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char2/Char2_Roll_16x16.png`

**Belongs with:** hero-2, hero-roll. **Companion groups:** hero-2.

**Use:** Dodge roll or movement burst; invulnerability is a design choice.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0005, S0007, S0008, S0009, S0010, S0012, S0017, S0023, S0029, S0035, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0012 — Hero 2: swim

[Preview](previews/S0012.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char2/Char2_Swim_16x16.png`

**Belongs with:** hero-2, hero-swim. **Companion groups:** hero-2, coast-water.

**Use:** Water movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0007, S0008, S0009, S0010, S0011, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0013 — Hero 3: hit

[Preview](previews/S0013.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char3/Char3_Bump_Hit_16x16.png`

**Belongs with:** hero-3, hero-hit. **Companion groups:** hero-3.

**Use:** Four directional hit/bump poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0007, S0014, S0015, S0016, S0017, S0018, S0019, S0025, S0031, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0620, S0621.

#### S0014 — Hero 3: swim idle

[Preview](previews/S0014.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char3/Char3_Idle_Swim_16x16.png`

**Belongs with:** hero-3, hero-swim. **Companion groups:** hero-3, coast-water.

**Use:** Tread water.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0013, S0015, S0016, S0017, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0620, S0621.

#### S0015 — Hero 3: pull

[Preview](previews/S0015.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char3/Char3_Pull_16x16.png`

**Belongs with:** hero-3, hero-push-pull. **Companion groups:** hero-3, puzzle-crates.

**Use:** Pull crates and reveal routes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0013, S0014, S0016, S0017, S0018, S0021, S0022, S0027, S0028, S0033, S0034, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0399, S0400, S0620, S0621.

#### S0016 — Hero 3: push

[Preview](previews/S0016.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char3/Char3_Push_16x16.png`

**Belongs with:** hero-3, hero-push-pull. **Companion groups:** hero-3, puzzle-crates.

**Use:** Push crates and environmental obstacles.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0013, S0014, S0015, S0017, S0018, S0021, S0022, S0027, S0028, S0033, S0034, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0399, S0400, S0620, S0621.

#### S0017 — Hero 3: roll

[Preview](previews/S0017.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char3/Char3_Roll_16x16.png`

**Belongs with:** hero-3, hero-roll. **Companion groups:** hero-3.

**Use:** Dodge roll or movement burst; invulnerability is a design choice.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0005, S0011, S0013, S0014, S0015, S0016, S0018, S0023, S0029, S0035, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0620, S0621.

#### S0018 — Hero 3: swim

[Preview](previews/S0018.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char3/Char3_Swim_16x16.png`

**Belongs with:** hero-3, hero-swim. **Companion groups:** hero-3, coast-water.

**Use:** Water movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0013, S0014, S0015, S0016, S0017, S0020, S0024, S0026, S0030, S0032, S0036, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0620, S0621.

#### S0019 — Hero 4: hit

[Preview](previews/S0019.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char4/Char4_Bump_Hit_16x16.png`

**Belongs with:** hero-4, hero-hit. **Companion groups:** hero-4.

**Use:** Four directional hit/bump poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0007, S0013, S0020, S0021, S0022, S0023, S0024, S0025, S0031, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0622, S0623.

#### S0020 — Hero 4: swim idle

[Preview](previews/S0020.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char4/Char4_Idle_Swim_16x16.png`

**Belongs with:** hero-4, hero-swim. **Companion groups:** hero-4, coast-water.

**Use:** Tread water.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0019, S0021, S0022, S0023, S0024, S0026, S0030, S0032, S0036, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0622, S0623.

#### S0021 — Hero 4: pull

[Preview](previews/S0021.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char4/Char4_Pull_16x16.png`

**Belongs with:** hero-4, hero-push-pull. **Companion groups:** hero-4, puzzle-crates.

**Use:** Pull crates and reveal routes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0019, S0020, S0022, S0023, S0024, S0027, S0028, S0033, S0034, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0399, S0400, S0622, S0623.

#### S0022 — Hero 4: push

[Preview](previews/S0022.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char4/Char4_Push_16x16.png`

**Belongs with:** hero-4, hero-push-pull. **Companion groups:** hero-4, puzzle-crates.

**Use:** Push crates and environmental obstacles.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0019, S0020, S0021, S0023, S0024, S0027, S0028, S0033, S0034, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0399, S0400, S0622, S0623.

#### S0023 — Hero 4: roll

[Preview](previews/S0023.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char4/Char4_Roll_16x16.png`

**Belongs with:** hero-4, hero-roll. **Companion groups:** hero-4.

**Use:** Dodge roll or movement burst; invulnerability is a design choice.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0005, S0011, S0017, S0019, S0020, S0021, S0022, S0024, S0029, S0035, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0622, S0623.

#### S0024 — Hero 4: swim

[Preview](previews/S0024.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char4/Char4_Swim_16x16.png`

**Belongs with:** hero-4, hero-swim. **Companion groups:** hero-4, coast-water.

**Use:** Water movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0019, S0020, S0021, S0022, S0023, S0026, S0030, S0032, S0036, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0622, S0623.

#### S0025 — Hero 5: hit

[Preview](previews/S0025.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char5/Char5_Bump_Hit_16x16.png`

**Belongs with:** hero-5, hero-hit. **Companion groups:** hero-5.

**Use:** Four directional hit/bump poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0007, S0013, S0019, S0026, S0027, S0028, S0029, S0030, S0031, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0624, S0625.

#### S0026 — Hero 5: swim idle

[Preview](previews/S0026.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char5/Char5_Idle_Swim_16x16.png`

**Belongs with:** hero-5, hero-swim. **Companion groups:** hero-5, coast-water.

**Use:** Tread water.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0025, S0027, S0028, S0029, S0030, S0032, S0036, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0624, S0625.

#### S0027 — Hero 5: pull

[Preview](previews/S0027.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char5/Char5_Pull_16x16.png`

**Belongs with:** hero-5, hero-push-pull. **Companion groups:** hero-5, puzzle-crates.

**Use:** Pull crates and reveal routes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0025, S0026, S0028, S0029, S0030, S0033, S0034, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0399, S0400, S0624, S0625.

#### S0028 — Hero 5: push

[Preview](previews/S0028.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char5/Char5_Push_16x16.png`

**Belongs with:** hero-5, hero-push-pull. **Companion groups:** hero-5, puzzle-crates.

**Use:** Push crates and environmental obstacles.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0025, S0026, S0027, S0029, S0030, S0033, S0034, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0399, S0400, S0624, S0625.

#### S0029 — Hero 5: roll

[Preview](previews/S0029.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char5/Char5_Roll_16x16.png`

**Belongs with:** hero-5, hero-roll. **Companion groups:** hero-5.

**Use:** Dodge roll or movement burst; invulnerability is a design choice.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0005, S0011, S0017, S0023, S0025, S0026, S0027, S0028, S0030, S0035, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0624, S0625.

#### S0030 — Hero 5: swim

[Preview](previews/S0030.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char5/Char5_Swim_16x16.png`

**Belongs with:** hero-5, hero-swim. **Companion groups:** hero-5, coast-water.

**Use:** Water movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0025, S0026, S0027, S0028, S0029, S0032, S0036, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0624, S0625.

#### S0031 — Hero 6: hit

[Preview](previews/S0031.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char6/Char6_Bump_Hit_16x16.png`

**Belongs with:** hero-6, hero-hit. **Companion groups:** hero-6.

**Use:** Four directional hit/bump poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0007, S0013, S0019, S0025, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0626, S0627.

#### S0032 — Hero 6: swim idle

[Preview](previews/S0032.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char6/Char6_Idle_Swim_16x16.png`

**Belongs with:** hero-6, hero-swim. **Companion groups:** hero-6, coast-water.

**Use:** Tread water.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0031, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0626, S0627.

#### S0033 — Hero 6: pull

[Preview](previews/S0033.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char6/Char6_Pull_16x16.png`

**Belongs with:** hero-6, hero-push-pull. **Companion groups:** hero-6, puzzle-crates.

**Use:** Pull crates and reveal routes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0031, S0032, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0399, S0400, S0626, S0627.

#### S0034 — Hero 6: push

[Preview](previews/S0034.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char6/Char6_Push_16x16.png`

**Belongs with:** hero-6, hero-push-pull. **Companion groups:** hero-6, puzzle-crates.

**Use:** Push crates and environmental obstacles.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0031, S0032, S0033, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0399, S0400, S0626, S0627.

#### S0035 — Hero 6: roll

[Preview](previews/S0035.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char6/Char6_Roll_16x16.png`

**Belongs with:** hero-6, hero-roll. **Companion groups:** hero-6.

**Use:** Dodge roll or movement burst; invulnerability is a design choice.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0005, S0011, S0017, S0023, S0029, S0031, S0032, S0033, S0034, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0626, S0627.

#### S0036 — Hero 6: swim

[Preview](previews/S0036.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Additional Animations.zip` → `Additional Animations/Char6/Char6_Swim_16x16.png`

**Belongs with:** hero-6, hero-swim. **Companion groups:** hero-6, coast-water.

**Use:** Water movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0031, S0032, S0033, S0034, S0035, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0321, S0322, S0323, S0324, S0325, S0326, S0327, S0626, S0627.

#### S0056 — Hero 1: directions

[Preview](previews/S0056.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_4_sides_16px.png`

**Belongs with:** hero-1, hero-directions. **Companion groups:** hero-1.

**Use:** Static four-direction reference poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0057, S0058, S0059, S0060, S0064, S0068, S0072, S0076, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0168, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0194, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0057 — Hero 1: idle

[Preview](previews/S0057.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_idle_16px.png`

**Belongs with:** hero-1, hero-idle. **Companion groups:** hero-1.

**Use:** Standing and breathing.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0058, S0059, S0061, S0065, S0069, S0073, S0077, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0197, S0198, S0199, S0200, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0058 — Hero 1: sword

[Preview](previews/S0058.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_Sword_32px.png`

**Belongs with:** hero-1, hero-sword. **Companion groups:** hero-1, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0059, S0062, S0066, S0070, S0074, S0078, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0190, S0191, S0192, S0193, S0250, S0251, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0059 — Hero 1: walk

[Preview](previews/S0059.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_walk_16px.png`

**Belongs with:** hero-1, hero-walk. **Companion groups:** hero-1.

**Use:** Ground movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0063, S0067, S0071, S0075, S0079, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0209, S0210, S0211, S0212, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0060 — Hero 2: directions

[Preview](previews/S0060.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_4_sides_16px.png`

**Belongs with:** hero-2, hero-directions. **Companion groups:** hero-2.

**Use:** Static four-direction reference poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0056, S0061, S0062, S0063, S0064, S0068, S0072, S0076, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0168, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0061 — Hero 2: idle

[Preview](previews/S0061.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_idle_16px.png`

**Belongs with:** hero-2, hero-idle. **Companion groups:** hero-2.

**Use:** Standing and breathing.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0057, S0060, S0062, S0063, S0065, S0069, S0073, S0077, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0170, S0171, S0172, S0173, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0062 — Hero 2: sword

[Preview](previews/S0062.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_Sword_32px.png`

**Belongs with:** hero-2, hero-sword. **Companion groups:** hero-2, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0058, S0060, S0061, S0063, S0066, S0070, S0074, S0078, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0164, S0165, S0166, S0167, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0250, S0251, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0063 — Hero 2: walk

[Preview](previews/S0063.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_walk_16px.png`

**Belongs with:** hero-2, hero-walk. **Companion groups:** hero-2.

**Use:** Ground movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0059, S0060, S0061, S0062, S0067, S0071, S0075, S0079, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0064 — Hero 3: directions

[Preview](previews/S0064.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_4_sides_16px.png`

**Belongs with:** hero-3, hero-directions. **Companion groups:** hero-3.

**Use:** Static four-direction reference poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0056, S0060, S0065, S0066, S0067, S0068, S0072, S0076, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0168, S0194, S0312, S0620, S0621.

#### S0065 — Hero 3: idle

[Preview](previews/S0065.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_idle_16px.png`

**Belongs with:** hero-3, hero-idle. **Companion groups:** hero-3.

**Use:** Standing and breathing.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0057, S0061, S0064, S0066, S0067, S0069, S0073, S0077, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0170, S0171, S0172, S0173, S0197, S0198, S0199, S0200, S0312, S0620, S0621.

#### S0066 — Hero 3: sword

[Preview](previews/S0066.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_Sword_32px.png`

**Belongs with:** hero-3, hero-sword. **Companion groups:** hero-3, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0058, S0062, S0064, S0065, S0067, S0070, S0074, S0078, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0164, S0165, S0166, S0167, S0190, S0191, S0192, S0193, S0250, S0251, S0312, S0620, S0621.

#### S0067 — Hero 3: walk

[Preview](previews/S0067.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_walk_16px.png`

**Belongs with:** hero-3, hero-walk. **Companion groups:** hero-3.

**Use:** Ground movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0059, S0063, S0064, S0065, S0066, S0071, S0075, S0079, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0182, S0183, S0184, S0185, S0209, S0210, S0211, S0212, S0312, S0620, S0621.

#### S0068 — Hero 4: directions

[Preview](previews/S0068.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_4_sides_16px.png`

**Belongs with:** hero-4, hero-directions. **Companion groups:** hero-4.

**Use:** Static four-direction reference poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0056, S0060, S0064, S0069, S0070, S0071, S0072, S0076, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0194, S0313, S0622, S0623.

#### S0069 — Hero 4: idle

[Preview](previews/S0069.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_idle_16px.png`

**Belongs with:** hero-4, hero-idle. **Companion groups:** hero-4.

**Use:** Standing and breathing.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0057, S0061, S0065, S0068, S0070, S0071, S0073, S0077, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0170, S0171, S0172, S0173, S0197, S0198, S0199, S0200, S0313, S0622, S0623.

#### S0070 — Hero 4: sword

[Preview](previews/S0070.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_Sword_32px.png`

**Belongs with:** hero-4, hero-sword. **Companion groups:** hero-4, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0058, S0062, S0066, S0068, S0069, S0071, S0074, S0078, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0164, S0165, S0166, S0167, S0168, S0190, S0191, S0192, S0193, S0250, S0251, S0313, S0622, S0623.

#### S0071 — Hero 4: walk

[Preview](previews/S0071.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_walk_16px.png`

**Belongs with:** hero-4, hero-walk. **Companion groups:** hero-4.

**Use:** Ground movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0059, S0063, S0067, S0068, S0069, S0070, S0075, S0079, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0182, S0183, S0184, S0185, S0209, S0210, S0211, S0212, S0313, S0622, S0623.

#### S0072 — Hero 5: directions

[Preview](previews/S0072.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_4_sides_16px.png`

**Belongs with:** hero-5, hero-directions. **Companion groups:** hero-5.

**Use:** Static four-direction reference poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0056, S0060, S0064, S0068, S0073, S0074, S0075, S0076, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0168, S0194, S0314, S0624, S0625.

#### S0073 — Hero 5: idle

[Preview](previews/S0073.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_idle_16px.png`

**Belongs with:** hero-5, hero-idle. **Companion groups:** hero-5.

**Use:** Standing and breathing.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0057, S0061, S0065, S0069, S0072, S0074, S0075, S0077, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0170, S0171, S0172, S0173, S0197, S0198, S0199, S0200, S0314, S0624, S0625.

#### S0074 — Hero 5: sword

[Preview](previews/S0074.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_Sword_32px.png`

**Belongs with:** hero-5, hero-sword. **Companion groups:** hero-5, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0058, S0062, S0066, S0070, S0072, S0073, S0075, S0078, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0164, S0165, S0166, S0167, S0190, S0191, S0192, S0193, S0250, S0251, S0314, S0624, S0625.

#### S0075 — Hero 5: walk

[Preview](previews/S0075.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_walk_16px.png`

**Belongs with:** hero-5, hero-walk. **Companion groups:** hero-5.

**Use:** Ground movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0059, S0063, S0067, S0071, S0072, S0073, S0074, S0079, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0182, S0183, S0184, S0185, S0209, S0210, S0211, S0212, S0314, S0624, S0625.

#### S0076 — Hero 6: directions

[Preview](previews/S0076.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_4_sides_16px.png`

**Belongs with:** hero-6, hero-directions. **Companion groups:** hero-6.

**Use:** Static four-direction reference poses.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0056, S0060, S0064, S0068, S0072, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0168, S0194, S0315, S0626, S0627.

#### S0077 — Hero 6: idle

[Preview](previews/S0077.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_idle_16px.png`

**Belongs with:** hero-6, hero-idle. **Companion groups:** hero-6.

**Use:** Standing and breathing.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0057, S0061, S0065, S0069, S0073, S0076, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0170, S0171, S0172, S0173, S0197, S0198, S0199, S0200, S0315, S0626, S0627.

#### S0078 — Hero 6: sword

[Preview](previews/S0078.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_Sword_32px.png`

**Belongs with:** hero-6, hero-sword. **Companion groups:** hero-6, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0058, S0062, S0066, S0070, S0074, S0076, S0077, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0164, S0165, S0166, S0167, S0190, S0191, S0192, S0193, S0250, S0251, S0315, S0626, S0627.

#### S0079 — Hero 6: walk

[Preview](previews/S0079.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_walk_16px.png`

**Belongs with:** hero-6, hero-walk. **Companion groups:** hero-6.

**Use:** Ground movement.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 8.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0059, S0063, S0067, S0071, S0075, S0076, S0077, S0078, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0182, S0183, S0184, S0185, S0209, S0210, S0211, S0212, S0315, S0626, S0627.

#### S0080 — Hero 1: bow

[Preview](previews/S0080.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char1/Char1_bow_32px.png`

**Belongs with:** hero-1, hero-bow. **Companion groups:** hero-1, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0081, S0082, S0083, S0084, S0085, S0090, S0095, S0100, S0105, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0246, S0247, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0081 — Hero 1: fall

[Preview](previews/S0081.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char1/Char1_fall_16px.png`

**Belongs with:** hero-1, hero-fall. **Companion groups:** hero-1.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0082, S0083, S0084, S0086, S0091, S0096, S0101, S0106, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0196, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0082 — Hero 1: item pose

[Preview](previews/S0082.png) · **Sheet:** 16 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_Pick_item_16px.png`

**Belongs with:** hero-1, hero-item. **Companion groups:** hero-1.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 4.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0083, S0084, S0087, S0092, S0097, S0102, S0107, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0195, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0083 — Hero 1: shield idle

[Preview](previews/S0083.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char1/Char1_shield_idle_16px.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Blocking while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0084 — Hero 1: shield walk

[Preview](previews/S0084.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char1/Char1_shield_walk_16px.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Moving while blocking.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0085 — Hero 2: bow

[Preview](previews/S0085.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char2/Char2_bow_32px.png`

**Belongs with:** hero-2, hero-bow. **Companion groups:** hero-2, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0080, S0086, S0087, S0088, S0089, S0090, S0095, S0100, S0105, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0246, S0247, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0086 — Hero 2: fall

[Preview](previews/S0086.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char2/Char2_fall_16px.png`

**Belongs with:** hero-2, hero-fall. **Companion groups:** hero-2.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0081, S0085, S0087, S0088, S0089, S0091, S0096, S0101, S0106, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0169, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0087 — Hero 2: item pose

[Preview](previews/S0087.png) · **Sheet:** 16 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_Pick_item_16px.png`

**Belongs with:** hero-2, hero-item. **Companion groups:** hero-2.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 3.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0082, S0085, S0086, S0088, S0089, S0092, S0097, S0102, S0107, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0088 — Hero 2: shield idle

[Preview](previews/S0088.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char2/Char2_shield_idle_16px.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Blocking while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0089 — Hero 2: shield walk

[Preview](previews/S0089.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char2/Char2_shield_walk_16px.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Moving while blocking.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0090 — Hero 3: bow

[Preview](previews/S0090.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char3/Char3_bow_32px.png`

**Belongs with:** hero-3, hero-bow. **Companion groups:** hero-3, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0080, S0085, S0091, S0092, S0093, S0094, S0095, S0100, S0105, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0246, S0247, S0312, S0620, S0621.

#### S0091 — Hero 3: fall

[Preview](previews/S0091.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char3/Char3_fall_16px.png`

**Belongs with:** hero-3, hero-fall. **Companion groups:** hero-3.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0081, S0086, S0090, S0092, S0093, S0094, S0096, S0101, S0106, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0169, S0196, S0312, S0620, S0621.

#### S0092 — Hero 3: item pose

[Preview](previews/S0092.png) · **Sheet:** 16 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_Pick_item_16px.png`

**Belongs with:** hero-3, hero-item. **Companion groups:** hero-3.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 3.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0082, S0087, S0090, S0091, S0093, S0094, S0097, S0102, S0107, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0195, S0312, S0620, S0621.

#### S0093 — Hero 3: shield idle

[Preview](previews/S0093.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char3/Char3_shield_idle_16px.png`

**Belongs with:** hero-3, hero-shield. **Companion groups:** hero-3, item-shield.

**Use:** Blocking while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0083, S0084, S0088, S0089, S0090, S0091, S0092, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0312, S0620, S0621.

#### S0094 — Hero 3: shield walk

[Preview](previews/S0094.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char3/Char3_shield_walk_16px.png`

**Belongs with:** hero-3, hero-shield. **Companion groups:** hero-3, item-shield.

**Use:** Moving while blocking.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0083, S0084, S0088, S0089, S0090, S0091, S0092, S0093, S0098, S0099, S0103, S0104, S0108, S0109, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0312, S0620, S0621.

#### S0095 — Hero 4: bow

[Preview](previews/S0095.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/char4/Char4_bow_32px.png`

**Belongs with:** hero-4, hero-bow. **Companion groups:** hero-4, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0080, S0085, S0090, S0096, S0097, S0098, S0099, S0100, S0105, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0160, S0161, S0162, S0163, S0168, S0186, S0187, S0188, S0189, S0246, S0247, S0313, S0622, S0623.

#### S0096 — Hero 4: fall

[Preview](previews/S0096.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/char4/Char4_fall_16px.png`

**Belongs with:** hero-4, hero-fall. **Companion groups:** hero-4.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0081, S0086, S0091, S0095, S0097, S0098, S0099, S0101, S0106, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0169, S0196, S0313, S0622, S0623.

#### S0097 — Hero 4: item pose

[Preview](previews/S0097.png) · **Sheet:** 16 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_Pick_item_16px.png`

**Belongs with:** hero-4, hero-item. **Companion groups:** hero-4.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 3.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0082, S0087, S0092, S0095, S0096, S0098, S0099, S0102, S0107, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0195, S0313, S0622, S0623.

#### S0098 — Hero 4: shield idle

[Preview](previews/S0098.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/char4/Char4_shield_idle_16px.png`

**Belongs with:** hero-4, hero-shield. **Companion groups:** hero-4, item-shield.

**Use:** Blocking while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0083, S0084, S0088, S0089, S0093, S0094, S0095, S0096, S0097, S0099, S0103, S0104, S0108, S0109, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0313, S0622, S0623.

#### S0099 — Hero 4: shield walk

[Preview](previews/S0099.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/char4/Char4_shield_walk_16px.png`

**Belongs with:** hero-4, hero-shield. **Companion groups:** hero-4, item-shield.

**Use:** Moving while blocking.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0083, S0084, S0088, S0089, S0093, S0094, S0095, S0096, S0097, S0098, S0103, S0104, S0108, S0109, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0313, S0622, S0623.

#### S0100 — Hero 5: bow

[Preview](previews/S0100.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char5/Char5_bow_32px.png`

**Belongs with:** hero-5, hero-bow. **Companion groups:** hero-5, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0080, S0085, S0090, S0095, S0101, S0102, S0103, S0104, S0105, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0246, S0247, S0314, S0624, S0625.

#### S0101 — Hero 5: fall

[Preview](previews/S0101.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char5/Char5_fall_16px.png`

**Belongs with:** hero-5, hero-fall. **Companion groups:** hero-5.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0081, S0086, S0091, S0096, S0100, S0102, S0103, S0104, S0106, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0169, S0196, S0314, S0624, S0625.

#### S0102 — Hero 5: item pose

[Preview](previews/S0102.png) · **Sheet:** 16 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_Pick_item_16px.png`

**Belongs with:** hero-5, hero-item. **Companion groups:** hero-5.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 3.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0082, S0087, S0092, S0097, S0100, S0101, S0103, S0104, S0107, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0195, S0314, S0624, S0625.

#### S0103 — Hero 5: shield idle

[Preview](previews/S0103.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char5/Char5_shield_idle_16px.png`

**Belongs with:** hero-5, hero-shield. **Companion groups:** hero-5, item-shield.

**Use:** Blocking while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0100, S0101, S0102, S0104, S0108, S0109, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0314, S0624, S0625.

#### S0104 — Hero 5: shield walk

[Preview](previews/S0104.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char5/Char5_shield_walk_16px.png`

**Belongs with:** hero-5, hero-shield. **Companion groups:** hero-5, item-shield.

**Use:** Moving while blocking.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0100, S0101, S0102, S0103, S0108, S0109, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0314, S0624, S0625.

#### S0105 — Hero 6: bow

[Preview](previews/S0105.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char6/Char6_bow_32px.png`

**Belongs with:** hero-6, hero-bow. **Companion groups:** hero-6, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0080, S0085, S0090, S0095, S0100, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0246, S0247, S0315, S0626, S0627.

#### S0106 — Hero 6: fall

[Preview](previews/S0106.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char6/Char6_fall_16px.png`

**Belongs with:** hero-6, hero-fall. **Companion groups:** hero-6.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0081, S0086, S0091, S0096, S0101, S0105, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0169, S0196, S0315, S0626, S0627.

#### S0107 — Hero 6: item pose

[Preview](previews/S0107.png) · **Sheet:** 16 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_Pick_item_16px.png`

**Belongs with:** hero-6, hero-item. **Companion groups:** hero-6.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 3.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0082, S0087, S0092, S0097, S0102, S0105, S0106, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0195, S0315, S0626, S0627.

#### S0108 — Hero 6: shield idle

[Preview](previews/S0108.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char6/Char6_shield_idle_16px.png`

**Belongs with:** hero-6, hero-shield. **Companion groups:** hero-6, item-shield.

**Use:** Blocking while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0105, S0106, S0107, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0315, S0626, S0627.

#### S0109 — Hero 6: shield walk

[Preview](previews/S0109.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TAPp_anim_v2.zip` → `TAPp_anim_v2/Animations ver2/Char6/Char6_shield_walk_16px.png`

**Belongs with:** hero-6, hero-shield. **Companion groups:** hero-6, item-shield.

**Use:** Moving while blocking.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0105, S0106, S0107, S0108, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0315, S0626, S0627.

#### S0110 — Hero 1: carry idle

[Preview](previews/S0110.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_carry_idle_16px.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0111 — Hero 1: carry walk

[Preview](previews/S0111.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_carry_walk_16px.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0112 — Hero 1: pickup

[Preview](previews/S0112.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_Pickup_16px.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0113 — Hero 1: throw

[Preview](previews/S0113.png) · **Sheet:** 32 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char1/Char1_Throw_item_16px.png`

**Belongs with:** hero-1, hero-throw. **Companion groups:** hero-1, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0117, S0121, S0125, S0129, S0133, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0616, S0617.

#### S0114 — Hero 2: carry idle

[Preview](previews/S0114.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_carry_idle_16px.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0115 — Hero 2: carry walk

[Preview](previews/S0115.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_carry_walk_16px.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0116 — Hero 2: pickup

[Preview](previews/S0116.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_Pickup_16px.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0117 — Hero 2: throw

[Preview](previews/S0117.png) · **Sheet:** 32 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char2/Char2_Throw_item_16px.png`

**Belongs with:** hero-2, hero-throw. **Companion groups:** hero-2, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0113, S0114, S0115, S0116, S0121, S0125, S0129, S0133, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0452, S0618, S0619.

#### S0118 — Hero 3: carry idle

[Preview](previews/S0118.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_carry_idle_16px.png`

**Belongs with:** hero-3, hero-carry. **Companion groups:** hero-3, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0110, S0111, S0112, S0114, S0115, S0116, S0119, S0120, S0121, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0144, S0145, S0146, S0147, S0312, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0620, S0621.

#### S0119 — Hero 3: carry walk

[Preview](previews/S0119.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_carry_walk_16px.png`

**Belongs with:** hero-3, hero-carry. **Companion groups:** hero-3, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0120, S0121, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0144, S0145, S0146, S0147, S0312, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0620, S0621.

#### S0120 — Hero 3: pickup

[Preview](previews/S0120.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_Pickup_16px.png`

**Belongs with:** hero-3, hero-carry. **Companion groups:** hero-3, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0121, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0144, S0145, S0146, S0147, S0312, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0620, S0621.

#### S0121 — Hero 3: throw

[Preview](previews/S0121.png) · **Sheet:** 32 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char3/Char3_Throw_item_16px.png`

**Belongs with:** hero-3, hero-throw. **Companion groups:** hero-3, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0113, S0117, S0118, S0119, S0120, S0125, S0129, S0133, S0144, S0145, S0146, S0147, S0312, S0344, S0345, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0620, S0621.

#### S0122 — Hero 4: carry idle

[Preview](previews/S0122.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_carry_idle_16px.png`

**Belongs with:** hero-4, hero-carry. **Companion groups:** hero-4, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0123, S0124, S0125, S0126, S0127, S0128, S0130, S0131, S0132, S0148, S0149, S0150, S0151, S0168, S0313, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0622, S0623.

#### S0123 — Hero 4: carry walk

[Preview](previews/S0123.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_carry_walk_16px.png`

**Belongs with:** hero-4, hero-carry. **Companion groups:** hero-4, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0124, S0125, S0126, S0127, S0128, S0130, S0131, S0132, S0148, S0149, S0150, S0151, S0168, S0313, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0622, S0623.

#### S0124 — Hero 4: pickup

[Preview](previews/S0124.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_Pickup_16px.png`

**Belongs with:** hero-4, hero-carry. **Companion groups:** hero-4, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0125, S0126, S0127, S0128, S0130, S0131, S0132, S0148, S0149, S0150, S0151, S0168, S0313, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0622, S0623.

#### S0125 — Hero 4: throw

[Preview](previews/S0125.png) · **Sheet:** 32 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char4/Char4_Throw_item_16px.png`

**Belongs with:** hero-4, hero-throw. **Companion groups:** hero-4, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0113, S0117, S0121, S0122, S0123, S0124, S0129, S0133, S0148, S0149, S0150, S0151, S0168, S0313, S0344, S0345, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0622, S0623.

#### S0126 — Hero 5: carry idle

[Preview](previews/S0126.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_carry_idle_16px.png`

**Belongs with:** hero-5, hero-carry. **Companion groups:** hero-5, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0127, S0128, S0129, S0130, S0131, S0132, S0152, S0153, S0154, S0155, S0314, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0624, S0625.

#### S0127 — Hero 5: carry walk

[Preview](previews/S0127.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_carry_walk_16px.png`

**Belongs with:** hero-5, hero-carry. **Companion groups:** hero-5, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0128, S0129, S0130, S0131, S0132, S0152, S0153, S0154, S0155, S0314, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0624, S0625.

#### S0128 — Hero 5: pickup

[Preview](previews/S0128.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_Pickup_16px.png`

**Belongs with:** hero-5, hero-carry. **Companion groups:** hero-5, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0129, S0130, S0131, S0132, S0152, S0153, S0154, S0155, S0314, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0624, S0625.

#### S0129 — Hero 5: throw

[Preview](previews/S0129.png) · **Sheet:** 32 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/char5/Char5_Throw_item_16px.png`

**Belongs with:** hero-5, hero-throw. **Companion groups:** hero-5, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0113, S0117, S0121, S0125, S0126, S0127, S0128, S0133, S0152, S0153, S0154, S0155, S0314, S0344, S0345, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0624, S0625.

#### S0130 — Hero 6: carry idle

[Preview](previews/S0130.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_carry_idle_16px.png`

**Belongs with:** hero-6, hero-carry. **Companion groups:** hero-6, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0626, S0627.

#### S0131 — Hero 6: carry walk

[Preview](previews/S0131.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_carry_walk_16px.png`

**Belongs with:** hero-6, hero-carry. **Companion groups:** hero-6, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0626, S0627.

#### S0132 — Hero 6: pickup

[Preview](previews/S0132.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_Pickup_16px.png`

**Belongs with:** hero-6, hero-carry. **Companion groups:** hero-6, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0133, S0156, S0157, S0158, S0159, S0315, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0626, S0627.

#### S0133 — Hero 6: throw

[Preview](previews/S0133.png) · **Sheet:** 32 × 64 px · **Suggested cells:** 16 × 16

**Source:** `TDP_anim_v2.zip` → `TDP_anim_v2/Char6/Char6_Throw_item_16px.png`

**Belongs with:** hero-6, hero-throw. **Companion groups:** hero-6, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0113, S0117, S0121, S0125, S0129, S0130, S0131, S0132, S0156, S0157, S0158, S0159, S0315, S0344, S0345, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0626, S0627.

#### S0136 — Hero 1: axe

[Preview](previews/S0136.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char1/Char_1_axe.png`

**Belongs with:** hero-1, hero-axe. **Companion groups:** hero-1, farm-tools.

**Use:** Chop wood and open forest shortcuts.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0137, S0138, S0139, S0140, S0144, S0148, S0152, S0156, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0460, S0616, S0617.

#### S0137 — Hero 1: hoe

[Preview](previews/S0137.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char1/Char_1_hoe.png`

**Belongs with:** hero-1, hero-hoe. **Companion groups:** hero-1, farm-crops.

**Use:** Prepare garden soil.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0138, S0139, S0141, S0145, S0149, S0153, S0157, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0616, S0617.

#### S0138 — Hero 1: pickaxe

[Preview](previews/S0138.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char1/Char_1_pickaxe.png`

**Belongs with:** hero-1, hero-pickaxe. **Companion groups:** hero-1, farm-resources.

**Use:** Break rocks or mine resource nodes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0139, S0142, S0146, S0150, S0154, S0158, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0458, S0616, S0617.

#### S0139 — Hero 1: wateringcan

[Preview](previews/S0139.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char1/Char_1_wateringcan.png`

**Belongs with:** hero-1, hero-wateringcan. **Companion groups:** hero-1, farm-crops.

**Use:** Water crops.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0143, S0147, S0151, S0155, S0159, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0616, S0617.

#### S0140 — Hero 2: axe

[Preview](previews/S0140.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char2/Char_2_axe.png`

**Belongs with:** hero-2, hero-axe. **Companion groups:** hero-2, farm-tools.

**Use:** Chop wood and open forest shortcuts.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0136, S0141, S0142, S0143, S0144, S0148, S0152, S0156, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0460, S0618, S0619.

#### S0141 — Hero 2: hoe

[Preview](previews/S0141.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char2/Char_2_hoe.png`

**Belongs with:** hero-2, hero-hoe. **Companion groups:** hero-2, farm-crops.

**Use:** Prepare garden soil.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0137, S0140, S0142, S0143, S0145, S0149, S0153, S0157, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0618, S0619.

#### S0142 — Hero 2: pickaxe

[Preview](previews/S0142.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char2/Char_2_pickaxe.png`

**Belongs with:** hero-2, hero-pickaxe. **Companion groups:** hero-2, farm-resources.

**Use:** Break rocks or mine resource nodes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0138, S0140, S0141, S0143, S0146, S0150, S0154, S0158, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0458, S0618, S0619.

#### S0143 — Hero 2: wateringcan

[Preview](previews/S0143.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char2/Char_2_wateringcan.png`

**Belongs with:** hero-2, hero-wateringcan. **Companion groups:** hero-2, farm-crops.

**Use:** Water crops.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0139, S0140, S0141, S0142, S0147, S0151, S0155, S0159, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0618, S0619.

#### S0144 — Hero 3: axe

[Preview](previews/S0144.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char3/Char_3_axe.png`

**Belongs with:** hero-3, hero-axe. **Companion groups:** hero-3, farm-tools.

**Use:** Chop wood and open forest shortcuts.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0136, S0140, S0145, S0146, S0147, S0148, S0152, S0156, S0312, S0460, S0620, S0621.

#### S0145 — Hero 3: hoe

[Preview](previews/S0145.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char3/Char_3_hoe.png`

**Belongs with:** hero-3, hero-hoe. **Companion groups:** hero-3, farm-crops.

**Use:** Prepare garden soil.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0137, S0141, S0144, S0146, S0147, S0149, S0153, S0157, S0312, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0620, S0621.

#### S0146 — Hero 3: pickaxe

[Preview](previews/S0146.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char3/Char_3_pickaxe.png`

**Belongs with:** hero-3, hero-pickaxe. **Companion groups:** hero-3, farm-resources.

**Use:** Break rocks or mine resource nodes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0138, S0142, S0144, S0145, S0147, S0150, S0154, S0158, S0312, S0458, S0620, S0621.

#### S0147 — Hero 3: wateringcan

[Preview](previews/S0147.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char3/Char_3_wateringcan.png`

**Belongs with:** hero-3, hero-wateringcan. **Companion groups:** hero-3, farm-crops.

**Use:** Water crops.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0139, S0143, S0144, S0145, S0146, S0151, S0155, S0159, S0312, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0620, S0621.

#### S0148 — Hero 4: axe

[Preview](previews/S0148.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/char4/Char_4_axe.png`

**Belongs with:** hero-4, hero-axe. **Companion groups:** hero-4, farm-tools.

**Use:** Chop wood and open forest shortcuts.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0136, S0140, S0144, S0149, S0150, S0151, S0152, S0156, S0168, S0313, S0460, S0622, S0623.

#### S0149 — Hero 4: hoe

[Preview](previews/S0149.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/char4/Char_4_hoe.png`

**Belongs with:** hero-4, hero-hoe. **Companion groups:** hero-4, farm-crops.

**Use:** Prepare garden soil.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0137, S0141, S0145, S0148, S0150, S0151, S0153, S0157, S0168, S0313, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0622, S0623.

#### S0150 — Hero 4: pickaxe

[Preview](previews/S0150.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/char4/Char_4_pickaxe.png`

**Belongs with:** hero-4, hero-pickaxe. **Companion groups:** hero-4, farm-resources.

**Use:** Break rocks or mine resource nodes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0138, S0142, S0146, S0148, S0149, S0151, S0154, S0158, S0168, S0313, S0458, S0622, S0623.

#### S0151 — Hero 4: wateringcan

[Preview](previews/S0151.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/char4/Char_4_wateringcan.png`

**Belongs with:** hero-4, hero-wateringcan. **Companion groups:** hero-4, farm-crops.

**Use:** Water crops.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0139, S0143, S0147, S0148, S0149, S0150, S0155, S0159, S0168, S0313, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0622, S0623.

#### S0152 — Hero 5: axe

[Preview](previews/S0152.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char5/Char_5_axe.png`

**Belongs with:** hero-5, hero-axe. **Companion groups:** hero-5, farm-tools.

**Use:** Chop wood and open forest shortcuts.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0136, S0140, S0144, S0148, S0153, S0154, S0155, S0156, S0314, S0460, S0624, S0625.

#### S0153 — Hero 5: hoe

[Preview](previews/S0153.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char5/Char_5_hoe.png`

**Belongs with:** hero-5, hero-hoe. **Companion groups:** hero-5, farm-crops.

**Use:** Prepare garden soil.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0137, S0141, S0145, S0149, S0152, S0154, S0155, S0157, S0314, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0624, S0625.

#### S0154 — Hero 5: pickaxe

[Preview](previews/S0154.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char5/Char_5_pickaxe.png`

**Belongs with:** hero-5, hero-pickaxe. **Companion groups:** hero-5, farm-resources.

**Use:** Break rocks or mine resource nodes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0138, S0142, S0146, S0150, S0152, S0153, S0155, S0158, S0314, S0458, S0624, S0625.

#### S0155 — Hero 5: wateringcan

[Preview](previews/S0155.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char5/Char_5_wateringcan.png`

**Belongs with:** hero-5, hero-wateringcan. **Companion groups:** hero-5, farm-crops.

**Use:** Water crops.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0139, S0143, S0147, S0151, S0152, S0153, S0154, S0159, S0314, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0624, S0625.

#### S0156 — Hero 6: axe

[Preview](previews/S0156.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char6/Char_6_axe.png`

**Belongs with:** hero-6, hero-axe. **Companion groups:** hero-6, farm-tools.

**Use:** Chop wood and open forest shortcuts.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0136, S0140, S0144, S0148, S0152, S0157, S0158, S0159, S0315, S0460, S0626, S0627.

#### S0157 — Hero 6: hoe

[Preview](previews/S0157.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char6/Char_6_hoe.png`

**Belongs with:** hero-6, hero-hoe. **Companion groups:** hero-6, farm-crops.

**Use:** Prepare garden soil.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0137, S0141, S0145, S0149, S0153, S0156, S0158, S0159, S0315, S0452, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0626, S0627.

#### S0158 — Hero 6: pickaxe

[Preview](previews/S0158.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char6/Char_6_pickaxe.png`

**Belongs with:** hero-6, hero-pickaxe. **Companion groups:** hero-6, farm-resources.

**Use:** Break rocks or mine resource nodes.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0138, S0142, S0146, S0150, S0154, S0156, S0157, S0159, S0315, S0458, S0626, S0627.

#### S0159 — Hero 6: wateringcan

[Preview](previews/S0159.png) · **Sheet:** 128 × 160 px · **Suggested cells:** 32 × 32

**Source:** `TFP_anim_v2.zip` → `TFP_anim_v2/Char6/Char_6_wateringcan.png`

**Belongs with:** hero-6, hero-wateringcan. **Companion groups:** hero-6, farm-crops.

**Use:** Water crops.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0139, S0143, S0147, S0151, S0155, S0156, S0157, S0158, S0315, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0626, S0627.

#### S0160 — Hero 1: bow

[Preview](previews/S0160.png) · **Sheet:** 96 × 18 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Attack/Bow/Char_bow_down.png`

**Belongs with:** hero-1, hero-bow. **Companion groups:** hero-1, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0085, S0090, S0095, S0100, S0105, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0246, S0247, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0161 — Hero 1: bow

[Preview](previews/S0161.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Attack/Bow/Char_bow_left.png`

**Belongs with:** hero-1, hero-bow. **Companion groups:** hero-1, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0085, S0090, S0095, S0100, S0105, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0246, S0247, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0162 — Hero 1: bow

[Preview](previews/S0162.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Attack/Bow/Char_bow_right.png`

**Belongs with:** hero-1, hero-bow. **Companion groups:** hero-1, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0085, S0090, S0095, S0100, S0105, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0246, S0247, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0163 — Hero 1: bow

[Preview](previews/S0163.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Attack/Bow/Char_bow_up.png`

**Belongs with:** hero-1, hero-bow. **Companion groups:** hero-1, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0085, S0090, S0095, S0100, S0105, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0246, S0247, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0164 — Hero 1: sword

[Preview](previews/S0164.png) · **Sheet:** 138 × 23 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Char_atk_down.png`

**Belongs with:** hero-1, hero-sword. **Companion groups:** hero-1, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0062, S0066, S0070, S0074, S0078, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0190, S0191, S0192, S0193, S0250, S0251, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0165 — Hero 1: sword

[Preview](previews/S0165.png) · **Sheet:** 96 × 21 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Char_atk_left.png`

**Belongs with:** hero-1, hero-sword. **Companion groups:** hero-1, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0062, S0066, S0070, S0074, S0078, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0190, S0191, S0192, S0193, S0250, S0251, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0166 — Hero 1: sword

[Preview](previews/S0166.png) · **Sheet:** 96 × 21 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Char_atk_right.png`

**Belongs with:** hero-1, hero-sword. **Companion groups:** hero-1, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0062, S0066, S0070, S0074, S0078, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0190, S0191, S0192, S0193, S0250, S0251, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0167 — Hero 1: sword

[Preview](previews/S0167.png) · **Sheet:** 138 × 18 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Char_atk_up.png`

**Belongs with:** hero-1, hero-sword. **Companion groups:** hero-1, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0062, S0066, S0070, S0074, S0078, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0190, S0191, S0192, S0193, S0250, S0251, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0168 — Hero 4: directions

[Preview](previews/S0168.png) · **Sheet:** 64 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Char_4_sides.png`

**Belongs with:** hero-4, hero-directions. **Companion groups:** hero-4.

**Use:** Static four-direction reference poses.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0056, S0060, S0064, S0068, S0069, S0070, S0071, S0072, S0076, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0194, S0313, S0622, S0623.

#### S0169 — Hero 1: fall

[Preview](previews/S0169.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Char_pit_fall.png`

**Belongs with:** hero-1, hero-fall. **Companion groups:** hero-1.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0086, S0091, S0096, S0101, S0106, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0196, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0170 — Hero 1: idle

[Preview](previews/S0170.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Idle/Char_idle_down.png`

**Belongs with:** hero-1, hero-idle. **Companion groups:** hero-1.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0061, S0065, S0069, S0073, S0077, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0197, S0198, S0199, S0200, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0171 — Hero 1: idle

[Preview](previews/S0171.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Idle/Char_idle_left.png`

**Belongs with:** hero-1, hero-idle. **Companion groups:** hero-1.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0061, S0065, S0069, S0073, S0077, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0197, S0198, S0199, S0200, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0172 — Hero 1: idle

[Preview](previews/S0172.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Idle/Char_idle_right.png`

**Belongs with:** hero-1, hero-idle. **Companion groups:** hero-1.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0061, S0065, S0069, S0073, S0077, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0197, S0198, S0199, S0200, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0173 — Hero 1: idle

[Preview](previews/S0173.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Idle/Char_idle_up.png`

**Belongs with:** hero-1, hero-idle. **Companion groups:** hero-1.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0061, S0065, S0069, S0073, S0077, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0197, S0198, S0199, S0200, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0174 — Hero 1: shield idle

[Preview](previews/S0174.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Idle/Char_shield_idle_down.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0175 — Hero 1: shield idle

[Preview](previews/S0175.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Idle/Char_shield_idle_left.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0176 — Hero 1: shield idle

[Preview](previews/S0176.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Idle/Char_shield_idle_right.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0177 — Hero 1: shield idle

[Preview](previews/S0177.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Idle/Char_shield_idle_up.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0178 — Hero 1: shield walk

[Preview](previews/S0178.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Walk/Char_shield_walk_down.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0179 — Hero 1: shield walk

[Preview](previews/S0179.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Walk/Char_shield_walk_left.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0180, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0180 — Hero 1: shield walk

[Preview](previews/S0180.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Walk/Char_shield_walk_right.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0181, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0181 — Hero 1: shield walk

[Preview](previews/S0181.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_one/Shield/Shield_Walk/Char_shield_walk_up.png`

**Belongs with:** hero-1, hero-shield. **Companion groups:** hero-1, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0182, S0183, S0184, S0185, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0249, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0182 — Hero 1: walk

[Preview](previews/S0182.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Walk/Char_walk_down.png`

**Belongs with:** hero-1, hero-walk. **Companion groups:** hero-1.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0063, S0067, S0071, S0075, S0079, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0183, S0184, S0185, S0209, S0210, S0211, S0212, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0183 — Hero 1: walk

[Preview](previews/S0183.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Walk/Char_walk_left.png`

**Belongs with:** hero-1, hero-walk. **Companion groups:** hero-1.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0063, S0067, S0071, S0075, S0079, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0184, S0185, S0209, S0210, S0211, S0212, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0184 — Hero 1: walk

[Preview](previews/S0184.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Walk/Char_walk_right.png`

**Belongs with:** hero-1, hero-walk. **Companion groups:** hero-1.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0063, S0067, S0071, S0075, S0079, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0185, S0209, S0210, S0211, S0212, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0185 — Hero 1: walk

[Preview](previews/S0185.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Walk/Char_walk_up.png`

**Belongs with:** hero-1, hero-walk. **Companion groups:** hero-1.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0063, S0067, S0071, S0075, S0079, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0209, S0210, S0211, S0212, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0186 — Hero 2: bow

[Preview](previews/S0186.png) · **Sheet:** 96 × 18 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Attack/Bow/Char2_bow_down.png`

**Belongs with:** hero-2, hero-bow. **Companion groups:** hero-2, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0080, S0085, S0086, S0087, S0088, S0089, S0090, S0095, S0100, S0105, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0160, S0161, S0162, S0163, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0246, S0247, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0187 — Hero 2: bow

[Preview](previews/S0187.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Attack/Bow/Char2_bow_left.png`

**Belongs with:** hero-2, hero-bow. **Companion groups:** hero-2, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0080, S0085, S0086, S0087, S0088, S0089, S0090, S0095, S0100, S0105, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0160, S0161, S0162, S0163, S0186, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0246, S0247, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0188 — Hero 2: bow

[Preview](previews/S0188.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Attack/Bow/Char2_bow_right.png`

**Belongs with:** hero-2, hero-bow. **Companion groups:** hero-2, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0080, S0085, S0086, S0087, S0088, S0089, S0090, S0095, S0100, S0105, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0160, S0161, S0162, S0163, S0186, S0187, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0246, S0247, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0189 — Hero 2: bow

[Preview](previews/S0189.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Attack/Bow/Char2_bow_up.png`

**Belongs with:** hero-2, hero-bow. **Companion groups:** hero-2, item-bow.

**Use:** Ranged bow attack; pair with separate arrow projectile.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0080, S0085, S0086, S0087, S0088, S0089, S0090, S0095, S0100, S0105, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0246, S0247, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0190 — Hero 2: sword

[Preview](previews/S0190.png) · **Sheet:** 138 × 18 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Char2_atk_up.png`

**Belongs with:** hero-2, hero-sword. **Companion groups:** hero-2, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0058, S0060, S0061, S0062, S0063, S0066, S0070, S0074, S0078, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0164, S0165, S0166, S0167, S0186, S0187, S0188, S0189, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0250, S0251, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0191 — Hero 2: sword

[Preview](previews/S0191.png) · **Sheet:** 138 × 23 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Char2_two_attack_down.png`

**Belongs with:** hero-2, hero-sword. **Companion groups:** hero-2, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0058, S0060, S0061, S0062, S0063, S0066, S0070, S0074, S0078, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0164, S0165, S0166, S0167, S0186, S0187, S0188, S0189, S0190, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0250, S0251, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0192 — Hero 2: sword

[Preview](previews/S0192.png) · **Sheet:** 96 × 21 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Char2_two_attack_left.png`

**Belongs with:** hero-2, hero-sword. **Companion groups:** hero-2, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0058, S0060, S0061, S0062, S0063, S0066, S0070, S0074, S0078, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0164, S0165, S0166, S0167, S0186, S0187, S0188, S0189, S0190, S0191, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0250, S0251, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0193 — Hero 2: sword

[Preview](previews/S0193.png) · **Sheet:** 96 × 21 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Char2_two_attack_right.png`

**Belongs with:** hero-2, hero-sword. **Companion groups:** hero-2, item-sword.

**Use:** Melee attack; tune attack arc and active frames.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0058, S0060, S0061, S0062, S0063, S0066, S0070, S0074, S0078, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0164, S0165, S0166, S0167, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0250, S0251, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0194 — Hero 2: directions

[Preview](previews/S0194.png) · **Sheet:** 64 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Char2_4sides.png`

**Belongs with:** hero-2, hero-directions. **Companion groups:** hero-2.

**Use:** Static four-direction reference poses.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0056, S0060, S0061, S0062, S0063, S0064, S0068, S0072, S0076, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0168, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0195 — Hero 2: item pose

[Preview](previews/S0195.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Char2_pick_item.png`

**Belongs with:** hero-2, hero-item. **Companion groups:** hero-2.

**Use:** Single item celebration pose; position acquired item separately.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0082, S0085, S0086, S0087, S0088, S0089, S0092, S0097, S0102, S0107, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0196 — Hero 2: fall

[Preview](previews/S0196.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Char2_pit_fall.png`

**Belongs with:** hero-2, hero-fall. **Companion groups:** hero-2.

**Use:** Pit fall feedback; implement respawn separately.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0081, S0085, S0086, S0087, S0088, S0089, S0091, S0096, S0101, S0106, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0169, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0197 — Hero 2: idle

[Preview](previews/S0197.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Idle/Char2_idle_down.png`

**Belongs with:** hero-2, hero-idle. **Companion groups:** hero-2.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0057, S0060, S0061, S0062, S0063, S0065, S0069, S0073, S0077, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0170, S0171, S0172, S0173, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0198 — Hero 2: idle

[Preview](previews/S0198.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Idle/Char2_idle_left.png`

**Belongs with:** hero-2, hero-idle. **Companion groups:** hero-2.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0057, S0060, S0061, S0062, S0063, S0065, S0069, S0073, S0077, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0170, S0171, S0172, S0173, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0199 — Hero 2: idle

[Preview](previews/S0199.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Idle/Char2_idle_right.png`

**Belongs with:** hero-2, hero-idle. **Companion groups:** hero-2.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0057, S0060, S0061, S0062, S0063, S0065, S0069, S0073, S0077, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0170, S0171, S0172, S0173, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0200 — Hero 2: idle

[Preview](previews/S0200.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Idle/Char2_idle_up.png`

**Belongs with:** hero-2, hero-idle. **Companion groups:** hero-2.

**Use:** Standing and breathing.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0057, S0060, S0061, S0062, S0063, S0065, S0069, S0073, S0077, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0170, S0171, S0172, S0173, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0201 — Hero 2: shield idle

[Preview](previews/S0201.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Idle/Char2_shield_idle_down.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0202 — Hero 2: shield idle

[Preview](previews/S0202.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Idle/Char2_shield_idle_left.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0203 — Hero 2: shield idle

[Preview](previews/S0203.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Idle/Char2_shield_idle_right.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0204 — Hero 2: shield idle

[Preview](previews/S0204.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Idle/Char2_shield_idle_up.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Blocking while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0205 — Hero 2: shield walk

[Preview](previews/S0205.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Walk/Char2_shield_walk_down.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0206 — Hero 2: shield walk

[Preview](previews/S0206.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Walk/Char2_shield_walk_left.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0207, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0207 — Hero 2: shield walk

[Preview](previews/S0207.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Walk/Char2_shield_walk_right.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0208, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0208 — Hero 2: shield walk

[Preview](previews/S0208.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Character/Char_two/Shield/Shield_Walk/Char2_shield_walk_up.png`

**Belongs with:** hero-2, hero-shield. **Companion groups:** hero-2, item-shield.

**Use:** Moving while blocking.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0083, S0084, S0085, S0086, S0087, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0209, S0210, S0211, S0212, S0248, S0249, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0209 — Hero 2: walk

[Preview](previews/S0209.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Walk/Char2_walk_down.png`

**Belongs with:** hero-2, hero-walk. **Companion groups:** hero-2.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0059, S0060, S0061, S0062, S0063, S0067, S0071, S0075, S0079, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0210 — Hero 2: walk

[Preview](previews/S0210.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Walk/Char2_walk_left.png`

**Belongs with:** hero-2, hero-walk. **Companion groups:** hero-2.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0059, S0060, S0061, S0062, S0063, S0067, S0071, S0075, S0079, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0211 — Hero 2: walk

[Preview](previews/S0211.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Walk/Char2_walk_right.png`

**Belongs with:** hero-2, hero-walk. **Companion groups:** hero-2.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0059, S0060, S0061, S0062, S0063, S0067, S0071, S0075, S0079, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0212 — Hero 2: walk

[Preview](previews/S0212.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Walk/Char2_walk_up.png`

**Belongs with:** hero-2, hero-walk. **Companion groups:** hero-2.

**Use:** Ground movement.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 9.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0059, S0060, S0061, S0062, S0063, S0067, S0071, S0075, S0079, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0182, S0183, S0184, S0185, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0310 — Hero 1: fishing

[Preview](previews/S0310.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Characters/char1_fishingrod_animation_32x32.png`

**Belongs with:** hero-1, hero-fishing. **Companion groups:** hero-1, coast-rods.

**Use:** Cast, wait and pull a catch.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0311, S0312, S0313, S0314, S0315, S0319, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0617.

#### S0311 — Hero 2: fishing

[Preview](previews/S0311.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Characters/char2_fishingrod_animation_32x32.png`

**Belongs with:** hero-2, hero-fishing. **Companion groups:** hero-2, coast-rods.

**Use:** Cast, wait and pull a catch.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0310, S0312, S0313, S0314, S0315, S0319, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0618, S0619.

#### S0312 — Hero 3: fishing

[Preview](previews/S0312.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Characters/char3_fishingrod_animation_32x32.png`

**Belongs with:** hero-3, hero-fishing. **Companion groups:** hero-3, coast-rods.

**Use:** Cast, wait and pull a catch.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0310, S0311, S0313, S0314, S0315, S0319, S0620, S0621.

#### S0313 — Hero 4: fishing

[Preview](previews/S0313.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Characters/char4_fishingrod_animation_32x32.png`

**Belongs with:** hero-4, hero-fishing. **Companion groups:** hero-4, coast-rods.

**Use:** Cast, wait and pull a catch.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0310, S0311, S0312, S0314, S0315, S0319, S0622, S0623.

#### S0314 — Hero 5: fishing

[Preview](previews/S0314.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Characters/char5_fishingrod_animation_32x32.png`

**Belongs with:** hero-5, hero-fishing. **Companion groups:** hero-5, coast-rods.

**Use:** Cast, wait and pull a catch.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0310, S0311, S0312, S0313, S0315, S0319, S0624, S0625.

#### S0315 — Hero 6: fishing

[Preview](previews/S0315.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Characters/char6_fishingrod_animation_32x32.png`

**Belongs with:** hero-6, hero-fishing. **Companion groups:** hero-6, coast-rods.

**Use:** Cast, wait and pull a catch.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0310, S0311, S0312, S0313, S0314, S0319, S0626, S0627.

#### S0328 — Hero 1: boomerang

[Preview](previews/S0328.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Boomerang/Char_Throw_boomerang_down.png`

**Belongs with:** hero-1, hero-boomerang. **Companion groups:** hero-1, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0434, S0435, S0616, S0617.

#### S0329 — Hero 1: boomerang

[Preview](previews/S0329.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Boomerang/Char_Throw_boomerang_left.png`

**Belongs with:** hero-1, hero-boomerang. **Companion groups:** hero-1, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0434, S0435, S0616, S0617.

#### S0330 — Hero 1: boomerang

[Preview](previews/S0330.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Boomerang/Char_Throw_boomerang_right.png`

**Belongs with:** hero-1, hero-boomerang. **Companion groups:** hero-1, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0434, S0435, S0616, S0617.

#### S0331 — Hero 1: boomerang

[Preview](previews/S0331.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Attack/Boomerang/Char_Throw_boomerang_up.png`

**Belongs with:** hero-1, hero-boomerang. **Companion groups:** hero-1, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0434, S0435, S0616, S0617.

#### S0332 — Hero 1: carry idle

[Preview](previews/S0332.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Idle/Char_carry_idle_down.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0333 — Hero 1: carry idle

[Preview](previews/S0333.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Idle/Char_carry_idle_left.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0334 — Hero 1: carry idle

[Preview](previews/S0334.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Idle/Char_carry_idle_right.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0335 — Hero 1: carry idle

[Preview](previews/S0335.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Idle/Char_carry_idle_up.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0336 — Hero 1: carry walk

[Preview](previews/S0336.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Walk/Char_carry_walk_down.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0337 — Hero 1: carry walk

[Preview](previews/S0337.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Walk/Char_carry_walk_left.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0338 — Hero 1: carry walk

[Preview](previews/S0338.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Walk/Char_carry_walk_right.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0339 — Hero 1: carry walk

[Preview](previews/S0339.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Carry/Walk/Char_carry_walk_up.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0340 — Hero 1: pickup

[Preview](previews/S0340.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Pick_up/Char_pickup_down.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0341 — Hero 1: pickup

[Preview](previews/S0341.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Pick_up/Char_pickup_left.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0342 — Hero 1: pickup

[Preview](previews/S0342.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Pick_up/Char_pickup_right.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0343 — Hero 1: pickup

[Preview](previews/S0343.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Pick_up/Char_pickup_up.png`

**Belongs with:** hero-1, hero-carry. **Companion groups:** hero-1, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0399, S0400, S0616, S0617.

#### S0344 — Hero 1: throw

[Preview](previews/S0344.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Throw_item/Char_left_right.png`

**Belongs with:** hero-1, hero-throw. **Companion groups:** hero-1, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0117, S0121, S0125, S0129, S0133, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0345, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0616, S0617.

#### S0345 — Hero 1: throw

[Preview](previews/S0345.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Throw_item/Char_Throw_down.png`

**Belongs with:** hero-1, hero-throw. **Companion groups:** hero-1, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0117, S0121, S0125, S0129, S0133, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0346, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0616, S0617.

#### S0346 — Hero 1: throw

[Preview](previews/S0346.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Throw_item/Char_throw_right.png`

**Belongs with:** hero-1, hero-throw. **Companion groups:** hero-1, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0117, S0121, S0125, S0129, S0133, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0347, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0616, S0617.

#### S0347 — Hero 1: throw

[Preview](previews/S0347.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_one/Throw_item/Char_Throw_up.png`

**Belongs with:** hero-1, hero-throw. **Companion groups:** hero-1, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0117, S0121, S0125, S0129, S0133, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0364, S0365, S0366, S0367, S0431, S0432, S0433, S0616, S0617.

#### S0348 — Hero 2: boomerang

[Preview](previews/S0348.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Boomerang/Char2_Throw_boomerang_down.png`

**Belongs with:** hero-2, hero-boomerang. **Companion groups:** hero-2, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0328, S0329, S0330, S0331, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0434, S0435, S0452, S0618, S0619.

#### S0349 — Hero 2: boomerang

[Preview](previews/S0349.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Boomerang/Char2_Throw_boomerang_left.png`

**Belongs with:** hero-2, hero-boomerang. **Companion groups:** hero-2, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0328, S0329, S0330, S0331, S0348, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0434, S0435, S0452, S0618, S0619.

#### S0350 — Hero 2: boomerang

[Preview](previews/S0350.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Boomerang/Char2_Throw_boomerang_right.png`

**Belongs with:** hero-2, hero-boomerang. **Companion groups:** hero-2, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0328, S0329, S0330, S0331, S0348, S0349, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0434, S0435, S0452, S0618, S0619.

#### S0351 — Hero 2: boomerang

[Preview](previews/S0351.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Attack/Boomerang/Char2_Throw_boomerang_up.png`

**Belongs with:** hero-2, hero-boomerang. **Companion groups:** hero-2, item-boomerang.

**Use:** Dedicated legacy boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Dedicated boomerang throw strips were found only for the two legacy heroes. For heroes 3–6, adapt the v2 throw-item pose deliberately.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0328, S0329, S0330, S0331, S0348, S0349, S0350, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0434, S0435, S0452, S0618, S0619.

#### S0352 — Hero 2: carry idle

[Preview](previews/S0352.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Idle/Char2_carry_idle_down.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0353 — Hero 2: carry idle

[Preview](previews/S0353.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Idle/Char2_carry_idle_left.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0354 — Hero 2: carry idle

[Preview](previews/S0354.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Idle/Char2_carry_idle_right.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0355 — Hero 2: carry idle

[Preview](previews/S0355.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Idle/Char2_carry_idle_up.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Hold a lifted item while stationary.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0356 — Hero 2: carry walk

[Preview](previews/S0356.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Walk/Char2_carry_walk_down.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0357 — Hero 2: carry walk

[Preview](previews/S0357.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Walk/Char2_carry_walk_left.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0358 — Hero 2: carry walk

[Preview](previews/S0358.png) · **Sheet:** 96 × 17 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Walk/Char2_carry_walk_right.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0359 — Hero 2: carry walk

[Preview](previews/S0359.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Carry/Walk/Char2_carry_walk_up.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Move while holding a lifted item.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Notes:** Legacy strips have trimmed/variable frame heights and sometimes widths; use authored rectangles rather than blanket 16x16.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0360 — Hero 2: pickup

[Preview](previews/S0360.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Pick_up/Char2_pickup_down.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0361 — Hero 2: pickup

[Preview](previews/S0361.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Pick_up/Char2_pickup_left.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0362 — Hero 2: pickup

[Preview](previews/S0362.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Pick_up/Char2_pickup_right.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0363 — Hero 2: pickup

[Preview](previews/S0363.png) · **Sheet:** 48 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Pick_up/Char2_pickup_up.png`

**Belongs with:** hero-2, hero-carry. **Companion groups:** hero-2, puzzle-crates.

**Use:** Lift pots, crates or bombs.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0110, S0111, S0112, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0364, S0365, S0366, S0367, S0399, S0400, S0452, S0618, S0619.

#### S0364 — Hero 2: throw

[Preview](previews/S0364.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Throw_item/Char2_left_right.png`

**Belongs with:** hero-2, hero-throw. **Companion groups:** hero-2, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0113, S0114, S0115, S0116, S0117, S0121, S0125, S0129, S0133, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0365, S0366, S0367, S0431, S0432, S0433, S0452, S0618, S0619.

#### S0365 — Hero 2: throw

[Preview](previews/S0365.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Throw_item/Char2_one_Throw_up.png`

**Belongs with:** hero-2, hero-throw. **Companion groups:** hero-2, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0113, S0114, S0115, S0116, S0117, S0121, S0125, S0129, S0133, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0366, S0367, S0431, S0432, S0433, S0452, S0618, S0619.

#### S0366 — Hero 2: throw

[Preview](previews/S0366.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Throw_item/Char2_Throw_down.png`

**Belongs with:** hero-2, hero-throw. **Companion groups:** hero-2, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0113, S0114, S0115, S0116, S0117, S0121, S0125, S0129, S0133, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0367, S0431, S0432, S0433, S0452, S0618, S0619.

#### S0367 — Hero 2: throw

[Preview](previews/S0367.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Character/Char_two/Throw_item/Char2_throw_right.png`

**Belongs with:** hero-2, hero-throw. **Companion groups:** hero-2, item-bomb.

**Use:** Release carried items; candidate shared boomerang throw pose.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 2.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0113, S0114, S0115, S0116, S0117, S0121, S0125, S0129, S0133, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0431, S0432, S0433, S0452, S0618, S0619.

#### S0452 — Hero 2: hoe

[Preview](previews/S0452.png) · **Sheet:** 128 × 640 px · **Suggested cells:** 32 × 32

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Char2/Char_2_hoe.png`

**Belongs with:** hero-2, hero-hoe. **Companion groups:** hero-2, farm-crops.

**Use:** Prepare garden soil.

**Version:** Legacy alternate; prefer matching v2 action where available. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0137, S0140, S0141, S0142, S0143, S0145, S0149, S0153, S0157, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599, S0618, S0619.

#### S0616 — Hero 1: hook

[Preview](previews/S0616.png) · **Sheet:** 128 × 32 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char1_hook_32x32.png`

**Belongs with:** hero-1, hero-hook. **Companion groups:** hero-1, item-hook.

**Use:** Directional hook launch pose; animate tether separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0617, S0618, S0620, S0622, S0624, S0626, S0638.

#### S0617 — Hero 1: magic

[Preview](previews/S0617.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char1_rod_32x32.png`

**Belongs with:** hero-1, hero-magic. **Companion groups:** hero-1, item-magic.

**Use:** Wand cast; pair with separate magic effect.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0001, S0002, S0003, S0004, S0005, S0006, S0056, S0057, S0058, S0059, S0080, S0081, S0082, S0083, S0084, S0110, S0111, S0112, S0113, S0136, S0137, S0138, S0139, S0160, S0161, S0162, S0163, S0164, S0165, S0166, S0167, S0169, S0170, S0171, S0172, S0173, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0182, S0183, S0184, S0185, S0310, S0328, S0329, S0330, S0331, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0616, S0619, S0621, S0623, S0625, S0627, S0640.

#### S0618 — Hero 2: hook

[Preview](previews/S0618.png) · **Sheet:** 128 × 32 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char2_hook_32x32.png`

**Belongs with:** hero-2, hero-hook. **Companion groups:** hero-2, item-hook.

**Use:** Directional hook launch pose; animate tether separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0616, S0619, S0620, S0622, S0624, S0626, S0638.

#### S0619 — Hero 2: magic

[Preview](previews/S0619.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char2_rod_32x32.png`

**Belongs with:** hero-2, hero-magic. **Companion groups:** hero-2, item-magic.

**Use:** Wand cast; pair with separate magic effect.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0007, S0008, S0009, S0010, S0011, S0012, S0060, S0061, S0062, S0063, S0085, S0086, S0087, S0088, S0089, S0114, S0115, S0116, S0117, S0140, S0141, S0142, S0143, S0186, S0187, S0188, S0189, S0190, S0191, S0192, S0193, S0194, S0195, S0196, S0197, S0198, S0199, S0200, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0209, S0210, S0211, S0212, S0311, S0348, S0349, S0350, S0351, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0452, S0617, S0618, S0621, S0623, S0625, S0627, S0640.

#### S0620 — Hero 3: hook

[Preview](previews/S0620.png) · **Sheet:** 128 × 32 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char3_hook_32x32.png`

**Belongs with:** hero-3, hero-hook. **Companion groups:** hero-3, item-hook.

**Use:** Directional hook launch pose; animate tether separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0616, S0618, S0621, S0622, S0624, S0626, S0638.

#### S0621 — Hero 3: magic

[Preview](previews/S0621.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char3_rod_32x32.png`

**Belongs with:** hero-3, hero-magic. **Companion groups:** hero-3, item-magic.

**Use:** Wand cast; pair with separate magic effect.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0013, S0014, S0015, S0016, S0017, S0018, S0064, S0065, S0066, S0067, S0090, S0091, S0092, S0093, S0094, S0118, S0119, S0120, S0121, S0144, S0145, S0146, S0147, S0312, S0617, S0619, S0620, S0623, S0625, S0627, S0640.

#### S0622 — Hero 4: hook

[Preview](previews/S0622.png) · **Sheet:** 128 × 32 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char4_hook_32x32.png`

**Belongs with:** hero-4, hero-hook. **Companion groups:** hero-4, item-hook.

**Use:** Directional hook launch pose; animate tether separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0616, S0618, S0620, S0623, S0624, S0626, S0638.

#### S0623 — Hero 4: magic

[Preview](previews/S0623.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char4_rod_32x32.png`

**Belongs with:** hero-4, hero-magic. **Companion groups:** hero-4, item-magic.

**Use:** Wand cast; pair with separate magic effect.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0019, S0020, S0021, S0022, S0023, S0024, S0068, S0069, S0070, S0071, S0095, S0096, S0097, S0098, S0099, S0122, S0123, S0124, S0125, S0148, S0149, S0150, S0151, S0168, S0313, S0617, S0619, S0621, S0622, S0625, S0627, S0640.

#### S0624 — Hero 5: hook

[Preview](previews/S0624.png) · **Sheet:** 128 × 32 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char5_hook_32x32.png`

**Belongs with:** hero-5, hero-hook. **Companion groups:** hero-5, item-hook.

**Use:** Directional hook launch pose; animate tether separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0616, S0618, S0620, S0622, S0625, S0626, S0638.

#### S0625 — Hero 5: magic

[Preview](previews/S0625.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char5_rod_32x32.png`

**Belongs with:** hero-5, hero-magic. **Companion groups:** hero-5, item-magic.

**Use:** Wand cast; pair with separate magic effect.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0025, S0026, S0027, S0028, S0029, S0030, S0072, S0073, S0074, S0075, S0100, S0101, S0102, S0103, S0104, S0126, S0127, S0128, S0129, S0152, S0153, S0154, S0155, S0314, S0617, S0619, S0621, S0623, S0624, S0627, S0640.

#### S0626 — Hero 6: hook

[Preview](previews/S0626.png) · **Sheet:** 128 × 32 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char6_hook_32x32.png`

**Belongs with:** hero-6, hero-hook. **Companion groups:** hero-6, item-hook.

**Use:** Directional hook launch pose; animate tether separately.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0616, S0618, S0620, S0622, S0624, S0627, S0638.

#### S0627 — Hero 6: magic

[Preview](previews/S0627.png) · **Sheet:** 128 × 128 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Char/Char6_rod_32x32.png`

**Belongs with:** hero-6, hero-magic. **Companion groups:** hero-6, item-magic.

**Use:** Wand cast; pair with separate magic effect.

**Version:** Preferred modern action sheet. **Exact source occurrences:** 1.

**Related IDs:** S0031, S0032, S0033, S0034, S0035, S0036, S0076, S0077, S0078, S0079, S0105, S0106, S0107, S0108, S0109, S0130, S0131, S0132, S0133, S0156, S0157, S0158, S0159, S0315, S0617, S0619, S0621, S0623, S0625, S0626, S0640.

### NPCs and emotes


#### S0235 — NPC appearance 1 (Village/Adventure)

[Preview](previews/S0235.png) · **Sheet:** 80 × 19 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/NPCs/NPC_one/NPC1_idle_down.png`

**Belongs with:** village-npc-1, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0236 — NPC appearance 2 (Village/Adventure)

[Preview](previews/S0236.png) · **Sheet:** 80 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/NPCs/NPC_two/NPC2_idle_down.png`

**Belongs with:** village-npc-2, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0261 — Outlined exclamation quest marker

[Preview](previews/S0261.png) · **Sheet:** 6 × 12 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Quest_exclamation.png`

**Belongs with:** npc-quest-marker. **Companion groups:** village-npcs, npc-emotes.

**Use:** Quest availability indicator.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0286 — Anthropomorphic fox traveller, idle/walk and colour variants

[Preview](previews/S0286.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/NPCs/Fox.png`

**Belongs with:** npc-fox. **Companion groups:** biome-forest, npc-emotes.

**Use:** Woodland guide or merchant; no combat set identified.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479.

#### S0287 — Gardener character, idle/walk and appearance variants

[Preview](previews/S0287.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/NPCs/Gardener.png`

**Belongs with:** npc-gardener. **Companion groups:** farm-crops, npc-emotes.

**Use:** Garden tutor, supply seller or rescued villager.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0459, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599.

#### S0288 — Hooded desert traveller, idle/walk and colour variants

[Preview](previews/S0288.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/NPCs/Sand_Wanderer.png`

**Belongs with:** npc-sand-wanderer. **Companion groups:** biome-desert, npc-emotes.

**Use:** Desert guide, route hints or travelling trader.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0275, S0276, S0280, S0290, S0298, S0299, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479.

#### S0289 — Santa character, idle/walk and appearance variants

[Preview](previews/S0289.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/NPCs/Santa.png`

**Belongs with:** npc-santa. **Companion groups:** biome-winter, npc-emotes.

**Use:** Optional seasonal quest giver.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0281, S0294, S0303, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479.

#### S0463 — Neighbours NPC 9: Long side-swept dark hair and blue clothes

[Preview](previews/S0463.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_9.png`

**Belongs with:** neighbour-9, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Scholar or traveller. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0464 — Neighbours NPC 10: Dark red hair and light/green clothes

[Preview](previews/S0464.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_10.png`

**Belongs with:** neighbour-10, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Gardener or merchant. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0465 — Neighbours NPC 11: Long blond hair, red headband and green clothes

[Preview](previews/S0465.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_11.png`

**Belongs with:** neighbour-11, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Musician or woodland guide. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0466 — Neighbours NPC 12: Bright orange/red hair with a tied-up silhouette

[Preview](previews/S0466.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_12.png`

**Belongs with:** neighbour-12, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Blacksmith apprentice or adventurer. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0467 — Neighbours NPC 13: Short tousled dark hair and dark clothes

[Preview](previews/S0467.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_13.png`

**Belongs with:** neighbour-13, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Scout or village resident. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0468 — Neighbours NPC 14: Receding/balding hairline with dark sides and dark clothing

[Preview](previews/S0468.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_14.png`

**Belongs with:** neighbour-14, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Elder or scholar. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0469 — Neighbours NPC 15: Dark brimmed hat with red band and green clothes

[Preview](previews/S0469.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_15.png`

**Belongs with:** neighbour-15, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Travelling merchant or entertainer. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0470 — Angry expression bubble

[Preview](previews/S0470.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Angry_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0471 — Evil expression bubble

[Preview](previews/S0471.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Evil_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0472 — Exclamation expression bubble

[Preview](previews/S0472.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Exclamation_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0473 — Happy expression bubble

[Preview](previews/S0473.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Happy_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0474 — HeartBreak expression bubble

[Preview](previews/S0474.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/HeartBreak_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0475 — Heart expression bubble

[Preview](previews/S0475.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Heart_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0476 — Interrogation expression bubble

[Preview](previews/S0476.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Interrogation_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0477 — Sad expression bubble

[Preview](previews/S0477.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Sad_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0478 — Star expression bubble

[Preview](previews/S0478.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Star_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0479 — Surprised expression bubble

[Preview](previews/S0479.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `Emotes/Surprised_emote_16x16.png`

**Belongs with:** npc-emotes. **Companion groups:** village-npcs.

**Use:** Animated NPC reaction or quest feedback; four bubble growth/reveal frames.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560.

#### S0480 — Neighbours NPC 1: Bald head, light top and red clothing accents

[Preview](previews/S0480.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_1.png`

**Belongs with:** neighbour-1, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Innkeeper, elder or village resident. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0481 — Neighbours NPC 2: Dark swept-up hair, beard-like face pixels and dark clothes

[Preview](previews/S0481.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_2.png`

**Belongs with:** neighbour-2, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Craftsperson or trader. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0482 — Neighbours NPC 3: Short dark hair/cap silhouette, dark top and pale lower clothing

[Preview](previews/S0482.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_3.png`

**Belongs with:** neighbour-3, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Apprentice, courier or resident. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0483 — Neighbours NPC 4: Blond tied-back hair and warm brown/orange clothes

[Preview](previews/S0483.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_4.png`

**Belongs with:** neighbour-4, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Merchant or explorer. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0484 — Neighbours NPC 5: Bright pink long hair and pale/blue clothes

[Preview](previews/S0484.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_5.png`

**Belongs with:** neighbour-5, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Herbalist, traveller or resident. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0485 — Neighbours NPC 6: Brown swept hair with pale and brown clothing

[Preview](previews/S0485.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_6.png`

**Belongs with:** neighbour-6, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Shopkeeper or resident. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0486 — Neighbours NPC 7: Dark rounded hair/cap and red top

[Preview](previews/S0486.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_7.png`

**Belongs with:** neighbour-7, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Courier or village worker. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0487 — Neighbours NPC 8: Dark hair with a blue headband-like band and pale/blue clothes

[Preview](previews/S0487.png) · **Sheet:** 128 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Neighbours Vol1.zip` → `NPC_8.png`

**Belongs with:** neighbour-8, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Sailor or coastal resident. Suggested roles only; source supplies idle/walk appearances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Contains idle/walk blocks and multiple skin tones; these are appearance variants, not separate professions. Header occupies the first 16-pixel row. Skip header row; 4 directional rows per skin tone; idle/walk blocks are separate.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0554 — NPC appearance 1 (Village/Adventure)

[Preview](previews/S0554.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_1_spritesheet.png`

**Belongs with:** village-npc-1, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0555, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0555 — NPC appearance 2 (Village/Adventure)

[Preview](previews/S0555.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_2_spritesheet.png`

**Belongs with:** village-npc-2, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0556, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0556 — NPC appearance 3 (Village/Adventure)

[Preview](previews/S0556.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_3_spritesheet.png`

**Belongs with:** village-npc-3, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0557, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0557 — NPC appearance 4 (Village/Adventure)

[Preview](previews/S0557.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_4_spritesheet.png`

**Belongs with:** village-npc-4, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0558, S0559, S0560, S0600, S0601, S0605.

#### S0558 — NPC appearance 5 (Village/Adventure)

[Preview](previews/S0558.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_5_spritesheet.png`

**Belongs with:** village-npc-5, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0559, S0560, S0600, S0601, S0605.

#### S0559 — NPC appearance 6 (Village/Adventure)

[Preview](previews/S0559.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_6_spritesheet.png`

**Belongs with:** village-npc-6, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0560, S0600, S0601, S0605.

#### S0560 — NPC appearance 7 (Village/Adventure)

[Preview](previews/S0560.png) · **Sheet:** 128 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/NPCs/NPC_7_spritesheet.png`

**Belongs with:** village-npc-7, village-npcs. **Companion groups:** npc-emotes, village-environment.

**Use:** Villager, trader, guide or rescued traveller; profession and personality are design choices.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0470, S0471, S0472, S0473, S0474, S0475, S0476, S0477, S0478, S0479, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0600, S0601, S0605.

### Reference


#### S0049 — Rosy-42 palette with three added blue shades

[Preview](previews/S0049.png) · **Sheet:** 16 × 3 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Neighbours Vol1.zip` → `Palette/rosyandblue.png`

**Belongs with:** palette. **Companion groups:** None required.

**Use:** Shared colour reference; not a gameplay sprite.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 10.

**Related IDs:** .

### Terrain


#### S0269 — Ground/edge tiles: TS_Dirt

[Preview](previews/S0269.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/TS_Dirt.png`

**Belongs with:** forest-environment. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 3.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0402, S0461, S0606, S0608, S0609, S0610, S0611.

#### S0270 — Ground/edge tiles: TS_Dirt_Pit

[Preview](previews/S0270.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Tilesets/TS_Dirt_Pit.png`

**Belongs with:** hazard-pit. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0272, S0402, S0461.

#### S0271 — Ground/edge tiles: TS_Dirt_Water

[Preview](previews/S0271.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Tilesets/TS_Dirt_Water.png`

**Belongs with:** forest-water. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0273, S0402, S0461.

#### S0272 — Ground/edge tiles: TS_Pit

[Preview](previews/S0272.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Tilesets/TS_Pit.png`

**Belongs with:** hazard-pit. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0270, S0402, S0461.

#### S0273 — Ground/edge tiles: TS_Water

[Preview](previews/S0273.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/TS_Water.png`

**Belongs with:** forest-water. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0271, S0402, S0461.

#### S0290 — Desert terrain (new style)

[Preview](previews/S0290.png) · **Sheet:** 224 × 240 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/New Style/Desert_16x16.png`

**Belongs with:** biome-desert, terrain-new. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0275, S0276, S0280, S0291, S0292, S0293, S0294, S0298, S0299.

#### S0291 — Fall terrain (new style)

[Preview](previews/S0291.png) · **Sheet:** 224 × 240 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/New Style/Fall_16x16.png`

**Belongs with:** biome-forest, terrain-new. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0290, S0292, S0293, S0294, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0292 — Grassland terrain (new style)

[Preview](previews/S0292.png) · **Sheet:** 224 × 240 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/New Style/Grasslands_16x16.png`

**Belongs with:** biome-forest, terrain-new. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0290, S0291, S0293, S0294, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0293 — Original terrain (new style)

[Preview](previews/S0293.png) · **Sheet:** 224 × 240 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/New Style/Original_Colour_16x16.png`

**Belongs with:** biome-forest, terrain-new. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0290, S0291, S0292, S0294, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0294 — Snow terrain (new style)

[Preview](previews/S0294.png) · **Sheet:** 176 × 240 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/New Style/Snow_16x16.png`

**Belongs with:** biome-winter, terrain-new. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0281, S0290, S0291, S0292, S0293, S0303.

#### S0295 — Fall terrain (old style)

[Preview](previews/S0295.png) · **Sheet:** 48 × 160 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Decoration tiles/Fall_decoration_16x16.png`

**Belongs with:** biome-forest, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0291, S0292, S0293, S0296, S0297, S0299, S0300, S0301, S0302, S0303.

#### S0296 — Grassland terrain (old style)

[Preview](previews/S0296.png) · **Sheet:** 48 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Decoration tiles/grassland_decoration_16x16.png`

**Belongs with:** biome-forest, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0297, S0299, S0300, S0301, S0302, S0303.

#### S0297 — Original terrain (old style)

[Preview](previews/S0297.png) · **Sheet:** 48 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Decoration tiles/Original_color_decoration_16x16.png`

**Belongs with:** biome-forest, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0299, S0300, S0301, S0302, S0303.

#### S0299 — Desert terrain (old style)

[Preview](previews/S0299.png) · **Sheet:** 80 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Desert_old_style_16x16.png`

**Belongs with:** biome-desert, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0275, S0276, S0280, S0290, S0295, S0296, S0297, S0298, S0300, S0301, S0302, S0303.

#### S0300 — Fall terrain (old style)

[Preview](previews/S0300.png) · **Sheet:** 80 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Fall_old_style_16x16.png`

**Belongs with:** biome-forest, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0299, S0301, S0302, S0303.

#### S0301 — Grassland terrain (old style)

[Preview](previews/S0301.png) · **Sheet:** 80 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Grassland_old_style_16x16.png`

**Belongs with:** biome-forest, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0299, S0300, S0302, S0303.

#### S0302 — Original terrain (old style)

[Preview](previews/S0302.png) · **Sheet:** 80 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Original_Color_old_style_16x16.png`

**Belongs with:** biome-forest, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0299, S0300, S0301, S0303.

#### S0303 — Winter terrain (old style)

[Preview](previews/S0303.png) · **Sheet:** 80 × 208 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Winter_old_style_16x16.png`

**Belongs with:** biome-winter, terrain-old. **Companion groups:** biome-props.

**Use:** Generate once and save outdoor dungeon geometry; retain shortcuts, treasure and solved puzzle states.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Notes:** Use one edge style consistently within a region. New Style includes broader edge/cliff/water detail; old style is an alternate layout, not an animation update.

**Related IDs:** S0274, S0281, S0294, S0295, S0296, S0297, S0299, S0300, S0301, S0302.

#### S0321 — Coast shoreline/water tiles: Shore_TS_Animated_noBG_16x16

[Preview](previews/S0321.png) · **Sheet:** 192 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/old/Shore_TS_Animated_noBG_16x16.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, hero-swim.

**Use:** Persistent coasts, islands, animated water edges and crossings.

**Version:** Legacy shoreline; updated counterpart preferred. **Exact source occurrences:** 1.

**Notes:** Archived legacy shoreline. Prefer the updated no-background shoreline when that rendering approach is needed.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0307, S0322, S0323, S0324, S0325, S0326, S0327.

#### S0322 — Coast shoreline/water tiles: Shore_TS_16x16

[Preview](previews/S0322.png) · **Sheet:** 80 × 128 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/Shore_TS_16x16.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, hero-swim.

**Use:** Persistent coasts, islands, animated water edges and crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0307, S0321, S0323, S0324, S0325, S0326, S0327.

#### S0323 — Coast shoreline/water tiles: Shore_TS_Animated_16x16

[Preview](previews/S0323.png) · **Sheet:** 192 × 96 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/Shore_TS_Animated_16x16.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, hero-swim.

**Use:** Persistent coasts, islands, animated water edges and crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0307, S0321, S0322, S0324, S0325, S0326, S0327.

#### S0324 — Coast shoreline/water tiles: Shore_TS_Animated_noBG_16x16_updated

[Preview](previews/S0324.png) · **Sheet:** 192 × 96 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/Shore_TS_Animated_noBG_16x16_updated.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, hero-swim.

**Use:** Persistent coasts, islands, animated water edges and crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0307, S0321, S0322, S0323, S0325, S0326, S0327.

#### S0325 — Coast shoreline/water tiles: TS_Dirt_Water

[Preview](previews/S0325.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/TS_Dirt_Water.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, hero-swim.

**Use:** Persistent coasts, islands, animated water edges and crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0307, S0321, S0322, S0323, S0324, S0326, S0327.

#### S0326 — Coast shoreline/water tiles: TS_Water

[Preview](previews/S0326.png) · **Sheet:** 80 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/TS_Water.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, hero-swim.

**Use:** Persistent coasts, islands, animated water edges and crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0307, S0321, S0322, S0323, S0324, S0325, S0327.

#### S0410 — Acid floor boundary tiles

[Preview](previews/S0410.png) · **Sheet:** 96 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Acid.png`

**Belongs with:** hazard-Acid. **Companion groups:** dungeon-room, hero-roll.

**Use:** Room hazards; water traversal can change with swimming capability.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0005, S0011, S0017, S0023, S0029, S0035, S0412, S0413, S0414, S0415, S0416.

#### S0411 — Pit floor boundary tiles

[Preview](previews/S0411.png) · **Sheet:** 96 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Pit.png`

**Belongs with:** hazard-Pit. **Companion groups:** dungeon-room, hero-roll.

**Use:** Room hazards; water traversal can change with swimming capability.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0005, S0011, S0017, S0023, S0029, S0035, S0412, S0413, S0414, S0415, S0416.

#### S0412 — Room_blue modular walls, corners, door and pillar pieces

[Preview](previews/S0412.png) · **Sheet:** 208 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Room/Room_blue.png`

**Belongs with:** dungeon-room. **Companion groups:** puzzle-colour-walls, trap-spikes.

**Use:** Hand-authored room templates assembled into changing dungeons.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0413, S0414, S0415, S0416, S0418, S0419, S0420, S0421, S0430.

#### S0413 — Room_brown modular walls, corners, door and pillar pieces

[Preview](previews/S0413.png) · **Sheet:** 208 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Room/Room_brown.png`

**Belongs with:** dungeon-room. **Companion groups:** puzzle-colour-walls, trap-spikes.

**Use:** Hand-authored room templates assembled into changing dungeons.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0412, S0414, S0415, S0416, S0418, S0419, S0420, S0421, S0430.

#### S0414 — Room_gray modular walls, corners, door and pillar pieces

[Preview](previews/S0414.png) · **Sheet:** 208 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Room/Room_gray.png`

**Belongs with:** dungeon-room. **Companion groups:** puzzle-colour-walls, trap-spikes.

**Use:** Hand-authored room templates assembled into changing dungeons.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0412, S0413, S0415, S0416, S0418, S0419, S0420, S0421, S0430.

#### S0415 — Room_green modular walls, corners, door and pillar pieces

[Preview](previews/S0415.png) · **Sheet:** 208 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Room/Room_green.png`

**Belongs with:** dungeon-room. **Companion groups:** puzzle-colour-walls, trap-spikes.

**Use:** Hand-authored room templates assembled into changing dungeons.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0412, S0413, S0414, S0416, S0418, S0419, S0420, S0421, S0430.

#### S0416 — Room_red modular walls, corners, door and pillar pieces

[Preview](previews/S0416.png) · **Sheet:** 208 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Room/Room_red.png`

**Belongs with:** dungeon-room. **Companion groups:** puzzle-colour-walls, trap-spikes.

**Use:** Hand-authored room templates assembled into changing dungeons.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0412, S0413, S0414, S0415, S0418, S0419, S0420, S0421, S0430.

#### S0417 — Water floor boundary tiles

[Preview](previews/S0417.png) · **Sheet:** 96 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Tilesets/Water.png`

**Belongs with:** hazard-Water. **Companion groups:** dungeon-room, hero-swim.

**Use:** Room hazards; water traversal can change with swimming capability.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0002, S0006, S0008, S0012, S0014, S0018, S0020, S0024, S0026, S0030, S0032, S0036, S0412, S0413, S0414, S0415, S0416.

#### S0606 — Ground/edge tiles: brown_walls

[Preview](previews/S0606.png) · **Sheet:** 208 × 96 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/brown_walls.png`

**Belongs with:** forest-environment. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0269, S0402, S0461, S0608, S0609, S0610, S0611.

#### S0608 — Ground/edge tiles: fountain

[Preview](previews/S0608.png) · **Sheet:** 112 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/fountain.png`

**Belongs with:** forest-environment. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0269, S0402, S0461, S0606, S0609, S0610, S0611.

#### S0609 — Ground/edge tiles: gray_walls

[Preview](previews/S0609.png) · **Sheet:** 208 × 96 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/gray_walls.png`

**Belongs with:** forest-environment. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0269, S0402, S0461, S0606, S0608, S0610, S0611.

#### S0610 — Ground/edge tiles: green_walls

[Preview](previews/S0610.png) · **Sheet:** 208 × 96 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/green_walls.png`

**Belongs with:** forest-environment. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0269, S0402, S0461, S0606, S0608, S0609, S0611.

#### S0611 — Ground/edge tiles: red_walls

[Preview](previews/S0611.png) · **Sheet:** 208 × 96 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/red_walls.png`

**Belongs with:** forest-environment. **Companion groups:** forest-props, forest-trees.

**Use:** Persistent overworld terrain and outdoor room boundaries.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0254, S0260, S0262, S0263, S0266, S0267, S0268, S0269, S0402, S0461, S0606, S0608, S0609, S0610.

#### S0643 — Castle modular walls, floor, doors and architectural pieces

[Preview](previews/S0643.png) · **Sheet:** 336 × 448 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Tileset_16x16.png`

**Belongs with:** castle-room. **Companion groups:** castle-door, castle-environment.

**Use:** Generated castle room templates and landmark chambers.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0613, S0614, S0645.

### UI and controls


#### S0037 — Controller prompts: controller_minimal

[Preview](previews/S0037.png) · **Sheet:** 256 × 192 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/controller_minimal.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0038, S0039, S0040, S0041, S0042, S0043, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0038 — Controller prompts: controller_ps

[Preview](previews/S0038.png) · **Sheet:** 112 × 560 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/controller_ps.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0039, S0040, S0041, S0042, S0043, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0039 — Controller prompts: controller_switch

[Preview](previews/S0039.png) · **Sheet:** 112 × 592 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/controller_switch.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0040, S0041, S0042, S0043, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0040 — Controller prompts: controller_xbox

[Preview](previews/S0040.png) · **Sheet:** 112 × 432 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/controller_xbox.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0041, S0042, S0043, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0041 — Mouse, cursor or stick prompts: cursors

[Preview](previews/S0041.png) · **Sheet:** 96 × 432 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/cursors.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0042, S0043, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0042 — Keyboard prompts: kb_dark_all

[Preview](previews/S0042.png) · **Sheet:** 256 × 416 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/kb_dark_all.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0043, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0043 — Keyboard prompts: kb_dark_alphanumeric

[Preview](previews/S0043.png) · **Sheet:** 128 × 416 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/kb_dark_alphanumeric.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0044, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0044 — Keyboard prompts: kb_dark_symbols

[Preview](previews/S0044.png) · **Sheet:** 128 × 416 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/kb_dark_symbols.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0043, S0045, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0045 — Keyboard prompts: kb_light_all

[Preview](previews/S0045.png) · **Sheet:** 256 × 416 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/kb_light_all.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0043, S0044, S0046, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0046 — Keyboard prompts: kb_light_alphanumeric

[Preview](previews/S0046.png) · **Sheet:** 128 × 416 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/kb_light_alphanumeric.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0043, S0044, S0045, S0047, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0047 — Keyboard prompts: kb_light_symbols

[Preview](previews/S0047.png) · **Sheet:** 128 × 416 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/kb_light_symbols.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0043, S0044, S0045, S0046, S0048, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0048 — Mouse, cursor or stick prompts: mouse

[Preview](previews/S0048.png) · **Sheet:** 96 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/mouse.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0043, S0044, S0045, S0046, S0047, S0050, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0050 — Mouse, cursor or stick prompts: sticks

[Preview](previews/S0050.png) · **Sheet:** 96 × 192 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Controllers and Keyboard.zip` → `Controllers and Keyboard/sticks.png`

**Belongs with:** ui-controls. **Companion groups:** ui-panels.

**Use:** Device-specific action prompts and rebinding UI. Match current input device; display actual rebound keys.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0037, S0038, S0039, S0040, S0041, S0042, S0043, S0044, S0045, S0046, S0047, S0048, S0652, S0653, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682.

#### S0647 — Button skins/states and modular pieces

[Preview](previews/S0647.png) · **Sheet:** 96 × 176 px · **Suggested cells:** 48 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Buttons/Rectangle_Buttons_48x16px.png`

**Belongs with:** ui-buttons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Menus and input feedback; derive state mapping from visible layout.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0648 — Button skins/states and modular pieces

[Preview](previews/S0648.png) · **Sheet:** 32 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Buttons/Square_Buttons_16x16px.png`

**Belongs with:** ui-buttons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Menus and input feedback; derive state mapping from visible layout.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0649 — Button skins/states and modular pieces

[Preview](previews/S0649.png) · **Sheet:** 96 × 528 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Buttons/Square_DIY_Buttons_16x16.png`

**Belongs with:** ui-buttons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Menus and input feedback; derive state mapping from visible layout.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0650 — Button skins/states and modular pieces

[Preview](previews/S0650.png) · **Sheet:** 88 × 520 px · **Suggested cells:** 8 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Buttons/Square_DIY_Buttons_split_8x8px.png`

**Belongs with:** ui-buttons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Menus and input feedback; derive state mapping from visible layout.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0651 — Button skins/states and modular pieces

[Preview](previews/S0651.png) · **Sheet:** 384 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Buttons/Square_premade_buttons_16x16px.png`

**Belongs with:** ui-buttons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Menus and input feedback; derive state mapping from visible layout.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0652 — UI panel/frame components: Bars_16x32

[Preview](previews/S0652.png) · **Sheet:** 48 × 96 px · **Suggested cells:** 16 × 32

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Bars_16x32.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0653 — UI panel/frame components: BpeechBubble_white_16x16

[Preview](previews/S0653.png) · **Sheet:** 64 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/BpeechBubble_white_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0654 — Icon collection: equipment_Icons_16x16

[Preview](previews/S0654.png) · **Sheet:** 64 × 192 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/equipment_Icons_16x16.png`

**Belongs with:** ui-icons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Equipment, statuses, pickups or menu actions. Assign individual meanings explicitly.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0655 — UI panel/frame components: Frames_BrownBG_32x32export

[Preview](previews/S0655.png) · **Sheet:** 384 × 160 px · **Suggested cells:** 32 × 32

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Frames_BrownBG_32x32export.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0656 — UI panel/frame components: Frames_DarkBG_32x32export

[Preview](previews/S0656.png) · **Sheet:** 384 × 160 px · **Suggested cells:** 32 × 32

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Frames_DarkBG_32x32export.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0657 — UI panel/frame components: Frames_GrayBG_32x32export

[Preview](previews/S0657.png) · **Sheet:** 384 × 160 px · **Suggested cells:** 32 × 32

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Frames_GrayBG_32x32export.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0658 — UI panel/frame components: Frames_noBG_32x32

[Preview](previews/S0658.png) · **Sheet:** 384 × 160 px · **Suggested cells:** 32 × 32

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Frames_noBG_32x32.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0659 — UI panel/frame components: Name_container

[Preview](previews/S0659.png) · **Sheet:** 80 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Name_container.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0660 — UI panel/frame components: Popup_Window_Brown2_16x16

[Preview](previews/S0660.png) · **Sheet:** 112 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Popup_Window_Brown2_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0661 — UI panel/frame components: Popup_Window_Dark_16x16

[Preview](previews/S0661.png) · **Sheet:** 112 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Popup_Window_Dark_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0662 — UI panel/frame components: Popup_Window_Light_16x16

[Preview](previews/S0662.png) · **Sheet:** 112 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Popup_Window_Light_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0663 — UI panel/frame components: SpeechBubble_white_woutline_16x16

[Preview](previews/S0663.png) · **Sheet:** 64 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/SpeechBubble_white_woutline_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0664 — UI panel/frame components: Bars_32x32

[Preview](previews/S0664.png) · **Sheet:** 96 × 96 px · **Suggested cells:** 32 × 32

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Bars_32x32.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0665 — UI panel/frame components: BpeechBubble_white_16x16

[Preview](previews/S0665.png) · **Sheet:** 80 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/BpeechBubble_white_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0666 — UI panel/frame components: Popup_Window_Brown2_16x16

[Preview](previews/S0666.png) · **Sheet:** 144 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Popup_Window_Brown2_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0667 — UI panel/frame components: Popup_Window_Brown_16x16

[Preview](previews/S0667.png) · **Sheet:** 112 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Popup_Window_Brown_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0668 — UI panel/frame components: Popup_Window_Dark2_16x16

[Preview](previews/S0668.png) · **Sheet:** 144 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Popup_Window_Dark2_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0669 — UI panel/frame components: Popup_Window_Dark_16x16

[Preview](previews/S0669.png) · **Sheet:** 112 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Popup_Window_Dark_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0670 — UI panel/frame components: Popup_Window_Light2_16x16

[Preview](previews/S0670.png) · **Sheet:** 144 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Popup_Window_Light2_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0671 — UI panel/frame components: Popup_Window_Light_16x16

[Preview](previews/S0671.png) · **Sheet:** 112 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Popup_Window_Light_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0672 — UI panel/frame components: SpeechBubble_white_woutline_16x16

[Preview](previews/S0672.png) · **Sheet:** 80 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/SpeechBubble_white_woutline_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0673 — UI panel/frame components: TalkBox_16x16

[Preview](previews/S0673.png) · **Sheet:** 80 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/TalkBox_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0674 — UI panel/frame components: TalkBox_brown_16x16

[Preview](previews/S0674.png) · **Sheet:** 80 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/TalkBox_brown_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0675 — UI panel/frame components: TalkBox_gray_16x16

[Preview](previews/S0675.png) · **Sheet:** 80 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/TalkBox_gray_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0676, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0676 — UI panel/frame components: TalkBox_green_16x16

[Preview](previews/S0676.png) · **Sheet:** 80 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/TalkBox_green_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0677, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0677 — UI panel/frame components: Transparency_container_16x16

[Preview](previews/S0677.png) · **Sheet:** 80 × 176 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Split/Transparency_container_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0678, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0678 — UI panel/frame components: TalkBox_16x16

[Preview](previews/S0678.png) · **Sheet:** 48 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/TalkBox_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0679, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0679 — UI panel/frame components: TalkBox_Brown_16x16

[Preview](previews/S0679.png) · **Sheet:** 48 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/TalkBox_Brown_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0680, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0680 — UI panel/frame components: TalkBox_Gray_16x16

[Preview](previews/S0680.png) · **Sheet:** 48 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/TalkBox_Gray_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0681, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0681 — UI panel/frame components: TalkBox_Green_16x16

[Preview](previews/S0681.png) · **Sheet:** 48 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/TalkBox_Green_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0682, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0682 — UI panel/frame components: Transparency_container_16x16

[Preview](previews/S0682.png) · **Sheet:** 64 × 64 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Containers/Transparency_container_16x16.png`

**Belongs with:** ui-panels. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Dialogue, inventory and popup windows; use sliced pieces for flexible sizing.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0652, S0653, S0654, S0655, S0656, S0657, S0658, S0659, S0660, S0661, S0662, S0663, S0664, S0665, S0666, S0667, S0668, S0669, S0670, S0671, S0672, S0673, S0674, S0675, S0676, S0677, S0678, S0679, S0680, S0681, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0683 — Bitmap alphabet Font_blue

[Preview](previews/S0683.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_blue.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0684 — Bitmap alphabet Font_blue_big

[Preview](previews/S0684.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_blue_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0685 — Bitmap alphabet Font_brown

[Preview](previews/S0685.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_brown.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0686 — Bitmap alphabet Font_brown_big

[Preview](previews/S0686.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_brown_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0687 — Bitmap alphabet Font_dark

[Preview](previews/S0687.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_dark.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0688 — Bitmap alphabet Font_dark_big

[Preview](previews/S0688.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_dark_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0689 — Bitmap alphabet Font_gold

[Preview](previews/S0689.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_gold.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0690 — Bitmap alphabet Font_gold_big

[Preview](previews/S0690.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_gold_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0691 — Bitmap alphabet Font_green

[Preview](previews/S0691.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_green.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0692 — Bitmap alphabet Font_green_big

[Preview](previews/S0692.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_green_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0693 — Bitmap alphabet Font_light

[Preview](previews/S0693.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_light.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0694 — Bitmap alphabet Font_light_big

[Preview](previews/S0694.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_light_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0695, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0695 — Bitmap alphabet Font_red

[Preview](previews/S0695.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_red.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0696, S0697, S0698, S0699, S0700, S0701.

#### S0696 — Bitmap alphabet Font_red_big

[Preview](previews/S0696.png) · **Sheet:** 576 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Fonts/Font_red_big.png`

**Belongs with:** ui-fonts. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Pixel headings and labels. Define glyph map explicitly; provide readable UI scaling.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0697, S0698, S0699, S0700, S0701.

#### S0697 — Icon collection: Coins_16x16

[Preview](previews/S0697.png) · **Sheet:** 64 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Icons/Coins_16x16.png`

**Belongs with:** ui-icons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Equipment, statuses, pickups or menu actions. Assign individual meanings explicitly.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0698, S0699, S0700, S0701.

#### S0698 — Icon collection: Heart_Drop_Star_16x16

[Preview](previews/S0698.png) · **Sheet:** 96 × 240 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Icons/Heart_Drop_Star_16x16.png`

**Belongs with:** ui-icons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Equipment, statuses, pickups or menu actions. Assign individual meanings explicitly.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0699, S0700, S0701.

#### S0699 — Icon collection: Item_Icons_16x16

[Preview](previews/S0699.png) · **Sheet:** 32 × 224 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Icons/Item_Icons_16x16.png`

**Belongs with:** ui-icons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Equipment, statuses, pickups or menu actions. Assign individual meanings explicitly.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0700, S0701.

#### S0700 — Icon collection: Menu_icons_16x16

[Preview](previews/S0700.png) · **Sheet:** 64 × 160 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Icons/Menu_icons_16x16.png`

**Belongs with:** ui-icons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Equipment, statuses, pickups or menu actions. Assign individual meanings explicitly.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0701.

#### S0701 — Icon collection: Status_icons_16x16

[Preview](previews/S0701.png) · **Sheet:** 64 × 448 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Icons/Status_icons_16x16.png`

**Belongs with:** ui-icons. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Equipment, statuses, pickups or menu actions. Assign individual meanings explicitly.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700.

#### S0702 — Segmented life/mana/experience bar parts

[Preview](previews/S0702.png) · **Sheet:** 28 × 240 px · **Suggested cells:** 4 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Angle_Down_LBs_4x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0703 — Segmented life/mana/experience bar parts

[Preview](previews/S0703.png) · **Sheet:** 30 × 240 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Angle_Down_LBs_outline.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0704 — Segmented life/mana/experience bar parts

[Preview](previews/S0704.png) · **Sheet:** 28 × 240 px · **Suggested cells:** 4 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Angle_UP_LBs_4x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0705 — Segmented life/mana/experience bar parts

[Preview](previews/S0705.png) · **Sheet:** 30 × 240 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Angle_UP_LBs_outline.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0706 — Segmented life/mana/experience bar parts

[Preview](previews/S0706.png) · **Sheet:** 28 × 320 px · **Suggested cells:** 4 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Round_LBs_4x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0707 — Segmented life/mana/experience bar parts

[Preview](previews/S0707.png) · **Sheet:** 30 × 320 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Round_LBs_outline.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0708 — Segmented life/mana/experience bar parts

[Preview](previews/S0708.png) · **Sheet:** 96 × 240 px · **Suggested cells:** 8 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Split/Angle_Down_LBs_8x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0707, S0709, S0710, S0711, S0712, S0713.

#### S0709 — Segmented life/mana/experience bar parts

[Preview](previews/S0709.png) · **Sheet:** 96 × 240 px · **Suggested cells:** 8 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Split/Angle_UP_LBs_8x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0710, S0711, S0712, S0713.

#### S0710 — Segmented life/mana/experience bar parts

[Preview](previews/S0710.png) · **Sheet:** 96 × 320 px · **Suggested cells:** 8 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Split/Round_LBs_8x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0711, S0712, S0713.

#### S0711 — Segmented life/mana/experience bar parts

[Preview](previews/S0711.png) · **Sheet:** 96 × 320 px · **Suggested cells:** 8 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Split/Squared_LBs_8x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Split version: components for assembly, not an additional game mechanic or complete window.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0712, S0713.

#### S0712 — Segmented life/mana/experience bar parts

[Preview](previews/S0712.png) · **Sheet:** 28 × 320 px · **Suggested cells:** 4 × 8

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Squared_LBs_4x8.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0713.

#### S0713 — Segmented life/mana/experience bar parts

[Preview](previews/S0713.png) · **Sheet:** 32 × 320 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/LifeBars/Squared_LBs_outline.png`

**Belongs with:** ui-resources. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Resource bars using matching caps, fills and outlines.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712.

#### S0714 — UI indicator: Clock_16x16

[Preview](previews/S0714.png) · **Sheet:** 32 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Misc/Clock_16x16.png`

**Belongs with:** ui-status. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Time, visibility or loading feedback as appropriate to the icon.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0715, S0716.

#### S0715 — UI indicator: Hidding_eye_16x16

[Preview](previews/S0715.png) · **Sheet:** 64 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Misc/Hidding_eye_16x16.png`

**Belongs with:** ui-status. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Time, visibility or loading feedback as appropriate to the icon.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0714, S0716.

#### S0716 — UI indicator: Load_16x16

[Preview](previews/S0716.png) · **Sheet:** 80 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny_GUI_Pack_v2.zip` → `GUI_Pack/Misc/Load_16x16.png`

**Belongs with:** ui-status. **Companion groups:** ui-buttons, ui-icons, ui-fonts.

**Use:** Time, visibility or loading feedback as appropriate to the icon.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0647, S0648, S0649, S0650, S0651, S0654, S0683, S0684, S0685, S0686, S0687, S0688, S0689, S0690, S0691, S0692, S0693, S0694, S0695, S0696, S0697, S0698, S0699, S0700, S0701, S0714, S0715.

### Wildlife and livestock


#### S0304 — Rabbit idle/walk, multiple colours

[Preview](previews/S0304.png) · **Sheet:** 128 × 112 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Wildlife/Bunny.png`

**Belongs with:** wildlife-bunny. **Companion groups:** biome-forest.

**Use:** Ambient wildlife and hints toward hidden clearings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0305 — Scorpion idle/walk/attack and colour variants

[Preview](previews/S0305.png) · **Sheet:** 192 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Wildlife/Scorpion.png`

**Belongs with:** wildlife-scorpion. **Companion groups:** biome-desert.

**Use:** Small desert threat with a clearly telegraphed sting.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0275, S0276, S0280, S0290, S0298, S0299.

#### S0306 — Squirrel idle/walk and colour variants

[Preview](previews/S0306.png) · **Sheet:** 128 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Wildlife/Squirrel.png`

**Belongs with:** wildlife-squirrel. **Companion groups:** biome-forest.

**Use:** Ambient movement and playful secret clues.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Exclude baked labels; map each action block and variant separately.

**Related IDs:** S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302.

#### S0317 — Animated crabs in multiple colours

[Preview](previews/S0317.png) · **Sheet:** 64 × 192 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Other/crab_animation_16x16.png`

**Belongs with:** wildlife-crab. **Companion groups:** coast-water.

**Use:** Coastal wildlife or small sideways-moving enemies.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0321, S0322, S0323, S0324, S0325, S0326, S0327.

#### S0446 — Cat animation sheet with directional poses and colour variants

[Preview](previews/S0446.png) · **Sheet:** 64 × 320 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Animals/Cat.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0447, S0448, S0449, S0450, S0451, S0453, S0488, S0600, S0601, S0605.

#### S0447 — Chicken animation sheet with directional poses and colour variants

[Preview](previews/S0447.png) · **Sheet:** 64 × 240 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Animals/Chicken.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0446, S0448, S0449, S0450, S0451, S0453, S0488, S0600, S0601, S0605.

#### S0448 — Cow animation sheet with directional poses and colour variants

[Preview](previews/S0448.png) · **Sheet:** 64 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Animals/Cow.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0446, S0447, S0449, S0450, S0451, S0453, S0488, S0600, S0601, S0605.

#### S0449 — Dog animation sheet with directional poses and colour variants

[Preview](previews/S0449.png) · **Sheet:** 64 × 320 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Animals/Dog.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0446, S0447, S0448, S0450, S0451, S0453, S0488, S0600, S0601, S0605.

#### S0450 — Sheep animation sheet with directional poses and colour variants

[Preview](previews/S0450.png) · **Sheet:** 64 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Animals/Sheep.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0446, S0447, S0448, S0449, S0451, S0453, S0488, S0600, S0601, S0605.

#### S0451 — Small birds animation sheet with directional poses and colour variants

[Preview](previews/S0451.png) · **Sheet:** 64 × 256 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Animals/Small_birds.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0446, S0447, S0448, S0449, S0450, S0453, S0488, S0600, S0601, S0605.

#### S0488 — Chicken animation sheet with directional poses and colour variants

[Preview](previews/S0488.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Chicken.png`

**Belongs with:** farm-animals. **Companion groups:** farm-buildings, village-environment.

**Use:** Village life, animal rescue requests and optional husbandry.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** These appearances do not imply supplied AI or husbandry mechanics.

**Related IDs:** S0446, S0447, S0448, S0449, S0450, S0451, S0453, S0600, S0601, S0605.

### World, props and items


#### S0237 — Coloured orb pickups

[Preview](previews/S0237.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Blue_orb.png`

**Belongs with:** item-orbs. **Companion groups:** ui-resources.

**Use:** Mana, experience or temporary resource pickups; assign colours consistently.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0239, S0243, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0238 — Small coin pickup

[Preview](previews/S0238.png) · **Sheet:** 5 × 5 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Coin.png`

**Belongs with:** item-currency. **Companion groups:** item-treasure, village-shop.

**Use:** Currency reward.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0264, S0644.

#### S0239 — Coloured orb pickups

[Preview](previews/S0239.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Green_orb.png`

**Belongs with:** item-orbs. **Companion groups:** ui-resources.

**Use:** Mana, experience or temporary resource pickups; assign colours consistently.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0237, S0243, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0240 — Heart pickup

[Preview](previews/S0240.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Heart.png`

**Belongs with:** item-health. **Companion groups:** ui-resources.

**Use:** Health recovery.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0241 — Key pickup or outlined UI variant

[Preview](previews/S0241.png) · **Sheet:** 9 × 6 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Misc/Key.png`

**Belongs with:** item-key. **Companion groups:** item-chest, castle-door.

**Use:** Key-gated doors and rewards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0242, S0255, S0398, S0401, S0614, S0615, S0639.

#### S0242 — Key pickup or outlined UI variant

[Preview](previews/S0242.png) · **Sheet:** 11 × 8 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Misc/Key_outline.png`

**Belongs with:** item-key. **Companion groups:** item-chest, castle-door.

**Use:** Key-gated doors and rewards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0241, S0255, S0398, S0401, S0614, S0615, S0639.

#### S0243 — Coloured orb pickups

[Preview](previews/S0243.png) · **Sheet:** 7 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Red_orb.png`

**Belongs with:** item-orbs. **Companion groups:** ui-resources.

**Use:** Mana, experience or temporary resource pickups; assign colours consistently.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0237, S0239, S0702, S0703, S0704, S0705, S0706, S0707, S0708, S0709, S0710, S0711, S0712, S0713.

#### S0244 — Arrow pickup/projectile or outlined icon

[Preview](previews/S0244.png) · **Sheet:** 12 × 5 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Arrow.png`

**Belongs with:** item-arrow. **Companion groups:** hero-bow, trap-shooter.

**Use:** Bow ammunition and projectile hazards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 3.

**Notes:** Share visual identity; give hero and trap projectiles separate ownership and damage data.

**Related IDs:** S0080, S0085, S0090, S0095, S0100, S0105, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0245, S0426, S0427, S0428, S0429.

#### S0245 — Arrow pickup/projectile or outlined icon

[Preview](previews/S0245.png) · **Sheet:** 14 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Arrow_outline.png`

**Belongs with:** item-arrow. **Companion groups:** hero-bow, trap-shooter.

**Use:** Bow ammunition and projectile hazards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Share visual identity; give hero and trap projectiles separate ownership and damage data.

**Related IDs:** S0080, S0085, S0090, S0095, S0100, S0105, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0244, S0426, S0427, S0428, S0429.

#### S0246 — Bow equipment icon

[Preview](previews/S0246.png) · **Sheet:** 14 × 7 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Bow.png`

**Belongs with:** item-bow. **Companion groups:** hero-bow, item-arrow.

**Use:** Bow pickup and equipment slot.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0080, S0085, S0090, S0095, S0100, S0105, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0244, S0245, S0247.

#### S0247 — Bow equipment icon

[Preview](previews/S0247.png) · **Sheet:** 16 × 9 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Bow_outline.png`

**Belongs with:** item-bow. **Companion groups:** hero-bow, item-arrow.

**Use:** Bow pickup and equipment slot.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0080, S0085, S0090, S0095, S0100, S0105, S0160, S0161, S0162, S0163, S0186, S0187, S0188, S0189, S0244, S0245, S0246.

#### S0248 — Shield equipment icon

[Preview](previews/S0248.png) · **Sheet:** 12 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Shield.png`

**Belongs with:** item-shield. **Companion groups:** hero-shield, enemy-soldier.

**Use:** Blocking, projectile defence and equipment UI.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0249, S0635.

#### S0249 — Shield equipment icon

[Preview](previews/S0249.png) · **Sheet:** 14 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Shield_outline.png`

**Belongs with:** item-shield. **Companion groups:** hero-shield, enemy-soldier.

**Use:** Blocking, projectile defence and equipment UI.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0083, S0084, S0088, S0089, S0093, S0094, S0098, S0099, S0103, S0104, S0108, S0109, S0174, S0175, S0176, S0177, S0178, S0179, S0180, S0181, S0201, S0202, S0203, S0204, S0205, S0206, S0207, S0208, S0248, S0635.

#### S0250 — Sword equipment icon

[Preview](previews/S0250.png) · **Sheet:** 7 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Sword.png`

**Belongs with:** item-sword. **Companion groups:** hero-sword.

**Use:** Starting weapon and equipment UI.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0058, S0062, S0066, S0070, S0074, S0078, S0164, S0165, S0166, S0167, S0190, S0191, S0192, S0193, S0251.

#### S0251 — Sword equipment icon

[Preview](previews/S0251.png) · **Sheet:** 9 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Items/Weapon/Sword_outline.png`

**Belongs with:** item-sword. **Companion groups:** hero-sword.

**Use:** Starting weapon and equipment UI.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0058, S0062, S0066, S0070, S0074, S0078, S0164, S0165, S0166, S0167, S0190, S0191, S0192, S0193, S0250.

#### S0252 — Narrow bridge segment

[Preview](previews/S0252.png) · **Sheet:** 8 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Bridge_side.png`

**Belongs with:** forest-bridge. **Companion groups:** forest-water, hazard-pit.

**Use:** Crossings, shortcuts and hook/bomb route puzzles.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0253, S0270, S0271, S0272, S0273.

#### S0253 — Narrow bridge segment

[Preview](previews/S0253.png) · **Sheet:** 16 × 8 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Bridge_vertical.png`

**Belongs with:** forest-bridge. **Companion groups:** forest-water, hazard-pit.

**Use:** Crossings, shortcuts and hook/bomb route puzzles.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0252, S0270, S0271, S0272, S0273.

#### S0254 — Rounded green bush

[Preview](previews/S0254.png) · **Sheet:** 15 × 13 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Bush.png`

**Belongs with:** forest-props. **Companion groups:** forest-environment, hero-sword.

**Use:** Trail borders and optional cuttable forage.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0058, S0062, S0066, S0070, S0074, S0078, S0164, S0165, S0166, S0167, S0190, S0191, S0192, S0193, S0260, S0262, S0263, S0269, S0402, S0606, S0608, S0609, S0610, S0611.

#### S0255 — Chest opening animation strip

[Preview](previews/S0255.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Chest.png`

**Belongs with:** item-chest. **Companion groups:** item-key, enemy-mimic.

**Use:** Persistent surface treasure or per-expedition dungeon reward.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0241, S0242, S0398, S0401, S0615, S0634, S0639.

#### S0256 — Small flower ground decoration

[Preview](previews/S0256.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Flower_blue.png`

**Belongs with:** forest-flowers. **Companion groups:** forest-environment, biome-forest.

**Use:** Landmark colour patches and decoration along persistent forest paths.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0257, S0258, S0269, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302, S0606, S0608, S0609, S0610, S0611.

#### S0257 — Small flower ground decoration

[Preview](previews/S0257.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Flower_orange.png`

**Belongs with:** forest-flowers. **Companion groups:** forest-environment, biome-forest.

**Use:** Landmark colour patches and decoration along persistent forest paths.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0256, S0258, S0269, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302, S0606, S0608, S0609, S0610, S0611.

#### S0258 — Small flower ground decoration

[Preview](previews/S0258.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Flower_pink.png`

**Belongs with:** forest-flowers. **Companion groups:** forest-environment, biome-forest.

**Use:** Landmark colour patches and decoration along persistent forest paths.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0256, S0257, S0269, S0277, S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302, S0606, S0608, S0609, S0610, S0611.

#### S0259 — Plain grass ground tile

[Preview](previews/S0259.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Grass.png`

**Belongs with:** forest-ground. **Companion groups:** forest-environment, forest-props.

**Use:** Base overworld fill tile.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0254, S0260, S0262, S0263, S0269, S0402, S0606, S0608, S0609, S0610, S0611.

#### S0260 — Wooden post

[Preview](previews/S0260.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Pole.png`

**Belongs with:** forest-props. **Companion groups:** forest-bridge, item-hook.

**Use:** Fence support or grapple target if given a distinctive marker.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0252, S0253, S0254, S0262, S0263, S0402, S0638.

#### S0262 — Rock or stone obstacle

[Preview](previews/S0262.png) · **Sheet:** 15 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Rock.png`

**Belongs with:** forest-props. **Companion groups:** forest-environment, hero-pickaxe.

**Use:** Outdoor barriers, weights or breakable ore nodes.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Notes:** Rock2 is not one consistent sprite: Adventure and Dungeon versions differ visibly.

**Related IDs:** S0138, S0142, S0146, S0150, S0154, S0158, S0254, S0260, S0263, S0269, S0402, S0606, S0608, S0609, S0610, S0611.

#### S0263 — Rock or stone obstacle

[Preview](previews/S0263.png) · **Sheet:** 14 × 8 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Rock2.png`

**Belongs with:** forest-props. **Companion groups:** forest-environment, hero-pickaxe.

**Use:** Outdoor barriers, weights or breakable ore nodes.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Rock2 is not one consistent sprite: Adventure and Dungeon versions differ visibly.

**Related IDs:** S0138, S0142, S0146, S0150, S0154, S0158, S0254, S0260, S0262, S0269, S0402, S0606, S0608, S0609, S0610, S0611.

#### S0264 — Market counter/stall strip

[Preview](previews/S0264.png) · **Sheet:** 48 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Adventure Pack Plus.zip` → `Tiny Adventure Pack Plus/Other/Misc/Shop.png`

**Belongs with:** village-shop. **Companion groups:** village-npcs, item-treasure.

**Use:** Merchant interaction point.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0235, S0236, S0463, S0464, S0465, S0466, S0467, S0468, S0469, S0480, S0481, S0482, S0483, S0484, S0485, S0486, S0487, S0554, S0555, S0556, S0557, S0558, S0559, S0560, S0644.

#### S0265 — Signboard or hanging sign variant

[Preview](previews/S0265.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Sign.png`

**Belongs with:** village-signs. **Companion groups:** village-environment.

**Use:** Directions, hints and shop identification.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0600, S0601, S0602, S0603, S0604, S0605.

#### S0266 — Round tree artwork; Farm version includes sizes and stumps

[Preview](previews/S0266.png) · **Sheet:** 48 × 54 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Tree/Tree.png`

**Belongs with:** forest-trees. **Companion groups:** forest-environment, hero-axe.

**Use:** Persistent forest barriers, clearings and chop/open states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Notes:** Some packs have a single assembled tree; Farm has a mixed-size collection. Preserve separate canopy/trunk assets where available.

**Related IDs:** S0136, S0140, S0144, S0148, S0152, S0156, S0267, S0268, S0269, S0461, S0606, S0608, S0609, S0610, S0611.

#### S0267 — Separated tree canopy or trunk component

[Preview](previews/S0267.png) · **Sheet:** 48 × 46 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Tree/Tree_top.png`

**Belongs with:** forest-trees. **Companion groups:** forest-environment, hero-axe.

**Use:** Layer canopy above actors and trunk among obstacles.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0136, S0140, S0144, S0148, S0152, S0156, S0266, S0268, S0269, S0461, S0606, S0608, S0609, S0610, S0611.

#### S0268 — Separated tree canopy or trunk component

[Preview](previews/S0268.png) · **Sheet:** 18 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Tree/Tree_trunk.png`

**Belongs with:** forest-trees. **Companion groups:** forest-environment, hero-axe.

**Use:** Layer canopy above actors and trunk among obstacles.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 9.

**Related IDs:** S0136, S0140, S0144, S0148, S0152, S0156, S0266, S0267, S0269, S0461, S0606, S0608, S0609, S0610, S0611.

#### S0274 — Seasonal bush clusters in several colours

[Preview](previews/S0274.png) · **Sheet:** 96 × 64 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Bushes.png`

**Belongs with:** biome-props. **Companion groups:** biome-forest, biome-desert, biome-winter.

**Use:** Layered trail boundaries, cover and forage spots.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0275, S0276, S0277, S0278, S0279, S0280, S0281, S0290, S0291, S0292, S0293, S0294, S0295, S0296, S0297, S0298, S0299, S0300, S0301, S0302, S0303.

#### S0275 — Desert cacti, including flowering forms

[Preview](previews/S0275.png) · **Sheet:** 64 × 96 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Cactus.png`

**Belongs with:** biome-desert. **Companion groups:** biome-desert.

**Use:** Desert barriers, landmarks and optional contact hazards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0276, S0280, S0290, S0298, S0299.

#### S0276 — Skulls, bones, stones and dry branches

[Preview](previews/S0276.png) · **Sheet:** 32 × 96 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Desert_decoration.png`

**Belongs with:** biome-desert. **Companion groups:** biome-desert.

**Use:** Environmental storytelling around desert trails.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0275, S0280, S0290, S0298, S0299.

#### S0277 — Small decorative mushroom variants

[Preview](previews/S0277.png) · **Sheet:** 48 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Mooshrooms.png`

**Belongs with:** biome-forest. **Companion groups:** biome-forest, enemy-mushrooms.

**Use:** Forage patches and visual warning near mushroom enemies.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Decorative mushrooms and animated mushroom enemies are separate assets.

**Related IDs:** S0278, S0279, S0291, S0292, S0293, S0295, S0296, S0297, S0300, S0301, S0302, S0442.

#### S0278 — Conifer trees, snowy forms, stumps and seasonal colours

[Preview](previews/S0278.png) · **Sheet:** 256 × 192 px · **Suggested cells:** 32 × 48

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Trees/Pinetrees_32x48.png`

**Belongs with:** biome-forest. **Companion groups:** biome-forest, biome-winter.

**Use:** Outdoor dungeon walls and winter clearings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 32x48 tree cells; the entire sheet is not one tree.

**Related IDs:** S0277, S0279, S0281, S0291, S0292, S0293, S0294, S0295, S0296, S0297, S0300, S0301, S0302, S0303.

#### S0279 — Round-canopy deciduous trees, snowy/seasonal colours and small ground details

[Preview](previews/S0279.png) · **Sheet:** 288 × 256 px · **Suggested cells:** 48 × 48

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Trees/Trees_48x48.png`

**Belongs with:** biome-forest. **Companion groups:** biome-forest, biome-winter.

**Use:** Persistent forest corridors and recognisable landmarks.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 48x48 main tree cells; supporting small details need separate rectangles. Sheet dimensions do not divide evenly by suggested cell size; explicit rectangles required.

**Related IDs:** S0277, S0278, S0281, S0291, S0292, S0293, S0294, S0295, S0296, S0297, S0300, S0301, S0302, S0303.

#### S0280 — Rolling tumbleweed variants

[Preview](previews/S0280.png) · **Sheet:** 64 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/Tumbleweed.png`

**Belongs with:** biome-desert. **Companion groups:** biome-desert.

**Use:** Ambient moving desert scenery; could become a minor moving obstacle.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0275, S0276, S0290, S0298, S0299.

#### S0281 — Snowmen, festive arch and presents

[Preview](previews/S0281.png) · **Sheet:** 80 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Misc/xmas_decoration.png`

**Belongs with:** biome-winter. **Companion groups:** biome-winter, npc-santa, enemy-santa-goblin.

**Use:** Optional winter event scenery and gift rewards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0284, S0289, S0294, S0303.

#### S0298 — Four-frame spiral quicksand tile strip

[Preview](previews/S0298.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Biomes Vol.1.zip` → `Tiny Biomes Vol.1/Tilesets/Old Style/Decoration tiles/Quicksands_16x16.png`

**Belongs with:** biome-desert. **Companion groups:** biome-desert, hero-roll.

**Use:** Telegraphed desert hazard or slow terrain; collision and damage remain game logic.

**Version:** Alternative terrain style; keep within a consistent region. **Exact source occurrences:** 1.

**Related IDs:** S0005, S0011, S0017, S0023, S0029, S0035, S0275, S0276, S0280, S0290, S0299.

#### S0307 — Boat hull variants in four directions

[Preview](previews/S0307.png) · **Sheet:** 512 × 256 px · **Suggested cells:** 64 × 64

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Boat/boat_base_64x64.png`

**Belongs with:** coast-boat. **Companion groups:** coast-sails, coast-upgrades, coast-water.

**Use:** Persistent travel to islands and coastal dungeon entrances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 64x64 placement cells; draw sails as a separate layer.

**Related IDs:** S0308, S0309, S0321, S0322, S0323, S0324, S0325, S0326, S0327.

#### S0308 — Sail and mast variants

[Preview](previews/S0308.png) · **Sheet:** 128 × 256 px · **Suggested cells:** 32 × 64

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Boat/boat_sails_32x64.png`

**Belongs with:** coast-sails. **Companion groups:** coast-boat, coast-upgrades.

**Use:** Boat appearance and readable upgrade states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 32x64 components require attachment offsets to boat hulls.

**Related IDs:** S0307, S0309.

#### S0309 — Boat fittings, flags and attachment pieces

[Preview](previews/S0309.png) · **Sheet:** 63 × 80 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Boat/boat_upgrades_16x16.png`

**Belongs with:** coast-upgrades. **Companion groups:** coast-boat, coast-sails.

**Use:** Boat customisation and travel progression.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Sheet is 63 pixels wide: do not derive frame count by blindly dividing the full width by 16. Sheet dimensions do not divide evenly by suggested cell size; explicit rectangles required.

**Related IDs:** S0307, S0308.

#### S0316 — Bait and lure variants

[Preview](previews/S0316.png) · **Sheet:** 64 × 48 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Other/baits_16x16.png`

**Belongs with:** coast-fishing. **Companion groups:** hero-fishing, coast-fish, coast-rods.

**Use:** Optional bait choices for catches and small supply quests.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0310, S0311, S0312, S0313, S0314, S0315, S0318, S0319.

#### S0318 — Fish, shell-like catches, junk and bottle-like discoveries

[Preview](previews/S0318.png) · **Sheet:** 96 × 352 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Other/FishIcons_n_junk_16x16.png`

**Belongs with:** coast-fish. **Companion groups:** hero-fishing, coast-fishing.

**Use:** Fishing collection, food supplies, treasure clues and salvage.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Treat individual species names as unconfirmed; the source does not label every icon.

**Related IDs:** S0310, S0311, S0312, S0313, S0314, S0315, S0316.

#### S0319 — Fishing rod item icons in three colour treatments

[Preview](previews/S0319.png) · **Sheet:** 48 × 16 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Other/fishing_rod_16x16.png`

**Belongs with:** coast-rods. **Companion groups:** hero-fishing, coast-fishing.

**Use:** Inventory, equipment and fishing interaction prompts.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0310, S0311, S0312, S0313, S0314, S0315, S0316.

#### S0320 — Palm canopy, trunk/stump and tropical fruit forms

[Preview](previews/S0320.png) · **Sheet:** 80 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Other/Palmtree_n_fruits.png`

**Belongs with:** coast-props. **Companion groups:** coast-water, coast-fish.

**Use:** Coastal landmarks, forage and island scenery.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Mixed-size sheet; palm tree exceeds one 16x16 cell.

**Related IDs:** S0318, S0321, S0322, S0323, S0324, S0325, S0326, S0327.

#### S0327 — Water decorations, shore props and spiral effects

[Preview](previews/S0327.png) · **Sheet:** 64 × 144 px · **Suggested cells:** 16 × 16

**Source:** `Tiny Coast Pack_v2.zip` → `Tiny Coast Pack/Water/water_misc_16x16.png`

**Belongs with:** coast-water. **Companion groups:** coast-boat, coast-fish.

**Use:** Coastal detail, fishing spots and possible current/whirlpool indicators.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0307, S0318, S0321, S0322, S0323, S0324, S0325, S0326.

#### S0398 — Chest opening animation strip

[Preview](previews/S0398.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Big_treasure_chest.png`

**Belongs with:** item-chest. **Companion groups:** item-key, enemy-mimic.

**Use:** Persistent surface treasure or per-expedition dungeon reward.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0241, S0242, S0255, S0401, S0615, S0634, S0639.

#### S0399 — Wooden crate

[Preview](previews/S0399.png) · **Sheet:** 15 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Box.png`

**Belongs with:** puzzle-crates. **Companion groups:** puzzle-pressure, hero-carry, hero-push-pull.

**Use:** Movable weight, breakable object or thrown obstacle.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0400, S0407.

#### S0400 — Heavy metal-looking crate

[Preview](previews/S0400.png) · **Sheet:** 12 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Box_heavy.png`

**Belongs with:** puzzle-crates. **Companion groups:** puzzle-pressure, hero-push-pull.

**Use:** Push-only weight and strength-gated puzzle object.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0399, S0407.

#### S0401 — Key pickup or outlined UI variant

[Preview](previews/S0401.png) · **Sheet:** 11 × 6 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Golden_key.png`

**Belongs with:** item-key. **Companion groups:** item-chest, castle-door.

**Use:** Key-gated doors and rewards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0241, S0242, S0255, S0398, S0614, S0615, S0639.

#### S0402 — Rock or stone obstacle

[Preview](previews/S0402.png) · **Sheet:** 15 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Rock2.png`

**Belongs with:** forest-props. **Companion groups:** forest-environment, hero-pickaxe.

**Use:** Outdoor barriers, weights or breakable ore nodes.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** Rock2 is not one consistent sprite: Adventure and Dungeon versions differ visibly.

**Related IDs:** S0138, S0142, S0146, S0150, S0154, S0158, S0254, S0260, S0262, S0263, S0269, S0606, S0608, S0609, S0610, S0611.

#### S0403 — Stair or stairway/doorframe composite

[Preview](previews/S0403.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Stairs_down.png`

**Belongs with:** prop-stairs. **Companion groups:** dungeon-room, village-environment.

**Use:** Persistent dungeon entrance or interior connection.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** Village stairs can be 48x48 composites; inspect dimensions in the record.

**Related IDs:** S0404, S0405, S0412, S0413, S0414, S0415, S0416, S0492, S0493, S0494, S0600, S0601, S0605, S0641.

#### S0404 — Stair or stairway/doorframe composite

[Preview](previews/S0404.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Stairs_down_grass.png`

**Belongs with:** prop-stairs. **Companion groups:** dungeon-room, village-environment.

**Use:** Persistent dungeon entrance or interior connection.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** Village stairs can be 48x48 composites; inspect dimensions in the record.

**Related IDs:** S0403, S0405, S0412, S0413, S0414, S0415, S0416, S0492, S0493, S0494, S0600, S0601, S0605, S0641.

#### S0405 — Stair or stairway/doorframe composite

[Preview](previews/S0405.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Stairs_up.png`

**Belongs with:** prop-stairs. **Companion groups:** dungeon-room, village-environment.

**Use:** Persistent dungeon entrance or interior connection.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** Village stairs can be 48x48 composites; inspect dimensions in the record.

**Related IDs:** S0403, S0404, S0412, S0413, S0414, S0415, S0416, S0492, S0493, S0494, S0600, S0601, S0605, S0641.

#### S0406 — Two-state blue/orange lever

[Preview](previews/S0406.png) · **Sheet:** 20 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Switches/Switch_blue_orange.png`

**Belongs with:** puzzle-colour-switch. **Companion groups:** puzzle-colour-walls.

**Use:** Toggle alternating barriers; keep colour and shape feedback together.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0418, S0419, S0420, S0421.

#### S0407 — Pressed/unpressed floor plate

[Preview](previews/S0407.png) · **Sheet:** 28 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Switches/Switch_press.png`

**Belongs with:** puzzle-pressure. **Companion groups:** puzzle-crates, hero-push-pull.

**Use:** Weight puzzles and shortcuts that remain open after solving.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0003, S0004, S0009, S0010, S0015, S0016, S0021, S0022, S0027, S0028, S0033, S0034, S0399, S0400.

#### S0408 — Animated torch; castle sheet includes multiple flame colours

[Preview](previews/S0408.png) · **Sheet:** 48 × 10 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Torch.png`

**Belongs with:** prop-torch. **Companion groups:** dungeon-room, castle-environment.

**Use:** Readable room landmarks and optional lighting puzzles.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0412, S0413, S0414, S0415, S0416, S0613, S0636, S0645.

#### S0409 — Pot or ceramic vessel

[Preview](previews/S0409.png) · **Sheet:** 14 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Misc/Vessel.png`

**Belongs with:** prop-vessel. **Companion groups:** hero-carry, item-bomb.

**Use:** Breakable loot container or throwable puzzle prop.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0110, S0111, S0112, S0114, S0115, S0116, S0118, S0119, S0120, S0122, S0123, S0124, S0126, S0127, S0128, S0130, S0131, S0132, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0431, S0432, S0433.

#### S0418 — Animated raised/lowered blue or orange barrier

[Preview](previews/S0418.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Color_Wall/Blue_wall_down.png`

**Belongs with:** puzzle-colour-walls. **Companion groups:** puzzle-colour-switch.

**Use:** Two-state barrier puzzles; animation direction is explicit in filename.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0406, S0419, S0420, S0421.

#### S0419 — Animated raised/lowered blue or orange barrier

[Preview](previews/S0419.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Color_Wall/Blue_wall_up.png`

**Belongs with:** puzzle-colour-walls. **Companion groups:** puzzle-colour-switch.

**Use:** Two-state barrier puzzles; animation direction is explicit in filename.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0406, S0418, S0420, S0421.

#### S0420 — Animated raised/lowered blue or orange barrier

[Preview](previews/S0420.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Color_Wall/Orange_wall_down.png`

**Belongs with:** puzzle-colour-walls. **Companion groups:** puzzle-colour-switch.

**Use:** Two-state barrier puzzles; animation direction is explicit in filename.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0406, S0418, S0419, S0421.

#### S0421 — Animated raised/lowered blue or orange barrier

[Preview](previews/S0421.png) · **Sheet:** 96 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Color_Wall/Orange_wall_up.png`

**Belongs with:** puzzle-colour-walls. **Companion groups:** puzzle-colour-switch.

**Use:** Two-state barrier puzzles; animation direction is explicit in filename.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0406, S0418, S0419, S0420.

#### S0422 — Directional chevron floor tile

[Preview](previews/S0422.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Pushing_floor/Floor_push_down.png`

**Belongs with:** trap-push-floor. **Companion groups:** dungeon-room, hazard-pit.

**Use:** Conveyor/current-style movement puzzles and timed crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0270, S0272, S0412, S0413, S0414, S0415, S0416, S0423, S0424, S0425.

#### S0423 — Directional chevron floor tile

[Preview](previews/S0423.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Pushing_floor/Floor_push_left.png`

**Belongs with:** trap-push-floor. **Companion groups:** dungeon-room, hazard-pit.

**Use:** Conveyor/current-style movement puzzles and timed crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0270, S0272, S0412, S0413, S0414, S0415, S0416, S0422, S0424, S0425.

#### S0424 — Directional chevron floor tile

[Preview](previews/S0424.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Pushing_floor/Floor_push_right.png`

**Belongs with:** trap-push-floor. **Companion groups:** dungeon-room, hazard-pit.

**Use:** Conveyor/current-style movement puzzles and timed crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0270, S0272, S0412, S0413, S0414, S0415, S0416, S0422, S0423, S0425.

#### S0425 — Directional chevron floor tile

[Preview](previews/S0425.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Pushing_floor/Floor_push_up.png`

**Belongs with:** trap-push-floor. **Companion groups:** dungeon-room, hazard-pit.

**Use:** Conveyor/current-style movement puzzles and timed crossings.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0270, S0272, S0412, S0413, S0414, S0415, S0416, S0422, S0423, S0424.

#### S0426 — Directional wall or floor projectile emitter

[Preview](previews/S0426.png) · **Sheet:** 15 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Shooting_trap/Shooting_trap_down.png`

**Belongs with:** trap-shooter. **Companion groups:** item-arrow, dungeon-room.

**Use:** Telegraphed projectile corridors and shield challenges.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0244, S0245, S0412, S0413, S0414, S0415, S0416, S0427, S0428, S0429.

#### S0427 — Directional wall or floor projectile emitter

[Preview](previews/S0427.png) · **Sheet:** 15 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Shooting_trap/Shooting_trap_left.png`

**Belongs with:** trap-shooter. **Companion groups:** item-arrow, dungeon-room.

**Use:** Telegraphed projectile corridors and shield challenges.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0244, S0245, S0412, S0413, S0414, S0415, S0416, S0426, S0428, S0429.

#### S0428 — Directional wall or floor projectile emitter

[Preview](previews/S0428.png) · **Sheet:** 15 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Shooting_trap/Shooting_trap_right.png`

**Belongs with:** trap-shooter. **Companion groups:** item-arrow, dungeon-room.

**Use:** Telegraphed projectile corridors and shield challenges.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0244, S0245, S0412, S0413, S0414, S0415, S0416, S0426, S0427, S0429.

#### S0429 — Directional wall or floor projectile emitter

[Preview](previews/S0429.png) · **Sheet:** 15 × 15 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Shooting_trap/Shooting_trap_up.png`

**Belongs with:** trap-shooter. **Companion groups:** item-arrow, dungeon-room.

**Use:** Telegraphed projectile corridors and shield challenges.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Related IDs:** S0244, S0245, S0412, S0413, S0414, S0415, S0416, S0426, S0427, S0428.

#### S0430 — Retracting/extending spike animation strip

[Preview](previews/S0430.png) · **Sheet:** 112 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Traps/Spike_trap.png`

**Belongs with:** trap-spikes. **Companion groups:** dungeon-room, hero-roll.

**Use:** Timed floor hazards and movement challenges.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** The strip is trimmed to 12-pixel-tall frames; not 16x16.

**Related IDs:** S0005, S0011, S0017, S0023, S0029, S0035, S0412, S0413, S0414, S0415, S0416.

#### S0431 — Bomb pickup, lit fuse animation or outlined icon

[Preview](previews/S0431.png) · **Sheet:** 12 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Weapons/Bomb.png`

**Belongs with:** item-bomb. **Companion groups:** hero-carry, hero-throw, puzzle-crates.

**Use:** Timed combat explosive and destructible-wall puzzle tool.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** No dedicated explosion sheet was identified in this archive collection; create an effect or adapt one deliberately.

**Related IDs:** S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0121, S0122, S0123, S0124, S0125, S0126, S0127, S0128, S0129, S0130, S0131, S0132, S0133, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0432, S0433.

#### S0432 — Bomb pickup, lit fuse animation or outlined icon

[Preview](previews/S0432.png) · **Sheet:** 64 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Weapons/Bomb_lighted.png`

**Belongs with:** item-bomb. **Companion groups:** hero-carry, hero-throw, puzzle-crates.

**Use:** Timed combat explosive and destructible-wall puzzle tool.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** No dedicated explosion sheet was identified in this archive collection; create an effect or adapt one deliberately.

**Related IDs:** S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0121, S0122, S0123, S0124, S0125, S0126, S0127, S0128, S0129, S0130, S0131, S0132, S0133, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0431, S0433.

#### S0433 — Bomb pickup, lit fuse animation or outlined icon

[Preview](previews/S0433.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Weapons/Bomb_outline.png`

**Belongs with:** item-bomb. **Companion groups:** hero-carry, hero-throw, puzzle-crates.

**Use:** Timed combat explosive and destructible-wall puzzle tool.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** No dedicated explosion sheet was identified in this archive collection; create an effect or adapt one deliberately.

**Related IDs:** S0110, S0111, S0112, S0113, S0114, S0115, S0116, S0117, S0118, S0119, S0120, S0121, S0122, S0123, S0124, S0125, S0126, S0127, S0128, S0129, S0130, S0131, S0132, S0133, S0332, S0333, S0334, S0335, S0336, S0337, S0338, S0339, S0340, S0341, S0342, S0343, S0344, S0345, S0346, S0347, S0352, S0353, S0354, S0355, S0356, S0357, S0358, S0359, S0360, S0361, S0362, S0363, S0364, S0365, S0366, S0367, S0399, S0400, S0431, S0432.

#### S0434 — Boomerang equipment or outlined icon

[Preview](previews/S0434.png) · **Sheet:** 10 × 14 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Weapons/Boomerang.png`

**Belongs with:** item-boomerang. **Companion groups:** hero-boomerang, hero-throw, puzzle-colour-switch.

**Use:** Returning projectile, remote switches and item retrieval.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** Icon art is supplied; flight spin/path and return behaviour require implementation.

**Related IDs:** S0113, S0117, S0121, S0125, S0129, S0133, S0328, S0329, S0330, S0331, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0364, S0365, S0366, S0367, S0406, S0435.

#### S0435 — Boomerang equipment or outlined icon

[Preview](previews/S0435.png) · **Sheet:** 12 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Dungeon Pack.zip` → `Tiny Dungeon Pack/Weapons/Boomerang_outline.png`

**Belongs with:** item-boomerang. **Companion groups:** hero-boomerang, hero-throw, puzzle-colour-switch.

**Use:** Returning projectile, remote switches and item retrieval.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 2.

**Notes:** Icon art is supplied; flight spin/path and return behaviour require implementation.

**Related IDs:** S0113, S0117, S0121, S0125, S0129, S0133, S0328, S0329, S0330, S0331, S0344, S0345, S0346, S0347, S0348, S0349, S0350, S0351, S0364, S0365, S0366, S0367, S0406, S0434.

#### S0453 — Six barn facade colours

[Preview](previews/S0453.png) · **Sheet:** 192 × 160 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Barns.png`

**Belongs with:** farm-buildings. **Companion groups:** farm-animals, farm-props.

**Use:** Farm buildings and persistent village expansion.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 64x80 facade regions; opening area and collision need authored definitions.

**Related IDs:** S0446, S0447, S0448, S0449, S0450, S0451, S0456, S0457, S0462, S0488.

#### S0454 — Four-frame campfire strip

[Preview](previews/S0454.png) · **Sheet:** 64 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Bonfire.png`

**Belongs with:** prop-campfire. **Companion groups:** forest-environment, village-environment.

**Use:** Rest landmark, campsite and optional expedition checkpoint.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0269, S0600, S0601, S0605, S0606, S0608, S0609, S0610, S0611.

#### S0455 — Modular fence segments and junctions

[Preview](previews/S0455.png) · **Sheet:** 144 × 112 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Fence.png`

**Belongs with:** farm-fences. **Companion groups:** farm-buildings, farm-animals.

**Use:** Farm boundaries and controlled outdoor paths.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0446, S0447, S0448, S0449, S0450, S0451, S0453, S0488, S0607.

#### S0456 — Barrels/containers, small fittings and building/ground pieces

[Preview](previews/S0456.png) · **Sheet:** 64 × 192 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Misc.png`

**Belongs with:** farm-props. **Companion groups:** farm-buildings, farm-crops.

**Use:** Farm dressing and small interactable containers.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0453, S0457, S0459, S0462, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599.

#### S0457 — Large farm fixtures including table-like structures and door/frame pieces

[Preview](previews/S0457.png) · **Sheet:** 96 × 192 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Misc_Big.png`

**Belongs with:** farm-props. **Companion groups:** farm-buildings, farm-crops.

**Use:** Farm work area, crafting station appearance or building entrances.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Functional roles are suggestions; source sheet is mixed and unlabelled.

**Related IDs:** S0453, S0456, S0459, S0462, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599.

#### S0458 — Stone/ore nodes, material pieces and resource variants

[Preview](previews/S0458.png) · **Sheet:** 32 × 112 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Resources.png`

**Belongs with:** farm-resources. **Companion groups:** hero-pickaxe, hero-axe, farm-tools.

**Use:** Resource drops and optional upgrade ingredients.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Material tiers are a game design choice; the pixels alone do not establish stats.

**Related IDs:** S0136, S0138, S0140, S0142, S0144, S0146, S0148, S0150, S0152, S0154, S0156, S0158, S0460.

#### S0459 — Soil patches, sprouts, fruits, crop growth forms and harvested produce

[Preview](previews/S0459.png) · **Sheet:** 64 × 256 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Sprouts_Fruit_Crops.png`

**Belongs with:** farm-crops. **Companion groups:** hero-hoe, hero-wateringcan, npc-gardener.

**Use:** Small village garden, expedition food and produce quests.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** See source crop guide: fruits and crops run right-to-left; four crops are invented.

**Related IDs:** S0137, S0139, S0141, S0143, S0145, S0147, S0149, S0151, S0153, S0155, S0157, S0159, S0287, S0452, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599.

#### S0460 — Axe, pickaxe, hoe and watering can icons in five material colours

[Preview](previews/S0460.png) · **Sheet:** 64 × 80 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Tool_Icons.png`

**Belongs with:** farm-tools. **Companion groups:** hero-axe, hero-pickaxe, hero-hoe, hero-wateringcan.

**Use:** Equipment UI and optional tool tiers.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0136, S0137, S0138, S0139, S0140, S0141, S0142, S0143, S0144, S0145, S0146, S0147, S0148, S0149, S0150, S0151, S0152, S0153, S0154, S0155, S0156, S0157, S0158, S0159, S0452.

#### S0461 — Round tree artwork; Farm version includes sizes and stumps

[Preview](previews/S0461.png) · **Sheet:** 144 × 112 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/Tree.png`

**Belongs with:** forest-trees. **Companion groups:** forest-environment, hero-axe.

**Use:** Persistent forest barriers, clearings and chop/open states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Some packs have a single assembled tree; Farm has a mixed-size collection. Preserve separate canopy/trunk assets where available.

**Related IDs:** S0136, S0140, S0144, S0148, S0152, S0156, S0266, S0267, S0268, S0269, S0606, S0608, S0609, S0610, S0611.

#### S0462 — Animated well/bucket strip

[Preview](previews/S0462.png) · **Sheet:** 72 × 28 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Farm Pack.zip` → `Tiny Farm Pack/Other/WaterWell.png`

**Belongs with:** farm-props. **Companion groups:** hero-wateringcan, farm-crops.

**Use:** Water collection and village focal point.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 72x28 trimmed strip: inspect explicit rectangles, do not force 16x16 slicing.

**Related IDs:** S0139, S0143, S0147, S0151, S0155, S0159, S0456, S0457, S0459, S0589, S0590, S0591, S0592, S0593, S0594, S0595, S0596, S0597, S0598, S0599.

#### S0489 — Door state or doorway facade

[Preview](previews/S0489.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Door_closed.png`

**Belongs with:** village-doors. **Companion groups:** village-buildings, village-environment.

**Use:** Building entry and locked-house states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Closed door is 16x16; other doorway compositions are larger.

**Related IDs:** S0490, S0491, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0600, S0601, S0605, S0612.

#### S0490 — Door state or doorway facade

[Preview](previews/S0490.png) · **Sheet:** 48 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Door_nothing.png`

**Belongs with:** village-doors. **Companion groups:** village-buildings, village-environment.

**Use:** Building entry and locked-house states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Closed door is 16x16; other doorway compositions are larger.

**Related IDs:** S0489, S0491, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0600, S0601, S0605, S0612.

#### S0491 — Door state or doorway facade

[Preview](previews/S0491.png) · **Sheet:** 48 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Door_open.png`

**Belongs with:** village-doors. **Companion groups:** village-buildings, village-environment.

**Use:** Building entry and locked-house states.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Closed door is 16x16; other doorway compositions are larger.

**Related IDs:** S0489, S0490, S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0600, S0601, S0605, S0612.

#### S0492 — Stair or stairway/doorframe composite

[Preview](previews/S0492.png) · **Sheet:** 48 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Stairs_down.png`

**Belongs with:** prop-stairs. **Companion groups:** dungeon-room, village-environment.

**Use:** Persistent dungeon entrance or interior connection.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Village stairs can be 48x48 composites; inspect dimensions in the record.

**Related IDs:** S0403, S0404, S0405, S0412, S0413, S0414, S0415, S0416, S0493, S0494, S0600, S0601, S0605, S0641.

#### S0493 — Stair or stairway/doorframe composite

[Preview](previews/S0493.png) · **Sheet:** 18 × 18 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Stairs_floor_down.png`

**Belongs with:** prop-stairs. **Companion groups:** dungeon-room, village-environment.

**Use:** Persistent dungeon entrance or interior connection.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Village stairs can be 48x48 composites; inspect dimensions in the record.

**Related IDs:** S0403, S0404, S0405, S0412, S0413, S0414, S0415, S0416, S0492, S0494, S0600, S0601, S0605, S0641.

#### S0494 — Stair or stairway/doorframe composite

[Preview](previews/S0494.png) · **Sheet:** 48 × 48 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Etc/Stairs_up.png`

**Belongs with:** prop-stairs. **Companion groups:** dungeon-room, village-environment.

**Use:** Persistent dungeon entrance or interior connection.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Village stairs can be 48x48 composites; inspect dimensions in the record.

**Related IDs:** S0403, S0404, S0405, S0412, S0413, S0414, S0415, S0416, S0492, S0493, S0600, S0601, S0605, S0641.

#### S0495 — Domestic room furnishing: Bathtub_Left

[Preview](previews/S0495.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bathroom/Bathtub_Left.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0496, S0497, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0506, S0507, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0496 — Domestic room furnishing: Bathtub_Right

[Preview](previews/S0496.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bathroom/Bathtub_Right.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0497, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0506, S0507, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0497 — Domestic room furnishing: Sink_Bathroom

[Preview](previews/S0497.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bathroom/Sink_Bathroom.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0496, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0506, S0507, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0498 — Domestic room furnishing: Toilet

[Preview](previews/S0498.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Bathroom/Toilet.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0496, S0497, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0506, S0507, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0505 — Domestic room furnishing: Bin

[Preview](previews/S0505.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Kitchen/Bin.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0496, S0497, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0506, S0507, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0506 — Domestic room furnishing: Fridge

[Preview](previews/S0506.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Kitchen/Fridge.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0496, S0497, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0507, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0507 — Domestic room furnishing: Furnace

[Preview](previews/S0507.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Kitchen/Furnace.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0496, S0497, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0506, S0508, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0508 — Domestic room furnishing: Kitchen_Sink

[Preview](previews/S0508.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Kitchen/Kitchen_Sink.png`

**Belongs with:** village-domestic. **Companion groups:** village-interior.

**Use:** Homes and shops; select fixtures that fit the intended fantasy technology level.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0495, S0496, S0497, S0498, S0499, S0500, S0501, S0502, S0503, S0504, S0505, S0506, S0507, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0526 — Large or small bookshelf

[Preview](previews/S0526.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/library_big.png`

**Belongs with:** village-library. **Companion groups:** village-interior.

**Use:** Library, study, lore interaction and secret bookshelf passage.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0527, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0527 — Large or small bookshelf

[Preview](previews/S0527.png) · **Sheet:** 16 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/library_small.png`

**Belongs with:** village-library. **Companion groups:** village-interior.

**Use:** Library, study, lore interaction and secret bookshelf passage.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0526, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0529 — Wall-mounted illustrated map

[Preview](previews/S0529.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Map.png`

**Belongs with:** village-map. **Companion groups:** village-interior.

**Use:** Inn or explorer room landmark; can open world map on interaction.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0545 — Cracked wall overlay

[Preview](previews/S0545.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Wall_crack.png`

**Belongs with:** village-crack. **Companion groups:** village-interior, item-bomb.

**Use:** Optional visual clue to a bombable secret wall.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0431, S0432, S0433, S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0546 — Single/double wall window

[Preview](previews/S0546.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Window.png`

**Belongs with:** village-interior. **Companion groups:** village-interior.

**Use:** Interior dressing and building orientation cues.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0547, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0547 — Single/double wall window

[Preview](previews/S0547.png) · **Sheet:** 32 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Indoors/Other/Window_Double.png`

**Belongs with:** village-interior. **Companion groups:** village-interior.

**Use:** Interior dressing and building orientation cues.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0499, S0500, S0501, S0502, S0503, S0504, S0509, S0510, S0511, S0512, S0513, S0514, S0515, S0516, S0517, S0518, S0519, S0520, S0521, S0522, S0523, S0524, S0525, S0528, S0530, S0531, S0532, S0533, S0534, S0535, S0536, S0537, S0538, S0539, S0540, S0541, S0542, S0543, S0544, S0546, S0548, S0549, S0550, S0551, S0552, S0553.

#### S0602 — Signboard or hanging sign variant

[Preview](previews/S0602.png) · **Sheet:** 16 × 16 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Other/sign.png`

**Belongs with:** village-signs. **Companion groups:** village-environment.

**Use:** Directions, hints and shop identification.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0265, S0600, S0601, S0603, S0604, S0605.

#### S0603 — Signboard or hanging sign variant

[Preview](previews/S0603.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Other/sign_2_left.png`

**Belongs with:** village-signs. **Companion groups:** village-environment.

**Use:** Directions, hints and shop identification.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0265, S0600, S0601, S0602, S0604, S0605.

#### S0604 — Signboard or hanging sign variant

[Preview](previews/S0604.png) · **Sheet:** 32 × 32 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Outdoors/Other/sign_2_right.png`

**Belongs with:** village-signs. **Companion groups:** village-environment.

**Use:** Directions, hints and shop identification.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0265, S0600, S0601, S0602, S0603, S0605.

#### S0607 — Modular fence segments and junctions

[Preview](previews/S0607.png) · **Sheet:** 144 × 112 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Pack.zip` → `Tiny Village Pack/Tilesets/fence.png`

**Belongs with:** farm-fences. **Companion groups:** farm-buildings, farm-animals.

**Use:** Farm boundaries and controlled outdoor paths.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0446, S0447, S0448, S0449, S0450, S0451, S0453, S0455, S0488.

#### S0612 — Large sheet of additional house facade designs and colours

[Preview](previews/S0612.png) · **Sheet:** 240 × 1039 px · **Suggested cells:** Explicit rectangles / inspect sheet

**Source:** `Tiny Village Updates.zip` → `Tiny Village Updates/HousesUpdate.png`

**Belongs with:** village-buildings. **Companion groups:** village-environment, village-buildings.

**Use:** Broader village building variety.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 240x1039 sheet has irregular final height and mixed building sizes; manual rectangles required.

**Related IDs:** S0561, S0562, S0563, S0564, S0565, S0566, S0567, S0568, S0569, S0570, S0571, S0572, S0573, S0574, S0575, S0576, S0577, S0578, S0579, S0580, S0581, S0582, S0583, S0584, S0585, S0586, S0587, S0588, S0600, S0601, S0605.

#### S0613 — Heraldic banner shapes and colours

[Preview](previews/S0613.png) · **Sheet:** 144 × 96 px · **Suggested cells:** 16 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Banners_16x32.png`

**Belongs with:** castle-environment. **Companion groups:** castle-room, castle-throne.

**Use:** Castle identity, faction markers and navigation landmarks.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0642, S0643, S0645.

#### S0614 — Large door variants and opening states

[Preview](previews/S0614.png) · **Sheet:** 144 × 384 px · **Suggested cells:** 48 × 48

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Big_doors_48x48.png`

**Belongs with:** castle-door. **Companion groups:** item-key, castle-room.

**Use:** Boss gates and key-locked progression.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 48x48 cells; match key/door identity in game data rather than by colour alone.

**Related IDs:** S0241, S0242, S0401, S0639, S0643.

#### S0615 — Large treasure chest colour variants and opening states

[Preview](previews/S0615.png) · **Sheet:** 128 × 192 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Big_Treasurechest_32x32.png`

**Belongs with:** item-chest. **Companion groups:** castle-room, item-key, enemy-mimic.

**Use:** Major dungeon rewards.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** 32x32 cells, separate from the smaller chest strips.

**Related IDs:** S0241, S0242, S0255, S0398, S0401, S0634, S0639, S0643.

#### S0636 — Animated torch; castle sheet includes multiple flame colours

[Preview](previews/S0636.png) · **Sheet:** 64 × 160 px · **Suggested cells:** 16 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Floor_torch_16x32.png`

**Belongs with:** prop-torch. **Companion groups:** dungeon-room, castle-environment.

**Use:** Readable room landmarks and optional lighting puzzles.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0408, S0412, S0413, S0414, S0415, S0416, S0613, S0645.

#### S0637 — Framed pictures and coloured portal-like arches

[Preview](previews/S0637.png) · **Sheet:** 96 × 192 px · **Suggested cells:** 32 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Framed_paintings_n_portals_32x32.png`

**Belongs with:** castle-portals. **Companion groups:** castle-room, castle-environment.

**Use:** Secret wall clues, optional portals and room identity.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0613, S0643, S0645.

#### S0638 — Hook head, line/pole and device components

[Preview](previews/S0638.png) · **Sheet:** 32 × 48 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Hook_n_pole16x16.png`

**Belongs with:** item-hook. **Companion groups:** hero-hook, item-hook-icon.

**Use:** Grapple traversal and movable-object interactions.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Notes:** Separate projectile, tether and attachment components from the hero pose.

**Related IDs:** S0616, S0618, S0620, S0622, S0624, S0626, S0646.

#### S0639 — Three key shapes/colour variants

[Preview](previews/S0639.png) · **Sheet:** 48 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Keys_16x16.png`

**Belongs with:** item-key. **Companion groups:** castle-door, item-chest.

**Use:** Dungeon keys and distinct locks.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0241, S0242, S0255, S0398, S0401, S0614, S0615.

#### S0640 — Four-frame white magic projectile/effect strip

[Preview](previews/S0640.png) · **Sheet:** 64 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Magic_animation_16x16.png`

**Belongs with:** item-magic. **Companion groups:** hero-magic, item-hook-icon.

**Use:** Wand projectile and switch activation.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0617, S0619, S0621, S0623, S0625, S0627, S0646.

#### S0641 — Stair tiles in several material colours

[Preview](previews/S0641.png) · **Sheet:** 96 × 96 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Stairs_16x16.png`

**Belongs with:** prop-stairs. **Companion groups:** castle-room, dungeon-room.

**Use:** Room exits and surface/interior transitions.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0403, S0404, S0405, S0412, S0413, S0414, S0415, S0416, S0492, S0493, S0494, S0643.

#### S0642 — Six coloured thrones

[Preview](previews/S0642.png) · **Sheet:** 144 × 96 px · **Suggested cells:** 48 × 48

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Thrones_48x48.png`

**Belongs with:** castle-throne. **Companion groups:** castle-room, castle-environment.

**Use:** Boss room centrepiece and story location.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0613, S0643, S0645.

#### S0644 — Gems, rings, crowns and jewellery-like treasures

[Preview](previews/S0644.png) · **Sheet:** 80 × 96 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Treasures_16x16.png`

**Belongs with:** item-treasure. **Companion groups:** item-chest, castle-room.

**Use:** Treasure, quest objects or relic icons; effects need design.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0255, S0398, S0615, S0643.

#### S0645 — Arched windows with several treatments

[Preview](previews/S0645.png) · **Sheet:** 96 × 64 px · **Suggested cells:** 16 × 32

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/windows_16x32.png`

**Belongs with:** castle-environment. **Companion groups:** castle-room.

**Use:** Castle walls, lighting cues and room landmarks.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0613, S0643.

#### S0646 — Hook and magic rod equipment icons

[Preview](previews/S0646.png) · **Sheet:** 32 × 16 px · **Suggested cells:** 16 × 16

**Source:** `TinyCastlePack.zip` → `PNG/PNGs/Hook_n_Rod_Icons_16x16.png`

**Belongs with:** item-hook-icon. **Companion groups:** hero-hook, hero-magic, item-hook, item-magic.

**Use:** Equipment UI; these are not the cast animations.

**Version:** Usable source; no blanket replacement inferred. **Exact source occurrences:** 1.

**Related IDs:** S0616, S0617, S0618, S0619, S0620, S0621, S0622, S0623, S0624, S0625, S0626, S0627, S0638, S0640.