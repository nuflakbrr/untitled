import { test, expect } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD || 'password';

test.describe('admin module smoke tests', () => {
  test.skip(!email, 'Set E2E_ADMIN_EMAIL to run authenticated admin module tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Kata sandi').fill(password);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  for (const [name, path, heading] of [
    ['dashboard', '/dashboard', null],
    ['pendaftaran', '/dashboard/registrations', 'Pendaftaran'],
    ['kategori event', '/dashboard/event-categories', 'Kategori event'],
    ['event', '/dashboard/events', 'Manajemen event'],
    ['galeri', '/dashboard/galleries', 'Galeri'],
    ['permission', '/dashboard/access/permissions', 'Manajemen hak akses'],
    ['role', '/dashboard/access/roles', 'Manajemen peran pengguna'],
    ['tenant', '/dashboard/access/tenants', 'Manajemen organisasi'],
    ['akun pengguna', '/dashboard/access/users', 'Manajemen akun'],
  ] as const) {
    test(`opens ${name} module`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      if (heading) await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    });
  }
});
