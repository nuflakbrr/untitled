import { test, expect } from '@playwright/test';

test('print media renders page safely', async ({ page }) => { await page.emulateMedia({ media: 'print' }); await page.goto('/articles'); await expect(page.locator('body')).toBeVisible(); });
