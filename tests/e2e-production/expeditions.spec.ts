import { test, expect } from '@playwright/test';
test('ships the generated forest and paused map in the production bundle without development controls', async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open');
  await expect(page.getByText('Development tools', { exact: true })).toHaveCount(0);
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.locator('.game-canvas').focus();
  await page.keyboard.down('ArrowDown');
  await page.clock.runFor(1600);
  await page.keyboard.up('ArrowDown');
  await page.clock.runFor(120);
  await page.keyboard.down('ArrowLeft');
  await page.clock.runFor(2660);
  await page.keyboard.up('ArrowLeft');
  await page.clock.runFor(120);
  await expect(page.getByRole('button', { name: 'Enter the persistent forest' })).toBeVisible();
  await page.keyboard.press('e');
  await page.clock.runFor(300);
  await expect(page.locator('#clearing-title')).toHaveText('Whispering forest');
  await expect(page.locator('.expedition-summary')).toContainText('1 / 9 clearings explored');
  await page.screenshot({
    path: testInfo.outputPath('production-forest-1440.png'),
    fullPage: true,
  });
  await page.setViewportSize({ width: 800, height: 900 });
  await page.clock.runFor(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('production-forest-800.png'), fullPage: true });
  await page.getByRole('button', { name: 'Open explored map' }).click();
  await expect(page.getByRole('dialog', { name: 'Explored map' })).toBeVisible();
  const calendar = await page.getByRole('region', { name: 'Day and season' }).textContent();
  await page.clock.runFor(3000);
  expect(await page.getByRole('region', { name: 'Day and season' }).textContent()).toBe(calendar);
  await page.getByText('Generation diagnostics', { exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('tiny-adventure-preview-v1');
  await page.screenshot({ path: testInfo.outputPath('production-map-800.png'), fullPage: true });
  await page.getByRole('button', { name: 'Close map' }).click();
  await page.clock.runFor(100);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});
