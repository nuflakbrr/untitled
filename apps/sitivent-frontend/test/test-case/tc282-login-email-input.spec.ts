import { test, expect } from '@playwright/test';

test('login email field uses email input type', async ({ page }) => { await page.goto('/login'); await expect(page.locator('input[type="email"]')).toBeVisible(); });
