import { test, expect } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD || 'password';

test.describe('certificate editor', () => {
  test.skip(!email, 'Set E2E_ADMIN_EMAIL to run authenticated tests');

  test('loads, previews, and saves a certificate template', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Kata sandi').fill(password);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/dashboard/certificates');
    await expect(page.getByRole('heading', { name: 'Editor sertifikat' })).toBeVisible();
    const editorLink = page.locator('a[href*="/dashboard/certificates/"][href$="/edit"]').first();
    test.skip((await editorLink.count()) === 0, 'No certificate-enabled event is available');
    await editorLink.click();

    const header = page.getByRole('textbox', { name: 'Nama penyelenggara' });
    const originalHeader = await header.inputValue();
    const updatedHeader = `${originalHeader} TEST`;
    await header.fill(updatedHeader);
    await expect(page.getByRole('img', { name: 'Preview template sertifikat' })).toContainText(
      updatedHeader
    );
    await page.getByRole('button', { name: 'Simpan template' }).click();
    await expect(page.getByText('Template sertifikat berhasil disimpan')).toBeVisible();

    await header.fill(originalHeader);
    await page.getByRole('button', { name: 'Simpan template' }).click();
    await expect(page.getByText('Template sertifikat berhasil disimpan')).toBeVisible();
  });
});
