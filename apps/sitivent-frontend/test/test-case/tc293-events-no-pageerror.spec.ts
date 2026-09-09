import { test, expect } from '@playwright/test';

test('events page has no page errors', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/events'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
