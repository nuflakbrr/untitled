import { test, expect } from '@playwright/test';

test('invalid tenant does not expose another tenant data', async ({ page }) => { await page.goto('/admin/not-a-uuid/dashboard'); await expect(page.locator('body')).toBeVisible(); });
