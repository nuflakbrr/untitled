import { test, expect } from '@playwright/test';

test('public home remains usable with empty local storage', async ({ page }) => { await page.goto('/'); await page.evaluate(() => localStorage.clear()); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
