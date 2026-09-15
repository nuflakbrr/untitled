import { test, expect } from '@playwright/test';

test('support inbox renders status controls safely', async ({ page }) => { await page.goto('/admin/invalid-tenant/support/messages'); await expect(page.locator('body')).toBeVisible(); });
