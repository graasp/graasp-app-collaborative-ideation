const {
  VITE_PORT,
  VITE_GRAASP_APP_KEY,
  VITE_VERSION,
  VITE_SENTRY_ENV,
  VITE_SENTRY_DSN,
  VITE_GA_MEASUREMENT_ID,
  VITE_ENABLE_MOCK_API,
  VITE_API_HOST,
  VITE_WS_HOST,
} = window.Cypress ? Cypress.env() : import.meta.env;

export const MOCK_API = VITE_ENABLE_MOCK_API === 'true';
export const GA_MEASUREMENT_ID = VITE_GA_MEASUREMENT_ID;
export const API_HOST = VITE_API_HOST;
export const VERSION = VITE_VERSION || 'latest';
export const GRAASP_APP_KEY = VITE_GRAASP_APP_KEY;
export const SENTRY_ENV = VITE_SENTRY_ENV;
export const SENTRY_DSN = VITE_SENTRY_DSN;
export const PORT = parseInt(VITE_PORT, 10);
export const WS_HOST: string | undefined = VITE_WS_HOST;
export const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
export const BACKEND_WS_ROUTE = import.meta.env.VITE_BACKEND_WS_ROUTE;
