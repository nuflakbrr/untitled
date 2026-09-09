import { test, expect } from '@playwright/test';

test('unknown user login remains controlled', async ({ page }) => { await page.goto('/login'); await page.locator('input[type="email"]').fill('nobody@example.invalid'); await page.locator('input[type="password"]').fill('wrong-password'); await page.locator('button[type="submit"]').click(); await expect(page).toHaveURL(/login/); });
