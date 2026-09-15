import { test, expect } from '@playwright/test';

test('public page survives repeated reloads', async ({ page }) => { await page.goto('/'); await page.reload(); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
