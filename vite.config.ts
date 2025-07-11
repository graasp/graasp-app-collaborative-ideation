/// <reference types="vitest" />
/// <reference types="./src/env"/>
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { resolve } from 'path';
import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';

const getHttpsOptions = (): { key: Buffer; cert: Buffer } | undefined => {
  try {
    const httpsOptions = {
      key: fs.readFileSync('localhost.key'),
      cert: fs.readFileSync('localhost.crt'),
    };
    return httpsOptions;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error reading HTTPS certificate files:', error);
    return undefined; // Return undefined if files are not found or an error occurs
  }
};

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
      https: mode === 'test' ? undefined : getHttpsOptions(),
    },
    preview: {
      port: parseInt(process.env.VITE_PORT || '3333', 10),
      strictPort: true,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
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
      // Put the Sentry vite plugin after all other plugins
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'graasp',
        project: 'graasp-app-collaborative-ideation',
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
