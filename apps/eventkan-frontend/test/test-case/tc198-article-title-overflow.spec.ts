import { test, expect } from '@playwright/test';

test('article page has no horizontal overflow', async ({ page }) => { await page.goto('/articles'); await expect(page.locator('body')).toBeVisible(); const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); expect(overflow).toBeLessThanOrEqual(8); });
