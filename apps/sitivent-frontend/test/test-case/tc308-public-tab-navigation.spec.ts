import { test, expect } from '@playwright/test';

test('public controls can be reached by repeated tab navigation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.querySelector('nextjs-portal')?.remove());
  await expect(page.locator('h1:visible').first()).toBeVisible();
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  for (let index = 0; index < 5; index += 1) await page.keyboard.press('Tab');
  await expect(page.locator(':focus').first()).toBeVisible();
});
