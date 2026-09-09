import { test, expect } from '@playwright/test';

test('login page exposes basic accessible structure', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator('h1, h2, [role="heading"]').first()).toBeVisible();
  await expect(page.locator('input').first()).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
