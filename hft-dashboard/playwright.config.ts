
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  // Run independent tests in parallel
  fullyParallel: true,

  // Prevent accidental test.only() commits in CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI
  retries: process.env.CI ? 2 : 0,

  // Control CI resource usage
  workers: process.env.CI ? 1 : undefined,

  // Test reporting
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Global test timeout
  timeout: 30000,

  // Assertions timeout
  expect: {
    timeout: 5000,
  },

  // Test artifacts
  outputDir: 'test-results/',

  use: {
    baseURL: 'http://localhost:3000',

    // Capture debugging information
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Browser action timeouts
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Automatically start application before testing
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',

    // Reuse local server, but never reuse an existing CI server
    reuseExistingServer: !process.env.CI,

    timeout: 120000,
  },
});
