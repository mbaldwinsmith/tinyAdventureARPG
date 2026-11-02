import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { cataloguePlugin } from './scripts/catalogue-plugin.ts';

export default defineConfig({
  base: './',
  plugins: [react(), cataloguePlugin()],
  server: { allowedHosts: ['terminal.local'] },
  build: { chunkSizeWarningLimit: 2000 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    clearMocks: true,
  },
});
