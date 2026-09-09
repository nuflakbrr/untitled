import { test, expect } from '@playwright/test';

test('first-page previous control is safe', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/users'); const previous = page.getByRole('button', { name: /Sebelumnya/ }); if (await previous.count()) await expect(previous).toBeDisabled(); });
