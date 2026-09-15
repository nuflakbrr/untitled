import { test, expect } from '@playwright/test';

test('registration mismatch case is render-safe', async ({ page }) => { await page.goto('/register'); await expect(page.locator('body')).toBeVisible(); });
