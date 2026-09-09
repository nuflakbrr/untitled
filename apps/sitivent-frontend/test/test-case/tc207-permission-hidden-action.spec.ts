import { test, expect } from '@playwright/test';

test('anonymous admin route does not expose active delete action', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/users'); const deleteButton = page.getByRole('button', { name: /hapus|delete/i }); if (await deleteButton.count()) await expect(deleteButton.first()).toBeDisabled(); });
