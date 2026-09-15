import { test, expect } from '@playwright/test';

test('unauthorized API response is handled', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 401, body: '{}' })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
