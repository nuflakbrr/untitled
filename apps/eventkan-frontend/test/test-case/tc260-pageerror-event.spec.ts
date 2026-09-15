import { test, expect } from '@playwright/test';

test('event page has no uncaught exception', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
