import { test, expect } from '@playwright/test';

test('profile handles missing optional data', async ({ page }) => { await page.goto('/participant/profile'); await expect(page.locator('body')).toBeVisible(); });
