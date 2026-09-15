import { test, expect } from '@playwright/test';

test('support inbox empty response is safe', async ({ page }) => { await page.route('**/features/v1/support/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) })); await page.goto('/admin/invalid-tenant/support/messages'); await expect(page.locator('body')).toBeVisible(); });
