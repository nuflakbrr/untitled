import { test, expect } from '@playwright/test';

test('Article Category Management', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/publications/articles');
  await expect(page).toBeDefined();
});
