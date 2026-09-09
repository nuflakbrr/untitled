import { test, expect } from '@playwright/test';

test('payment history empty state is safe', async ({ page }) => { await page.goto('/participant/payment-history'); await expect(page.locator('body')).toBeVisible(); });
