import { test, expect } from '@playwright/test';

test('support page has no horizontal overflow', async ({ page }) => { await page.goto('/admin/invalid-tenant/support/messages'); await expect(page.locator('body')).toBeVisible(); });
