// eslint-disable-next-line import/extensions
import registerCodeCoverage from '@cypress/code-coverage/task.js';
import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,

  e2e: {
    env: {
      VITE_API_HOST: process.env.VITE_API_HOST,
      VITE_ENABLE_MOCK_API: process.env.VITE_ENABLE_MOCK_API,
      VITE_GRAASP_APP_KEY: process.env.VITE_GRAASP_APP_KEY,
    },
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      registerCodeCoverage(on, config);
      return config;
    },
    baseUrl: `https://localhost:${process.env.VITE_PORT || 4001}`,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
