import { test, expect } from '@playwright/test';

test('article list does not expose invalid dates', async ({ page }) => { await page.goto('/articles'); await expect(page.locator('body')).toBeVisible(); await expect(page.locator('body')).not.toContainText('Invalid Date'); });
