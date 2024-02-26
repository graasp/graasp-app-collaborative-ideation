import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADMIN_PANEL_CY,
  DETAILS_INSTRUCTIONS_CY,
  RESPONSE_EVALUATION_VIEW_CY,
  TITLE_INSTRUCTIONS_CY,
  buildDataCy,
} from '@/config/selectors';

import {
  currentStateEvaluation,
  currentStateInitial,
  endOfActivityResponses,
} from '../../fixtures/appData';
import { ALL_SETTINGS, ALL_SETTINGS_OBJECT } from '../../fixtures/appSettings';
import { MEMBERS } from '../../fixtures/members';

describe('Player with read rights and collection activity.', () => {
  beforeEach(() => {
    cy.setUpApi(
      {
        appSettings: ALL_SETTINGS,
        appData: [currentStateInitial],
      },
      {
        context: Context.Player,
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

describe('Player with read rights and evaluation activity.', () => {
  beforeEach(() => {
    cy.setUpApi(
      {
        appSettings: ALL_SETTINGS,
        appData: [currentStateEvaluation, ...endOfActivityResponses],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Read,
        memberId: MEMBERS.ANNA.id,
      },
    );
    cy.visit('/');
  });

  it('loads the view and checks UI', () => {
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('not.exist');
    cy.get(buildDataCy(RESPONSE_EVALUATION_VIEW_CY)).should('exist');
  });
});
