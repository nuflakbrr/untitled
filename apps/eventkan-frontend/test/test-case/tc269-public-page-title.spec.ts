import { test, expect } from '@playwright/test';

test('public page has a document title', async ({ page }) => { await page.goto('/'); await expect(page).toHaveTitle(/.+/); });
