import { test, expect } from '@playwright/test';

test('public page supports keyboard focus', async ({ page }) => { await page.goto('/'); await page.keyboard.press('Tab'); await expect(page.locator(':focus')).toBeVisible(); });
