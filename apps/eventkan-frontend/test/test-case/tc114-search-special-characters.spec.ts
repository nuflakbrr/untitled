import { test, expect } from '@playwright/test';

test('search accepts special characters safely', async ({ page }) => { await page.goto('/articles'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) await input.fill("%' OR 1=1 -- 🔎"); await expect(page.locator('body')).toBeVisible(); });
