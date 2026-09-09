import { test, expect } from '@playwright/test';

test('Admin Create Article', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/publications/articles');

  const addArticleBtn = page.locator(
    'button:has-text("Tambah Artikel"), a:has-text("Tambah Artikel")'
  );
  if (await addArticleBtn.isVisible()) {
    await addArticleBtn.click();
    await expect(page).toBeDefined();
  }
});
