/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
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
      VITE_REFETCH_INTERVAL_SETTING: process.env.VITE_REFETCH_INTERVAL_SETTING,
      VITE_WS_HOST: process.env.VITE_WS_HOST,
    },
  };
  require('@cypress/code-coverage/task')(on, newConfig);
  // include any other plugin code...

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return newConfig;
};
