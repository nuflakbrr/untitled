import { test, expect } from '@playwright/test';

test('viewport metadata prevents unwanted scaling', async ({ page }) => { await page.goto('/'); await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /initial-scale=1/); });
