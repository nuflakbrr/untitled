import { test, expect } from '@playwright/test';

test('search input can receive focus', async ({ page }) => { await page.goto('/events'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) { await input.focus(); await expect(input).toBeFocused(); } });
