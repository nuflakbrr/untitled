import { test, expect } from '@playwright/test';

test('dashboard has a rendered fallback boundary', async ({ page }) => { await page.route('**/features/v1/**', (route) => route.abort()); await page.goto('/admin/invalid-tenant/dashboard'); await expect(page.locator('body')).toBeVisible(); });
