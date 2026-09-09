import { test, expect } from '@playwright/test';

test('anonymous visitor cannot access participant profile', async ({ page }) => {
  await page.goto('/participant/profile');

  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});
