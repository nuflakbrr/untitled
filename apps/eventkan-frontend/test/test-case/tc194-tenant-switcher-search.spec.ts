import { test, expect } from '@playwright/test';

test('tenant switcher search interaction is safe', async ({ page }) => { await page.goto('/admin/invalid-tenant/dashboard'); const input = page.locator('input[placeholder*="Cari tenant"]').first(); if (await input.count()) { await input.fill('fakultas'); await expect(input).toBeVisible(); } });
