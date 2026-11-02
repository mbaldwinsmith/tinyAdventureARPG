# Curated asset provenance

Artwork is by [Vryell](https://vryell.itch.io/). The project owner owns the Tiny Adventure packs. The repository's proprietary software licence does not relicense this artwork or grant a standalone redistribution right.

## Current runtime selection

The importer validates **211 curated source records from 13 unchanged archives**. It emits **158 runtime PNGs**: 150 hero sheets across six appearances and 28 registered action families, plus eight clearing props. Hero sources now include the Farm animation update, Coast and Castle packs alongside the original five archives.

The remaining **53 records are inspection-only**: enemy, King and detached tool sources. Their metadata is validated and available in the development workbench, while their pixels are not copied into the production build. Promote them deliberately when gameplay actually uses them.

The exact case-sensitive member paths are in [`src/assets/sources.json`](../src/assets/sources.json). Each generated entry records its source hash and canonical image ID. Explicit rectangles, direction mappings, timing and reference foot anchors are in `src/assets/hero-animations.json`.

The broader [sprite catalogue](sprites/README.md) contains all reviewed image metadata and aliases, including the selected updated goblin, skeleton and zombie sources. Images for the full catalogue are generated only into the ignored development cache, never committed as extra PNG copies or copied into production.

## Rebuilding

Run `npm run assets:build`, then `npm run assets:check`. Both fail with the logical asset/source path when an archive member, frame definition or generated output is invalid. There is no Python dependency or paid editor requirement for this pipeline.

Do not put raw ZIPs or a full source-art catalogue under `public/`. Only selected runtime PNGs and their manifest belong in `public/generated/`. A production game build contains the selected art for rendering; it is not a standalone asset pack download.

The [animation layout contract](sprites/animation-layouts.md) documents tool sockets, 1,736 additional presentation sequences, enemy label/recolour blocks, mixed King rectangles and divided-tongue joins. Terrain/layer/UI metadata, atlas packing, gap effects and complete third-party release notices remain open M02/release tasks.
