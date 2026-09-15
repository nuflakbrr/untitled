import { test, expect } from '@playwright/test';

test('page handles corrupt local storage values', async ({ page }) => { await page.goto('/'); await page.evaluate(() => localStorage.setItem('theme', '{broken')); await page.reload(); await expect(page.locator('body')).toBeVisible(); });
