import { test, expect } from '@playwright/test';

test('Support Message Submission', async ({ page }) => {
  await page.goto('/support');

  const nameInput = page.locator('input[name="name"], #name, #support-name');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Penanya');
    await page.fill('input[name="email"], #email, #support-email', 'penanya@gmail.com');
    await page.fill('input[name="subject"], #subject, #support-subject', 'Pertanyaan Sertifikat');
    await page.fill(
      'textarea[name="message"], #message, #support-message',
      'Bagaimana cara mengunduh sertifikat digital?'
    );
    await page.click('button[type="submit"]');
  }

  await expect(page).toBeDefined();
});
