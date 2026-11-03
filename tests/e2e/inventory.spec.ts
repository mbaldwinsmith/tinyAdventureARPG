import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createPreviewSave } from '../../src/content/preview';
import { itemInstanceSchema } from '../../src/core/model';
import type { SaveState } from '../../src/core/model';
import { enterArea } from '../../src/core/expeditions';
import { PREVIEW_WORLD } from '../../src/content/world';
const pack = (page: Page) => page.getByRole('dialog', { name: 'Inventory and equipment' });
async function settled(page: Page) {
  await expect(page.getByTestId('save-status')).not.toHaveText('Saving…');
}
async function open(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await settled(page);
}
function fixture(capacity = 20) {
  const state = createPreviewSave('browser-pack');
  state.player.actor.position = { x: 211, y: 175 };
  state.player.actor.facing = 'up';
  state.player.carried.money = 25;
  state.player.carried.capacity = capacity;
  return state;
}
async function importState(page: Page, state: SaveState) {
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  await page.getByLabel('Import backup as a new adventure', { exact: true }).setInputFiles({
    name: 'pack.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await expect(page.locator('.save-panel > div strong')).toHaveText(
    'Imported adventure (imported)',
    { timeout: 30000 },
  );
  await settled(page);
  await expect(page.getByRole('dialog', { name: 'Saved adventures' })).toHaveCount(0, {
    timeout: 30000,
  });
}
async function claim(page: Page) {
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await page.getByRole('button', { name: 'Collect starter supplies' }).click();
  await settled(page);
  await expect(page.getByRole('button', { name: 'Collect starter supplies' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close local storage' }).click();
}
async function backup(page: Page): Promise<SaveState> {
  await page.getByRole('button', { name: 'Saved adventures', exact: true }).click();
  await settled(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export current backup' }).click();
  const path = await (await pending).path();
  if (!path) throw new Error('Missing backup');
  const value = JSON.parse(await readFile(path, 'utf8'));
  await page.getByRole('button', { name: 'Return to adventure' }).click();
  return value.state;
}
async function openPack(page: Page) {
  await page.getByRole('button', { name: 'Open pack' }).click();
  await expect(pack(page)).toBeVisible();
}
test('manages a real starter kit, stacks, equipment, paired chest owners and deliberate discard across reloads', async ({
  page,
}, info) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await open(page);
  await importState(page, fixture());
  await claim(page);
  await openPack(page);
  await expect(pack(page)).toContainText('4 / 20 stacks');
  await page.getByRole('button', { name: /Select pack item 4: Iron sword/ }).click();
  await expect(pack(page)).toContainText('Attack +2 while equipped');
  await page.getByRole('button', { name: 'Equip Main hand', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
  await page.getByRole('button', { name: /Select pack item 3: Shield/ }).click();
  await page.getByRole('button', { name: 'Equip Off hand', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('stat-defence')).toHaveText('1');
  await page.getByRole('button', { name: /Select pack item 1: Wood/ }).click();
  await page.getByLabel('Item quantity', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Split selected stack' }).click();
  await settled(page);
  await expect(pack(page).locator('.pack-cell')).toHaveCount(5);
  await page.getByRole('button', { name: /Select pack item 5: Wood/ }).click();
  await page.getByLabel('Pack position', { exact: true }).fill('1');
  await page.getByRole('button', { name: 'Move selected stack' }).click();
  await settled(page);
  await expect(pack(page).locator('.pack-cell').first()).toContainText('× 5');
  await page.getByLabel('Merge into', { exact: true }).selectOption({ label: 'Wood × 7' });
  await page.getByLabel('Item quantity', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Merge selected quantity' }).click();
  await settled(page);
  await expect(pack(page).locator('.pack-cell')).toHaveCount(4);
  await expect(pack(page).locator('.pack-cell').first()).toContainText('× 12');
  await page.getByRole('button', { name: /Select pack item 4: Iron sword/ }).click();
  await page.getByRole('button', { name: 'Unequip selected item' }).click();
  await settled(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('1');
  await page.getByRole('button', { name: 'Close pack' }).click();
  const before = await backup(page),
    keen = before.player.carried.items.find((i) => i.enchantments.length);
  if (!keen) throw new Error('No enchanted blade');
  await page.getByRole('button', { name: 'Open local storage' }).click();
  const carried = page.locator('.storage-columns > section').first(),
    banked = page.locator('.storage-columns > section').last();
  await carried
    .locator('.storage-item')
    .filter({ hasText: 'Keen +2' })
    .getByRole('button', { name: 'Deposit Iron sword', exact: true })
    .click();
  await settled(page);
  await expect(banked).toContainText('Keen +2');
  await expect(banked).toContainText('Protected in this local chest.');
  await page.getByLabel('Deposit Wood quantity', { exact: true }).fill('4');
  await page.getByRole('button', { name: 'Deposit Wood', exact: true }).click();
  await settled(page);
  await page.getByLabel('Coin amount').fill('10');
  await page.getByRole('button', { name: 'Deposit coins', exact: true }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await settled(page);
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await expect(page.getByTestId('carried-money')).toHaveText('Carried: 15 coins');
  await expect(page.getByTestId('deposited-money')).toHaveText('In this chest: 10 coins');
  await page.getByRole('button', { name: 'Withdraw Iron sword', exact: true }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Close local storage' }).click();
  const after = await backup(page);
  expect(after.player.carried.items.find((i) => i.id === keen.id)).toEqual(keen);
  expect(after.player.deposits[0]?.inventory.items[0]?.quantity).toBe(4);
  await openPack(page);
  await page.getByRole('button', { name: /Select pack item 4: Iron sword/ }).click();
  await page.getByRole('button', { name: 'Discard selected quantity…' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirm discard' })).toContainText(
    'Discard a valuable item?',
  );
  await expect(page.getByRole('button', { name: 'Confirm discard', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Keep item', exact: true }).click();
  await expect(pack(page).locator('.pack-cell')).toHaveCount(4);
  await page.getByRole('button', { name: 'Discard selected quantity…' }).click();
  await page.getByLabel('I understand this removes the selected possessions.').check();
  await page.getByRole('button', { name: 'Confirm discard', exact: true }).click();
  await settled(page);
  await expect(pack(page).locator('.pack-cell')).toHaveCount(3);
  await expect(pack(page)).toContainText('Permanent tools: sword, shield');
  await page.setViewportSize({ width: 800, height: 1000 });
  await page.screenshot({ path: info.outputPath('inventory-800.png'), fullPage: true });
  expect(await pack(page).evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(true);
  await page.getByRole('button', { name: 'Close pack' }).click();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await openPack(page);
  await expect(page.getByTestId('stat-defence')).toHaveText('1');
  await expect(pack(page).locator('.pack-cell')).toHaveCount(3);
  expect(errors).toEqual([]);
});
test('leaves a full-pack starter reward unclaimed, then succeeds after room is made; a failed equip remains pending until retry', async ({
  page,
}) => {
  test.setTimeout(90000);
  await open(page);
  const crowded = fixture(4);
  crowded.player.carried.items = [
    itemInstanceSchema.parse({
      id: 'item-instance:full-wood',
      templateId: 'item:wood',
      quantity: 99,
      enchantments: [],
    }),
  ];
  await importState(page, crowded);
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await page.getByRole('button', { name: 'Collect starter supplies' }).click();
  await expect(page.getByRole('dialog', { name: 'Local storage' })).toContainText(
    'remains unclaimed',
  );
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await openPack(page);
  await expect(pack(page)).toContainText('1 / 4 stacks');
  await expect(pack(page)).toContainText('Permanent tools: none yet');
  await page.getByRole('button', { name: 'Close pack' }).click();
  await page.getByRole('button', { name: 'Open local storage' }).click();
  await page.getByLabel('Deposit Wood quantity', { exact: true }).fill('99');
  await page.getByRole('button', { name: 'Deposit Wood', exact: true }).click();
  await settled(page);
  await page.getByRole('button', { name: 'Close local storage' }).click();
  await claim(page);
  await openPack(page);
  await page.getByRole('button', { name: /Select pack item 4: Iron sword/ }).click();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    Reflect.set(window, 'restorePackStorage', () => {
      IDBObjectStore.prototype.put = original;
    });
    IDBObjectStore.prototype.put = function () {
      throw new DOMException('quota fixture', 'QuotaExceededError');
    };
  });
  await page.getByRole('button', { name: 'Equip Main hand', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('1');
  await expect(pack(page)).toContainText('full');
  await expect(page.getByRole('button', { name: 'Close pack' })).toBeDisabled();
  await page.evaluate(() => {
    const restore = Reflect.get(window, 'restorePackStorage');
    if (typeof restore === 'function') restore();
  });
  await page.getByRole('button', { name: 'Retry checkpoint', exact: true }).click();
  await settled(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
  await page.getByRole('button', { name: 'Close pack' }).click();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await openPack(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
});
test('protects equipped identities and selected tool through a single saved expedition death', async ({
  page,
}) => {
  test.setTimeout(90000);
  await open(page);
  await importState(page, fixture());
  await claim(page);
  await openPack(page);
  await page.getByRole('button', { name: /Select pack item 4: Iron sword/ }).click();
  await page.getByRole('button', { name: 'Equip Main hand', exact: true }).click();
  await settled(page);
  await page.getByLabel('Selected tool', { exact: true }).selectOption('bow');
  await settled(page);
  await page.getByRole('button', { name: 'Close pack' }).click();
  const state = await backup(page),
    possessions = structuredClone(state.player.carried.items);
  enterArea(state, PREVIEW_WORLD, 'region:crypt');
  if (!state.combat) throw new Error('Missing encounter');
  state.player.actor.resources.health.current = 0;
  state.combat.death = {
    id: state.combat.nextSequence++,
    phase: 'pending',
    lostItems: [],
    lostMoney: 0,
    losses: [],
  };
  await importState(page, state);
  await page.getByRole('button', { name: 'Return to village', exact: true }).click();
  await settled(page);
  await expect(page.getByRole('region', { name: 'Last death outcome' })).toContainText(
    'Lost 2 coins. Kept 23 carried coins.',
  );
  await openPack(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
  await expect(page.getByLabel('Selected tool', { exact: true })).toHaveValue('bow');
  await page.getByRole('button', { name: 'Close pack' }).click();
  const post = await backup(page);
  expect(post.player.carried.items.filter((i) => i.templateId !== 'item:wood')).toEqual(
    possessions.filter((i) => i.templateId !== 'item:wood'),
  );
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('The path is open', { timeout: 30000 });
  await openPack(page);
  await expect(page.getByTestId('stat-attack')).toHaveText('4');
  await expect(page.getByLabel('Selected tool', { exact: true })).toHaveValue('bow');
});

test('uses keyboard and standard controller pack navigation, quantities, confirmation and selected-tool actions', async ({
  page,
}, info) => {
  test.setTimeout(120000);
  await page.addInitScript(() => {
    window.m04Pad = { connected: false, axes: [0, 0], buttons: Array(17).fill(false) };
    Object.defineProperty(navigator, 'getGamepads', {
      value: () => {
        const pad = window.m04Pad;
        return pad?.connected
          ? [
              {
                index: 0,
                id: 'Xbox standard inventory fixture',
                mapping: 'standard',
                axes: pad.axes,
                buttons: pad.buttons.map((pressed) => ({
                  pressed,
                  touched: pressed,
                  value: Number(pressed),
                })),
              },
            ]
          : [];
      },
    });
  });
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await open(page);
  await importState(page, fixture());
  await claim(page);
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'));
  await page.locator('.game-canvas').focus();
  await page.keyboard.press('i');
  await page.clock.runFor(100);
  await expect(pack(page)).toBeVisible();
  await page.getByRole('button', { name: /Select pack item 1: Wood/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /Select pack item 2: Iron sword/ })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('button', { name: /Select pack item 1: Wood/ })).toBeFocused();
  await page.keyboard.press('i');
  await page.clock.runFor(100);
  await expect(pack(page)).toHaveCount(0);
  async function pad(button?: number) {
    await page.evaluate((button) => {
      if (!window.m04Pad) throw new Error('No pad');
      window.m04Pad.connected = true;
      window.m04Pad.buttons = Array.from({ length: 17 }, (_, i) => i === button);
    }, button);
    await page.clock.runFor(120);
  }
  async function press(button: number) {
    await pad();
    await pad(button);
    await pad();
  }
  await pad();
  await press(8);
  await expect(pack(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close pack' })).toBeFocused();
  await press(13);
  await expect(pack(page).locator('.pack-cell').first()).toBeFocused();
  await press(0); // Standard south-button selects the focused item.
  await page.getByLabel('Item quantity', { exact: true }).focus();
  await press(15);
  await expect(page.getByLabel('Item quantity', { exact: true })).toHaveValue('2');
  await page.getByRole('button', { name: 'Split selected stack' }).focus();
  await press(0);
  await settled(page);
  await expect(pack(page).locator('.pack-cell')).toHaveCount(5);
  await expect(pack(page).locator('.pack-cell').first()).toContainText('× 10');
  await page.getByRole('button', { name: /Select pack item 5: Wood/ }).focus();
  await press(0);
  await page.getByRole('button', { name: 'Discard selected quantity…' }).focus();
  await press(0);
  await expect(page.getByRole('button', { name: 'Keep item', exact: true })).toBeFocused();
  await press(13); // wraps from Keep to the unchecked confirmation because Confirm is disabled.
  await expect(
    page.getByLabel('I understand this removes the selected possessions.'),
  ).toBeFocused();
  await press(0);
  await expect(
    page.getByLabel('I understand this removes the selected possessions.'),
  ).toBeChecked();
  await press(13);
  await expect(page.getByRole('button', { name: 'Keep item', exact: true })).toBeFocused();
  await press(13);
  await expect(page.getByRole('button', { name: 'Confirm discard', exact: true })).toBeFocused();
  await press(0);
  await settled(page);
  await expect(page.getByRole('dialog', { name: 'Confirm discard' })).toHaveCount(0);
  await expect(pack(page).locator('.pack-cell').last()).toContainText('× 1');
  await page.getByLabel('Selected tool', { exact: true }).focus();
  await press(15);
  await settled(page);
  await expect(page.getByLabel('Selected tool', { exact: true })).toHaveValue('shield');
  await page.screenshot({ path: info.outputPath('controller-pack.png'), fullPage: true });
  await press(8);
  await expect(pack(page)).toHaveCount(0);
  await page.getByLabel('Practice encounter').selectOption('archer');
  await page.getByRole('button', { name: 'Enter practice field', exact: true }).click();
  await settled(page);
  await page.clock.runFor(250);
  await page.locator('.game-canvas').focus();
  await pad();
  await pad(7);
  await expect(page.getByTestId('combat-phase')).toHaveText('Shield raised');
  await pad();
  await page.getByRole('button', { name: 'Select Bow', exact: true }).click();
  await settled(page);
  await page.clock.runFor(120);
  await press(7);
  await page.clock.runFor(220);
  await expect(page.getByTestId('combat-energy')).not.toHaveText('10 / 10');
  await expect(page.locator('.tool-slot.selected')).toContainText('Bow');
  await page.clock.runFor(1200);
  await page.locator('.game-canvas').focus();
  await page.keyboard.press('x');
  await page.clock.runFor(160);
  await expect(page.getByTestId('combat-energy')).not.toHaveText('10 / 10');
});
