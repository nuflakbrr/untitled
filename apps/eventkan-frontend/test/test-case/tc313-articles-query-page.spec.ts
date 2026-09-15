import { test, expect } from '@playwright/test';

test('articles page handles a positive page query', async ({ page }) => { await page.goto('/articles?page=1'); await expect(page.locator('body')).toBeVisible(); });
