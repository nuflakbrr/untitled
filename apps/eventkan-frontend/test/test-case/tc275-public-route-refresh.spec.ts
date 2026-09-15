import { test, expect } from '@playwright/test';

test('public article route remains available after refresh', async ({ page }) => {
  await page.goto('/articles');
  await page.reload();
  await expect(page).toHaveURL(/\/articles$/);
  await expect(page.getByRole('heading', { name: 'Pusat Edukasi & Artikel' })).toBeVisible();
});
