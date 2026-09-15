import { test, expect } from '@playwright/test';

test('aborted request leaves page usable', async ({ page }) => { await page.route('**/features/v1/events/**', (route) => route.abort()); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); });
