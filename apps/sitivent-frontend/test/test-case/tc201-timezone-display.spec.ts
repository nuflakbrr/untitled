import { test, expect } from '@playwright/test';

test('public dates are valid', async ({ page }) => { await page.goto('/events'); await expect(page.locator('body')).not.toContainText('Invalid Date'); });
