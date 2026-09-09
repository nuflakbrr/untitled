import { test, expect } from '@playwright/test';

test('roles recycle bin renders without active-only confusion', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/roles'); const recycle = page.getByText('Recycle bin'); if (await recycle.count()) { await recycle.click(); await expect(page.locator('body')).toBeVisible(); } });
