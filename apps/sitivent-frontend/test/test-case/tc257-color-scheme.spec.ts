import { test, expect } from '@playwright/test';

test('dark color scheme remains rendered', async ({ page }) => { await page.emulateMedia({ colorScheme: 'dark' }); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); });
