import { test, expect } from '@playwright/test';

test('empty event slug route is handled', async ({ page }) => { await page.goto('/events/'); await expect(page.locator('body')).toBeVisible(); });
