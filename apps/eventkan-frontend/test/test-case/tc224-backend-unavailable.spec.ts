import { test, expect } from '@playwright/test';

test('frontend shell handles unavailable backend', async ({ page }) => { await page.route('**/core/**', (route) => route.abort()); await page.goto('/login'); await expect(page.locator('body')).toBeVisible(); });
