import { Context, PermissionLevel } from '@graasp/sdk';

import {
  BUILDER_VIEW_CY,
  INITIALIZE_BTN_CY,
  buildDataCy,
} from '../../../src/config/selectors';

describe('Builder View with admin rights', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('loads the view without initialization', () => {
    cy.get(buildDataCy(BUILDER_VIEW_CY));
    cy.get(buildDataCy(INITIALIZE_BTN_CY));
  });
});
