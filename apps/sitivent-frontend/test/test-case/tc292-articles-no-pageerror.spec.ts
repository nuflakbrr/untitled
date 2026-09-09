import { test, expect } from '@playwright/test';

test('articles page has no page errors', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/articles'); await expect(page.locator('body')).toBeVisible(); expect(errors).toEqual([]); });
