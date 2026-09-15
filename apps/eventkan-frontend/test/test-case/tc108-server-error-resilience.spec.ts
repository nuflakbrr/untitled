import { test, expect } from '@playwright/test';

test('invalid public article renders a handled response', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/articles/does-not-exist');
  await expect(page.locator('body')).toBeVisible();
  expect(errors).toEqual([]);
});
