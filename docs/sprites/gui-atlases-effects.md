# GUI, packed textures and authored effects

## GUI metadata

`src/assets/gui.ts` defines four 48×48 TalkBox panels with nine nonoverlapping source slices. Their inspected border is **4px**, not 16px: each axis is 4/40/4. The workbench resizes panels with fixed 2× corners. The accessible React pause dialog uses the green panel through a cropped atlas image and CSS border-image; body text remains DOM text.

The same module defines square/rectangle normal/pressed buttons, heart/drop/star variants and descriptive status symbols. These symbols have no assigned combat or status rules. Icons keep their actual sheet rectangles rather than being assigned invented item identities.

`font-glyphs.json` records two inspected alpha-cropped glyph templates, with seven supplied colour variants each. Every font maps 88 characters: A–Z, a–z, digits and supplied punctuation/symbols. Small/big line heights are 9/13 pixels. Space has its own advance; newlines advance by line height. Unsupported Unicode is reported and rendered as `?`; samples are bounded. These raster fonts are available for inspection and future decorative uses, while DOM text remains the readable/accessibility default.

Device prompt IDs describe **physical controls**, separate from input action bindings. Keyboard light/dark variants map letters, digits, function/navigation/modifier keys and a two-cell-tall Enter key. Controller face positions retain Xbox Y/X/A/B, PlayStation Triangle/Square/Cross/Circle and Switch X/Y/B/A for north/west/south/east. Mouse left/right/middle prompts are descriptive. The preview maps current remapped action bindings to keyboard or Xbox/PlayStation/Switch prompts, with text for generic/shoulder/Start controls. Controller face sheets are now runtime art.

## Atlas contract

`npm run assets:build` validates 316 source records from 16 unchanged selected archives, then packs **4,271 explicit runtime frames from 190 sources into one 2048×2048 atlas**. The remaining 126 source records are inspection-only; their pixels stay outside the game build.

The Node-only `pngjs` build tool reads/writes RGBA losslessly. Frames sort by dimensions and stable rectangle ID before deterministic shelf placement. Each has **2px of extruded edge pixels on every side and corner**, no rotation and no trimming. Pages are bounded to 2048px per side and eight pages; oversized/missing/duplicate inputs fail. Only sources explicitly declaring a uniform grid receive grid extraction. Irregular scenery and GUI use reviewed source rectangles.

Manifest version 2 retains source SHA-256/canonical identities and inspection flags, adds page image/JSON hashes, and maps stable rectangle IDs to their page position, original source rectangle and exact RGBA crop hash. `sourceFile` is a source-metadata name, not an emitted full-sheet download. The generated Phaser atlas JSON preserves original frame dimensions. Phaser actors, animations, tiles, scenery, React portraits and keyboard prompts all use those packed mappings. Missing mappings produce a visible loading failure.

The pause skin copies only its 48px panel to an off-DOM canvas once; it does not add a second visible game canvas. Shared manifest/image loading is immutable asset metadata, not game-state authority. Phaser still owns the game lifecycle.

`assets:check` rebuilds and compares exact atlas bytes, metadata and the expected output file list. Unit checks verify every emitted crop hash, all extruded borders and nonoverlapping padded regions; synthetic semi-transparent/transparent pixels check losslessness and input-order independence. Source archive reconciliation remains in `catalogue:check`. Raw packs, full catalogue art and workbench modules are excluded from production.

## Presentation gaps

There are now **720 hero sequences: six appearances × 30 action families × four directions**. Death deliberately reuses the supplied shared fall strip, with an authored fade from 200ms through 560ms. Bomb deliberately reuses the 360ms throw-item pose, followed by a code-authored six-frame, 640ms pixel explosion. This does not imply a supplied death/explosion sheet.

`src/assets/effects.ts` bounds the explosion to a 64×64 reference canvas with at most eight rectangular cells per authored frame. The runtime owns one reusable Graphics object, clamps the effect within the clearing, holds the throw endpoint and clears/reset alpha on completion or a replacement preview. Timers stop under the same pause reasons as the actor/shore. A new request can restart the same action. The workbench exposes a frame slider and finite playback that holds the last effect frame for inspection.

There is no damage, fuse, energy cost, player death state, loss/respawn or inventory simulation in these presentation previews. Future gameplay state machines own those rules and their precise combat timing.

## Credits and notices

[`LICENSE-ASSETS.md`](../../LICENSE-ASSETS.md) records Vryell's artwork, palette notes, source identity and the authored adaptations. [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md) is generated from the locked installed production dependency graph, plus the archive/PNG build tools, retaining bundled licence texts. Both records are copied to the generated production assets and checked for staleness. The repository LICENSE and source ZIPs are unchanged.
