import { test, expect } from '@playwright/test';

test('empty pagination metadata is safe', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
