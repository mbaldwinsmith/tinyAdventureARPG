import { z } from 'zod';
import { expect, test } from '@playwright/test';
import type * as TerrainModule from '../../src/assets/terrain';

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

test('reports missing curated textures and recovers when the player retries', async ({ page }) => {
  await page.route('**/generated/atlas-0.png', (route) =>
    route.fulfill({ status: 404, body: 'missing fixture' }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Could not load texture', { timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await page.unroute('**/generated/atlas-0.png');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.locator('canvas')).toHaveCount(1);
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

test('uses source pixels for all 47 terrain cases and inspects layered boats and buildings', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  const pixelCases = await page.evaluate(async () => {
    const modulePath = '/src/assets/terrain.ts';
    const terrain = (await import(modulePath)) as typeof TerrainModule;
    const manifest = (await (await fetch('/generated/manifest.json')).json()) as {
      assets: { id: string; canonicalId: string }[];
    };
    let checked = 0;
    for (const profile of terrain.terrainProfiles.filter(
      (p) => p.style === 'new-47' && p.surface === 'dirt',
    )) {
      const source = manifest.assets.find((a) => a.id === profile.texture);
      if (!source) throw new Error('Terrain texture missing');
      const image = new Image();
      image.src = `/__catalogue/${source.canonicalId}.png`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No terrain reference canvas');
      ctx.drawImage(image, 0, 0);
      const fill = Array.from(ctx.getImageData(24, 24, 1, 1).data).join(',');
      const filled = (x: number, y: number) =>
        Array.from(ctx.getImageData(x, y, 1, 1).data).join(',') === fill;
      const visited = new Set<number>();
      for (let input = 0; input < 256; input++) {
        const mask = terrain.normalizeTerrainMask(input);
        if (visited.has(mask)) continue;
        visited.add(mask);
        const frame = terrain.terrainFrame(profile, mask);
        if (!frame) throw new Error('Missing normalized case');
        let observed = 0;
        for (const [bit, dx, dy] of [
          [1, 8, 0],
          [2, 15, 8],
          [4, 8, 15],
          [8, 0, 8],
        ] as const)
          if (filled(frame.x + dx, frame.y + dy)) observed |= bit;
        for (const [bit, sides, dx, dy] of [
          [16, 3, 15, 0],
          [32, 6, 15, 15],
          [64, 12, 0, 15],
          [128, 9, 0, 0],
        ] as const)
          if ((observed & sides) === sides && filled(frame.x + dx, frame.y + dy)) observed |= bit;
        if (observed !== mask)
          throw new Error(
            `${profile.id}: expected mask ${mask}, observed source pixels ${observed}`,
          );
        checked++;
      }
    }
    return checked;
  });
  expect(pixelCases).toBe(235);
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  const wb = page.getByRole('region', { name: 'Sprite workbench' });
  await wb.getByLabel('Search sprites').fill('New Style/Grasslands');
  await wb.locator('.catalogue-card').click();
  await wb.getByLabel('Neighbour N', { exact: true }).uncheck();
  await expect(wb.getByTestId('terrain-mask')).toContainText('Canonical mask 110');
  await wb.getByLabel('Search sprites').fill('Wooden_House1_green');
  await wb.locator('.catalogue-card').click();
  await wb.getByLabel('Frame/grid overlay').uncheck();
  await wb.getByLabel('Show scenery anchors').uncheck();
  const base = wb.locator('.asset-inspector > .sprite-inspection-viewport canvas');
  const assembled = wb.getByLabel('Assembled scenery', { exact: true });
  const hash = async (locator: typeof base) =>
    locator.evaluate(async (node) => {
      const canvas = node as HTMLCanvasElement,
        ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No pixel canvas');
      const bytes = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      if (!bytes.some((n) => n !== 0)) return 'empty';
      return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).join(',');
    });
  await expect.poll(() => hash(base)).not.toBe('empty');
  await expect.poll(() => hash(assembled)).toBe(await hash(base));
  const complete = await hash(assembled);
  await wb.getByLabel('Show scenery roof', { exact: true }).uncheck();
  await expect.poll(() => hash(assembled)).not.toBe(complete);
  await wb.getByLabel('Search sprites').fill('boat_base_64x64');
  await wb.locator('.catalogue-card').click();
  for (const direction of ['down', 'left', 'up', 'right']) {
    await wb
      .getByLabel('Scenery composition', { exact: true })
      .selectOption(`boat-1-2-${direction}`);
    await expect(wb.getByTestId('scenery-size')).toContainText('64×96px');
  }
  await wb.getByLabel('Search sprites').fill('Shore_TS_Animated_noBG_16x16_updated');
  await wb.locator('.catalogue-card').click();
  await wb.getByRole('button', { name: 'Play shoreline', exact: true }).click();
  await expect.poll(() => wb.getByTestId('shore-phase').textContent()).not.toBe('Phase 1 / 4');
});

test('pauses and resumes the rendered shoreline with the shared menu pause', async ({ page }) => {
  test.setTimeout(60000); // Several software-WebGL captures can exceed the default on CI.
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  const sample = async () => {
    // Compare the world buffer without the modal's blurred backdrop or overlaid text.
    const pixels = await page.locator('.game-canvas canvas').screenshot({
      style:
        '.pause-dialog { opacity: 0 !important; } .pause-dialog::backdrop { background: transparent !important; backdrop-filter: none !important; }',
    });
    return page.evaluate(async (encoded) => {
      const image = new Image();
      image.src = 'data:image/png;base64,' + encoded;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 272;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No shoreline reference canvas');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, 480, 272);
      const bytes = ctx.getImageData(336, 144, 96, 16).data;
      return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).join(',');
    }, pixels.toString('base64'));
  };
  const moving = await sample();
  await expect.poll(sample).not.toBe(moving);
  await page.getByRole('button', { name: 'Pause Esc' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.waitForTimeout(250);
  const frozen = await sample();
  await page.waitForTimeout(450);
  expect(await sample()).toBe(frozen);
  await page.getByRole('button', { name: 'Back to the clearing' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const resumed = await sample();
  await expect.poll(sample).not.toBe(resumed);
});

test('renders GUI panel corners from supplied pixels at different sizes and handles unsupported font text', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.locator('.packed-key')).toHaveCount(7);
  await page.getByRole('button', { name: 'Pause Esc' }).click();
  await expect
    .poll(() =>
      page.getByRole('dialog').evaluate((node) => getComputedStyle(node).borderImageSource),
    )
    .toContain('data:image/png');
  await page.getByRole('button', { name: 'Back to the clearing' }).click();
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  const wb = page.getByRole('region', { name: 'Sprite workbench' });
  await wb.getByLabel('Search sprites').fill('TalkBox_Green_16x16');
  await wb.getByRole('button', { name: /TalkBox_Green_16x16.*48×48px/ }).click();
  const sample = wb.getByLabel('Rendered GUI sample');
  for (const [width, height] of [
    [64, 32],
    [360, 180],
  ]) {
    if (!width || !height) throw new Error('Missing panel size fixture');
    await wb.getByLabel('Panel sample width').fill(String(width));
    await wb.getByLabel('Panel sample height').fill(String(height));
    await expect(sample).toHaveAttribute('width', String(width));
    await expect(sample).toHaveAttribute('height', String(height));
    await expect
      .poll(async () =>
        sample.evaluate(async (node) => {
          const catalogue = (await (await fetch('/__catalogue/index.json')).json()) as {
            assets: { id: string; sources: { path: string }[] }[];
          };
          const source = catalogue.assets.find((a) =>
            a.sources.some((s) => s.path.endsWith('/TalkBox_Green_16x16.png')),
          );
          if (!source) throw new Error('Missing panel source');
          const image = new Image();
          image.src = `/__catalogue/${source.id}.png`;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = 96;
          canvas.height = 96;
          const ctx = canvas.getContext('2d'),
            actual = (node as HTMLCanvasElement).getContext('2d');
          if (!ctx || !actual) throw new Error('No panel comparison canvas');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, 0, 0, 96, 96);
          for (const [sx, sy, dx, dy] of [
            [0, 0, 0, 0],
            [88, 0, (node as HTMLCanvasElement).width - 8, 0],
            [0, 88, 0, (node as HTMLCanvasElement).height - 8],
            [88, 88, (node as HTMLCanvasElement).width - 8, (node as HTMLCanvasElement).height - 8],
          ]) {
            if (sx === undefined || sy === undefined || dx === undefined || dy === undefined)
              throw new Error('Missing corner fixture');
            if (
              Array.from(ctx.getImageData(sx, sy, 8, 8).data).join(',') !==
              Array.from(actual.getImageData(dx, dy, 8, 8).data).join(',')
            )
              return false;
          }
          return true;
        }),
      )
      .toBe(true);
  }
  await wb.getByLabel('Search sprites').fill('Fonts/Font_light.png');
  await wb.locator('.catalogue-card').click();
  await wb.getByLabel('Bitmap sample text').fill('Ready?\n🦊');
  await expect(wb.getByTestId('glyph-support')).toContainText('Unsupported characters use ?: 🦊');
  await wb.getByLabel('Bitmap sample text').fill('Ready?');
  await expect(wb.getByTestId('glyph-support')).toHaveText('All characters mapped');
});

test('plays the authored explosion to its held endpoint and restarts explicitly', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  // Keep the pause target ahead of the browser clock, independently of host/transport drift.
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  for (const action of ['death', 'bomb']) {
    await page.getByLabel('Animation to preview').selectOption(action);
    await page.getByRole('button', { name: 'Preview animation', exact: true }).click();
    await page.clock.runFor(action === 'death' ? 400 : 500);
    await page.getByRole('button', { name: 'Pause Esc' }).click();
    await page.clock.runFor(20);
    const options = {
      style:
        '.pause-dialog { opacity: 0 !important; } .pause-dialog::backdrop { background: transparent !important; backdrop-filter: none !important; }',
    };
    const frozen = await page.locator('.game-canvas canvas').screenshot(options);
    await page.clock.runFor(700);
    expect(await page.locator('.game-canvas canvas').screenshot(options)).toEqual(frozen);
    await page.getByRole('button', { name: 'Back to the clearing' }).click();
    await page.clock.runFor(1200);
  }
  await page.clock.resume();
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  await page.getByText('Authored presentation effects', { exact: true }).click();
  const effect = page.getByRole('region', { name: 'Authored explosion preview' });
  await effect.getByRole('button', { name: 'Play explosion' }).click();
  await expect(effect.getByTestId('explosion-frame')).toHaveText('Frame 6 / 6');
  const terminal = await effect
    .getByLabel('Pixel explosion')
    .evaluate((node) => (node as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(400);
  expect(
    await effect
      .getByLabel('Pixel explosion')
      .evaluate((node) => (node as HTMLCanvasElement).toDataURL()),
  ).toBe(terminal);
  await effect.getByRole('button', { name: 'Play explosion' }).click();
  await expect
    .poll(() =>
      effect
        .getByLabel('Pixel explosion')
        .evaluate((node) => (node as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(terminal);
  await effect.getByRole('button', { name: 'Stop explosion' }).click();
  await effect.getByLabel('Explosion frame').fill('0');
  await expect(effect.getByTestId('explosion-frame')).toHaveText('Frame 1 / 6');
  await page.waitForTimeout(200);
  await expect(effect.getByTestId('explosion-frame')).toHaveText('Frame 1 / 6');
});

test('advances the shared calendar only during active play and rests through an authoritative command', async ({
  page,
}) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  const time = page.getByTestId('world-time');
  const before = await time.textContent();
  await page.clock.runFor(1500);
  await expect(time).not.toHaveText(before ?? '');
  await page.getByRole('button', { name: 'Pause Esc' }).click();
  const paused = await time.textContent();
  await page.clock.runFor(2000);
  await expect(time).toHaveText(paused ?? '');
  await expect(page.getByRole('button', { name: 'Rest until tomorrow' })).toBeDisabled();
  await page.getByRole('button', { name: 'Back to the clearing' }).click();
  await page.getByRole('button', { name: 'Rest until tomorrow' }).click();
  await expect(time).toHaveText('Day 2 · Spring 2 · 06:00');
  await page.clock.runFor(500);
  await expect(time).not.toHaveText('Day 2 · Spring 2 · 06:00');
  await page.getByText('Development tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open sprite workbench' }).click();
  const inspecting = await time.textContent();
  await page.clock.runFor(2000);
  await expect(time).toHaveText(inspecting ?? '');
  await page.getByRole('button', { name: 'Close workbench' }).click();
  await page.clock.runFor(500);
  await expect(time).not.toHaveText(inspecting ?? '');
  expect(errors).toEqual([]);
});

test('keeps the original region-creation failure visible after a scene restart and recovers on retry', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.route('**/generated/manifest.json', async (route) => {
    const response = await route.fetch(),
      data = z
        .looseObject({
          frames: z.array(z.looseObject({ source: z.looseObject({ texture: z.string() }) })),
        })
        .parse(await response.json());
    await route.fulfill({
      response,
      json: {
        ...data,
        frames: data.frames.filter((frame) => frame.source.texture !== 'world-cottage-floor'),
      },
    });
  });
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.locator('.game-canvas').focus();
  await page.keyboard.down('ArrowUp');
  await page.clock.runFor(300);
  await page.keyboard.up('ArrowUp');
  await page.clock.runFor(100);
  await page.keyboard.down('ArrowLeft');
  await page.clock.runFor(2050);
  await page.keyboard.up('ArrowLeft');
  await page.clock.runFor(100);
  await page.keyboard.press('e');
  await page.clock.runFor(500);
  await expect(page.getByRole('alert')).toContainText('Missing packed frame: world-cottage-floor');
  const failure = await page.getByRole('alert').textContent();
  await page.clock.runFor(1000);
  expect(await page.getByRole('alert').textContent()).toBe(failure);
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.unroute('**/generated/manifest.json');
  // A reload boots a new Phaser loop; let its asynchronous assets receive animation frames.
  await page.clock.resume();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.locator('canvas')).toHaveCount(1);
});
