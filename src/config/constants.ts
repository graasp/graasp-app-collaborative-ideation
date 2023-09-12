import { AppDataVisibility } from '@graasp/sdk';

export const INITIAL_STATE = {
  type: 'current-state',
  data: {
    round: 0,
  },
  visibility: AppDataVisibility.Item,
};

export const IDEA_MAXIMUM_LENGTH = 500;
export const NUMBER_OF_IDEAS_TO_SHOW = 3;
export const REFRESH_INTERVAL_MS = 5000;
