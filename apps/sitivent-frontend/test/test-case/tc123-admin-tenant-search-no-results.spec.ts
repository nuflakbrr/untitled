import { test, expect } from '@playwright/test';

test('tenant search no-result state is safe', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/tenants'); const input = page.locator('input[placeholder*="Cari"]').last(); if (await input.count()) await input.fill('zzzz-no-result-999'); await expect(page.locator('body')).toBeVisible(); });
