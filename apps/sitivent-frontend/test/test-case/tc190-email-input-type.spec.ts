import { test, expect } from '@playwright/test';

test('login email uses email input type', async ({ page }) => { await page.goto('/login'); await expect(page.locator('input[type="email"]').first()).toBeVisible(); });
