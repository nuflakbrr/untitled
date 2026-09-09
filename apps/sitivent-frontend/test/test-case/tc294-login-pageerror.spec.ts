import { test, expect } from '@playwright/test';

test('login page has no page errors on initial load', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/login'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
