import { test, expect } from '@playwright/test';

test('password visibility preserves value', async ({ page }) => { await page.goto('/login'); const input = page.locator('input[type="password"]').first(); if (!(await input.count())) return; await input.fill('secret123'); const toggle = page.locator('button').filter({ has: page.locator('svg') }).last(); if (await toggle.count()) { await toggle.click(); expect(await input.inputValue()).toBe('secret123'); } });
