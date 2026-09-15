import { test, expect } from '@playwright/test';

test('admin shell handles empty tenant response', async ({ page }) => { await page.route('**/core/v1/auth/my-tenants', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) })); await page.goto('/admin/invalid-tenant/dashboard'); await expect(page.locator('body')).toBeVisible(); });
