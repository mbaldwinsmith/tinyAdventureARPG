# Cardinal combat and practice encounters

M05 adds playable combat to an explicit practice field. The authored clearing, cottage and woodland remain safe. Select a melee, archer, swarm or mixed encounter in Combat practice; entering or starting a new trial refills health/energy and explicitly resets that trial. The marked south exit returns to the clearing. This is an integration encounter, not a generated dungeon or campaign tool unlock.

## One owner and one clock

GameSession owns a nullable, serializable, version-1 combat record alongside the existing player/world data. The default is null for earlier prerelease checkpoints. Actors, actions, accepted contacts, projectile ownership/lifetime, enemy phases/path requests, drops, completion, sequence counters and defeat outcome are data. Phaser owns views; React receives focused quantised HUD values. Core state has no Phaser, DOM or browser references.

Each 20ms step resolves the input adapter's requested movement once. Guard changes the supplied movement speed; attacks/hurt lock movement and facing; rolls supply a swept cardinal displacement. Core validates and commits the resulting position once, advances the clock/calendar, then resolves player attacks, enemy decisions/attacks, projectile sweeps, regeneration and encounter completion. There is no competing physics loop. A defeat stops the remainder of the frame and adds an owned death pause. Other pause reasons compose, and closing a menu cannot resume a defeat or background pause.

Combat and render state are separate: damage never depends on a Phaser animation callback. Frame display, hit flashes, windup/recovery and invulnerability read committed ticks. Pausing freezes action/enemy/projectile/regen clocks. Optional 100ms impact shake is off by default, stops under pause, and can be enabled in Controls.

## Player actions

All balances below are validated preview values in `src/content/combat.ts`, version 1. They remain editable pending M00 balance/facing decisions. Timing uses complete 20ms steps: a six-step windup causes no damage during those six steps; the following active update tests contacts.

| Action | Windup / active / recovery | Rules                                                                                                                                           |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Sword  | 120 / 120 / 240ms          | Cardinal 24px reach, 20px width; movement/facing committed; one accepted hit per target per swing; 3 base damage at current preview attack stat |
| Shield | Held                       | 90° forward cone, 35% walking speed; blocks one attack contact for 1 energy; rear/side and insufficient-energy hits get through                 |
| Roll   | 360ms total                | Cardinal 150px/s, swept world collision; invulnerable only during elapsed ticks 3–11 (60–240ms); 2 energy, 900ms cooldown                       |
| Bow    | 240 / 20 / 280ms           | One cardinal arrow after windup, 1 energy, 1s cooldown; no ammunition; 130px/s, maximum 2s lifetime                                             |
| Hurt   | 200ms pose                 | Swept 12px knockback and 700ms damage invulnerability; interrupts action/shield                                                                 |

Physical damage applies attack/defence and the actor's physical resistance. A shield contact or immune overlap consumes an enemy attack's one contact; it cannot keep hitting or draining shield energy across its active window. A sword records successful target IDs, including across checkpoints. Intervening solids block melee line of sight.

Energy regenerates at 1.25/second while not guarding. Health regenerates at 0.5/second after five seconds without damage. Both use fixed active-play steps, cap at their maximum, and stop on defeat/pause. HUD pools are rounded to tenths and cooldowns to 100ms; continuous actor positions stay out of React snapshots. Regeneration currently runs while an encounter's practice region is active, including after completion. Rest and cosmetic animation previews are unavailable in practice.

## Enemy behaviours

All six kinds are separate behaviour definitions, not recolours. States expose idle → detect → pursuit → windup → active → recovery, with a return/disengage state beyond detection/leash limits. Detection has a 300ms visible warning. Windup commits aim/facing; enemies leave a recovery opportunity after attacking.

| Kind     | Behaviour                                                                         | Windup / active / recovery | Health / damage |
| -------- | --------------------------------------------------------------------------------- | -------------------------- | --------------- |
| Skeleton | Approaches at 38px/s, stops to swing                                              | 500 / 120 / 600ms          | 6 / 2           |
| Zombie   | Slow 20px/s pressure, longer swing and recovery                                   | 640 / 160 / 800ms          | 9 / 3           |
| Goblin   | Keeps distance, retreats inside 60px, commits a visible aim line before one arrow | 700 / 20 / 800ms           | 5 / 2           |
| Bat      | Faster circling approach followed by a committed cardinal dash                    | 360 / 240 / 800ms          | 3 / 1           |
| Rat      | Short pursuit bursts and pauses, then a quick close strike                        | 240 / 100 / 700ms          | 3 / 1           |
| Slime    | Hop/pause approach followed by a slow committed lunge                             | 600 / 300 / 900ms          | 5 / 2           |

Gold rings/outlines indicate windup; red indicates an active attack. Labels and small health bars supplement colour. Archer aim remains fixed through its windup so moving can evade it. Enemy arrows travel at 90px/s and expire after 2s. Projectiles carry owner/faction IDs, skip friendly actors, sweep against thin world solids and targets, and disappear on contact, lifetime/region exit, owner death or player defeat. They do not consume an ammunition inventory.

Steering uses direct clear-foot routes where possible. Blocked routes request a bounded 8px-grid room path at most once per enemy per 25 ticks. Each request visits at most 2,048 cells and stores at most 256 waypoints. Impossible routes return an empty result; there is no full-world search each frame. Feet collide with static world geometry; enemy feet are hurtboxes rather than additional solid navigation walls. Actors cannot trap one another against a bench by becoming unresolvable solids.

## Pixels and effects

Fifteen already-reviewed updated skeleton/zombie/goblin, bat, rat and blue-slime sources are promoted to runtime. All their animation rectangles are packed explicitly into the padded atlas; full sheets are not substituted for frame crops. Updated skeleton/zombie sources supply idle/walk, and the goblin supplies a bow sequence. They do not provide separate strike/death sheets. Their committed attacks use authored telegraph/active geometry, and defeat uses a short held-pose fade. Hit tint uses Phaser 4 tint mode, not the removed Phaser 3 tint-fill API.

Bat art has left/right coverage, used as a side-facing flight pose during vertical travel. Rats have four directions with their inspected mixed cell sizes. Slimes have up/down coverage; lateral hops deliberately use the down view. Source pixels, frame sizes and reference feet remain unchanged. Primitive arrows, coin markers, attack outlines and shield/impact effects are authored presentation, separate from the purchased art.

## Rewards, defeat and continuation

Each enemy death creates one stable drop and one defeat event. The final death emits one encounter-completed event. Nearby coin pickup checks current range/identity, marks the drop claimed and credits carried money atomically; repeat pickup fails. Coins and defeated enemy state survive in-session checkpoints. Starting a new trial is the explicit reset boundary; simply pausing or returning from defeat does not duplicate drops or revive defeated actors.

Player defeat creates one persisted sequence identity and pending phase, clears projectiles and freezes play. The focused defeat dialog returns to the validated practice entrance through a single authoritative command. It restores pools, gives two seconds of safety, returns living enemies to their home positions and retains dead enemies/unclaimed drops. A repeated stale respawn command fails; restoring a pending-defeat checkpoint restores its pause. Sequence identities continue across new trials.

The practice policy retains all possessions and does not consume death randomness. The separate pure loss resolver accepts validated material-chance/money-fraction configuration and an injected owned random draw; tests verify that it never mutates permanent progression, deposits or the supplied player. **This does not settle M00 campaign loss eligibility, equipment/stack/money rules or implement M07 durable loss/respawn saving.** No campaign tools are granted. Durable browser storage, inventory operations, equipment modifiers, dungeon anchors, boss rewards and campaign progression remain later work.

## Controls and verification

Default actions are Space (sword), Q (hold shield), R (roll), F (bow), E (interact/pickup) and Escape (pause). Standard controllers use west face (sword), left bumper (shield), north face (roll), right bumper (bow), south face (interact/confirm) and Start (pause). Bindings remain unique and remappable per session; arrow movement and east-face menu cancel remain reserved. Focus, pause, modal, region and disconnect transitions clear held input; controllers require neutral before rearming.

Unit tests cover cardinal boundaries, active timing, repeated overlap, directional/empty-energy shielding, bounded invulnerability/knockback, roll timing/collision, projectile faction/sweeps/lifetime, each enemy's phases, bounded obstacle navigation, one-time rewards/respawn, checkpoint continuation and 30/60/144Hz equivalence. Browser checks use actual keyboard/controller/UI paths and rendered results. Controller tests emulate the standard Gamepad API; physical hardware remains untested. See CHANGELOG for executed checks and play/visual results.
