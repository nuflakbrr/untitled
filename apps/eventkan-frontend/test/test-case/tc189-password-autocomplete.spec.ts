import { test, expect } from '@playwright/test';

test('password field exposes safe autocomplete', async ({ page }) => { await page.goto('/login'); const input = page.locator('input[type="password"]').first(); await expect(input).toHaveAttribute('autocomplete', /password|new-password/); });
