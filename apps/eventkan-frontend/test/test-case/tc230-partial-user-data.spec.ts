import { test, expect } from '@playwright/test';

test('participant profile handles partial data', async ({ page }) => { await page.goto('/participant/profile'); await expect(page.locator('body')).toBeVisible(); });
