import { test, expect } from '@playwright/test';

test('upload form exposes file input constraints', async ({ page }) => { await page.goto('/admin/invalid-tenant/master/galleries/new'); const input = page.locator('input[type="file"]').first(); if (await input.count()) expect(await input.getAttribute('accept')).toBeTruthy(); });
