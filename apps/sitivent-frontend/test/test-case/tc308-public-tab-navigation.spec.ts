import { test, expect } from '@playwright/test';

test('public controls can be reached by repeated tab navigation', async ({ page }) => { await page.goto('/'); for (let index = 0; index < 5; index += 1) await page.keyboard.press('Tab'); await expect(page.locator(':focus')).toBeVisible(); });
