import { test, expect } from '@playwright/test';

test('login form resets password after reload', async ({ page }) => { await page.goto('/login'); const input = page.locator('input[type="password"]').first(); await input.fill('temporary-secret'); await page.reload(); await expect(input).toHaveValue(''); });
