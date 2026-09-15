import { test, expect } from '@playwright/test';

test('home page has no uncaught runtime error', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
