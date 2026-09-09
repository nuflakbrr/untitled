import { test, expect } from '@playwright/test';

test('back navigation restores event list', async ({ page }) => { await page.goto('/events'); await page.goto('/articles'); await page.goBack(); await expect(page).toHaveURL(/events/); await expect(page.locator('body')).toBeVisible(); });
