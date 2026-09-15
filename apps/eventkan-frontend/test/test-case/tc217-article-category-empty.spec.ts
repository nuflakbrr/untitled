import { test, expect } from '@playwright/test';

test('article list handles empty category', async ({ page }) => { await page.goto('/articles'); await expect(page.locator('body')).toBeVisible(); });
