import { test, expect } from '@playwright/test';

test('public page defines viewport metadata', async ({ page }) => { await page.goto('/'); await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/); });
