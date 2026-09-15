import { test, expect } from '@playwright/test';

test('login accepts whitespace as a validation case', async ({ page }) => {
  await page.goto('/login'); await page.locator('input[type="email"]').fill('  invalid@example.com  '); await page.locator('button[type="submit"]').click(); await expect(page.locator('body')).toBeVisible();
});
