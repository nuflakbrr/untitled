import { test, expect } from '@playwright/test';

test('articles page handles an empty search query', async ({ page }) => { await page.goto('/articles?search='); await expect(page.locator('body')).toBeVisible(); });
