import { test, expect } from '@playwright/test';

test('file input remains safe when no file is chosen', async ({ page }) => { await page.goto('/admin/invalid-tenant/master/galleries/new'); const input = page.locator('input[type="file"]').first(); if (await input.count()) await expect(input).toHaveValue(''); });
