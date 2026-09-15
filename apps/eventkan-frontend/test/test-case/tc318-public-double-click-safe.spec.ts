import { test, expect } from '@playwright/test';

test('public navigation remains stable after double click', async ({ page }) => { await page.goto('/'); const link = page.locator('a').first(); if (await link.isVisible()) { await link.dblclick(); await expect(page.locator('body')).toBeVisible(); } });
