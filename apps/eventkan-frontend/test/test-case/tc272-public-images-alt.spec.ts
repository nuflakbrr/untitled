import { test, expect } from '@playwright/test';

test('public images have alt attributes', async ({ page }) => { await page.goto('/'); for (const image of await page.locator('img').all()) await expect(image).toHaveAttribute('alt'); });
