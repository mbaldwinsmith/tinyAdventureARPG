import { test, expect } from '@playwright/test';
import { createPreviewSave } from '../../src/content/preview';
import { PREVIEW_WORLD } from '../../src/content/world';
import { enterArea } from '../../src/core/expeditions';
import { toolIdSchema } from '../../src/core/ids';
test('ships the tool trail, freezes a live fuse under its pack, and retains a production blast at desktop and narrow widths', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  const state = createPreviewSave('production-tools');
  enterArea(state, PREVIEW_WORLD, 'region:tool-trail');
  state.player.actor.position = { x: 600, y: 408 };
  state.player.actor.facing = 'right';
  state.player.permanent.tools = ['bow', 'bomb', 'boomerang', 'hook', 'magic'].map((t) =>
    toolIdSchema.parse(`tool:${t}`),
  );
  if (!state.combat) throw new Error('Missing trail');
  state.combat.enemies = [];
  state.combat.completed = true;
  state.combat.invulnerableUntil = 0;
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.getByLabel('Import backup as a new adventure', { exact: true }).setInputFiles({
    name: 'production-tools.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0, {
    timeout: 30000,
  });
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.clock.runFor(200);
  await page.getByRole('button', { name: 'Place bomb', exact: true }).click();
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.runFor(120);
  await expect(page.getByTestId('tool-effects')).toContainText('bomb · fuse');
  await page.getByRole('button', { name: 'Open pack' }).click();
  const effect = await page.getByTestId('tool-effects').textContent();
  await page.clock.runFor(3000);
  expect(await page.getByTestId('tool-effects').textContent()).toBe(effect);
  await page.screenshot({ path: info.outputPath('production-tool-pack-1440.png'), fullPage: true });
  await page.getByRole('button', { name: 'Close pack' }).click();
  await page.clock.runFor(2300);
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
  await page.clock.runFor(200);
  const trail = page.getByRole('region', { name: 'Tools and trail' });
  await trail.getByText('Trail passages', { exact: true }).click();
  await expect(trail).toContainText('Open · Cracked wall');
  await page.screenshot({
    path: info.outputPath('production-tool-trail-1440.png'),
    fullPage: true,
  });
  await page.setViewportSize({ width: 800, height: 900 });
  await page.clock.runFor(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('production-tool-trail-800.png'), fullPage: true });
  await page.reload();
  await expect
    .poll(
      async () => {
        await page.clock.runFor(40);
        return page.getByRole('status').textContent();
      },
      { timeout: 30000 },
    )
    .toBe('The path is open');
  await page
    .getByRole('region', { name: 'Tools and trail' })
    .getByText('Trail passages', { exact: true })
    .click();
  await expect(page.getByRole('region', { name: 'Tools and trail' })).toContainText(
    'Open · Cracked wall',
  );
  await expect(page.getByText('Development tools', { exact: true })).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});
