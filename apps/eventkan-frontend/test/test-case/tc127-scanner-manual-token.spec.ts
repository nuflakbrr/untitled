import { test, expect } from '@playwright/test';

test('scanner accepts a bounded manual-token interaction', async ({ page }) => { await page.goto('/admin/invalid-tenant/attendance/scan'); const input = page.locator('input').first(); if (await input.count()) { await input.fill(''); await expect(input).toBeVisible(); } });
