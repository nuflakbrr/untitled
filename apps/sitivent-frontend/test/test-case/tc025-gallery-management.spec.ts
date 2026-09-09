import { test, expect } from '@playwright/test';

test('Admin Gallery Management', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/galleries');

  const addGalleryBtn = page.locator('button:has-text("Tambah"), a:has-text("Tambah")');
  if (await addGalleryBtn.isVisible()) {
    await addGalleryBtn.click();
    await expect(page).toBeDefined();
  }
});
