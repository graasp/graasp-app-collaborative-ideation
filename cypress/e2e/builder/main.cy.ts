import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADMIN_PANEL_CY,
  BUILDER_VIEW_CY,
  NEXT_ROUND_BTN_CY,
  PLAY_PAUSE_BUTTON_CY,
  PROPOSE_NEW_RESPONSE_BTN,
  RESPONSE_COLLECTION_VIEW_CY,
  SETTINGS_TAB_CY,
  SETTINGS_VIEW_CY,
  SUBMIT_RESPONSE_BTN_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import { MEMBERS } from '../../fixtures/members';

describe('Builder View with admin rights, no settings', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
        memberId: MEMBERS.ANNA.id,
      },
    );
    cy.visit('/');
  });

  it('loads the view without initialization', () => {
    cy.get(buildDataCy(BUILDER_VIEW_CY));
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('exist');
  });

  it('starts the ideation process with orchestrator', () => {
    cy.get(buildDataCy(PLAY_PAUSE_BUTTON_CY)).should('have.lengthOf', 1);
    cy.get(buildDataCy(PLAY_PAUSE_BUTTON_CY)).click();

    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).should('exist');
  });

  it('create some responses, and hit next round', () => {
    cy.get(buildDataCy(PLAY_PAUSE_BUTTON_CY)).should('have.lengthOf', 1);
    cy.get(buildDataCy(PLAY_PAUSE_BUTTON_CY)).click();

    const newIdeas = ['Testing this software', "I don't know.", 'Sleep...'];

    cy.get(buildDataCy(RESPONSE_COLLECTION_VIEW_CY)).within(() => {
      newIdeas.forEach((idea) => {
        cy.get(buildDataCy(PROPOSE_NEW_RESPONSE_BTN)).click();
        cy.get('#input-response').type('a');
        cy.get('#input-response').type('{backspace}');
        cy.get('#input-response').should('be.enabled');
        cy.get('#input-response').type(idea, { delay: 20 });
        cy.get(buildDataCy(SUBMIT_RESPONSE_BTN_CY)).click();
      });
    });

    cy.get(buildDataCy(NEXT_ROUND_BTN_CY)).click();
  });

  it('visits settings', () => {
    cy.get(buildDataCy(SETTINGS_TAB_CY)).click();
    cy.get(buildDataCy(SETTINGS_VIEW_CY)).should('be.visible');
  });
});
