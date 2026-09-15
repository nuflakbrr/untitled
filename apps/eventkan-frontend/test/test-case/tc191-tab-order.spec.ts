import { test, expect } from '@playwright/test';

test('login controls are keyboard reachable', async ({ page }) => { await page.goto('/login'); await page.keyboard.press('Tab'); await expect(page.locator(':focus')).toBeVisible(); await page.keyboard.press('Tab'); await expect(page.locator(':focus')).toBeVisible(); });
