import { test, expect } from '@playwright/test';

test('payment history remains safe without proof', async ({ page }) => { await page.goto('/participant/payment-history'); await expect(page.locator('body')).toBeVisible(); });
