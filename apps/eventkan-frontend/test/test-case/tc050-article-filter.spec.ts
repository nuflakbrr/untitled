import { test, expect } from '@playwright/test';

test('Public Filter Articles by Category', async ({ page }) => {
  await page.goto('/articles');

  await expect(page.getByRole('heading', { name: /Pusat Edukasi & Artikel/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
});
