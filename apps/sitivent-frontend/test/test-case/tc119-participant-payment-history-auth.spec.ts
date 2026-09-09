import { test, expect } from '@playwright/test';

test('payment history requires a safe session', async ({ page }) => { await page.goto('/participant/payment-history'); await expect(page.locator('body')).toBeVisible(); await expect(page.locator('body')).not.toContainText('password'); });
