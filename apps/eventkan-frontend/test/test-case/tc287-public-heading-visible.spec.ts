import { test, expect } from '@playwright/test';

test('public page has a visible heading when content is loaded', async ({ page }) => { await page.goto('/'); await expect(page.locator('h1, h2').first()).toBeVisible(); });
