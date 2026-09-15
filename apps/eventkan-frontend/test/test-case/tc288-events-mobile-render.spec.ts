import { test, expect } from '@playwright/test';

test('events page renders on a narrow viewport', async ({ page }) => { await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
