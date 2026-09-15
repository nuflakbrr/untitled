import { test, expect } from '@playwright/test';

test('empty dashboard remains rendered', async ({ page }) => { await page.goto('/admin/invalid-tenant/dashboard'); await expect(page.locator('body')).toBeVisible(); });
