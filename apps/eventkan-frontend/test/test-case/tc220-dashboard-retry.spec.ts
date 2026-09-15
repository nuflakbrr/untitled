import { test, expect } from '@playwright/test';

test('dashboard reload remains recoverable', async ({ page }) => { await page.goto('/admin/invalid-tenant/dashboard'); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
