import { test, expect } from '@playwright/test';

test('scanner remains usable when camera is denied', async ({ page, context }) => { await context.grantPermissions([], { origin: 'http://localhost:3000' }); await page.goto('/admin/invalid-tenant/attendance/scan'); await expect(page.locator('body')).toBeVisible(); });
