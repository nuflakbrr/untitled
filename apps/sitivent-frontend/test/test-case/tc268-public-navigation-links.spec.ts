import { test, expect } from '@playwright/test';

test('public navigation contains links', async ({ page }) => { await page.goto('/'); await expect(page.locator('a')).not.toHaveCount(0); });
