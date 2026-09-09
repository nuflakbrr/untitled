import { test, expect } from '@playwright/test';

test('landing page renders at small viewport', async ({ page }) => { await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); });
