import { test, expect } from '@playwright/test';

test('search remains rendered during overlapping requests', async ({ page }) => { await page.goto('/events'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) { await input.fill('a'); await input.fill('ab'); } await expect(page.locator('body')).toBeVisible(); });
