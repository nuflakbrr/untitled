import { test, expect } from '@playwright/test';

test('FAQ Accordion Interactivity', async ({ page }) => {
  await page.goto('/faq');
  const firstQuestion = page.locator('details').first();

  await expect(firstQuestion).toBeVisible();
  await expect(firstQuestion).not.toHaveAttribute('open', '');
  await firstQuestion.locator('summary').click();
  await expect(firstQuestion).toHaveAttribute('open', '');
});
