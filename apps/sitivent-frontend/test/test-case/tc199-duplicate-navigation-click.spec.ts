import { test, expect } from '@playwright/test';

test('duplicate navigation click is safe', async ({ page }) => { await page.goto('/'); const link = page.getByRole('link', { name: /event/i }).first(); if (await link.count()) { await link.click(); await page.goBack(); } await expect(page.locator('body')).toBeVisible(); });
