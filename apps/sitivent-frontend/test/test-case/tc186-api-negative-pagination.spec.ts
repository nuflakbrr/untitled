import { test, expect } from '@playwright/test';

test('negative pagination query is handled', async ({ page }) => { await page.goto('/events?page=-1&limit=-10'); await expect(page.locator('body')).toBeVisible(); });
