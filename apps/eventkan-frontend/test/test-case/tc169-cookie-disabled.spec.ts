import { test, expect } from '@playwright/test';

test('public page renders without cookies', async ({ browser }) => { const context = await browser.newContext(); await context.clearCookies(); const page = await context.newPage(); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); await context.close(); });
