import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90 * 1000,
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // parallel execution may be flaky because of api calls and response times
  grep: process.env.GREP || undefined,

  use: {
    trace: 'on-first-retry',
    headless: process.env.CI ? true : false,
    baseURL: 'https://stage.spinbet.com/en-nz',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30 * 1000, //longer wait because of some slow API calls
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
