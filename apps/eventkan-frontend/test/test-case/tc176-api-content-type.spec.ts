import { test, expect } from '@playwright/test';

test('non-json API response is handled', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.fulfill({ status: 200, contentType: 'text/plain', body: 'temporarily unavailable' })); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
