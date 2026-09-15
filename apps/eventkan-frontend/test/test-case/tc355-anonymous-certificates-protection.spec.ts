import { test, expect } from '@playwright/test';

test('anonymous visitor cannot access participant certificates', async ({ page }) => {
  await page.goto('/participant/certificates');

  await expect(page).toHaveURL(/\/login(?:\?|$)/);
});
