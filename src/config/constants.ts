import { AppData, AppDataVisibility } from '@graasp/sdk';

import { CurrentStateData } from './appDataTypes';

export const INITIAL_STATE = {
  type: 'current-state',
  data: {
    round: 0,
  },
  visibility: AppDataVisibility.Item,
};
