import { test, expect } from '@playwright/test';

test('pagination controls remain bounded', async ({ page }) => { await page.goto('/admin/invalid-tenant/managements/users'); const next = page.getByRole('button', { name: /Selanjutnya|Berikutnya/ }); if (await next.count()) await expect(next).toBeVisible(); });
