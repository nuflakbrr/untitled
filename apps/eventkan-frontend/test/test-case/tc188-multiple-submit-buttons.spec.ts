import { test, expect } from '@playwright/test';

test('multiple invalid submits remain controlled', async ({ page }) => { await page.goto('/login'); const button = page.locator('button[type="submit"]'); await button.click(); await button.click(); await expect(page).toHaveURL(/login/); });
