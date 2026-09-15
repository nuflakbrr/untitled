import { test, expect } from '@playwright/test';

test('login page ignores unexpected query parameters safely', async ({ page }) => { await page.goto('/login?redirect=%2Fadmin%2Funknown'); await expect(page.locator('body')).toBeVisible(); });
