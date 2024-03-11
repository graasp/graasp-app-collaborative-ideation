import React from 'react';
import ReactDOM from 'react-dom/client';

import { MockSolution, mockApi } from '@graasp/apps-query-client';

import * as Sentry from '@sentry/react';

import { MOCK_API } from './config/env';
import { generateSentryConfig } from './config/sentry';
import './index.css';
import buildDatabase, { defaultMockContext, mockMembers } from './mocks/db';
import Root from './modules/Root';

Sentry.init({
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
  ...generateSentryConfig(),
});

// setup mocked api for cypress or standalone app
/* istanbul ignore next */
if (MOCK_API) {
  mockApi(
    {
      externalUrls: [],
      dbName: window.Cypress ? 'graasp-app-cypress' : undefined,
      appContext: window.Cypress ? window.appContext : defaultMockContext,
      database: window.Cypress ? window.database : buildDatabase(mockMembers),
    },
    window.Cypress ? MockSolution.MirageJS : MockSolution.ServiceWorker,
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
