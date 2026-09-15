import { test, expect } from '@playwright/test';

test('query content is not executed as script', async ({ page }) => { const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message)); await page.goto('/?message=%3Cscript%3Ethrow%20Error()%3C%2Fscript%3E'); expect(errors).toEqual([]); });
