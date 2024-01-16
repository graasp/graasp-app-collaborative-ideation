import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADMIN_PANEL_CY,
  BUILDER_VIEW_CY,
  INITIALIZE_BTN_CY,
  buildDataCy,
} from '../../../src/config/selectors';

describe('Builder View with admin rights', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    );
    cy.visit('/');
  });

  it('loads the view without initialization', () => {
    cy.get(buildDataCy(BUILDER_VIEW_CY));
    cy.get(buildDataCy(INITIALIZE_BTN_CY)).should('exist');
    cy.get(buildDataCy(INITIALIZE_BTN_CY)).click();
    cy.get(buildDataCy(INITIALIZE_BTN_CY)).should('not.exist');
    cy.get(buildDataCy(ADMIN_PANEL_CY)).should('exist');
  });
});
