import { test, expect } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD || 'password';

test.describe('event category CRUD', () => {
  test.skip(!email, 'Set E2E_ADMIN_EMAIL to run authenticated tests');

  test('creates, edits, and deletes an event category', async ({ page }) => {
    const name = `Playwright category ${Date.now()}`;
    const updatedName = `${name} updated`;
    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Kata sandi').fill(password);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/dashboard/event-categories/create');
    await page.getByLabel('Nama kategori').fill(name);
    await page.getByLabel('Deskripsi').fill('Kategori yang dibuat oleh Playwright.');
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/event-categories\/?$/);
    await expect(page.getByText(name)).toBeVisible();

    const row = page.getByRole('row').filter({ hasText: name });
    await row.locator('a[href*="/edit"]').click();
    await page.getByLabel('Nama kategori').fill(updatedName);
    await page.getByLabel('Deskripsi').fill('Deskripsi kategori yang sudah diperbarui.');
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    await page.getByRole('button', { name: 'Konfirmasi' }).click();
    await expect(page).toHaveURL(/\/dashboard\/event-categories\/?$/);
    await expect(page.getByText(updatedName)).toBeVisible();

    const updatedRow = page.getByRole('row').filter({ hasText: updatedName });
    await updatedRow.getByRole('button', { name: 'Hapus kategori' }).click();
    await page.getByRole('button', { name: 'Konfirmasi' }).click();
    await expect(page).toHaveURL(/\/dashboard\/event-categories\/?$/);
    await expect(page.getByText(updatedName)).not.toBeVisible();
  });
});
