import { test, expect } from '@playwright/test';

test('public buttons have accessible names', async ({ page }) => { await page.goto('/'); for (const button of await page.getByRole('button').all()) await expect(button).toHaveAccessibleName(/.+/); });
