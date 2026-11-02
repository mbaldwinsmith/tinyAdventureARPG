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

test('inspects the reviewed catalogue, plays framed art and follows an updated enemy source', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  const workbench = page.getByRole('region', { name: 'Sprite workbench' });
  await expect(workbench.getByTestId('catalogue-summary')).toContainText('716 canonical images', {
    timeout: 30000,
  });
  await expect(page.getByRole('button', { name: 'Preview animation', exact: true })).toBeDisabled();
  await expect(workbench.getByLabel('Validated animation')).toHaveValue('1-idle-down');
  await workbench.getByRole('button', { name: 'Play animation', exact: true }).click();
  await expect.poll(() => workbench.getByTestId('frame-count').textContent()).not.toBe('1 / 4');
  await workbench.getByRole('button', { name: 'Stop animation', exact: true }).click();
  await workbench.getByLabel('Custom hitbox guide').check();
  await expect(workbench.getByLabel('Hitbox width')).toBeVisible();
  await workbench.getByLabel('Search sprites').fill('Goblin_bow_v2');
  await expect(workbench.locator('.catalogue-card')).toHaveCount(1);
  await workbench.locator('.catalogue-card').click();
  await workbench.getByText('Source occurrences & version choice', { exact: true }).click();
  await expect(workbench.locator('.asset-source')).toContainText('TAP_Enemies_v2.zip');
  await page.getByRole('button', { name: 'Close workbench' }).click();
  await expect(page.getByRole('button', { name: 'Preview animation', exact: true })).toBeEnabled();
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('plays tool art, holds the King death endpoint and assembles all tongue directions', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByLabel('Animation to preview').selectOption('hook');
  await page.getByRole('button', { name: 'Preview animation', exact: true }).click();
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  const workbench = page.getByRole('region', { name: 'Sprite workbench' });
  await workbench.getByLabel('Search sprites').fill('Boss_Death_32x48');
  await workbench.locator('.catalogue-card').click();
  await expect(workbench.getByLabel('Validated animation')).toHaveValue('king-death');
  await workbench.getByRole('button', { name: 'Play animation', exact: true }).click();
  await expect(workbench.getByTestId('frame-count')).toHaveText('6 / 6', { timeout: 8000 });
  await expect(workbench.getByRole('button', { name: 'Play animation', exact: true })).toBeVisible({
    timeout: 3000,
  });
  await expect(workbench.getByTestId('frame-count')).toHaveText('6 / 6');
  await workbench.getByLabel('Search sprites').fill('Tongue_Attack_divided');
  await workbench.locator('.catalogue-card').click();
  for (const direction of ['down', 'left', 'up', 'right']) {
    await workbench.getByLabel('Tongue direction').selectOption(direction);
    await workbench.getByLabel('Tongue segments').fill('7');
    await expect(workbench.getByTestId('tongue-size')).toContainText('7 middle segments');
    const dimensions = await workbench.getByLabel('Assembled King tongue').evaluate((node) => ({
      width: (node as HTMLCanvasElement).width,
      height: (node as HTMLCanvasElement).height,
    }));
    expect(Math.max(dimensions.width, dimensions.height)).toBe(480);
  }
});

test('matches updated goblin directions to named legacy source pixels', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  const workbench = page.getByRole('region', { name: 'Sprite workbench' });
  await workbench.getByLabel('Search sprites').fill('Goblin_idle_v2');
  await workbench.locator('.catalogue-card').click();
  await workbench.getByLabel('Sprite zoom').selectOption('1');
  await workbench.getByLabel('Frame/grid overlay').uncheck();
  await workbench.getByLabel('Authored foot anchor').uncheck();
  await workbench.getByLabel('Attachment sockets').uncheck();
  for (const direction of ['down', 'left', 'up', 'right']) {
    await workbench
      .getByLabel('Validated animation')
      .selectOption(`enemy-goblin-idle-${direction}`);
    const expected = await page.evaluate(async (direction) => {
      const catalogue = (await (await fetch('/__catalogue/index.json')).json()) as {
        assets: { id: string; sources: { path: string }[] }[];
      };
      const legacy = catalogue.assets.find((asset) =>
        asset.sources.some((s) => s.path.endsWith(`/Goblin/Idle/Goblin_idle_${direction}.png`)),
      );
      if (!legacy) throw new Error('Legacy direction reference missing');
      const image = new Image();
      image.src = `/__catalogue/${legacy.id}.png`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No reference canvas');
      ctx.drawImage(image, 0, 0, 16, 16, 0, 0, 16, 16);
      return Array.from(ctx.getImageData(0, 0, 16, 16).data);
    }, direction);
    await expect
      .poll(async () =>
        workbench
          .locator('.asset-inspector > .sprite-inspection-viewport canvas')
          .evaluate((node) => {
            const ctx = (node as HTMLCanvasElement).getContext('2d');
            if (!ctx) throw new Error('No inspector canvas');
            return Array.from(ctx.getImageData(0, 0, 16, 16).data);
          }),
      )
      .toEqual(expected);
  }
});
