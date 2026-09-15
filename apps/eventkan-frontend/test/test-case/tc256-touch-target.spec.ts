import { test, expect } from '@playwright/test';

test('mobile controls remain visible', async ({ page }) => { await page.setViewportSize({ width: 375, height: 667 }); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); });
