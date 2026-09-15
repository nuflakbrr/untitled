import { test, expect } from '@playwright/test';

test('about page renders', async ({ page }) => { await page.goto('/about'); await expect(page.locator('body')).toBeVisible(); });
