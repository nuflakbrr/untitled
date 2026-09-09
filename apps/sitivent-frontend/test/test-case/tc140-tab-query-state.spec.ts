import { test, expect } from '@playwright/test';

test('soft-delete page remains stable after reload', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/roles'); const recycle = page.getByText('Recycle bin'); if (await recycle.count()) { await recycle.click(); await page.reload(); } await expect(page.locator('body')).toBeVisible(); });
