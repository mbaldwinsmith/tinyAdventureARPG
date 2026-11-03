import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createPreviewSave } from '../../src/content/preview';
import { PREVIEW_WORLD } from '../../src/content/world';
import { enterArea } from '../../src/core/expeditions';
import { toolIdSchema } from '../../src/core/ids';
import type { SaveState } from '../../src/core/model';
const host = (p: Page) => p.locator('.game-canvas');
async function settled(p: Page) {
  await expect(p.getByTestId('save-status')).not.toHaveText('Saving…');
}
async function ready(p: Page) {
  await expect
    .poll(
      async () => {
        await p.clock.runFor(40);
        return p.getByRole('status').textContent();
      },
      { timeout: 30000 },
    )
    .toBe('The path is open');
  await settled(p);
}
async function open(p: Page) {
  await p.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await p.goto('/');
  await expect(p.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await settled(p);
  await p.getByText('Development tools', { exact: true }).click();
  await p.getByLabel('World collision overlay').check();
  await p.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await host(p).focus();
  await p.clock.runFor(180);
  await expect(host(p)).toHaveAttribute('data-region', 'region:clearing');
}
async function pose(p: Page) {
  return host(p).evaluate((e) => ({
    x: Number((e as HTMLElement).dataset.x),
    y: Number((e as HTMLElement).dataset.y),
  }));
}
async function walk(p: Page, x: number, y: number) {
  await settled(p);
  await host(p).focus();
  for (const [axis, target] of [
    ['x', x],
    ['y', y],
  ] as const) {
    for (let i = 0; i < 20; i++) {
      const at = await pose(p),
        delta = target - at[axis];
      if (Math.abs(delta) < 2) break;
      const key =
        axis === 'x'
          ? delta > 0
            ? 'ArrowRight'
            : 'ArrowLeft'
          : delta > 0
            ? 'ArrowDown'
            : 'ArrowUp';
      const duration = Math.min(900, Math.max(20, Math.floor(Math.abs(delta) / 1.2) * 20));
      await p.keyboard.down(key);
      await p.clock.runFor(duration);
      await p.keyboard.up(key);
      await p.clock.runFor(120);
      await settled(p);
      if (i === 19)
        throw new Error(
          `Route blocked moving ${axis} toward ${target}; at ${JSON.stringify(await pose(p))}`,
        );
    }
  }
  const at = await pose(p);
  expect(Math.abs(at.x - x)).toBeLessThan(2);
  expect(Math.abs(at.y - y)).toBeLessThan(2);
}
async function face(p: Page, key: string) {
  await host(p).focus();
  await p.keyboard.down(key);
  await p.clock.runFor(60);
  await p.keyboard.up(key);
  await p.clock.runFor(160);
  await expect(host(p)).toHaveAttribute('data-facing', key.replace('Arrow', '').toLowerCase());
}
async function interact(p: Page) {
  await host(p).focus();
  await p.keyboard.press('e');
  await p.clock.runFor(100);
  await settled(p);
  await p.clock.runFor(120);
}
async function select(p: Page, name: string) {
  await p.getByRole('button', { name: `Select ${name}`, exact: true }).click();
  await settled(p);
  await p.clock.runFor(100);
}
async function use(p: Page) {
  await host(p).focus();
  await p.keyboard.press('x');
  await p.clock.runFor(100);
  await settled(p);
}
async function ticks(p: Page, ms: number) {
  await p.clock.runFor(ms);
  await settled(p);
  await p.clock.runFor(100);
}
function fixture(x = 688, y = 408) {
  const state = createPreviewSave('browser-tool-trail');
  enterArea(state, PREVIEW_WORLD, 'region:tool-trail');
  state.player.actor.position = { x, y };
  state.player.actor.facing = 'right';
  state.player.permanent.tools = ['bow', 'bomb', 'boomerang', 'hook', 'magic'].map((t) =>
    toolIdSchema.parse(`tool:${t}`),
  );
  if (!state.combat) throw new Error('No trail');
  state.combat.enemies = [];
  state.combat.completed = true;
  state.combat.invulnerableUntil = 0;
  return state;
}
async function importState(p: Page, state: SaveState) {
  await p.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(p);
  await p.getByLabel('Import backup as a new adventure', { exact: true }).setInputFiles({
    name: 'tools.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await expect(p.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0, {
    timeout: 30000,
  });
  await settled(p);
  await ticks(p, 120);
}
async function passages(p: Page) {
  const d = p.getByRole('region', { name: 'Tools and trail' });
  if (
    !(await d
      .getByText('Trail passages', { exact: true })
      .evaluate((e) => e.parentElement?.hasAttribute('open')))
  )
    await d.getByText('Trail passages', { exact: true }).click();
  return d;
}
test('walks from the village chest into the authored trail, earns tools, solves arrow/weight/bomb gates and reloads their retained state', async ({
  page,
}, info) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await open(page);
  await walk(page, 240, 175);
  await walk(page, 211, 175);
  await face(page, 'ArrowUp');
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await page.getByRole('button', { name: 'Collect starter supplies' }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await ticks(page, 120);
  await walk(page, 248, 32);
  await face(page, 'ArrowUp');
  await interact(page);
  await expect(page.locator('#clearing-title')).toHaveText('The woodland path');
  await ticks(page, 200);
  await walk(page, 480, 272);
  await face(page, 'ArrowUp');
  await interact(page);
  await expect(page.locator('#clearing-title')).toHaveText('The wayfarer’s tool trail');
  await ticks(page, 200);
  await walk(page, 56, 480);
  await face(page, 'ArrowRight');
  await interact(page);
  await expect(page.getByTestId('tool-feedback')).toContainText('permanently owned');
  await walk(page, 240, 408);
  await face(page, 'ArrowUp');
  await select(page, 'Bow');
  await use(page);
  await ticks(page, 1000);
  await expect(await passages(page)).toContainText('Open · Arrow target A');
  await walk(page, 376, 432);
  await face(page, 'ArrowRight');
  await select(page, 'Push');
  expect((await pose(page)).y).toBeCloseTo(432, 0);
  await expect(host(page)).toHaveAttribute('data-facing', 'right');
  for (let i = 0; i < 3; i++) {
    await use(page);
    await ticks(page, 200);
    await expect(page.getByTestId('tool-feedback')).toContainText('Pushed heavy weight');
  }
  await walk(page, 424, 408);
  await walk(page, 600, 408);
  await face(page, 'ArrowRight');
  await page.getByRole('button', { name: 'Place bomb', exact: true }).click();
  await settled(page);
  await ticks(page, 60);
  await walk(page, 584, 456);
  await ticks(page, 1000);
  await expect(await passages(page)).toContainText('Open · Cracked wall');
  await page.screenshot({ path: info.outputPath('trail-bomb-passage.png'), fullPage: true });
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Save now', exact: true }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Return to adventure' }).click();
  await page.reload();
  await ready(page);
  await expect(page.locator('#clearing-title')).toHaveText('The wayfarer’s tool trail');
  await expect(await passages(page)).toContainText('Open · Cracked wall');
  await expect(await passages(page)).toContainText('Open · Arrow target A');
  expect(errors).toEqual([]);
});
test('uses a controller-selected hook, both lever groups, magic, boomerang retrieval and flippers before opening the permanent forest shortcut', async ({
  page,
}, info) => {
  test.setTimeout(240000);
  await page.addInitScript(() => {
    window.m04Pad = { connected: false, axes: [0, 0], buttons: Array(17).fill(false) };
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => {
        const p = window.m04Pad;
        return p?.connected
          ? [
              {
                index: 0,
                id: 'Xbox standard tools fixture',
                mapping: 'standard',
                axes: p.axes,
                buttons: p.buttons.map((pressed) => ({ pressed, value: Number(pressed) })),
              },
            ]
          : [];
      },
    });
  });
  await open(page);
  await importState(page, fixture());
  async function pad(button?: number) {
    await page.evaluate((button) => {
      if (!window.m04Pad) throw new Error('No pad');
      window.m04Pad.connected = true;
      window.m04Pad.buttons = Array.from({ length: 17 }, (_, i) => i === button);
    }, button);
    await page.clock.runFor(260);
  }
  async function press(button: number) {
    await pad();
    await pad(button);
    await pad();
    await settled(page);
    await pad();
  }
  await host(page).focus();
  await pad();
  await press(8);
  await expect(page.getByRole('dialog', { name: 'Inventory and equipment' })).toBeVisible();
  await page.getByLabel('Selected tool', { exact: true }).focus();
  for (const value of ['shield', 'roll', 'bow', 'bomb', 'boomerang', 'hook']) {
    await expect(page.getByLabel('Selected tool', { exact: true })).toBeFocused();
    await expect(page.getByLabel('Selected tool', { exact: true })).toBeEnabled();
    await press(15);
    await expect(
      page.getByLabel('Selected tool', { exact: true }),
      await page.locator('.inventory-dialog').innerText(),
    ).toHaveValue(value);
  }
  await expect(page.getByLabel('Selected tool', { exact: true })).toHaveValue('hook');
  await press(8);
  await press(7);
  await ticks(page, 700);
  expect((await pose(page)).x).toBeCloseTo(824, 0);
  await page.screenshot({ path: info.outputPath('hook-crossing.png'), fullPage: true });
  await walk(page, 864, 344);
  await face(page, 'ArrowUp');
  await interact(page);
  await expect(page.getByRole('region', { name: 'Tools and trail' })).toContainText(
    'Orange O raised',
  );
  await walk(page, 864, 224);
  await walk(page, 800, 224);
  await face(page, 'ArrowUp');
  await page.getByRole('button', { name: 'Cast magic', exact: true }).click();
  await settled(page);
  await ticks(page, 800);
  await expect(await passages(page)).toContainText('Open · Magic brazier M');
  await walk(page, 800, 136);
  await walk(page, 480, 136);
  await face(page, 'ArrowUp');
  await page.getByRole('button', { name: 'Use boomerang', exact: true }).click();
  await settled(page);
  await ticks(page, 1800);
  await expect(await passages(page)).toContainText('Open · Return switch R');
  await expect(page.getByTestId('tool-feedback')).toContainText('returned with a coin');
  await walk(page, 480, 176);
  await walk(page, 344, 176);
  await walk(page, 344, 136);
  await walk(page, 288, 136);
  await walk(page, 288, 176);
  await face(page, 'ArrowLeft');
  await interact(page);
  await expect(page.getByTestId('tool-feedback')).toContainText('Flippers owned permanently');
  await walk(page, 256, 136);
  await walk(page, 224, 136);
  await page.screenshot({ path: info.outputPath('flipper-channel.png'), fullPage: true });
  await walk(page, 216, 136);
  await face(page, 'ArrowLeft');
  await page.getByRole('button', { name: 'Place bomb', exact: true }).click();
  await settled(page);
  await walk(page, 256, 176);
  await ticks(page, 800);
  await expect(await passages(page)).toContainText('Open · Forest shortcut');
  await walk(page, 256, 136);
  await walk(page, 64, 136);
  await interact(page);
  await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
  await ticks(page, 200);
  await page.reload();
  await ready(page);
  await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
});
test('keeps a failed tool activation unpublished, retries one fuse, and retains its permanent blast through reload', async ({
  page,
}) => {
  test.setTimeout(90000);
  await open(page);
  await importState(page, fixture(600, 408));
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    Reflect.set(window, 'restoreToolStorage', () => {
      IDBObjectStore.prototype.put = original;
    });
    IDBObjectStore.prototype.put = function () {
      throw new DOMException('quota fixture', 'QuotaExceededError');
    };
  });
  await page.getByRole('button', { name: 'Place bomb', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('save-status')).toHaveText('Save needs attention');
  await expect(page.getByTestId('combat-energy')).toHaveText('10 / 10');
  await expect(page.getByTestId('tool-effects')).toHaveCount(0);
  await page.evaluate(() => {
    const f = Reflect.get(window, 'restoreToolStorage');
    if (typeof f === 'function') f();
  });
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await page.getByRole('button', { name: 'Retry checkpoint', exact: true }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Return to adventure' }).click();
  await ticks(page, 100);
  await expect(page.getByTestId('tool-effects')).toContainText('bomb · fuse');
  await walk(page, 584, 456);
  await ticks(page, 1400);
  await expect(await passages(page)).toContainText('Open · Cracked wall');
  await page.reload();
  await ready(page);
  await expect(await passages(page)).toContainText('Open · Cracked wall');
});
