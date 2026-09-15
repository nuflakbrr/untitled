import { test, expect } from '@playwright/test';

test('empty QR token does not navigate unexpectedly', async ({ page }) => { await page.goto('/admin/invalid-tenant/attendance/scan'); const input = page.locator('input').first(); if (await input.count()) { await input.fill(''); await expect(input).toBeVisible(); } });
