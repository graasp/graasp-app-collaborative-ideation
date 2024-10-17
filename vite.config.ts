/// <reference types="vitest" />
/// <reference types="./src/env"/>
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: '',
    css: {
      devSourcemap: true,
    },
    server: {
      port: parseInt(process.env.VITE_PORT, 10) || 4001,
      open: mode !== 'test', // open only when mode is different from test
      watch: {
        ignored: ['**/coverage/**', '**/cypress/downloads/**'],
      },
    },
    preview: {
      port: parseInt(process.env.VITE_PORT || '3333', 10),
      strictPort: true,
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      mode === 'test'
        ? undefined
        : checker({
            typescript: true,
            eslint: {
              useFlatConfig: true,
              lintCommand: 'eslint "src/**/*.{ts,tsx}"',
            },
          }),
      react(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test/', '.nyc_output', 'coverage'],
        extension: ['.js', '.ts', '.tsx'],
        requireEnv: false,
        forceBuildInstrument: mode === 'test',
        checkProd: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.REACT_APP_GRAASP_ASSETS_URL': `"${process.env.VITE_GRAASP_ASSETS_URL}"`,
    },
    test: {
      environment: 'jsdom',
    },
  });
};
