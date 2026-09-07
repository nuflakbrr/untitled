import { test, expect } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD || 'password';

test.describe('event CRUD', () => {
  test.skip(!email, 'Set E2E_ADMIN_EMAIL to run authenticated event CRUD tests');

  test('create, edit, and delete an event from the admin dashboard', async ({ page }) => {
    const title = `Playwright event ${Date.now()}`;
    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Kata sandi').fill(password);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/dashboard/events/create');
    await page.getByLabel('Nama event').fill(title);
    await page.getByLabel('Tanggal mulai').fill('2030-01-10');
    await page.getByLabel('Waktu mulai').fill('09:00');
    await page.getByLabel('Tanggal selesai').fill('2030-01-10');
    await page.getByLabel('Waktu selesai').fill('12:00');
    await page.getByLabel('Lokasi atau link Zoom').fill('Ruang utama');
    await page.getByLabel('Batas akhir pendaftaran').fill('2029-12-31');
    await page.getByLabel('Kuota peserta').fill('25');
    await page.locator('textarea[name="description"]').fill('Event yang dibuat oleh automated browser test.');
    for (const [label, value] of [
      ['name', 'Pemateri Test'],
      ['title', 'Lead'],
      ['company', 'Company'],
      ['company url', 'https://company.test'],
      ['github', 'https://github.com/speaker'],
      ['instagram', 'https://instagram.com/speaker'],
      ['linked in', 'https://linkedin.com/speaker'],
      ['avatar', 'https://example.com/avatar.webp'],
    ] as const) await page.getByLabel(label).first().fill(value);
    await page.getByLabel('Judul benefit').first().fill('Sertifikat elektronik');
    await page.getByLabel('Nama icon').first().fill('Gift');
    await page.getByLabel('Deskripsi benefit').first().fill('Benefit untuk peserta.');
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/events\/?$/);
    await expect(page.getByText(title)).toBeVisible();

    const createdEventRow = page.getByRole('row').filter({ hasText: title });
    await createdEventRow.getByRole('link', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/dashboard\/events\/[^/]+\/edit\/?$/);
    await page.getByLabel('Nama event').waitFor();
    await page.getByLabel('Nama event').fill(`${title} updated`);
    await page.getByLabel('Tanggal mulai').fill('2030-02-10');
    await page.getByLabel('Waktu mulai').fill('10:00');
    await page.getByLabel('Tanggal selesai').fill('2030-02-10');
    await page.getByLabel('Waktu selesai').fill('15:00');
    await page.getByLabel('Tipe event').click();
    await page.getByRole('option', { name: 'Online', exact: true }).click();
    await page.getByLabel('Status').click();
    await page.getByRole('option', { name: 'Dipublikasikan', exact: true }).click();
    await page.getByLabel('Lokasi atau link Zoom').fill('https://meet.example.com/updated');
    await page.getByLabel('Batas akhir pendaftaran').fill('2030-02-01');
    await page.getByLabel('Kuota peserta').fill('50');
    await page.getByLabel('Biaya (IDR)').fill('25000');
    await page.locator('textarea[name="description"]').fill('Deskripsi event yang sudah diperbarui.');
    await page.getByLabel('URL cover / gambar thumbnail').fill('https://example.com/updated-banner.webp');
    await page.getByLabel('Aktifkan sertifikat elektronik').check();
    for (const [label, value] of [
      ['name', 'Pemateri Updated'],
      ['title', 'Senior Lead'],
      ['company', 'Updated Company'],
      ['company url', 'https://updated-company.test'],
      ['github', 'https://github.com/updated-speaker'],
      ['instagram', 'https://instagram.com/updated-speaker'],
      ['linked in', 'https://linkedin.com/updated-speaker'],
      ['avatar', 'https://example.com/updated-avatar.webp'],
    ] as const) await page.getByLabel(label).first().fill(value);
    await page.getByLabel('Judul benefit').first().fill('Tiket dan sertifikat updated');
    await page.getByLabel('Nama icon').first().fill('Award');
    await page.getByLabel('Deskripsi benefit').first().fill('Benefit event yang sudah diperbarui.');
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    await page.getByRole('button', { name: 'Konfirmasi' }).click();
    await expect(page).toHaveURL(/\/dashboard\/events\/?$/);
    await expect(page.getByText(`${title} updated`)).toBeVisible();

    const eventRow = page.getByRole('row').filter({ hasText: `${title} updated` });
    await eventRow.getByRole('button', { name: 'Hapus' }).click();
    await page.getByRole('button', { name: 'Konfirmasi' }).click();
    await expect(page).toHaveURL(/\/dashboard\/events\/?$/);
    await expect(page.getByText(`${title} updated`)).not.toBeVisible();
  });
});
