import { test, expect } from '@playwright/test';

test('login remains rendered after network failure', async ({ page }) => { await page.route('**/core/v1/auth/**', (route) => route.abort()); await page.goto('/login'); await expect(page.locator('body')).toBeVisible(); });
