import { test, expect } from '@playwright/test';

test('Admin Moderate Testimonials', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/publications/testimonies');

  await expect(page).toBeDefined();
});
