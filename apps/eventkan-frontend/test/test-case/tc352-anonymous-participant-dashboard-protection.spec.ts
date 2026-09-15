import { test, expect } from '@playwright/test';

test('anonymous visitor cannot access participant dashboard', async ({ page }) => {
  await page.goto('/participant/dashboard');

  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});
