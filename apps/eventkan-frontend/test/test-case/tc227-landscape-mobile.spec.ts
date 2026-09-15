import { test, expect } from '@playwright/test';

test('mobile landscape remains usable', async ({ page }) => { await page.setViewportSize({ width: 844, height: 390 }); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
