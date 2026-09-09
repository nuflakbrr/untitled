import { test, expect } from '@playwright/test';

test('page handles an API timeout', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.abort('timedout')); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
