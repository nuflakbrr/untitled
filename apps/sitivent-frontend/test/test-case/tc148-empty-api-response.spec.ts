import { test, expect } from '@playwright/test';

test('events page handles empty API payload', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [], pagination: { total: 0 } }) })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
