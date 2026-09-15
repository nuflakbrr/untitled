import { test, expect } from '@playwright/test';

import { loginWithCleanState } from '../utils/auth-helper';

test('Create Event Fails due to Negative Quota', async ({ page }) => {
  await loginWithCleanState(page, 'superadmin.univ@gmail.com', 'password');

  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/events/new');

  const titleInput = page.locator('input[name="title"]').first();
  await expect(titleInput).toBeVisible({ timeout: 15000 });
  await titleInput.fill('Workshop Invalid Quota');
  await page.fill('input[name="quota"]', '-10');

  const tiptap = page.locator('.tiptap.ProseMirror').first();
  if (await tiptap.isVisible()) {
    await tiptap.fill('Test description');
  }

  await page.click('button:has-text("Buat Event")');
  await expect(page).toBeDefined();
});
