import { test, expect, type Page } from '@playwright/test';

type Account = { name: string; email?: string; password: string; routes: string[] };

const adminRoutes = [
  '/dashboard',
  '/dashboard/registrations',
  '/dashboard/event-categories',
  '/dashboard/events',
  '/dashboard/galleries',
  '/dashboard/access/permissions',
  '/dashboard/access/roles',
  '/dashboard/access/tenants',
  '/dashboard/access/users',
];

const accounts: Account[] = [
  {
    name: 'root superadmin',
    email: process.env.E2E_ROOT_ADMIN_EMAIL || process.env.E2E_ADMIN_EMAIL,
    password: process.env.E2E_ROOT_ADMIN_PASSWORD || process.env.E2E_ADMIN_PASSWORD || 'password',
    routes: adminRoutes,
  },
  {
    name: 'superadmin fakultas',
    email: process.env.E2E_FACULTY_ADMIN_EMAIL,
    password: process.env.E2E_FACULTY_ADMIN_PASSWORD || 'password',
    routes: adminRoutes,
  },
  {
    name: 'panitia fakultas',
    email: process.env.E2E_COMMITTEE_EMAIL,
    password: process.env.E2E_COMMITTEE_PASSWORD || 'password',
    routes: adminRoutes,
  },
  {
    name: 'peserta',
    email: process.env.E2E_PARTICIPANT_EMAIL,
    password: process.env.E2E_PARTICIPANT_PASSWORD || 'password',
    routes: [
      '/participant/dashboard',
      '/participant/transactions',
      '/participant/certificates',
      '/participant/profile',
      '/dashboard/events',
    ],
  },
];

async function signIn(page: Page, account: Account) {
  await page.goto('/auth/sign-in');
  await page.getByLabel('Email').fill(account.email!);
  await page.getByLabel('Kata sandi').fill(account.password);
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/auth\/sign-in/);
}

for (const account of accounts) {
  test.describe(`${account.name} access boundary`, () => {
    test.skip(!account.email, `Set credentials for ${account.name}`);

    test('can only render protected modules without server errors', async ({ page }) => {
      await signIn(page, account);
      for (const route of account.routes) {
        const response = await page.goto(route, {
          waitUntil: 'domcontentloaded',
          timeout: 15_000,
        });
        expect(response?.status(), `${account.name} ${route}`).toBeLessThan(500);
        await expect(page.locator('body')).not.toContainText('Internal Server Error');
      }
    });
  });
}

test.describe('authentication boundaries', () => {
  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill('invalid-e2e@example.com');
    await page.getByLabel('Kata sandi').fill('wrong-password');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page.getByText(/gagal|salah|invalid/i)).toBeVisible();
  });

  test('redirects unauthenticated users from protected modules', async ({ page }) => {
    await page.goto('/dashboard/events');
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
