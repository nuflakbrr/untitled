import { test, expect } from '@playwright/test';

test('public document declares a language', async ({ page }) => { await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('lang', /.+/); });
