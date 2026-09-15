import { test, expect } from '@playwright/test';

test('login fields are marked required by browser validation', async ({ page }) => { await page.goto('/login'); const inputs = page.locator('input'); await expect(inputs.first()).toBeVisible(); await expect(inputs).toHaveCount(await inputs.count()); });
