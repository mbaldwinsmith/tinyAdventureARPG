# Durable saves and recovery

M07 uses `SaveRepository` behind `SaveManager`; the browser implementation is Dexie/IndexedDB. Core sessions contain only serializable data. A future desktop adapter can implement the same read/list/commit/select contract with file/database transactions and compare-and-swap revisions; it must preserve the durability and conflict guarantees described here. Cloud sync, native packaging and account storage are not implemented.

## Checkpoints and ownership

Each slot stores a complete versioned checkpoint, its previous checkpoint, revision and timestamps. One IndexedDB transaction writes the whole slot and active-slot pointer. Both inventories, carried money, local deposits, player resources, calendar, random continuation, permanent progress, active/inactive encounters, anchor states, complete generated geometry and object changes therefore change together. Farm/resident/quest data contracts round-trip too; their gameplay systems are later milestones.

New adventures get independent IDs and optional explicit seeds. The initial tutorial adventure uses a stable slot ID so concurrent startup owners cannot create duplicate first adventures. Slots continue the last committed checkpoint. Imports always create a new slot, including repeated imports of the same backup. Names are bounded to 48 characters; JSON backups to 32 MiB. Full geometry is retained rather than regenerated from a seed.

Inventory operations/selection, transfers, interactions/travel/unlocks/rewards, sleep, appearance changes, practice starts, collected coins and respawn are staged in a detached core session. The manager pauses simulation, encodes and commits, then adopts that candidate into the existing session owner. Failed writes leave the live session unchanged and retain the candidate for retry/export. Retrying uses the exact encoded checkpoint and revision, so an acknowledgement lost after a successful commit cannot apply a transfer twice. Shared transaction tokens reject stale inventory and chest commands.

Combat defeat/completion and enemy deaths trigger immediate checkpoints after the authoritative simulation step. The game pauses until the write completes. Other active simulation progress checkpoints every 750 ticks (15 seconds). Opening the save menu checkpoints dirty progress; Save now explicitly checkpoints. Closing a browser can lose progress since the last completed checkpoint. The implementation does not depend on unload handlers, claim pending writes survived a crash, or advance time while closed.

A process interrupted before a staged command commits reloads its earlier checkpoint. An interruption after the atomic commit reloads the complete later outcome. A failed simulation checkpoint retains the live state and pauses for retry, export or recovery-copy actions; reloading without completing it restores the last durable state. Previous checkpoints provide one extra recovery point, not an unlimited history.

## Local banking and defeat

Each authored chest has separate items and money. Stand nearby to deposit or withdraw. Partial stacks preserve properties/enchantments and allocate a new identity only when another stack is needed. Identical stacks merge within limits. Capacity, equipped-item deposits, stale transaction tokens, insufficient funds and safe-integer overflow are rejected before mutation.

Expedition defeat rolls an independent 25% loss chance for each carried material unit, permitting partial stacks. All equipment and permanent tools are protected. Ten percent of carried money is lost, rounded down. Deposited items/money, discoveries, unlocks and existing geometry remain protected. The seeded random continuation, precise loss/retained report and village respawn commit together. Reloading/retrying cannot reroll or repeat a committed death. Practice defeat remains loss-free.

Anchor defeat, claimed rewards, pending regeneration and saved encounters travel in the same checkpoint. The occupied defeated instance stays intact; only reward plus exit marks it pending, and its next entry creates a successor. Reload cannot grant a claimed reward twice or reset a living anchor.

## Validation, conflicts and failures

Envelope version 2 contains save-schema version 3, content version, generator versions and SHA-256 over canonical metadata/state. This detects accidental corruption; it is not authentication or cheat prevention. Zod and semantic world/session checks validate restored data. Explicit v1-to-v2-to-v3 migrations add transaction/domain/death-policy fields, then selected-tool/starter-claim state, while preserving geography, progress, items/equipment and random state. `tests/fixtures/save-v1.json` and `save-v2.json` are synthetic reproducible integration data; the latter retains a unique equipped Keen sword. Unknown future versions are rejected without overwriting their originals.

Every commit compares the expected slot revision. A stale tab receives a visible conflict and can export or save its pending candidate as a separate recovery adventure. It cannot silently replace the newer checkpoint. A corrupt current checkpoint is visibly blocked; a valid previous checkpoint can be recovered into a **new** slot, preserving the damaged original for export. Import errors leave existing adventures intact. Export original downloads the unmodified current payload, even if invalid.

Quota, permission, unavailable IndexedDB and write failures never report Saved. Recovery actions include retrying the identical checkpoint, exporting the recoverable candidate, saving a separate recovery copy or cancelling the pending action. Explicit session-only play keeps a warning; retrying browser storage preserves that live adventure as a new copy. Switching/new/import first saves dirty session-only progress separately when storage is available. If that preservation fails, the switch remains pending.

Browser storage belongs to the current site origin and browser profile. Clearing site data, private browsing expiry, eviction, changing browsers or changing the site's URL can remove or separate saves. Export backups regularly and before such changes. Downloads require the browser's normal download permissions. There is no server backup or cross-device synchronization. A browser crash can interrupt an uncommitted write; only completed checkpoints are durable.

## Verification

Core/repository tests cover migration, semantic corruption, real IndexedDB transaction aborts through fake-indexeddb, revision races, idempotent retries, protected per-unit loss, recovery copies and unchanged closed-game time. Browser tests exercise the actual UI, Dexie adapter, reloads, exports/imports, bank transfers, quota failure/retry, pending/resolved defeat and crypt reward/successor boundaries. Read-only render observations support assertions; production gameplay exposes no state-changing test API.
