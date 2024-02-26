import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADMIN_PANEL_CY,
  DETAILS_INSTRUCTIONS_CY,
  TITLE_INSTRUCTIONS_CY,
  buildDataCy,
} from '@/config/selectors';

import { currentState } from '../../fixtures/appData';
import { ALL_SETTINGS, ALL_SETTINGS_OBJECT } from '../../fixtures/appSettings';
import { MEMBERS } from '../../fixtures/members';

describe('Player with read rights and activity configured.', () => {
  beforeEach(() => {
    cy.setUpApi(
      {
        appSettings: ALL_SETTINGS,
        appData: [currentState],
      },
      {
        context: Context.Builder,
        permission: PermissionLevel.Read,
        memberId: MEMBERS.ANNA.id,
      },
    );
    cy.visit('/');
  });

  it('loads the view and checks UI', () => {
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('not.exist');
    cy.get(buildDataCy(TITLE_INSTRUCTIONS_CY)).should(
      'contain.text',
      ALL_SETTINGS_OBJECT.instructions.title.content,
    );
    cy.get(buildDataCy(DETAILS_INSTRUCTIONS_CY)).should(
      'contain.text',
      ALL_SETTINGS_OBJECT.instructions.details?.content,
    );
  });
});
