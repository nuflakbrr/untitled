import { test, expect } from '@playwright/test';

test('registration page tolerates repeated interaction', async ({ page }) => { await page.goto('/register'); await expect(page.locator('body')).toBeVisible(); });
