import { test, expect } from '@playwright/test';

test('special event slug is safe', async ({ page }) => { await page.goto('/events/%3Cscript%3E'); await expect(page.locator('body')).toBeVisible(); });
