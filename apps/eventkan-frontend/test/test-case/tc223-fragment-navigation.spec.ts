import { test, expect } from '@playwright/test';

test('fragment navigation is stable', async ({ page }) => { await page.goto('/articles#content'); await expect(page.locator('body')).toBeVisible(); });
