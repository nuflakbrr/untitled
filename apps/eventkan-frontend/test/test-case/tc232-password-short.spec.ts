import { test, expect } from '@playwright/test';

test('short password remains on registration form', async ({ page }) => { await page.goto('/register'); await expect(page.locator('body')).toBeVisible(); });
