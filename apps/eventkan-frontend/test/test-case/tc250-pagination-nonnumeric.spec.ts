import { test, expect } from '@playwright/test';

test('non-numeric pagination is safe', async ({ page }) => { await page.goto('/events?page=abc&limit=xyz'); await expect(page.locator('body')).toBeVisible(); });
