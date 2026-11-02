# Curated asset provenance

Artwork is by [Vryell](https://vryell.itch.io/). The project owner owns the Tiny Adventure packs. The repository's proprietary software licence does not relicense this artwork or grant a standalone redistribution right.

## Current runtime selection

The runtime imports **116 curated PNGs from five unchanged archives**: 108 updated hero sheets across six appearances and 19 registered action families (boomerang shares throw), plus eight clearing props. Sources are `TAP_anim_v2.zip`, `TAPp_anim_v2.zip`, `TDP_anim_v2.zip`, `Additional Animations.zip` and `Tiny Adventure Pack Plus.zip`.

The exact case-sensitive member paths are in [`src/assets/sources.json`](../src/assets/sources.json). Each generated entry records its source hash and canonical image ID. Explicit rectangles, direction mappings, timing and reference foot anchors are in `src/assets/hero-animations.json`.

The broader [sprite catalogue](sprites/README.md) contains all reviewed image metadata and aliases, including the selected updated goblin, skeleton and zombie sources. Images for the full catalogue are generated only into the ignored development cache, never committed as extra PNG copies or copied into production.

## Rebuilding

Run `npm run assets:build`, then `npm run assets:check`. Both fail with the logical asset/source path when an archive member, frame definition or generated output is invalid. There is no Python dependency or paid editor requirement for this pipeline.

Do not put raw ZIPs or a full source-art catalogue under `public/`. Only selected runtime PNGs and their manifest belong in `public/generated/`. A production game build contains the selected art for rendering; it is not a standalone asset pack download.

Remaining farming/fishing/hook/magic and enemy/boss action definitions, atlas packing, terrain/UI metadata, gap effects and complete third-party release notices remain open M02/release tasks.
