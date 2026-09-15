import { test, expect } from '@playwright/test';

test('public forward navigation restores next page', async ({ page }) => { await page.goto('/'); await page.goto('/articles'); await page.goBack(); await page.goForward(); await expect(page).toHaveURL(/\/articles/); });
