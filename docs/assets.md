# Curated asset provenance

Artwork is by [Vryell](https://vryell.itch.io/). The project owner owns the Tiny Adventure packs. The repository's proprietary software licence does not relicense this artwork or grant a standalone redistribution right.

## Current runtime selection

The importer validates **316 curated source records from 16 unchanged archives**. It packs **3,985 padded runtime frames from 187 sources into one 2048×2048 atlas** for the clearing's hero animation previews, tiled ground, animated shore and layered scenery.

The other **129 records are inspection-only**: enemy/King, detached tool and alternate terrain/scenery sources. Their metadata is validated and available in the workbench, while their pixels are not copied into production. Promote them deliberately when gameplay uses them.

The exact case-sensitive member paths are in [`src/assets/sources.json`](../src/assets/sources.json). Each generated entry records its source hash and canonical image ID. Explicit rectangles, direction mappings, timing and reference foot anchors are in `src/assets/hero-animations.json`.

The broader [sprite catalogue](sprites/README.md) contains all reviewed image metadata and aliases, including the selected updated goblin, skeleton and zombie sources. Images for the full catalogue are generated only into the ignored development cache, never committed as extra PNG copies or copied into production.

## Rebuilding

Run `npm run assets:build`, then `npm run assets:check`. Both fail with the logical asset/source path when an archive member, frame definition or generated output is invalid. There is no Python dependency or paid editor requirement for this pipeline.

Do not put raw ZIPs or a full source-art catalogue under `public/`. Only selected runtime atlas pages, frame manifests and credit/notice records belong in `public/generated/`. A production game build contains the selected art for rendering; it is not a standalone asset pack download.

The [animation layout contract](sprites/animation-layouts.md) documents tool sockets, 1,736 additional presentation sequences, enemy label/recolour blocks, mixed King rectangles and divided-tongue joins. The [terrain/scenery contract](sprites/terrain-scenery.md) documents 35 terrain profiles, updated shoreline phases and 279 scenery compositions/source views. The [GUI/atlas/effects contract](sprites/gui-atlases-effects.md) records frame packing, glyphs, prompts and authored gap effects. See [artwork provenance](../LICENSE-ASSETS.md) and [software notices](../THIRD_PARTY_NOTICES.md).
