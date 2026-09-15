import { test, expect } from '@playwright/test';

test('public home has no page errors', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
