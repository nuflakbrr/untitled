import { test, expect } from '@playwright/test';

test('login supports keyboard focus', async ({ page }) => { await page.goto('/login'); await page.locator('input').first().focus(); await page.keyboard.press('Tab'); await expect(page.locator(':focus')).toBeVisible(); });
