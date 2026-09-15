import { test, expect } from '@playwright/test';

test('document declares a language', async ({ page }) => { await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('lang', /.+/); });
