import registerCodeCoverageTasks from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,

  e2e: {
    retries: 1,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      const newConfig = {
        ...config,
        env: {
          ...config.env,
          VITE_API_HOST: process.env.VITE_API_HOST,
          VITE_MOCK_API: process.env.VITE_MOCK_API,
          VITE_GRAASP_APP_KEY: process.env.VITE_GRAASP_APP_KEY,
          VITE_VERSION: process.env.VITE_VERSION,
          VITE_SENTRY_ENV: process.env.VITE_SENTRY_ENV,
          VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN,
          VITE_REFETCH_INTERVAL_SETTING:
            process.env.VITE_REFETCH_INTERVAL_SETTING,
          VITE_WS_HOST: process.env.VITE_WS_HOST,
        },
      };
      registerCodeCoverageTasks(on, newConfig);
      return newConfig;
    },
    baseUrl: `http://localhost:${process.env.VITE_PORT || 4001}`,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
