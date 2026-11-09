import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

interface PadFixture {
  connected: boolean;
  axes: number[];
  buttons: boolean[];
}
declare global {
  interface Window {
    m04Pad?: PadFixture;
  }
}
const world = (page: Page) => page.locator('.game-canvas');
async function pose(page: Page) {
  return world(page).evaluate((element) => {
    const e = element as HTMLElement;
    return {
      x: Number(e.dataset.x),
      y: Number(e.dataset.y),
      region: e.dataset.region,
      cameraX: Number(e.dataset.cameraX),
      cameraY: Number(e.dataset.cameraY),
      animation: e.dataset.animation,
    };
  });
}
async function open(page: Page) {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByLabel('World collision overlay').check();
  await world(page).click();
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.clock.runFor(150);
  await expect.poll(() => world(page).getAttribute('data-region')).toBe('region:clearing');
}
async function move(page: Page, key: string, ms: number) {
  await page.keyboard.down(key);
  await page.clock.runFor(ms);
  await page.keyboard.up(key);
  await page.clock.runFor(150);
}
async function interact(page: Page) {
  await page.keyboard.press('e');
  await page.clock.runFor(100);
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.runFor(200);
}
async function setPad(page: Page, axes = [0, 0], buttons: number[] = [], connected = true) {
  await page.evaluate(
    ({ axes, buttons, connected }) => {
      if (!window.m04Pad) throw new Error('Missing emulated pad');
      window.m04Pad.axes = axes;
      window.m04Pad.buttons = Array.from({ length: 17 }, (_, i) => buttons.includes(i));
      window.m04Pad.connected = connected;
    },
    { axes, buttons, connected },
  );
}
async function padPress(page: Page, button: number) {
  await setPad(page);
  await page.clock.runFor(100);
  await setPad(page, [0, 0], [button]);
  await page.clock.runFor(100);
  await setPad(page);
  await page.clock.runFor(100);
}

test('collides with sign feet, reads it, clears held keys across the modal and remaps a movement action', async ({
  page,
}) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await open(page);
  await move(page, 'ArrowRight', 1200);
  expect((await pose(page)).x).toBeCloseTo(268);
  await expect(page.getByRole('button', { name: 'Read sign', exact: true })).toBeVisible();
  await page.keyboard.down('ArrowRight');
  await interact(page);
  await expect(page.getByRole('dialog', { name: 'Read sign' })).toBeVisible();
  await page.clock.runFor(500);
  expect((await pose(page)).x).toBeCloseTo(268);
  await page.getByRole('button', { name: 'Continue exploring' }).click();
  await page.clock.runFor(500);
  expect((await pose(page)).x).toBeCloseTo(268);
  await page.keyboard.up('ArrowRight');
  const canvas = await page.locator('canvas').boundingBox();
  if (!canvas) throw new Error('Missing world canvas');
  await page.mouse.click(
    canvas.x + (277 / 480) * canvas.width,
    canvas.y + (151 / 272) * canvas.height,
  );
  await page.clock.runFor(200);
  await expect(page.getByRole('dialog', { name: 'Read sign' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue exploring' }).click();
  await page.clock.runFor(150);
  await move(page, 'ArrowLeft', 400);
  await page.getByRole('button', { name: 'Controls', exact: true }).first().click();
  await page.getByLabel('Move right key').selectOption('KeyL');
  await page.getByRole('button', { name: 'Done with controls' }).click();
  await page.clock.runFor(100);
  const before = (await pose(page)).x;
  await move(page, 'd', 400);
  expect((await pose(page)).x).toBeCloseTo(before);
  await move(page, 'l', 400);
  expect((await pose(page)).x).toBeGreaterThan(before + 15);
  expect(errors).toEqual([]);
});

test('uses real doors, opens a retained chest, carries a box and selects swimming locomotion', async ({
  page,
}) => {
  test.setTimeout(90000);
  await open(page);
  await move(page, 'ArrowUp', 300);
  await move(page, 'ArrowLeft', 2050);
  await expect(page.getByRole('button', { name: 'Enter cottage', exact: true })).toBeVisible();
  await interact(page);
  await expect.poll(async () => (await pose(page)).region).toBe('region:cottage');
  await expect(page.locator('#clearing-title')).toHaveText('Wayfarer’s cottage');
  expect((await pose(page)).cameraX).toBe(-80);
  expect((await pose(page)).cameraY).toBe(-40);
  await move(page, 'ArrowDown', 100);
  await interact(page);
  await expect.poll(async () => (await pose(page)).region).toBe('region:clearing');
  await move(page, 'ArrowRight', 1550);
  await move(page, 'ArrowDown', 600);
  await expect(page.getByRole('button', { name: 'Open travel chest', exact: true })).toBeVisible();
  await interact(page);
  await expect(page.getByRole('dialog', { name: 'Local storage' })).toBeVisible();
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await page.clock.runFor(100);
  await move(page, 'ArrowRight', 800);
  await move(page, 'ArrowDown', 1100);
  await expect(page.getByRole('button', { name: 'Lift small box', exact: true })).toBeVisible();
  await interact(page);
  await expect(page.getByRole('button', { name: 'Set down small box', exact: true })).toBeVisible();
  await move(page, 'ArrowDown', 400);
  expect((await pose(page)).animation).toContain('carry-idle');
  await interact(page);
  await expect(page.getByRole('button', { name: 'Set down small box', exact: true })).toHaveCount(
    0,
  );
  await move(page, 'ArrowUp', 1600);
  await move(page, 'ArrowRight', 1550);
  await move(page, 'ArrowDown', 800);
  expect((await pose(page)).animation).toContain('swim-idle');
  await expect(page.locator('.action-dock')).toContainText('Swimming');
});

test('follows the player in a larger bounded region and returns through a clear incoming spawn', async ({
  page,
}) => {
  test.setTimeout(90000);
  await open(page);
  await move(page, 'ArrowRight', 150);
  await move(page, 'ArrowUp', 1900);
  await expect(
    page.getByRole('button', { name: 'Enter woodland path', exact: true }),
  ).toBeVisible();
  await interact(page);
  await expect.poll(async () => (await pose(page)).region).toBe('region:woodland');
  const entered = await pose(page);
  expect(entered.cameraY).toBeGreaterThan(200);
  await move(page, 'ArrowUp', 4300);
  const followed = await pose(page);
  expect(followed.y).toBeLessThan(250);
  expect(followed.cameraY).toBeLessThan(entered.cameraY - 100);
  expect(followed.cameraX).toBeGreaterThanOrEqual(0);
  expect(followed.cameraX).toBeLessThanOrEqual(480);
  await move(page, 'ArrowDown', 4700);
  await expect(page.getByRole('button', { name: 'Return to clearing', exact: true })).toBeVisible();
  await interact(page);
  await expect.poll(async () => (await pose(page)).region).toBe('region:clearing');
  const returned = await pose(page);
  expect(returned.x).toBeCloseTo(248);
  expect(returned.y).toBeCloseTo(32);
  expect(returned.cameraX).toBe(0);
  expect(returned.cameraY).toBe(0);
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('routes an emulated standard Gamepad API through neutral arming, menus, navigation and disconnect', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    window.m04Pad = { connected: false, axes: [0, 0], buttons: Array(17).fill(false) };
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => {
        const p = window.m04Pad;
        if (!p?.connected) return [];
        return [
          {
            index: 0,
            id: 'Xbox standard controller fixture',
            mapping: 'standard',
            axes: p.axes,
            buttons: p.buttons.map((pressed) => ({
              pressed,
              touched: pressed,
              value: Number(pressed),
            })),
          },
        ];
      },
    });
  });
  await open(page);
  const initial = await pose(page);
  await setPad(page, [1, 0], [0]);
  await page.clock.runFor(300);
  expect((await pose(page)).x).toBeCloseTo(initial.x);
  await setPad(page);
  await page.clock.runFor(100);
  await setPad(page, [1, 0]);
  await page.clock.runFor(300);
  await setPad(page);
  await page.clock.runFor(150);
  expect((await pose(page)).x).toBeGreaterThan(initial.x + 10);
  await expect(page.getByRole('group', { name: 'xbox controls' })).toContainText('Stick / D-pad');
  await padPress(page, 0);
  await expect(page.getByRole('dialog', { name: 'Read sign' })).toBeVisible();
  await padPress(page, 1);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await setPad(page, [1, 0], [9]);
  await page.clock.runFor(100);
  await expect(page.getByRole('dialog')).toBeVisible();
  const paused = await pose(page);
  await page.clock.runFor(400);
  expect((await pose(page)).x).toBeCloseTo(paused.x);
  await expect(page.getByRole('dialog')).toBeVisible();
  await setPad(page);
  await page.clock.runFor(100);
  await padPress(page, 12);
  await padPress(page, 0);
  await expect(page.getByRole('dialog', { name: 'Controls and bindings' })).toBeVisible();
  await padPress(page, 13);
  await expect(page.getByLabel('Move up key')).toBeFocused();
  await padPress(page, 15);
  await expect(page.getByLabel('Move up key')).toHaveValue('KeyJ');
  await padPress(page, 1);
  await expect(page.getByRole('dialog', { name: 'Controls and bindings' })).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('Taking a breather');
  await padPress(page, 13);
  await setPad(page, [0, 0], [0]);
  await page.clock.runFor(100);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await setPad(page, [1, 0], [0]);
  const afterMenu = await pose(page);
  await page.clock.runFor(300);
  expect((await pose(page)).x).toBeCloseTo(afterMenu.x);
  await setPad(page);
  await page.clock.runFor(100);
  await expect(page.getByRole('status')).toHaveText('The path is open');
  await setPad(page, [-1, 0]);
  await page.clock.runFor(300);
  await setPad(page, [0, 0], [], false);
  await page.clock.runFor(150);
  const disconnected = await pose(page);
  await page.clock.runFor(500);
  expect((await pose(page)).x).toBeCloseTo(disconnected.x);
  await expect(page.getByRole('group', { name: 'keyboard controls' })).toContainText('arrows');
});
