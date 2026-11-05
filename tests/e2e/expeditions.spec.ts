import { MERCHANT_ID, MERCHANT_PLOT, SHOP_REGION, STORE_DOOR } from '../../src/content/village';
import { forestRescueSite } from '../../src/core/village';
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { toolIdSchema } from '../../src/core/ids';
import { createPreviewSave } from '../../src/content/preview';
import { PREVIEW_WORLD } from '../../src/content/world';
import { enterArea, retainedArea, areaDefinition } from '../../src/core/expeditions';
import { solidEntriesFor } from '../../src/core/world';
import { clearFootRoute } from '../../src/core/combat-path';
import { combatStateSchema } from '../../src/core/combat-model';
import { freeFoot, segmentBlocked } from '../../src/core/motion';
import type { Position, SaveState } from '../../src/core/model';
import type { RegionDefinition } from '../../src/core/world';
async function pose(page: Page) {
  return page.locator('.game-canvas').evaluate((element) => ({
    x: Number((element as HTMLElement).dataset.x),
    y: Number((element as HTMLElement).dataset.y),
  }));
}
async function move(page: Page, key: string, ms: number) {
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.keyboard.down(key);
  await page.clock.runFor(ms);
  await page.keyboard.up(key);
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.runFor(120);
}
/** Test-side route planning reads the same saved fixture, but all movement goes through real keys. */
async function walk(page: Page, state: SaveState, target: Position) {
  await page.locator('.game-canvas').focus();
  await fightNearby(page, state);
  const definition = areaDefinition(state, PREVIEW_WORLD),
    solids = solidEntriesFor(definition, retainedArea(state)).map((s) => ({
      x: s.rect.x - 2,
      y: s.rect.y - 2,
      width: s.rect.width + 4,
      height: s.rect.height + 4,
    })),
    start = await pose(page);
  const columns = Math.floor(definition.width / 8) + 1,
    index = (p: Position) => Math.round(p.y / 8) * columns + Math.round(p.x / 8),
    point = (n: number) => ({ x: (n % columns) * 8, y: Math.floor(n / columns) * 8 });
  const nearest = (p: Position) => {
    const base = index(p),
      candidates = [
        base,
        base - 1,
        base + 1,
        base - columns,
        base + columns,
        base - columns - 1,
        base - columns + 1,
        base + columns - 1,
        base + columns + 1,
      ]
        .filter(
          (n) =>
            freeFoot(point(n), definition.width, definition.height, solids) &&
            clearFootRoute(
              p,
              point(n),
              definition.width,
              definition.height,
              solidEntriesFor(definition, retainedArea(state)).map((s) => s.rect),
            ),
        )
        .sort(
          (a, b) =>
            Math.hypot(point(a).x - p.x, point(a).y - p.y) -
            Math.hypot(point(b).x - p.x, point(b).y - p.y),
        );
    const found = candidates[0];
    if (found === undefined) throw new Error(`No clear walking node near ${JSON.stringify(p)}`);
    return found;
  };
  const first = nearest(start),
    last = nearest(target),
    queue = [first],
    parents = new Map<number, number>([[first, first]]);
  for (let i = 0; i < queue.length && !parents.has(last); i++) {
    const current = queue[i];
    if (current === undefined) throw new Error('Missing route node');
    for (const n of [current - 1, current + 1, current - columns, current + columns]) {
      const p = point(n);
      if (n >= 0 && !parents.has(n) && freeFoot(p, definition.width, definition.height, solids)) {
        parents.set(n, current);
        queue.push(n);
      }
    }
  }
  if (!parents.has(last))
    throw new Error(`No test walking route: ${JSON.stringify({ start, target })}`);
  const path: Position[] = [target];
  let cursor = last;
  while (cursor !== first) {
    path.push(point(cursor));
    const previous = parents.get(cursor);
    if (previous === undefined) throw new Error('Broken route');
    cursor = previous;
  }
  path.push(point(first));
  path.reverse();
  const turns = path.filter((p, i) => {
    const before = path[i - 1],
      after = path[i + 1];
    return (
      !before || !after || (p.x - before.x) * (after.y - p.y) !== (p.y - before.y) * (after.x - p.x)
    );
  });
  for (const point of turns) {
    await fightNearby(page, state);
    for (let correction = 0; correction < 4; correction++) {
      const current = await pose(page),
        dx = point.x - current.x,
        dy = point.y - current.y;
      if (Math.hypot(dx, dy) < 2) break;
      const horizontal = Math.abs(dx) > Math.abs(dy),
        distance = horizontal ? dx : dy;
      await move(
        page,
        horizontal
          ? distance > 0
            ? 'ArrowRight'
            : 'ArrowLeft'
          : distance > 0
            ? 'ArrowDown'
            : 'ArrowUp',
        Math.max(20, Math.round(((Math.abs(distance) / 60) * 1000) / 20) * 20),
      );
    }
  }
  const final = await pose(page);
  expect(Math.hypot(final.x - target.x, final.y - target.y)).toBeLessThan(4);
}
async function faceTarget(page: Page, state: SaveState, id: string, position: Position) {
  const definition: RegionDefinition = areaDefinition(state, PREVIEW_WORLD),
    solids = solidEntriesFor(definition, retainedArea(state)).map((s) => s.rect);
  const candidates = [
    { x: position.x, y: position.y + 20, key: 'ArrowUp' },
    { x: position.x - 20, y: position.y, key: 'ArrowRight' },
    { x: position.x + 20, y: position.y, key: 'ArrowLeft' },
    { x: position.x, y: position.y - 20, key: 'ArrowDown' },
  ];
  const current = await pose(page);
  candidates.sort(
    (a, b) =>
      Math.hypot(a.x - current.x, a.y - current.y) - Math.hypot(b.x - current.x, b.y - current.y),
  );
  const target = candidates.find(
    (q) =>
      freeFoot(q, definition.width, definition.height, solids) &&
      !solidEntriesFor(definition, retainedArea(state)).some(
        (s) => s.owner !== id && segmentBlocked(q, position, s.rect),
      ),
  );
  if (!target) throw new Error('No approach');
  await walk(page, state, target);
  await move(page, target.key, 60);
}
async function approach(page: Page, state: SaveState, kind: string) {
  const layout = retainedArea(state).geometry.generated,
    p = layout?.placements.find((p) => p.kind === kind || p.id.endsWith(kind));
  if (!p) throw new Error('Missing target');
  await faceTarget(page, state, p.id, p.position);
  await page.keyboard.press('e');
  await page.clock.runFor(p.kind === 'portal' ? 450 : 150);
  if (p.kind === 'portal') await expect(page.getByRole('status')).toHaveText('The path is open');
}
async function openForest(page: Page, starterSupplies = false) {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByLabel('World collision overlay').check();
  await page.locator('.game-canvas').click();
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.clock.runFor(150);
  const state = createPreviewSave();
  if (starterSupplies) {
    await walk(page, state, { x: 240, y: 175 });
    await walk(page, state, { x: 211, y: 175 });
    await move(page, 'ArrowUp', 60);
    await page.getByRole('button', { name: 'Open local storage' }).click();
    await page.getByRole('button', { name: 'Collect starter supplies' }).click();
    await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
    await page.getByRole('button', { name: 'Close local storage' }).click();
    await page.clock.runFor(120);
  }
  await walk(page, state, { x: 80, y: 220 });
  await move(page, 'ArrowDown', 20);
  await expect(page.getByRole('button', { name: 'Enter the persistent forest' })).toBeVisible();
  await page.keyboard.press('e');
  await page.clock.runFor(300);
  enterArea(state, PREVIEW_WORLD, 'region:forest');
  await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
  return state;
}
test('walks into the generated forest, solves a key gate, pauses its explored map and retains discoveries on a village round trip', async ({
  page,
}, testInfo) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const state = await openForest(page);
  await page.getByRole('button', { name: 'Open explored map' }).click();
  await expect(page.getByRole('dialog', { name: 'Explored map' })).toBeVisible();
  const before = await pose(page);
  await page.clock.runFor(500);
  expect(await pose(page)).toEqual(before);
  await expect(page.getByRole('img', { name: 'Explored rooms and known trails' })).toContainText(
    '?',
  );
  await page.getByRole('button', { name: 'Close map' }).click();
  await page.clock.runFor(100);
  await approach(page, state, 'key');
  await expect(page.getByRole('dialog', { name: 'Take brass key' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue exploring' }).click();
  await page.clock.runFor(100);
  const key = retainedArea(state).geometry.generated?.placements.find((p) => p.kind === 'key');
  if (!key) throw new Error('Missing key');
  retainedArea(state).changes.openedObjects.push(key.id);
  await approach(page, state, 'gate-key');
  await expect(page.getByRole('dialog', { name: 'Unlock brass gate' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue exploring' }).click();
  await page.clock.runFor(100);
  const gate = retainedArea(state).geometry.generated?.placements.find(
    (p) => p.kind === 'gate-key',
  );
  if (!gate) throw new Error('Missing gate');
  retainedArea(state).changes.openedPassages.push(gate.id);
  const map = page.getByRole('dialog', { name: 'Explored map' });
  const knownRooms = () =>
    map.locator('svg > g > text:first-of-type').evaluateAll((labels) =>
      labels
        .filter((label) => label.textContent !== '?')
        .map((label) => ({
          x: label.getAttribute('x'),
          y: label.getAttribute('y'),
          name: label.textContent,
        })),
    );
  await page.getByRole('button', { name: 'Open explored map' }).click();
  await expect(map).toBeVisible();
  const discovered = await knownRooms();
  expect(discovered.length).toBeGreaterThanOrEqual(2);
  await page.getByRole('button', { name: 'Close map' }).click();
  await page.clock.runFor(100);
  await approach(page, state, 'portal');
  await expect(page.locator('#clearing-title')).toHaveText('Wayfarer’s clearing');
  enterArea(state, PREVIEW_WORLD, 'region:clearing', 'start');
  await walk(page, state, { x: 80, y: 220 });
  await move(page, 'ArrowDown', 20);
  await page.keyboard.press('e');
  await page.clock.runFor(300);
  await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
  await page.getByRole('button', { name: 'Open explored map' }).click();
  await expect(map).toBeVisible();
  const remembered = await knownRooms();
  expect(remembered).toEqual(expect.arrayContaining(discovered));
  await expect(map).toContainText(`${remembered.length} PLACES REMEMBERED`);
  await page.screenshot({ path: testInfo.outputPath('explored-map.png'), fullPage: true });
  await page.getByRole('button', { name: 'Close map' }).click();
  await page.getByLabel('World collision overlay').uncheck();
  await page.clock.runFor(150);
  await page.screenshot({ path: testInfo.outputPath('forest-1440.png'), fullPage: true });
  await page.setViewportSize({ width: 800, height: 900 });
  await page.screenshot({ path: testInfo.outputPath('forest-800.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

async function fightNearby(page: Page, state: SaveState) {
  if (!retainedArea(state).geometry.generated) return;
  const definition = areaDefinition(state, PREVIEW_WORLD),
    solids = solidEntriesFor(definition, retainedArea(state)).map((s) => s.rect);
  for (let attempt = 0; attempt < 16; attempt++) {
    const raw = await page.locator('.game-canvas').getAttribute('data-battle');
    if (!raw || raw === 'null') return;
    const battle = combatStateSchema.parse(JSON.parse(raw)),
      current = await pose(page);
    expect(battle.death?.phase).not.toBe('pending');
    const enemy = battle.enemies
      .filter(
        (e) =>
          e.health > 0 &&
          Math.hypot(e.position.x - current.x, e.position.y - current.y) < 75 &&
          !solids.some((s) => segmentBlocked(current, e.position, s)),
      )
      .sort(
        (a, b) =>
          Math.hypot(a.position.x - current.x, a.position.y - current.y) -
          Math.hypot(b.position.x - current.x, b.position.y - current.y),
      )[0];
    if (!enemy) return;
    const dx = enemy.position.x - current.x,
      dy = enemy.position.y - current.y,
      face =
        Math.abs(dx) > Math.abs(dy)
          ? dx > 0
            ? 'ArrowRight'
            : 'ArrowLeft'
          : dy > 0
            ? 'ArrowDown'
            : 'ArrowUp';
    await move(page, face, 60);
    if (Math.hypot(dx, dy) <= 31 && (Math.abs(dx) < 12 || Math.abs(dy) < 12)) {
      await page.keyboard.press('Space');
      await page.clock.runFor(550);
    } else {
      await page.keyboard.down('q');
      await page.clock.runFor(400);
      await page.keyboard.up('q');
      await page.clock.runFor(100);
    }
  }
}
async function solve(page: Page, state: SaveState, kind: string) {
  await approach(page, state, kind);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Continue exploring' }).click();
  await page.clock.runFor(120);
  const area = retainedArea(state),
    p = area.geometry.generated?.placements.find((p) => p.kind === kind);
  if (!p) throw new Error('Missing solved object');
  if (kind.startsWith('gate-') || kind === 'shortcut') area.changes.openedPassages.push(p.id);
  else area.changes.openedObjects.push(p.id);
}
test('solves the crypt route and clears its anchor, retaining the occupied reward room until exit and generating its successor on re-entry', async ({
  page,
}, testInfo) => {
  test.setTimeout(300000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const state = await openCryptCheckpoint(page);
  for (const kind of ['key', 'gate-key', 'switch', 'gate-switch', 'gate-axe'])
    await solve(page, state, kind);
  const layout = retainedArea(state).geometry.generated,
    anchor = layout?.placements.find((p) => p.kind === 'anchor');
  if (!anchor) throw new Error('Missing anchor');
  await walk(page, state, { x: anchor.position.x, y: anchor.position.y + 30 });
  await fightNearby(page, state);
  await expect(page.locator('.expedition-summary')).toContainText('anchor defeated');
  await reloadCheckpoint(page);
  await expect(page.locator('.expedition-summary')).toContainText('Generation 1 · anchor defeated');
  await approach(page, state, 'reward');
  await expect(page.getByRole('dialog', { name: 'Claim anchor reward' })).toContainText(
    'five coins',
  );
  await page.getByRole('button', { name: 'Continue exploring' }).click();
  await page.clock.runFor(100);
  await expect(page.locator('.expedition-summary')).toContainText('Generation 1 · anchor defeated');
  await reloadCheckpoint(page);
  await expect(page.locator('.expedition-summary')).toContainText('Generation 1 · anchor defeated');
  await page.getByLabel('World collision overlay').uncheck();
  await page.clock.runFor(150);
  await page.screenshot({ path: testInfo.outputPath('crypt-defeated.png'), fullPage: true });
  await page.getByLabel('World collision overlay').check();
  await page.clock.runFor(150);
  await approach(page, state, 'portal-0');
  await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
  enterArea(state, PREVIEW_WORLD, 'region:forest');
  await reloadCheckpoint(page);
  await approach(page, state, 'portal-4');
  await expect(page.locator('#clearing-title')).toHaveText('The anchored crypt');
  await expect(page.locator('.expedition-summary')).toContainText('Generation 2 · anchor living');
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('walks the unlocked forest routes into desert, winter and coast and returns from each biome', async ({
  page,
}, testInfo) => {
  test.setTimeout(300000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const state = await openForest(page);
  for (const kind of ['key', 'gate-key', 'switch', 'gate-switch', 'axe', 'gate-axe'])
    await solve(page, state, kind);
  for (const [portal, region, name] of [
    ['portal-1', 'region:desert', 'Amber dunes'],
    ['portal-2', 'region:winter', 'Winter hollows'],
    ['portal-3', 'region:coast', 'Tidewood coast'],
  ] as const) {
    await approach(page, state, portal);
    await expect(page.locator('#clearing-title')).toHaveText(name);
    enterArea(state, PREVIEW_WORLD, region);
    await page.getByLabel('World collision overlay').uncheck();
    await page.clock.runFor(150);
    await page.screenshot({ path: testInfo.outputPath(`${region.slice(7)}.png`), fullPage: true });
    await page.getByLabel('World collision overlay').check();
    await page.clock.runFor(150);
    await approach(page, state, 'portal-0');
    await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
    enterArea(state, PREVIEW_WORLD, 'region:forest');
  }
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

async function reloadCheckpoint(page: Page) {
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.reload();
  // Reload creates a new Phaser boot loop while the test clock remains paused.
  await expect
    .poll(
      async () => {
        await page.clock.runFor(100);
        return page.getByRole('status').textContent();
      },
      { timeout: 30000 },
    )
    .toBe('The path is open');
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByLabel('World collision overlay').check();
  await page.clock.runFor(200);
  await page.locator('.game-canvas').focus();
}

/** Isolate the crypt lifecycle using the public backup import flow. The separate
 * forest/biome journey earns every route tool through actual keyboard play. */
async function openCryptCheckpoint(page: Page) {
  const state = createPreviewSave();
  enterArea(state, PREVIEW_WORLD, 'region:forest');
  state.player.permanent.tools.push(toolIdSchema.parse('tool:axe'));
  const forest = retainedArea(state);
  for (const placement of forest.geometry.generated?.placements ?? []) {
    if (placement.kind.startsWith('gate-')) forest.changes.openedPassages.push(placement.id);
    else if (['key', 'switch', 'axe'].includes(placement.kind))
      forest.changes.openedObjects.push(placement.id);
  }
  // The return trail is already cleared in this lifecycle fixture; ordinary
  // forest combat is exercised by the separate keyboard expedition journey.
  if (!state.combat) throw new Error('Missing fixture forest encounter');
  for (const enemy of state.combat.enemies) {
    enemy.health = 0;
    enemy.phase = 'dead';
    enemy.deathTick = 0;
  }
  state.combat.completed = true;
  state.combat.drops = state.combat.enemies.map((enemy) => ({
    id: `${enemy.id}:drop`,
    position: { ...enemy.position },
    money: 1,
    claimed: true,
  }));
  state.player.carried.money += state.combat.enemies.length;
  enterArea(state, PREVIEW_WORLD, 'region:crypt');
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.getByLabel('Import backup as a new adventure', { exact: true }).setInputFiles({
    name: 'crypt-lifecycle-fixture.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0);
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByLabel('World collision overlay').check();
  await page.clock.runFor(250);
  await expect(page.locator('#clearing-title')).toHaveText('The anchored crypt');
  await page.locator('.game-canvas').focus();
  return state;
}

test('rescues the forest merchant, opens her reserved store, stocks it and saves real trades', async ({
  page,
}, info) => {
  test.setTimeout(300000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const state = await openForest(page, true);
  const journal = page.getByRole('region', { name: 'Village journal' });
  const site = forestRescueSite(retainedArea(state).geometry, areaDefinition(state, PREVIEW_WORLD));
  if (!site) throw new Error('No rescue site');
  await expect(journal).toContainText('Reserved plots marked');
  const talkAtTrailhead = async () => {
    await faceTarget(page, state, 'entity:forest-tessa', site);
    await page.getByRole('button', { name: 'Talk to Tessa at the trailhead', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Tessa at the trailhead' })).toBeVisible();
  };
  const settle = () => expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  const close = async () => {
    await page.getByRole('button', { name: 'Continue exploring', exact: true }).click();
    await page.clock.runFor(120);
  };
  await talkAtTrailhead();
  await expect(page.getByRole('button', { name: 'Invite Tessa to the village' })).toHaveCount(0);
  await close();
  await solve(page, state, 'key');
  await solve(page, state, 'gate-key');
  await talkAtTrailhead();
  await page.getByRole('button', { name: 'Invite Tessa to the village' }).click();
  await expect(page.getByRole('dialog', { name: 'Tessa is coming home' })).toBeVisible();
  await settle();
  await close();
  await expect(journal).toContainText('General store open');
  await approach(page, state, 'portal');
  await expect(page.locator('#clearing-title')).toHaveText('Wayfarer’s clearing');
  enterArea(state, PREVIEW_WORLD, 'region:clearing', 'start');
  await faceTarget(page, state, STORE_DOOR, MERCHANT_PLOT);
  await expect(
    page.getByRole('button', { name: 'Enter general store', exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('merchant-storefront.png'), fullPage: true });
  await page.getByRole('button', { name: 'Enter general store', exact: true }).click();
  await settle();
  await page.clock.runFor(300);
  await expect(page.locator('#clearing-title')).toHaveText('Tessa’s General Store');
  // The test-side state is used only to calculate keyboard routes through retained geometry.
  state.domains.village.residents.push({
    id: MERCHANT_ID,
    recruited: true,
    service: 'general-store',
  });
  enterArea(state, PREVIEW_WORLD, SHOP_REGION);
  await faceTarget(page, state, MERCHANT_ID, { x: 206, y: 102 });
  await page.getByRole('button', { name: 'Talk to Tessa', exact: true }).click();
  await page.getByRole('button', { name: 'Ask about shop supplies' }).click();
  await page.getByRole('button', { name: 'Accept Stock the shelves' }).click();
  await settle();
  await expect(page.getByRole('dialog', { name: 'Stock the shelves' })).toContainText(
    'Wood in pack: 3 / 3',
  );
  await page.getByRole('button', { name: 'Deliver 3 Wood' }).click();
  await settle();
  await expect(page.getByRole('dialog', { name: 'Stock the shelves' })).toContainText(
    'Reward claimed · 12 coins',
  );
  await expect(page.getByRole('button', { name: 'Deliver 3 Wood' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Back to Tessa' }).click();
  await page.getByRole('button', { name: 'Browse the shop' }).click();
  const store = page.getByRole('dialog', { name: 'Tessa’s General Store' });
  await expect(store).toContainText('12 carried coins');
  await store.getByRole('button', { name: 'Buy Shield' }).click();
  await settle();
  await expect(store).toContainText('6 carried coins');
  const quantity = store.getByLabel('Trade quantity');
  await quantity.fill('99');
  await store.getByRole('button', { name: 'Sell Wood' }).click();
  await expect(store.getByRole('alert')).toHaveText('You do not carry that quantity.');
  await expect(store).toContainText('6 carried coins');
  await quantity.fill('1');
  await store.getByRole('button', { name: 'Sell Wood' }).click();
  await settle();
  await expect(store).toContainText('7 carried coins');
  await page.screenshot({ path: info.outputPath('merchant-shop.png'), fullPage: true });
  await reloadCheckpoint(page);
  await expect(page.locator('#clearing-title')).toHaveText('Tessa’s General Store');
  await expect(journal).toContainText('Market stocked');
  await expect(journal).toContainText('Reward claimed');
  await page.getByRole('button', { name: 'Talk to Tessa', exact: true }).click();
  await page.getByRole('button', { name: 'Browse the shop' }).click();
  await expect(store).toContainText('7 carried coins');
  await expect(store.getByRole('button', { name: 'Sell Shield' })).toHaveCount(2);
  await close();
  await faceTarget(page, state, 'entity:merchant-shop-exit', { x: 160, y: 184 });
  await page.getByRole('button', { name: 'Leave general store', exact: true }).click();
  await settle();
  await page.clock.runFor(300);
  await expect(page.locator('#clearing-title')).toHaveText('Wayfarer’s clearing');
  await expect(journal).toContainText('Market stocked');
  expect(errors).toEqual([]);
});
