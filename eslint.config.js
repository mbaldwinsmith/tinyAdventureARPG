import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'public/generated/**',
      'playwright-report/**',
      'test-results/**',
      'src/raw sprites/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}', 'src/main.tsx'],
    plugins: { 'react-hooks': hooks, 'react-refresh': refresh },
    rules: {
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'phaser',
                'react',
                'react-dom',
                'zustand',
                'dexie',
                'phaser/**',
                'react/**',
                'react-dom/**',
                'zustand/**',
                'dexie/**',
                'node:*',
                '**/game/**',
                '**/ui/**',
                '**/platform/**',
                '**/bridge/**',
              ],
              message: 'Keep core rules independent of framework and platform adapters.',
            },
          ],
        },
      ],
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'indexedDB'],
    },
  },
);
