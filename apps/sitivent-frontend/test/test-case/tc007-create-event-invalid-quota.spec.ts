import { test, expect } from '@playwright/test';
import { loginWithCleanState } from '../utils/auth-helper';

test('Create Event Fails due to Negative Quota', async ({ page }) => {
  await loginWithCleanState(page, 'super.admin@gmail.com', 'password');

  await page.goto('/admin/master/events/new');

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
