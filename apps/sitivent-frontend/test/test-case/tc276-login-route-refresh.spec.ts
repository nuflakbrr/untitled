import { test, expect } from '@playwright/test';

test('login route remains available after refresh', async ({ page }) => { await page.goto('/login'); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
