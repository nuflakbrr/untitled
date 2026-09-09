import { test, expect } from '@playwright/test';

test('very long search query is handled', async ({ page }) => { await page.goto(`/events?search=${'x'.repeat(2000)}`); await expect(page.locator('body')).toBeVisible(); });
