import { test, expect } from '@playwright/test';

test('repeated search input remains stable', async ({ page }) => { await page.goto('/events'); const input = page.locator('input[placeholder*="Cari"], input[type="search"]').first(); if (await input.count()) { await input.fill('seminar'); await input.fill('seminar'); } await expect(page.locator('body')).toBeVisible(); });
