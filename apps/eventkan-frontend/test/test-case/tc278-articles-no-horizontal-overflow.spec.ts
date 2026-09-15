import { test, expect } from '@playwright/test';

test('articles page has no horizontal overflow on mobile', async ({ page }) => { await page.setViewportSize({ width: 375, height: 667 }); await page.goto('/articles'); expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy(); });
