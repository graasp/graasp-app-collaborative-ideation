import registerCodeCoverage from '@cypress/code-coverage/task';
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
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      registerCodeCoverage(on, config);
      return config;
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
