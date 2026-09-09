import { test, expect } from '@playwright/test';

test('article deep link renders a handled page', async ({ page }) => { await page.goto('/articles/panduan-menghadiri-seminar-hybrid-di-sitivent'); await expect(page.locator('body')).toBeVisible(); });
