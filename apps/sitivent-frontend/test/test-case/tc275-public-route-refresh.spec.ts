import { test, expect } from '@playwright/test';

test('public route remains available after refresh', async ({ page }) => { await page.goto('/articles'); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
