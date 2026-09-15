import { test, expect } from '@playwright/test';

test('unknown route renders handled 404', async ({ page }) => { const response = await page.goto('/route-that-does-not-exist'); expect(response?.status()).toBe(404); await expect(page.locator('body')).toBeVisible(); });
