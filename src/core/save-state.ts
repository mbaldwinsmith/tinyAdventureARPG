import { completedMixedTrial, emptyBuild } from './build-model';
import { z } from 'zod';
import { regionIdSchema, entityIdSchema } from './ids';
import { saveSchema, changesSchema } from './model';
import { assertWorldInvariants } from './invariants';
import type { ContentRegistry } from '../content/schemas';
import { TRAIL_ID, TRAIL_ENTRY, TOOL_TRAIL_DEFINITION, trailPathAt } from '../content/tool-trail';
export const versionFourSaveSchema = saveSchema
  .omit({ build: true })
  .extend({ schemaVersion: z.literal(4) });
export const versionThreeSaveSchema = versionFourSaveSchema
  .omit({ tools: true })
  .extend({ schemaVersion: z.literal(3) });
export const versionTwoSaveSchema = versionThreeSaveSchema
  .omit({ pack: true })
  .extend({ schemaVersion: z.literal(2) });
export const legacySaveSchema = versionTwoSaveSchema
  .omit({ nextTransaction: true, domains: true, deathRules: true, lastDeath: true })
  .extend({ schemaVersion: z.literal(1) });
/** The new authored annex is additive; no retained forest/dungeon geography is regenerated. */
function addToolTrail(state: z.infer<typeof versionThreeSaveSchema>) {
  if (!state.world.regions.some((r) => r.id === TRAIL_ID)) {
    const width = 60,
      height = 34;
    state.world.regions.push({
      id: regionIdSchema.parse(TOOL_TRAIL_DEFINITION.id),
      kind: 'surface',
      phase: 'dormant',
      generatorVersion: 1,
      geometry: {
        version: 1,
        generated: null,
        width,
        height,
        tilePixels: 16,
        tiles: Array.from({ length: width * height }, (_, i) =>
          trailPathAt(i % width, Math.floor(i / width)) ? 1 : 0,
        ),
        objects: TOOL_TRAIL_DEFINITION.objects.map((o) => ({
          id: entityIdSchema.parse(o.id),
          position: { ...o.position },
        })),
      },
      changes: changesSchema.parse({ removedObjects: [], openedPassages: [], claimedRewards: [] }),
    });
  }
  const woodland = state.world.regions.find((r) => r.id === 'region:woodland');
  if (
    woodland?.kind === 'surface' &&
    woodland.phase !== 'unvisited' &&
    !woodland.geometry.objects.some((o) => o.id === TRAIL_ENTRY.id)
  )
    woodland.geometry.objects.push({
      id: entityIdSchema.parse(TRAIL_ENTRY.id),
      position: { ...TRAIL_ENTRY.position },
    });
  return state;
}
export function readSaveState(input: unknown, content: ContentRegistry) {
  const header = z.object({ schemaVersion: z.number().int() }).parse(input);
  if (![1, 2, 3, 4, 5].includes(header.schemaVersion))
    throw new Error(
      `Unsupported save schema ${header.schemaVersion}. The original data has been kept.`,
    );
  const v2 =
    header.schemaVersion === 1 ? { ...legacySaveSchema.parse(input), schemaVersion: 2 } : input;
  const v3 =
    header.schemaVersion <= 2 ? { ...versionTwoSaveSchema.parse(v2), schemaVersion: 3 } : v2;
  const v4 =
    header.schemaVersion <= 3
      ? { ...addToolTrail(versionThreeSaveSchema.parse(v3)), schemaVersion: 4 }
      : v3;
  let upgraded = v4;
  if (header.schemaVersion <= 4) {
    const legacy = versionFourSaveSchema.parse(v4);
    upgraded = {
      ...legacy,
      schemaVersion: 5,
      build: {
        ...emptyBuild(),
        mixedTrialCompleted: [legacy.combat, ...legacy.world.savedCombats].some(
          completedMixedTrial,
        ),
      },
    };
  }
  const state = saveSchema.parse(upgraded);
  assertWorldInvariants(state, content);
  return state;
}
