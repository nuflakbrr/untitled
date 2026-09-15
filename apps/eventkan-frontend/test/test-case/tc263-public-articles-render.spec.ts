import { test, expect } from '@playwright/test';

test('public articles page exposes readable content', async ({ page }) => { await page.goto('/articles'); await expect(page.locator('body')).toBeVisible(); await expect(page.locator('body')).not.toBeEmpty(); });
