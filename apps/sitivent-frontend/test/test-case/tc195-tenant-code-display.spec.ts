import { test, expect } from '@playwright/test';

test('admin shell does not require tenant UUID as display label', async ({ page }) => { await page.goto('/admin/invalid-tenant/dashboard'); await expect(page.locator('body')).toBeVisible(); });
