import { test, expect } from '@playwright/test';

test('login submit does not navigate with empty credentials', async ({ page }) => { await page.goto('/login'); const url = page.url(); await page.locator('button[type="submit"]').click(); await expect(page).toHaveURL(url); });
