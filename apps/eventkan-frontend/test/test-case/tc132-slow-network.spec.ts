import { test, expect } from '@playwright/test';

test('public page renders under delayed API response', async ({ page }) => {
  await page.route('**/features/v1/**', async (route) => { await new Promise((resolve) => setTimeout(resolve, 300)); await route.continue(); });
  await page.goto('/events');
  await expect(page.locator('body')).toBeVisible();
});
