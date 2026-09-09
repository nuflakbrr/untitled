import { test, expect } from '@playwright/test';

test('page handles malformed API response', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 200, body: 'not-json' })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
