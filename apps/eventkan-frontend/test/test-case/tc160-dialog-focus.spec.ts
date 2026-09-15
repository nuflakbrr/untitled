import { test, expect } from '@playwright/test';

test('available dialog exposes an interactive element', async ({ page }) => { await page.goto('/login'); const dialog = page.locator('[role="dialog"]'); if (await dialog.count()) await expect(dialog.locator('button, input').first()).toBeVisible(); });
