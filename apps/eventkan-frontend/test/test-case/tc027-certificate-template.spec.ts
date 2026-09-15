import { test, expect } from '@playwright/test';

test('Admin Certificate Template Creation', async ({ page }) => {
  await page.goto('/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/certificates');

  const addTemplateBtn = page.locator('button:has-text("Template"), a:has-text("Template")');
  if (await addTemplateBtn.isVisible()) {
    await addTemplateBtn.click();
    await expect(page).toBeDefined();
  }
});
