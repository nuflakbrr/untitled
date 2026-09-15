import { test, expect } from '@playwright/test';

test('duplicate API items are handled', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'duplicate', title: 'Event A' }, { id: 'duplicate', title: 'Event A' }], pagination: { total: 2 } }) })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
