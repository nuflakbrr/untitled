import { test, expect } from '@playwright/test';

test('page remains visible when image fails', async ({ page }) => { await page.route('**/*.{png,jpg,jpeg,webp}', (route) => route.abort()); await page.goto('/gallery'); await expect(page.locator('body')).toBeVisible(); });
