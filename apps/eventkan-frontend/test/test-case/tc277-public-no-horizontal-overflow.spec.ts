import { test, expect } from '@playwright/test';

test('public page has no horizontal overflow on mobile', async ({ page }) => { await page.setViewportSize({ width: 375, height: 667 }); await page.goto('/'); expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy(); });
