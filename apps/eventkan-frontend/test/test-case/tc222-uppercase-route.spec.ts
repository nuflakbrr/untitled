import { test, expect } from '@playwright/test';

test('uppercase route returns a handled page', async ({ page }) => { await page.goto('/Events'); await expect(page.locator('body')).toBeVisible(); });
