import { test, expect } from '@playwright/test';

test('public error page hides internal stack details', async ({ page }) => { await page.goto('/unknown-route'); const text = await page.locator('body').innerText(); expect(text).not.toMatch(/node_modules|webpack|at Object|at async/); });
