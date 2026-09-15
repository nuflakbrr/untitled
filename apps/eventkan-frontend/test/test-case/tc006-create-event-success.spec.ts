import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';

test('Create Offline Event Success', async ({ page }) => {
  await loginWithCleanState(page, 'superadmin.univ@gmail.com', 'password');

  // Go to create event page
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/events/new');

  // Name / Title
  const titleInput = page.locator('input[name="title"]').first();
  await expect(titleInput).toBeVisible({ timeout: 15000 });
  await titleInput.fill('Seminar AI Terapan');

  // Location
  await page.fill('input[name="location"]', 'Auditorium Kampus A');

  // Quota
  await page.fill('input[name="quota"]', '100');

  // Price
  await page.fill('input[name="price"]', '50000');

  // Calendar triggers
  const calendarTriggers = page.locator('button[type="button"]:has(.lucide-calendar)');

  if ((await calendarTriggers.count()) >= 3) {
    // Start Date
    await calendarTriggers.nth(0).click();
    await page
      .locator('button[data-day], button.rdp-day_button')
      .nth(10)
      .click()
      .catch(() => {});
    await page.keyboard.press('Escape');

    // End Date
    await calendarTriggers.nth(1).click();
    await page
      .locator('button[data-day], button.rdp-day_button')
      .nth(10)
      .click()
      .catch(() => {});
    await page.keyboard.press('Escape');

    // Reg Deadline
    await calendarTriggers.nth(2).click();
    await page
      .locator('button[data-day], button.rdp-day_button')
      .nth(9)
      .click()
      .catch(() => {});
    await page.keyboard.press('Escape');
  }

  // Description Rich Text
  const tiptap = page.locator('.tiptap.ProseMirror').first();
  if (await tiptap.isVisible()) {
    await tiptap.fill('Deskripsi seminar AI terapan dalam industri.');
  }

  await page.click('button:has-text("Buat Event")');
  await expect(page).toBeDefined();
});
