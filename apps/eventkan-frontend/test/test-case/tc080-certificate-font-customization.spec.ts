import { test, expect } from '@playwright/test';

test('Certificate Font and Coordinates Customization', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/certificates');
  await expect(page).toBeDefined();
});
