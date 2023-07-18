/// <reference types="../../src/window" />
import { Database, LocalContext } from '@graasp/apps-query-client';
import { Member } from '@graasp/sdk';

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
      setUpApi({
        database,
        currentMember,
        appContext,
      }: {
        database?: Partial<Database>;
        currentMember?: Member;
        appContext?: Partial<LocalContext>;
      }): Chainable<Element>;
    }
  }
}

Cypress.Commands.add(
  'setUpApi',
  ({ currentMember = CURRENT_MEMBER, database, appContext } = {}) => {
    // mock api and database
    Cypress.on('window:before:load', (win: Window) => {
      // eslint-disable-next-line no-param-reassign
      win.database = {
        appData: [],
        appActions: [],
        appSettings: [],
        members: Object.values(MEMBERS),
        ...database,
        items: [MOCK_SERVER_ITEM],
      };
      // eslint-disable-next-line no-param-reassign
      win.appContext = {
        memberId: currentMember.id,
        itemId: MOCK_SERVER_ITEM.id,
        apiHost: Cypress.env('VITE_API_HOST'),
        ...appContext,
      };
    });

    // setup mocks here
  },
);
