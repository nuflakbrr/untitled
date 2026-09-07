import { devices, defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/test-case',
  fullyParallel: true,
  retries: 3,
  workers: 1,
  reporter: [['list'], ['html', { open: 'always' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
