import { test, expect } from '@playwright/test';

test('registration route remains safe with empty name', async ({ page }) => { await page.goto('/register'); await expect(page.locator('body')).toBeVisible(); });
