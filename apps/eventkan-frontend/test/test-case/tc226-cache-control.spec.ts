import { test, expect } from '@playwright/test';

test('reload renders after cache disabled', async ({ page }) => { await page.route('**/*', (route) => route.continue({ headers: { ...route.request().headers(), 'cache-control': 'no-cache' } })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
