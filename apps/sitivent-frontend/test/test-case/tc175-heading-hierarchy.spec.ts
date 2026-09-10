import { test, expect } from '@playwright/test';

test('home page exposes a visible primary heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1:visible').first()).toBeVisible();
});
