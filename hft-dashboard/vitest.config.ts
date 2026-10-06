import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration for LALAN HFT & Robo-Advisor monorepo unit test suites.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', '__tests__/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
