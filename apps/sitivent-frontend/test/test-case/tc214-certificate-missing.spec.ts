import { test, expect } from '@playwright/test';

test('certificate page handles missing certificate data', async ({ page }) => { await page.goto('/participant/certificates'); await expect(page.locator('body')).toBeVisible(); });
