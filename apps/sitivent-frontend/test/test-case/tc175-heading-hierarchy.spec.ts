import { test, expect } from '@playwright/test';

test('home page has at most one visible h1', async ({ page }) => { await page.goto('/'); await expect(page.locator('h1')).toHaveCount(1); });
