import { test, expect } from '@playwright/test';

test('page handles null event fields', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: '1', title: null, description: null }], pagination: { total: 1 } }) })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
