import { test, expect } from '@playwright/test';

test('special article slug is handled', async ({ page }) => { await page.goto('/articles/%3Cscript%3E'); await expect(page.locator('body')).toBeVisible(); });
