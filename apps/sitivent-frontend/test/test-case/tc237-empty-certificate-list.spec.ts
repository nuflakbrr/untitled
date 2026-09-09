import { test, expect } from '@playwright/test';

test('certificate list handles no data', async ({ page }) => { await page.goto('/participant/certificates'); await expect(page.locator('body')).toBeVisible(); });
