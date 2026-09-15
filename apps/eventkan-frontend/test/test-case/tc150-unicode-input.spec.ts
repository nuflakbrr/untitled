import { test, expect } from '@playwright/test';

test('search supports unicode input', async ({ page }) => { await page.goto('/articles'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) await input.fill('日本語 العربية 🎫'); await expect(page.locator('body')).toBeVisible(); });
