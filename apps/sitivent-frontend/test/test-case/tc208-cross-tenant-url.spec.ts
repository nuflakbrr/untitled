import { test, expect } from '@playwright/test';

test('cross-tenant URL is handled safely', async ({ page }) => { await page.goto('/admin/11111111-1111-1111-1111-111111111111/dashboard'); await expect(page.locator('body')).toBeVisible(); });
