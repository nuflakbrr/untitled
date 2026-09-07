import { test, expect } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD || 'password';

test.describe('gallery CRUD', () => {
  test.skip(!email, 'Set E2E_ADMIN_EMAIL to run authenticated tests');

  test('creates, edits, and deletes a gallery', async ({ page }) => {
    const title = `Playwright gallery ${Date.now()}`;
    const updatedTitle = `${title} updated`;
    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Kata sandi').fill(password);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/dashboard/galleries/create');
    await page.getByLabel('Judul galeri').fill(title);
    await page.getByLabel('Deskripsi').fill('Galeri yang dibuat oleh Playwright.');
    await page.getByLabel('URL gambar').fill('https://example.com/gallery.webp');
    await page.getByRole('checkbox', { name: 'Tampilkan sebagai unggulan' }).check();
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/galleries\/?$/);
    await expect(page.getByText(title)).toBeVisible();

    const row = page.getByRole('row').filter({ hasText: title });
    await row.locator('a[href*="/edit"]').click();
    await page.getByLabel('Judul galeri').fill(updatedTitle);
    await page.getByLabel('Deskripsi').fill('Deskripsi galeri yang sudah diperbarui.');
    await page.getByLabel('URL gambar').fill('https://example.com/gallery-updated.webp');
    await page.getByRole('checkbox', { name: 'Tampilkan sebagai unggulan' }).uncheck();
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/galleries\/?$/);
    await expect(page.getByText(updatedTitle)).toBeVisible();

    const updatedRow = page.getByRole('row').filter({ hasText: updatedTitle });
    await updatedRow.getByRole('button', { name: 'Hapus galeri' }).click();
    await page.getByRole('button', { name: 'Konfirmasi' }).click();
    await expect(page).toHaveURL(/\/dashboard\/galleries\/?$/);
    await expect(page.getByText(updatedTitle)).not.toBeVisible();
  });
});
