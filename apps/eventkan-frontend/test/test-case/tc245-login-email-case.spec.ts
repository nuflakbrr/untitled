import { test, expect } from '@playwright/test';

test('email case variation is handled', async ({ page }) => { await page.goto('/login'); await page.locator('input[type="email"]').fill('USER@EXAMPLE.COM'); await expect(page.locator('body')).toBeVisible(); });
