import { test, expect } from '@playwright/test';

test('public home remains usable with empty session storage', async ({ page }) => { await page.goto('/'); await page.evaluate(() => sessionStorage.clear()); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
