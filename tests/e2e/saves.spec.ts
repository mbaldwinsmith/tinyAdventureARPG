import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createPreviewSave } from '../../src/content/preview';
import { itemInstanceSchema } from '../../src/core/model';
import type { SaveState } from '../../src/core/model';
import { enterArea } from '../../src/core/expeditions';
import { PREVIEW_WORLD } from '../../src/content/world';
async function settled(page: Page) {
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
}
async function open(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await settled(page);
}
async function importState(page: Page, state: SaveState) {
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  await page.getByLabel('Import backup as a new adventure', { exact: true }).setInputFiles({
    name: 'test-adventure.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(state)),
  });
  // Import includes file reading, schema/hash work and an IndexedDB commit.
  // Await its durable active-slot postcondition before checking modal teardown.
  await expect(page.locator('.save-panel > div strong')).toHaveText(
    'Imported adventure (imported)',
    { timeout: 30000 },
  );
  await settled(page);
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0);
}
function chestFixture() {
  const state = createPreviewSave('browser-saves');
  state.player.actor.position = { x: 211, y: 175 };
  state.player.actor.facing = 'up';
  state.player.carried.money = 25;
  state.player.carried.items = [
    itemInstanceSchema.parse({
      id: 'item-instance:browser-wood',
      templateId: 'item:wood',
      quantity: 10,
      enchantments: [],
    }),
  ];
  return state;
}
test('banks both owners durably, reloads, sleeps once, exports and imports a separate slot, then creates a named adventure', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  await open(page);
  await importState(page, chestFixture());
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await page.getByLabel('Deposit Wood quantity', { exact: true }).fill('3');
  await page.getByRole('button', { name: 'Deposit Wood', exact: true }).click();
  await settled(page);
  await expect(page.getByRole('dialog', { name: 'Local storage' })).toContainText('Wood × 7');
  await expect(page.getByRole('dialog', { name: 'Local storage' })).toContainText('Wood × 3');
  await page.getByLabel('Coin amount').fill('10');
  await page.getByRole('button', { name: 'Deposit coins', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('carried-money')).toHaveText('Carried: 15 coins');
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 10 coins');
  await page.screenshot({ path: info.outputPath('local-storage.png'), fullPage: true });
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await settled(page);
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await expect(page.getByTestId('carried-money')).toHaveText('Carried: 15 coins');
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 10 coins');
  await page.getByRole('button', { name: 'Withdraw Wood', exact: true }).click();
  await settled(page);
  await expect(page.getByRole('dialog', { name: 'Local storage' })).toContainText('Wood × 8');
  await expect(page.getByRole('dialog', { name: 'Local storage' })).toContainText('Wood × 2');
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await page.getByRole('button', { name: 'Rest until tomorrow' }).click();
  await settled(page);
  await expect(page.getByRole('region', { name: 'Day and season' })).toContainText('Day 2');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.getByRole('region', { name: 'Day and season' })).toContainText('Day 2');
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export current backup' }).click();
  const download = await downloadPromise,
    path = await download.path();
  if (!path) throw new Error('Missing exported backup');
  await page.getByLabel('Import backup as a new adventure', { exact: true }).setInputFiles(path);
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  await expect(page.locator('.save-slots li')).toHaveCount(3);
  await page.getByText('Start a new adventure', { exact: true }).click();
  await page.getByLabel('Adventure name', { exact: true }).fill('A new trail');
  await page.getByLabel('World seed (optional)').fill('named-browser-world');
  await page.getByRole('button', { name: 'Create new adventure' }).click();
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0);
  await settled(page);
  await expect(page.locator('.save-panel')).toContainText('A new trail');
  await expect(page.getByRole('region', { name: 'Day and season' })).toContainText('Day 1');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(page.locator('.save-panel')).toContainText('A new trail');
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  await page
    .getByRole('button', { name: 'Continue Imported adventure (imported)', exact: true })
    .click();
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0);
  await settled(page);
  await expect(page.getByTestId('world-time')).toContainText('Day 2');
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 10 coins');
});
test('reloads a pending expedition defeat and its single resolved loss report', async ({
  page,
}, info) => {
  test.setTimeout(60000);
  const state = chestFixture();
  enterArea(state, PREVIEW_WORLD, 'region:crypt');
  if (!state.combat) throw new Error('Missing crypt');
  state.player.actor.resources.health.current = 0;
  state.combat.death = {
    id: state.combat.nextSequence++,
    phase: 'pending',
    lostItems: [],
    lostMoney: 0,
    losses: [],
  };
  await open(page);
  await importState(page, state);
  await expect(page.getByRole('dialog', { name: 'Defeated on expedition' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Defeated on expedition' })).toBeVisible({
    timeout: 30000,
  });
  await settled(page);
  await page.getByRole('button', { name: 'Return to village' }).click();
  await expect(page.locator('#clearing-title')).toHaveText('Wayfarer’s clearing');
  await settled(page);
  const report = page.getByRole('region', { name: 'Last death outcome' });
  await expect(report).toContainText('Lost 2 coins. Kept 23 carried coins.');
  const outcome = await report.innerText();
  await page.screenshot({ path: info.outputPath('death-report.png'), fullPage: true });
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await expect(report).toHaveText(outcome, { useInnerText: true });
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('keeps a quota-failed bank transfer pending and retries the same complete checkpoint', async ({
  page,
}) => {
  test.setTimeout(60000);
  await open(page);
  await importState(page, chestFixture());
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    Object.defineProperty(window, 'restoreStorage', {
      value: () => {
        IDBObjectStore.prototype.put = original;
      },
      configurable: true,
    });
    IDBObjectStore.prototype.put = function () {
      throw new DOMException('quota test fixture', 'QuotaExceededError');
    };
  });
  await page.getByLabel('Coin amount').fill('10');
  await page.getByRole('button', { name: 'Deposit coins', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('save-status')).toHaveText('Save needs attention');
  await expect(page.getByTestId('carried-money')).toHaveText('Carried: 25 coins');
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 0 coins');
  await page.evaluate(() => {
    const restore = Reflect.get(window, 'restoreStorage');
    if (typeof restore === 'function') restore();
  });
  await page.getByRole('button', { name: 'Retry checkpoint', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('carried-money')).toHaveText('Carried: 15 coins');
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 10 coins');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await expect(page.getByTestId('carried-money')).toHaveText('Carried: 15 coins');
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 10 coins');
});

test('preserves a corrupt original and recovers the previous checkpoint into a separate slot', async ({
  page,
}) => {
  test.setTimeout(60000);
  await open(page);
  await importState(page, chestFixture());
  await page.getByRole('button', { name: 'Rest until tomorrow' }).click();
  await settled(page);
  await expect(page.getByTestId('world-time')).toContainText('Day 2');
  const damagedId = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('tiny-adventure-saves');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      const tx = db.transaction(['slots', 'settings'], 'readwrite');
      const id = await new Promise<string>((resolve, reject) => {
        const request = tx.objectStore('settings').get('active');
        request.onsuccess = () => resolve(request.result.value);
        request.onerror = () => reject(request.error);
      });
      await new Promise<void>((resolve, reject) => {
        const store = tx.objectStore('slots'),
          request = store.get(id);
        request.onsuccess = () =>
          store.put({ ...request.result, current: '{corrupt-current-checkpoint' });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
      return id;
    } finally {
      db.close();
    }
  });
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toBeVisible({
    timeout: 30000,
  });
  await settled(page);
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toContainText(
    'not valid JSON',
  );
  await page.getByRole('button', { name: 'Recover previous checkpoint', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0);
  await settled(page);
  await expect(page.getByTestId('world-time')).toContainText('Day 1');
  await expect(page.locator('.save-panel')).toContainText('(recovered)');
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  await expect(page.locator('.save-slots li')).toHaveCount(3);
  const downloadPromise = page.waitForEvent('download');
  await page
    .locator('.save-slots li')
    .filter({ hasText: 'not valid JSON' })
    .getByRole('button', { name: /Export original/ })
    .click();
  const download = await downloadPromise,
    stream = await download.createReadStream();
  if (!stream) throw new Error('Missing original export');
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString()).toBe('{corrupt-current-checkpoint');
  expect(damagedId).toMatch(/^[0-9a-f-]{36}$/);
});
