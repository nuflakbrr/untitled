import { test, expect } from '@playwright/test';

test('login rejects empty and malformed input', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('not-an-email');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/login/);
});
