import { test, expect } from '@playwright/test';

test('login fields expose autocomplete metadata', async ({ page }) => { await page.goto('/login'); await expect(page.locator('input[type="email"]')).toHaveAttribute('autocomplete', /email|username/); });
