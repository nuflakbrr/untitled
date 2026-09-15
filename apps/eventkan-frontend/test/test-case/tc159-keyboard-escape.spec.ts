import { test, expect } from '@playwright/test';

test('escape key does not crash public page', async ({ page }) => { await page.goto('/events'); await page.keyboard.press('Escape'); await expect(page.locator('body')).toBeVisible(); });
