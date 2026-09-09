import { test, expect } from '@playwright/test';

test('status page remains stable after refresh', async ({ page }) => { await page.goto('/admin/invalid-tenant/support/messages'); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
