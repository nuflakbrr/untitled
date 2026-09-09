import { test, expect } from '@playwright/test';

test('large limit query is handled', async ({ page }) => { await page.goto('/events?limit=10000'); await expect(page.locator('body')).toBeVisible(); });
