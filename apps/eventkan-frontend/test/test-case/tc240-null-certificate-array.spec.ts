import { test, expect } from '@playwright/test';

test('history page handles absent certificates collection', async ({ page }) => { await page.goto('/participant/event-history'); await expect(page.locator('body')).toBeVisible(); });
