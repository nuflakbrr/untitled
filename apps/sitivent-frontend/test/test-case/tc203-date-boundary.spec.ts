import { test, expect } from '@playwright/test';

test('date query at day boundary is safe', async ({ page }) => { await page.goto('/events?date=1970-01-01T00:00:00.000Z'); await expect(page.locator('body')).toBeVisible(); });
