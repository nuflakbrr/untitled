import { test, expect } from '@playwright/test';

test('public events page renders without blank document', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); await expect(page.locator('body')).not.toBeEmpty(); });
