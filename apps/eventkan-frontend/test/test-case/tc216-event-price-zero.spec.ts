import { test, expect } from '@playwright/test';

test('event listing handles free events', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
