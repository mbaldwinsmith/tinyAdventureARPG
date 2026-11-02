import { expect, test } from '@playwright/test';

test('opens the clearing, changes appearance and pauses/resumes through the bridge', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.getByRole('button', { name: 'Wanderer 4', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Wanderer 4', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('region', { name: 'Walkable forest clearing' }).click();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(250);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Taking a breather');
  await page.getByRole('button', { name: 'Back to the clearing' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('status')).toHaveText('The path is open');
  expect(errors).toEqual([]);
});

test('disposes its canvas and bridge handler cleanly before mounting a fresh runtime', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByText('Development tools', { exact: true }).click();
  for (let cycle = 0; cycle < 2; cycle++) {
    await page.getByRole('button', { name: 'Unload scene' }).click();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.getByRole('button', { name: 'Mount scene' }).click();
    await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
    await expect(page.locator('canvas')).toHaveCount(1);
    await page.getByRole('button', { name: 'Wanderer 6', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Wanderer 6', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  }
});

test('reports missing curated textures instead of silently opening a broken scene', async ({
  page,
}) => {
  await page.route('**/generated/hero-1-idle.png', (route) =>
    route.fulfill({ status: 404, body: 'missing fixture' }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Could not load texture', { timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});
