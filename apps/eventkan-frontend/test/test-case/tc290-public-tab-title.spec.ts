import { test, expect } from '@playwright/test';

test('public article list has a meaningful tab title', async ({ page }) => { await page.goto('/articles'); await expect(page).toHaveTitle(/EVENTKAN|Artikel|Article/i); });
