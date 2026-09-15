import { test, expect } from '@playwright/test';

test('search input does not execute markup', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/events');

  const input = page.getByPlaceholder('Cari event atau lokasi...');
  await expect(input).toBeVisible();
  await input.fill('<script>throw new Error("xss")</script>');
  await expect(input).toHaveValue('<script>throw new Error("xss")</script>');
  const scriptText = (await page.locator('script').allTextContents()).join('\n');
  expect(scriptText).not.toContain('throw new Error("xss")');
  expect(errors).toEqual([]);
});
