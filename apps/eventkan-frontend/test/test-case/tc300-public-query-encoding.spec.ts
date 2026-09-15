import { test, expect } from '@playwright/test';

test('public page handles encoded query text', async ({ page }) => { await page.goto('/articles?search=%E2%9C%93%20test'); await expect(page.locator('body')).toBeVisible(); });
