// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
// Alternatively you can use CommonJS syntax:
// require('./commands')
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import CssBaseline from '@mui/material/CssBaseline';
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles';

import { WithLocalContext, WithTokenContext } from '@graasp/apps-query-client';

import { mount } from 'cypress/react18';

import i18nConfig from '../../src/config/i18n';
import {
  QueryClientProvider,
  hooks,
  queryClient,
} from '../../src/config/queryClient';
import { AppDataProvider } from '../../src/modules/context/AppDataContext';
import { MembersProvider } from '../../src/modules/context/MembersContext';
import { SettingsProvider } from '../../src/modules/context/SettingsContext';
import './commands';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  const theme = createTheme();
  const wrappedComponent = (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <I18nextProvider i18n={i18nConfig}>
          <QueryClientProvider client={queryClient}>
            <WithLocalContext
              defaultValue={window.appContext}
              useGetLocalContext={hooks.useGetLocalContext}
              useAutoResize={hooks.useAutoResize}
              onError={() => {
                // eslint-disable-next-line no-console
                console.error('An error occurred while fetching the context.');
              }}
            >
              <WithTokenContext
                useAuthToken={hooks.useAuthToken}
                onError={() => {
                  // eslint-disable-next-line no-console
                  console.error(
                    'An error occurred while requesting the token.',
                  );
                }}
              >
                <MembersProvider>
                  <SettingsProvider>
                    <AppDataProvider>
                      {component as JSX.Element}
                    </AppDataProvider>
                  </SettingsProvider>
                </MembersProvider>
              </WithTokenContext>
            </WithLocalContext>
          </QueryClientProvider>
        </I18nextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
  return mount(wrappedComponent, options);
});

// Example use:
// cy.mount(<MyComponent />)
