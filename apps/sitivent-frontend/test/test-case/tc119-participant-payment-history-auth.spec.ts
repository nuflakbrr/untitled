import { test, expect } from '@playwright/test';

test('payment history requires authentication', async ({ page }) => {
  await page.goto('/participant/payment-history');
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  await expect(page.locator('#login-password')).toBeVisible();
});
