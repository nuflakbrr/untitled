import { test, expect } from '@playwright/test';

test('public back navigation returns to previous page', async ({ page }) => { await page.goto('/'); await page.goto('/articles'); await page.goBack(); await expect(page).toHaveURL(/\/$/); });
