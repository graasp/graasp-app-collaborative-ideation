import { AppDataVisibility } from '@graasp/sdk';

export const INITIAL_STATE = {
  type: 'current-state',
  data: {
    round: 0,
  },
  visibility: AppDataVisibility.Item,
};

export const IDEA_MAXIMUM_LENGTH = 500;
