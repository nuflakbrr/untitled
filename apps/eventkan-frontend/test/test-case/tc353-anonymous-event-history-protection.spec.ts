import { test, expect } from '@playwright/test';

test('anonymous visitor cannot access participant event history', async ({ page }) => {
  await page.goto('/participant/event-history');

  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});
