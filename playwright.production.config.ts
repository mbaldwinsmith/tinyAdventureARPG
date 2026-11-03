import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e-production',
  outputDir: 'test-results-production',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4190',
    viewport: { width: 1440, height: 1100 },
    trace: 'retain-on-failure',
    launchOptions: {
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
        : {}),
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    },
  },
  webServer: {
    command: 'npm run preview -- --port 4190 --strictPort',
    url: 'http://127.0.0.1:4190',
    reuseExistingServer: false,
  },
});
