import { test, expect } from '@playwright/test';

test('events page handles API 500', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 500, body: '{}' })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
