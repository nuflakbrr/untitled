import { test, expect } from '@playwright/test';

test('public home tolerates an empty hash', async ({ page }) => { await page.goto('/#'); await expect(page.locator('body')).toBeVisible(); });
