import { test, expect } from '@playwright/test';

test('rapid search typing is safe', async ({ page }) => { await page.goto('/articles'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) { await input.type('seminar', { delay: 5 }); await expect(input).toHaveValue('seminar'); } });
