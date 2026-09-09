import { test, expect } from '@playwright/test';

test('escape interaction is safe', async ({ page }) => { await page.goto('/login'); await page.keyboard.press('Escape'); await expect(page.locator('body')).toBeVisible(); });
