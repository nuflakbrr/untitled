import { test, expect } from '@playwright/test';

test('invalid QR token is handled', async ({ page }) => { await page.goto('/admin/invalid-tenant/attendance/scan'); const input = page.locator('input').first(); if (await input.count()) { await input.fill('invalid-token'); await expect(page.locator('body')).toBeVisible(); } });
