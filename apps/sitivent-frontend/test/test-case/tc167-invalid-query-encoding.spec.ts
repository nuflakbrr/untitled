import { test, expect } from '@playwright/test';

test('invalid query encoding does not crash page', async ({ page }) => { await page.goto('/events?search=%E0%A4%A'); await expect(page.locator('body')).toBeVisible(); });
