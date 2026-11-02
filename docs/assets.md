# Curated asset provenance

Artwork is by [Vryell](https://vryell.itch.io/). The project owner owns the Tiny Adventure packs. The repository's proprietary software licence does not relicense this artwork or grant a standalone redistribution right.

## Current preview selection

| Source archive                                 | Members used                                                        | Purpose                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| `src/raw sprites/TAP_anim_v2.zip`              | Twelve `CharN_idle_16px.png` / `CharN_walk_16px.png` sheets         | Six hero appearances, each with four inspected directional rows |
| `src/raw sprites/Tiny Adventure Pack Plus.zip` | Grass, Tree, Bush, Rock, Flower_blue, Flower_orange, Sign and Chest | Clearing ground and props                                       |

The exact case-sensitive member paths are in [`src/assets/sources.json`](../src/assets/sources.json). Sources stay unchanged. Generated manifests include each PNG's SHA-256 digest. Generated files and scratch extraction output are ignored by git.

The inspected hero row order is **down, left, up, right**, with four 16×16 frames per row. The preview uses 4fps idle and 9fps walk as provisional presentation timings. Foot anchors are explicitly defined in the scene. Other action families are not yet imported.

## Rebuilding

Run `npm run assets:build`, then `npm run assets:check`. Both fail with the logical asset/source path when an archive member, frame definition or generated output is invalid. There is no Python dependency or paid editor requirement for this pipeline.

Do not put raw ZIPs or a full source-art catalogue under `public/`. Only selected runtime PNGs and their manifest belong in `public/generated/`. A production game build contains the selected art for rendering; it is not a standalone asset pack download.

Broader catalogue import, canonical aliases, remaining animations, atlas packing, gap effects and complete third-party release notices remain open M02/release tasks.
