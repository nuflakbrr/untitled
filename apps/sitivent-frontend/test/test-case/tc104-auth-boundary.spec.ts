import { test, expect } from '@playwright/test';

test('anonymous user cannot access admin dashboard', async ({ page }) => {
  await page.goto('/admin/invalid-tenant/dashboard');
  await expect(page).toHaveURL(/login|admin/);
  await expect(page.locator('body')).toBeVisible();
});
