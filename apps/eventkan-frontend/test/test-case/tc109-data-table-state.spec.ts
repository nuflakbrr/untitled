import { test, expect } from '@playwright/test';

test('participant history route handles empty data state', async ({ page }) => {
  await page.goto('/participant/event-history');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
});
