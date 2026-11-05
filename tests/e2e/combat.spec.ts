import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { combatStateSchema } from '../../src/core/combat-model';
async function battle(page: Page) {
  const raw = await page.locator('.game-canvas').getAttribute('data-battle');
  if (!raw) throw new Error('Combat observation is unavailable');
  return combatStateSchema.parse(JSON.parse(raw));
}
async function openTrial(page: Page, trial = 'melee') {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByLabel('World collision overlay').check();
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.getByLabel('Practice encounter').selectOption(trial);
  await page.getByRole('button', { name: 'Enter practice field', exact: true }).click();
  await page.clock.runFor(250);
  await expect(page.locator('#clearing-title')).toHaveText('The practice field');
  await expect
    .poll(() => page.locator('.game-canvas').getAttribute('data-region'))
    .toBe('region:practice');
}
async function press(page: Page, key: string, ms = 600) {
  await page.keyboard.press(key);
  await page.clock.runFor(ms);
}
test('blocks a telegraphed melee strike, lands distinct sword hits and collects one retained drop', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openTrial(page);
  await page.keyboard.down('q');
  await page.clock.runFor(2000);
  await expect(page.getByTestId('combat-health')).toHaveText('10 / 10');
  await expect(page.getByTestId('combat-feedback')).toContainText('Blocked');
  await page.keyboard.up('q');
  await page.clock.runFor(100);
  await press(page, 'Space');
  let state = await battle(page);
  expect(state.enemies.find((e) => e.kind === 'skeleton')?.health).toBe(3);
  await press(page, 'Space');
  state = await battle(page);
  expect(state.enemies.find((e) => e.kind === 'skeleton')?.health).toBe(0);
  expect(state.drops).toHaveLength(1);
  await expect(page.getByTestId('combat-remaining')).toHaveText('1 enemies remaining');
  await page.keyboard.down('ArrowUp');
  await page.clock.runFor(450);
  await page.keyboard.up('ArrowUp');
  await page.clock.runFor(150);
  await page.getByRole('button', { name: 'Collect nearby coin' }).click();
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.runFor(150);
  await expect(page.getByTestId('combat-coins')).toHaveText('1 coins');
  expect((await battle(page)).drops.filter((d) => d.claimed)).toHaveLength(1);
  expect(errors).toEqual([]);
});
test('releases real arrows, spends roll energy, and freezes every combat clock under a menu', async ({
  page,
}) => {
  test.setTimeout(90000);
  await openTrial(page, 'archer');
  // The read-only geometry observation refreshes every 100ms. Sample after windup
  // and an observation refresh; unit tests enforce the exact release boundary.
  await press(page, 'f', 500);
  expect((await battle(page)).projectiles.some((p) => p.faction === 'player')).toBe(true);
  await expect(page.getByTestId('combat-energy')).toHaveText('10 / 10');
  await page.clock.runFor(400);
  await press(page, 'r', 100);
  expect((await battle(page)).action?.kind).toBe('roll');
  await expect(page.getByTestId('combat-energy')).not.toHaveText('10 / 10');
  await page.keyboard.press('Escape');
  await page.clock.runFor(150);
  await expect(page.getByRole('dialog')).toBeVisible();
  const paused = await battle(page);
  await page.clock.runFor(1000);
  expect(await battle(page)).toEqual(paused);
  await page.getByRole('button', { name: 'Controls', exact: true }).last().click();
  await page.getByLabel('Screen shake on impact').check();
  await page.getByRole('button', { name: 'Done with controls' }).click();
  await expect(page.getByRole('status')).toHaveText('Taking a breather');
  await page.getByRole('button', { name: 'Back to the clearing' }).click();
  await page.clock.runFor(500);
  expect(await battle(page)).not.toEqual(paused);
});
test('pauses on defeat and returns once without resetting the encounter or losing possessions', async ({
  page,
}) => {
  test.setTimeout(90000);
  await openTrial(page);
  await page.clock.runFor(15000);
  await expect(page.getByRole('dialog', { name: 'Defeated in practice' })).toBeVisible();
  const defeated = await battle(page);
  expect(defeated.death?.phase).toBe('pending');
  await expect(page.getByTestId('combat-health')).toHaveText('0 / 10');
  await page.clock.runFor(1000);
  expect(await battle(page)).toEqual(defeated);
  await page.getByRole('button', { name: 'Return to practice entrance' }).evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await page.clock.runFor(150);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('combat-health')).toHaveText('10 / 10');
  await page.clock.runFor(150);
  const returned = await battle(page);
  expect(returned.generation).toBe(defeated.generation);
  expect(returned.death?.id).toBe(defeated.death?.id);
  expect(returned.death?.phase).toBe('resolved');
  expect(returned.death?.lostItems).toEqual([]);
  await expect(page.locator('canvas')).toHaveCount(1);
});
test('shows all six distinct mixed-encounter actors and their authored telegraphs', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openTrial(page, 'mixed');
  expect((await battle(page)).enemies.map((e) => e.kind).sort()).toEqual([
    'bat',
    'goblin',
    'rat',
    'skeleton',
    'slime',
    'zombie',
  ]);
  await page.keyboard.down('q');
  await page.clock.runFor(1200);
  const state = await battle(page);
  expect(
    state.enemies.some((e) => ['pursuit', 'windup', 'active', 'recovery'].includes(e.phase)),
  ).toBe(true);
  await page.keyboard.up('q');
  await page.clock.runFor(100);
  await page.keyboard.press('r');
  await page.clock.runFor(100);
  await expect(page.getByRole('status')).toHaveText('The path is open');
  expect(errors).toEqual([]);
});

declare global {
  interface Window {
    combatPad?: { axes: number[]; buttons: boolean[] };
  }
}
test('uses emulated controller shield, roll and bow bindings and clears a held shield across a modal', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    window.combatPad = { axes: [0, 0], buttons: Array(17).fill(false) };
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => [
        {
          index: 0,
          id: 'Xbox combat fixture',
          mapping: 'standard',
          axes: window.combatPad?.axes ?? [],
          buttons: (window.combatPad?.buttons ?? []).map((pressed) => ({
            pressed,
            value: Number(pressed),
          })),
        },
      ],
    });
  });
  await openTrial(page, 'archer');
  const pad = async (buttons: number[] = []) => {
    await page.evaluate((buttons) => {
      if (!window.combatPad) throw new Error('Missing pad');
      window.combatPad.buttons = Array.from({ length: 17 }, (_, i) => buttons.includes(i));
    }, buttons);
    await page.clock.runFor(150);
  };
  await pad();
  await pad([4]);
  await expect(page.getByTestId('combat-phase')).toHaveText('Shield raised');
  await pad([4, 9]);
  await expect(page.getByRole('dialog')).toBeVisible();
  const paused = await battle(page);
  expect(paused.guard).toBe(false);
  await page.getByRole('button', { name: 'Back to the clearing' }).click();
  await page.clock.runFor(300);
  await expect(page.getByTestId('combat-phase')).not.toHaveText('Shield raised');
  await pad();
  await pad([3]);
  expect((await battle(page)).action?.kind).toBe('roll');
  await pad();
  await page.clock.runFor(400);
  await pad([5]);
  await pad();
  await page.clock.runFor(200);
  expect((await battle(page)).projectiles.some((p) => p.faction === 'player')).toBe(true);
});
