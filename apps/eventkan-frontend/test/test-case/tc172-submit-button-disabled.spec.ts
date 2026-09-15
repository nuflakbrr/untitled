import { test, expect } from '@playwright/test';

test('invalid login cannot navigate away', async ({ page }) => { await page.goto('/login'); await page.locator('button[type="submit"]').click(); await expect(page).toHaveURL(/login/); });
