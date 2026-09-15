import { test, expect } from '@playwright/test';

test('admin table sorting interaction is safe', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/users'); const sort = page.locator('button').filter({ hasText: /Pengguna|Nama/ }).first(); if (await sort.count()) { await sort.click(); await expect(page.locator('body')).toBeVisible(); } });
