import { test, expect } from '@playwright/test';

test('public links have non-empty href values', async ({ page }) => { await page.goto('/'); for (const link of await page.locator('a').all()) await expect(link).toHaveAttribute('href', /.+/); });
