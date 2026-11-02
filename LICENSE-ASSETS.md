# Artwork provenance and credits

Tiny Adventure is created by Mark Baldwin-Smith. The existing repository [LICENSE](LICENSE) applies to project software and documentation; it does not relicense third-party artwork or libraries.

## Supplied artwork

Pixel artwork, bitmap fonts and device prompts are by **[Vryell](https://vryell.itch.io/)**. The owner has confirmed ownership of the paid Tiny Adventure companion packs. Development inputs include Adventure/Plus, Dungeon, Village, Farm, Biomes, Coast, Castle, Enemies, Neighbours, GUI, Controller & Keyboard Icons, and their animation/update bundles.

The author's [Tiny Adventure Pack](https://vryell.itch.io/tiny-adventure-pack) and [Tiny GUI Pack](https://vryell.itch.io/tiny-gui-pack) pages, reviewed on 2026-11-02, permit personal/commercial use, make credit optional, and prohibit resale or redistribution of the assets. The relevant purchase and author terms continue to govern each supplied pack. This record grants no standalone asset distribution rights and does not replace those terms.

The supplied palette notes credit **Rosy-42 by PineTreePizza**, with three additional blue shades from **EDG32**. This preserves the wording of the source notes without claiming authorship of those colours.

## Traceable source records

- Original inputs remain byte-for-byte in `src/raw sprites/`; source filenames are preserved. No source pack is included as a ZIP download in the game build.
- `docs/sprites/catalogue.json` records all 23 archive hashes, 1,436 PNG occurrences, exact member paths, support-text records and aliases for 716 canonical images. `npm run catalogue:check` reconciles the inputs against that inventory.
- `src/assets/sources.json` selects the case-sensitive source members. Generated manifest version 2 records the full source SHA-256/canonical ID, inspection status, packed source rectangles and atlas page/crop hashes.
- Only curated runtime frames enter the game atlas. Full source catalogues and inspection-only images are served by development middleware, outside `dist/`.
- Build output includes this credit record as `generated/CREDITS.txt` and bundled software licence texts as `generated/THIRD_PARTY_NOTICES.txt`.

## Authored presentation

Frame timing, reference feet, attachment offsets, layering, GUI glyph metrics and scene composition are project-authored metadata. The modern boomerang pose deliberately reuses supplied throw-item art. Hero death presentation deliberately reuses supplied fall art with a fade. Bomb presentation reuses throw-item art followed by a code-authored six-frame pixel explosion. These are presentation adaptations; no separate supplied death/explosion sheet is claimed.

The explosion geometry and this metadata are project software under the existing repository licence. Source pixels remain Vryell's artwork. Combat, inventory, death losses and tool simulation are separate, later game systems.

## Third-party software

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the locked runtime dependency graph and the archive/PNG build tools, including their bundled licence texts. Build tools are not imported into the browser game. Update and verify these notices whenever the dependency graph changes using `npm run assets:build` and `npm run assets:check`.
