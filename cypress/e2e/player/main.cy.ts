import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADMIN_PANEL_CY,
  DETAILS_INSTRUCTIONS_CY,
  LIKERT_RATING_CY,
  NEXT_STEP_BTN_CY,
  ORCHESTRATION_BAR_CY,
  RESPONSE_COLLECTION_VIEW_CY,
  RESPONSE_CY,
  RESPONSE_EVALUATION_VIEW_CY,
  RESPONSE_RESULTS_VIEW_CY,
  TITLE_INSTRUCTIONS_CY,
  buildDataCy,
} from '@/config/selectors';

import {
  currentStateEvaluation,
  currentStateInitial,
  endOfActivityResponses,
} from '../../fixtures/appData';
import {
  ALL_SETTINGS,
  ALL_SETTINGS_OBJECT,
  SETTINGS_WITH_ASSISTANT,
} from '../../fixtures/appSettings';
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

describe('Player with read rights, configured with one assistant and no data.', () => {
  beforeEach(() => {
    cy.setUpApi(
      {
        appSettings: SETTINGS_WITH_ASSISTANT,
        appData: [],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Read,
        memberId: MEMBERS.ANNA.id,
      },
    );
    cy.visit('/');
  });

  it('goes through all the steps.', () => {
    const MEAN_WAITING_TIME = 6000;
    // Propose a new idea, then go to next step
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('not.exist');

    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.PLAY_BUTTON)).click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);
    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).should('exist');
    cy.get(buildDataCy(NEXT_STEP_BTN_CY)).click();
    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).should('exist');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);
    cy.get(buildDataCy(NEXT_STEP_BTN_CY)).click();
    cy.get(buildDataCy(RESPONSE_EVALUATION_VIEW_CY)).should('exist');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);

    cy.get(buildDataCy(RESPONSE_CY))
      .first()
      .within(() => {
        cy.get(buildDataCy(LIKERT_RATING_CY))
          .first()
          .within(() => {
            cy.get('input[value=5]').click({ force: true });
          });
      });

    cy.get(buildDataCy(NEXT_STEP_BTN_CY)).click();

    cy.get(buildDataCy(RESPONSE_RESULTS_VIEW_CY)).should('exist');
  });
});
