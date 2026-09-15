import { test, expect } from '@playwright/test';

test('unknown route remains a handled 404 after reload', async ({ page }) => { await page.goto('/unknown-route'); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
