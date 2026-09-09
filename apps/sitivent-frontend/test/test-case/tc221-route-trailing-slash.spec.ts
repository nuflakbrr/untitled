import { test, expect } from '@playwright/test';

test('events trailing slash is safe', async ({ page }) => { await page.goto('/events/'); await expect(page.locator('body')).toBeVisible(); });
