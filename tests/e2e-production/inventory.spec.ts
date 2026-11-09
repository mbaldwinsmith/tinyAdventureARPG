import { test, expect } from '@playwright/test';
test('walks to starter supplies, equips and reloads a responsive production pack', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.locator('.game-canvas').focus();
  for (const [key, ms] of [
    ['ArrowDown', 500],
    ['ArrowLeft', 500],
    ['ArrowUp', 40],
  ] as const) {
    await page.keyboard.down(key);
    await page.clock.runFor(ms);
    await page.keyboard.up(key);
    await page.clock.runFor(100);
  }
  await page.getByRole('button', { name: /Open (travel|cottage) chest/ }).click();
  await page.getByRole('button', { name: 'Collect starter supplies' }).click();
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await expect(page.getByRole('button', { name: 'Collect starter supplies' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await page.clock.runFor(100);
  await page.keyboard.press('i');
  await page.clock.runFor(100);
  const pack = page.getByRole('dialog', { name: 'Inventory and equipment' });
  await expect(pack).toBeVisible();
  await page.getByRole('button', { name: /Select pack item 4: Iron sword/ }).click();
  await page.getByRole('button', { name: 'Equip Main hand', exact: true }).click();
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
  await page.screenshot({ path: info.outputPath('production-pack-1440.png'), fullPage: true });
  await page.setViewportSize({ width: 800, height: 900 });
  await page.clock.runFor(100);
  expect(await pack.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('production-pack-800.png'), fullPage: true });
  await page.getByRole('button', { name: /Select pack item 1: Wood/ }).click();
  await page.getByRole('button', { name: 'Discard selected quantity…' }).scrollIntoViewIfNeeded();
  await page.screenshot({
    path: info.outputPath('production-item-details-800.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Discard selected quantity…' }).click();
  await expect(page.getByRole('button', { name: 'Confirm discard', exact: true })).toBeDisabled();
  await page.screenshot({ path: info.outputPath('production-discard-800.png'), fullPage: true });
  await page.getByRole('button', { name: 'Keep item', exact: true }).click();
  await page.getByRole('button', { name: 'Close pack' }).click();
  await page.clock.runFor(100);
  await page.reload();
  await expect
    .poll(
      async () => {
        await page.clock.runFor(100);
        return page.getByRole('status').textContent();
      },
      { timeout: 30000 },
    )
    .toBe('The path is open');
  await page.getByRole('button', { name: 'Open pack' }).click();
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
  await expect(pack.locator('.pack-cell')).toHaveCount(4);
  await expect(page.getByText('Development tools', { exact: true })).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});
