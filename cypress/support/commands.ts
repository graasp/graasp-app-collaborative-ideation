/// <reference types="../../src/window" />
import { Database } from '@graasp/apps-query-client';
import { LocalContext } from '@graasp/sdk';

import { ALL_SETTINGS } from '../fixtures/appSettings';
import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';
import { MOCK_SERVER_ITEM } from '../fixtures/mockItem';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setUpApi(
        database: Partial<Database>,
        appContext: Partial<LocalContext>,
      ): void;
    }
  }
}

Cypress.Commands.add('setUpApi', (database, appContext) => {
  Cypress.on('window:before:load', (win: Window) => {
    win.indexedDB.deleteDatabase('graasp-app-cypress');
    // eslint-disable-next-line no-param-reassign
    win.appContext = {
      accountId: CURRENT_MEMBER.id,
      itemId: MOCK_SERVER_ITEM.id,
      apiHost: Cypress.env('VITE_API_HOST'),
      ...appContext,
    };
    // eslint-disable-next-line no-param-reassign
    win.database = {
      appData: [],
      appActions: [],
      appSettings: [...ALL_SETTINGS],
      members: Object.values(MEMBERS),
      items: [MOCK_SERVER_ITEM],
      ...database,
    };
  });
});
