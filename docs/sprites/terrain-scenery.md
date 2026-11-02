# Terrain and layered scenery

This increment defines **35 terrain profiles** and **279 scenery compositions/source views**. It improves the authored clearing and the development workbench; it does not add world generation, collision, interiors, NPCs, boarding, storage or farming.

## Terrain topology

`src/assets/terrain.ts` defines source rectangles in 16px cells. New Style has 47 normalized eight-neighbour cases for each of dirt, water and chasm, across Original, Grasslands, Fall, Desert and Snow palettes. Snow's sheet is 176px wide; the others are 224px. All are 240px high, with the three surface families starting at y=0, 80 and 160.

| Neighbour     |           Bit | Requirement                |
| ------------- | ------------: | -------------------------- |
| N / E / S / W | 1 / 2 / 4 / 8 | Cardinal neighbour present |
| NE            |            16 | Both N and E also present  |
| SE            |            32 | Both S and E also present  |
| SW            |            64 | Both S and W also present  |
| NW            |           128 | Both N and W also present  |

Normalization removes disconnected diagonal claims. Every one of the 256 inputs resolves to one of 47 canonical cases; the reviewed lookup includes thin caps, straight lines, crossings, outer edges and inward corners. Frame selection never depends on filenames or runtime colour guessing. A browser regression independently classifies the source pixels for all 235 New Style dirt cases across the five palettes.

Old Style remains a separate family. Its five 80×208 sheets contain dirt, masonry pit, water and chasm patches, beginning at tile rows 1, 4, 7 and 10. Each profile supports the supplied nine-piece border patch, isolated cell and four concave-corner pieces. It does **not** supply the full thin-cap/cross vocabulary. Unsupported masks return `null`; the inspector marks them with a magenta question mark instead of borrowing New Style art. Broader Old Style topology would need deliberately authored additions.

The workbench exposes individual neighbour toggles and assembled rectangle/notch/cross examples. Source coordinates and normalized masks remain visible for inspection. These tools are not a region editor or generator.

## Updated shoreline

The selected source is `Shore_TS_Animated_noBG_16x16_updated.png`, **192×96**. The older 192×80 alternative remains in the catalogue and is not promoted to runtime.

- Four phases occupy successive 48px column groups.
- Tile rows 0–2 contain land-cutout patches; rows 3–5 contain water patches.
- Each phase has nine 16px source rectangles. The workbench plays either 3×3 composition without scaling individual source pixels unevenly.
- The clearing uses the water-patch family for its rectangular pond. Shore phase advances only while the preview session is unpaused, without closed-window catch-up.

The current blue water is supplied artwork. Seasons, water hazards, arbitrary coastline generation and collision are later systems.

## Trees and buildings

| Family            | Inspected rectangle/layer policy                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original tree     | 48×54 composition: supplied 18×16 trunk at 15,38, and 48×46 canopy at 0,0. Reference foot 24,52.                                                                                    |
| Biome broad trees | **48×64 cells**, despite the 48x48 filename. Four colours × four supplied forms. Split the lower 16px silhouette from the upper 48px crown; lower foliage is not a collision shape. |
| Biome pines       | 32×48 cells. Combine supplied canopy columns 4/5 with stump columns 6/7; colour, snow and trunk variants stay distinct.                                                             |
| Palm              | 48×48 silhouette split at y=32. Fruit/stump pieces elsewhere on the sheet are retained as source alternatives.                                                                      |
| Village houses    | Four silhouettes × plaster/wood walls × three colours = 24 selected buildings, using separate original PNGs. Roof and facade exactly partition each image.                          |

House roof cuts are at y=42 for shapes 1–3 and y=56 for shape 4. The latter groups the upper-storey silhouette with the roof. Door sockets and root feet are separate from source bounds. The additional `HousesUpdate.png` designs remain catalogue alternatives, not guessed uniform frames from its irregular 1039px height.

Parts retain local offsets and render at a common object foot depth, with stable within-object ordering. An actor in front of a tree/building can draw in front of it; canopies are not a blanket screen-wide layer above all actors. Physical collision and roof hiding for interiors are not implemented.

## Furniture and oversized props

Registered definitions include whole bedroom/bathroom/kitchen/bookcase/window/plant props; 48×48 large sofa and table views; 32×32 small sofas/chairs; 32×16 chest colours; 48×16 bench; 48×48 thrones; and 32×32 treasure-chest poses. Colour variations and closed/transition/open poses are presentation data, not separate item behaviours or functioning storage.

The workbench assembles each selection, toggles its layers and marks feet/sockets. Building layers reconstruct the source pixels exactly; tests verify that no pixel is omitted or covered twice.

## Boat composition

Transparent hulls are composed independently of water. The lower two rows with baked blue water remain explicitly named inspection alternatives, so another water palette cannot accidentally acquire a blue rectangle.

| Direction | Hull within each two-column colour group | Sail row | Local mast base |
| --------- | ---------------------------------------- | -------: | --------------- |
| Right     | column 0, row 0                          |        0 | 26,62           |
| Up        | column 1, row 0                          |        2 | 16,62           |
| Left      | column 0, row 1                          |        1 | 5,62            |
| Down      | column 1, row 1                          |        3 | 16,62           |

Each composition uses a 64×96 inspection canvas, with a 64×64 hull at y=32 and a mast socket at 32,64. Four hull colours × four sail colours × four directions give 64 assemblies. Hatch/anchor fittings and a reference appearance-1 rider remain separate parts. The public pond boat omits the reference rider; no resident or second player is implied. M13 still owns boarding, movement, actual rider appearance and final traversal offsets.

The fittings sheet is **63×80**. Three full 16px columns contain anchors, chests, hatches and pipes; the final trimmed 15px column contains a tall rope. The rail uses a separate 48×16 rectangle. No importer rounds these dimensions up or cuts a fictional fourth full column.

## Production boundary and validation

The curated manifest now contains **286 source records from 14 unchanged archives**. It emits **165 runtime PNGs** and keeps **121 inspection-only records** behind the catalogue. The full source art, raw ZIPs and development inspectors remain excluded from production. Original single-tree and grass source records become inspection alternatives when their layered/tiled replacements are used.

`assets:check` validates terrain coverage/dimensions, the updated shore layout, all scenery source rectangles, composition extents, unique IDs and attachment points, alongside prior hero/enemy checks. Presentation feet, layer cuts and boat offsets are authored reference choices, never transparent-image collision bounds.

GUI slices, pixel-safe atlas packing, presentation gaps and complete release notices remain M02 tasks. The broader M04 world/input milestone stays open: this authored illustration is not the campaign's collision/interaction layer.
