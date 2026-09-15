import { test, expect } from '@playwright/test';

test('event page survives reload', async ({ page }) => {
  await page.goto('/events');
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
});
