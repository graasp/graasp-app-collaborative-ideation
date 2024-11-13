import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADMIN_PANEL_CY,
  DETAILS_INSTRUCTIONS_CY,
  LIKERT_RATING_CY,
  ORCHESTRATION_BAR_CY,
  PROMPTS_CY,
  PROPOSE_NEW_RESPONSE_BTN_CY,
  RESPONSE_COLLECTION_VIEW_CY,
  RESPONSE_CY,
  RESPONSE_EVALUATION_VIEW_CY,
  RESPONSE_RESULTS_VIEW_CY,
  SUBMIT_RESPONSE_BTN_CY,
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
  SETTINGS_WITH_RATINGS,
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
        accountId: MEMBERS.ANNA.id,
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

  it('checks the prompts', () => {
    cy.get(buildDataCy(PROPOSE_NEW_RESPONSE_BTN_CY)).click();

    cy.get(buildDataCy(PROMPTS_CY.DASHBOARD)).should('be.visible');
    cy.get(buildDataCy(PROMPTS_CY.PROMPT)).should('not.be.visible');

    cy.get(buildDataCy(PROMPTS_CY.REQUEST_BUTTON)).click();

    cy.get(buildDataCy(PROMPTS_CY.PROMPT)).should('be.visible');
    cy.get(buildDataCy(PROMPTS_CY.PROMPT_STEP)).should(
      'have.length',
      ALL_SETTINGS_OBJECT.prompts.maxNumberOfQueries,
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
        accountId: MEMBERS.ANNA.id,
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
        accountId: MEMBERS.ANNA.id,
      },
    );
    cy.visit('/');
  });

  it('goes through all the steps.', () => {
    const MEAN_WAITING_TIME = 4000;
    // Propose a new idea, then go to next step
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('not.exist');

    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.PLAY_BUTTON)).click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);
    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).should('exist');
    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.NEXT_STEP_BTN)).click();
    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).should('exist');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);
    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.NEXT_STEP_BTN)).click();
    cy.get(buildDataCy(RESPONSE_EVALUATION_VIEW_CY)).should('exist');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);

    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.NEXT_STEP_BTN)).click();

    cy.get(buildDataCy(RESPONSE_RESULTS_VIEW_CY)).should('exist');
  });
});

describe('Player with read rights, configured to rate ideas.', () => {
  beforeEach(() => {
    cy.setUpApi(
      {
        appSettings: SETTINGS_WITH_RATINGS,
        appData: [],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Read,
        accountId: MEMBERS.ANNA.id,
      },
    );
    cy.visit('/');
  });

  it('types a few ideas and rate them.', () => {
    const MEAN_WAITING_TIME = 4000;
    // Propose a new idea, then go to next step
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('not.exist');

    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.PLAY_BUTTON)).click();

    const newIdeas = ['Testing this software', "I don't know.", 'Sleep...'];

    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).within(() => {
      newIdeas.forEach((idea) => {
        cy.get(buildDataCy(PROPOSE_NEW_RESPONSE_BTN_CY)).click();
        cy.get('#input-response').type('a');
        cy.get('#input-response').type('{backspace}');
        cy.get('#input-response').should('be.enabled');
        cy.get('#input-response').type(idea, { delay: 20 });
        cy.get(buildDataCy(SUBMIT_RESPONSE_BTN_CY)).click();
      });
    });

    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.NEXT_STEP_BTN)).click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(MEAN_WAITING_TIME);

    cy.get(buildDataCy(RESPONSE_EVALUATION_VIEW_CY)).should('exist');

    cy.get(buildDataCy(RESPONSE_CY))
      .first()
      .within(() => {
        cy.get(buildDataCy(LIKERT_RATING_CY)).should('have.length', 2);
        cy.get(buildDataCy(LIKERT_RATING_CY))
          .first()
          .within(() => {
            cy.get('input[value=5]').click({ force: true });
          });
      });

    cy.get(buildDataCy(RESPONSE_CY))
      .last()
      .within(() => {
        cy.get(buildDataCy(LIKERT_RATING_CY)).should('have.length', 2);
        cy.get(buildDataCy(LIKERT_RATING_CY))
          .last()
          .within(() => {
            cy.get('input[value=2]').click({ force: true });
          });
      });

    cy.get(buildDataCy(ORCHESTRATION_BAR_CY.NEXT_STEP_BTN)).click();

    cy.get(buildDataCy(RESPONSE_RESULTS_VIEW_CY)).should('exist');
  });
});
