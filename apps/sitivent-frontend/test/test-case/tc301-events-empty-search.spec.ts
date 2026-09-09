import { test, expect } from '@playwright/test';

test('events page handles an empty search query', async ({ page }) => { await page.goto('/events?search='); await expect(page.locator('body')).toBeVisible(); });
