import { Context, PermissionLevel } from '@graasp/sdk';

import { BUILDER_VIEW_CY, buildDataCy } from '../../../src/config/selectors';

describe('Builder View', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('App', () => {
    cy.get(buildDataCy(BUILDER_VIEW_CY));
  });
});
