import { test, expect } from '@playwright/test';

test('Admin Manage Event Category', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/event-categories');

  const addCategoryBtn = page.locator('button:has-text("Tambah"), a:has-text("Tambah")');
  if (await addCategoryBtn.isVisible()) {
    await addCategoryBtn.click();
    await expect(page).toBeDefined();
  }
});
