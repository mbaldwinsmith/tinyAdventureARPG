# Sprite catalogue and source policy

The original 2 November 2026 audit is now imported as **metadata**, with the owned ZIPs remaining the source of image bytes. No second copy of the archives or full preview-art collection is committed.

| Record                        | Purpose                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `audit-annotations.json`      | Reviewed sheet identities, companion groups, suggested uses, framing cautions and original S0001–S0716 audit labels |
| `audit-baseline.json`         | Expected archive SHA-256 hashes and audit counts                                                                    |
| `catalogue.json`              | Rebuilt file inventory, image dimensions, canonical source aliases and semantic descriptions                        |
| `selected-enemy-sources.json` | Explicit updated goblin/skeleton/zombie source selections, checked against the catalogue                            |

Run `npm run catalogue:build` to rebuild the metadata and ignored local previews. Run `npm run catalogue:check` to verify the committed catalogue against every source archive and reviewed annotation. `npm run dev` prepares the workbench automatically. A new/unreviewed PNG or changed archive fails reconciliation instead of acquiring a guessed identity.

The reconciled totals remain **23 archives, 1,466 file entries, 1,436 PNG occurrences, 716 distinct PNG images/sheets and 30 support-text entries**. These are not individual-frame or creature counts. The three duplicate archive pairs are retained intact:

- `TDP_anim_v2 (1).zip` / `TDP_anim_v2.zip`.
- `TDP_zombie_v2 (1).zip` / `TDP_zombie_v2.zip`.
- `Tiny Dungeon Pack (1).zip` / `Tiny Dungeon Pack.zip`.

## IDs and alternatives

Each distinct PNG has a content-derived canonical ID, `sprite-` followed by the first 16 SHA-256 hex digits. The full digest is retained, and prefix collisions are rejected. Every original archive/member occurrence maps to that ID. Byte changes create a new image identity; files with similar names but different pixels remain separate. The old S-number is an audit reference, not the canonical identity contract.

Canonical preferred sources favour the dedicated update bundles and avoid the `(1)` archive copies when a plain copy exists. This chooses between **exact aliases only**. It never discards a nonidentical older animation because its filename resembles an update.

| Family                       | Selected source                                             |
| ---------------------------- | ----------------------------------------------------------- |
| Six hero base actions        | `TAP_anim_v2.zip`                                           |
| Bow, shield, fall, item pose | `TAPp_anim_v2.zip`                                          |
| Pickup, carry, throw         | `TDP_anim_v2.zip`                                           |
| Hit, roll, push/pull, swim   | `Additional Animations.zip`                                 |
| Goblin and skeleton          | `TAP_Enemies_v2.zip`                                        |
| Zombie                       | `TDP_zombie_v2.zip`                                         |
| Farming/fishing/hook/magic   | Indexed, with later runtime frame definitions still pending |

Modern boomerang presentation deliberately reuses each hero's updated throw-item pose. Its metadata says so explicitly. This is not a claim that a dedicated six-appearance boomerang animation was supplied; the legacy dedicated strips remain indexed.

## Authored animation contract

`src/assets/hero-animations.json` defines **456 sequences: six appearances × 19 actions × four directions**, backed by 108 hero sheets. Each sequence records explicit source rectangles, grid indices, durations, reference foot anchor, directional/shared source policy and loop behaviour. Runtime import adds eight clearing props for **116 selected PNGs**.

Four cardinal directions are down/left/up/right. Fall and celebration poses are shared where the source provides one strip/front-facing pose. Hit strips provide one directional pose per cell. Bow/sword frames are 32px; most other selected actions use 16px cells. Uniformly slicing every archive remains unsupported.

`assets:check` verifies required hero/action/direction coverage, source references, frame bounds, grid/index agreement, anchors and hashes. Presentation durations/anchors are explicit editable choices inspected in the workbench; they are not combat hitbox or active-frame definitions.

## Workbench and production boundary

In development, expand **Development tools → Open sprite workbench**. Search all canonical images, inspect exact source paths and companion groups, zoom, play registered sequences and toggle frame grids/foot anchors. Editable hitbox rectangles are inspection guides; they do not add gameplay collision or damage.

The Vite development middleware serves reviewed previews from ignored `.cache/catalogue/`. The workbench module and the full preview image collection are absent from production builds. The public clearing includes a smaller action-preview selector, which plays artwork without granting weapons, damage, traversal or abilities.

Texture atlas packing, remaining tool/enemy/boss frames, terrain adjacency, layered architectural/boat definitions, UI slices, effects and complete release notices remain open plan tasks. This delivery does not mark the entire M02 milestone complete.
