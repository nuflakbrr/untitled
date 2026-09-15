import { test, expect } from '@playwright/test';

test('landing page reaches DOM content promptly', async ({ page }) => {
  const started = Date.now();
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  expect(Date.now() - started).toBeLessThan(8000);
});
