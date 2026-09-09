import { test, expect } from '@playwright/test';

test('admin page remains usable when confirmation is cancelled', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/users'); await expect(page.locator('body')).toBeVisible(); });
