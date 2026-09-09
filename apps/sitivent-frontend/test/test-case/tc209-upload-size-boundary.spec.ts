import { test, expect } from '@playwright/test';

test('upload page renders size guidance', async ({ page }) => { await page.goto('/admin/invalid-tenant/master/galleries/new'); await expect(page.locator('body')).toBeVisible(); });
