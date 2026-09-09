import { test, expect } from '@playwright/test';

test('login email accepts editable whitespace input', async ({ page }) => { await page.goto('/login'); const email = page.locator('input[type="email"]'); await email.fill(' user@example.com '); await expect(email).toHaveValue(' user@example.com '); });
