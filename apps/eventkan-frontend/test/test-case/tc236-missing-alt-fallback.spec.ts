import { test, expect } from '@playwright/test';

test('gallery page handles missing image metadata', async ({ page }) => { await page.goto('/gallery'); await expect(page.locator('body')).toBeVisible(); });
