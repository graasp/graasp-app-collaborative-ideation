/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT?: number;
  readonly VITE_API_HOST: string;
  readonly VITE_ENABLE_MOCK_API?: string;
  readonly VITE_GRAASP_APP_KEY: string;
  readonly VITE_VERSION?: string;
  readonly VITE_SENTRY_ENV?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_WS_HOST?: string;
  readonly VITE_BACKEND_HOST?: string;
  readonly VITE_BACKEND_WS_ROUTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
