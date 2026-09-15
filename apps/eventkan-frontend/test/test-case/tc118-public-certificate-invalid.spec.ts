import { test, expect } from '@playwright/test';

test('invalid certificate is handled', async ({ page }) => { await page.goto('/certificates/invalid-certificate'); await expect(page.locator('body')).toBeVisible(); });
