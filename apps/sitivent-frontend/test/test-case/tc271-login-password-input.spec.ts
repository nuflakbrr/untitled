import { test, expect } from '@playwright/test';

test('login password input uses password type', async ({ page }) => { await page.goto('/login'); await expect(page.locator('input[type="password"]')).toBeVisible(); });
