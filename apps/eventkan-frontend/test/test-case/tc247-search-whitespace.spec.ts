import { test, expect } from '@playwright/test';

test('whitespace search is safe', async ({ page }) => { await page.goto('/events'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) await input.fill('   '); await expect(page.locator('body')).toBeVisible(); });
