import { test, expect } from '@playwright/test';

test.describe('Public navigation', () => {
  for (const path of ['/', '/events', '/articles', '/gallery']) {
    test(`renders ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
