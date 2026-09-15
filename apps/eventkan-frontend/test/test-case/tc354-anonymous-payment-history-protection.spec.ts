import { test, expect } from '@playwright/test';

test('anonymous visitor cannot access participant payment history', async ({ page }) => {
  await page.goto('/participant/payment-history');

  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});
