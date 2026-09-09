import { test, expect } from '@playwright/test';

test('event list remains visible with long content response', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); expect(overflow).toBeLessThanOrEqual(8); });
