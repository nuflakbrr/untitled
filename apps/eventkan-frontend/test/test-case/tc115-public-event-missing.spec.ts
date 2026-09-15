import { test, expect } from '@playwright/test';

test('missing event is handled', async ({ page }) => { await page.goto('/events/does-not-exist'); await expect(page.locator('body')).toBeVisible(); await expect(page.locator('body')).not.toContainText('Unhandled Runtime Error'); });
