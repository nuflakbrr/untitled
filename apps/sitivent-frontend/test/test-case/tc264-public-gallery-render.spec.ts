import { test, expect } from '@playwright/test';

test('public gallery page renders', async ({ page }) => { await page.goto('/gallery'); await expect(page.locator('body')).toBeVisible(); });
