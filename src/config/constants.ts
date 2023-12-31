import { AppDataVisibility } from '@graasp/sdk';

import { IdeationState } from '@/interfaces/ideation';

import { CurrentStateData } from './appDataTypes';

export const INITIAL_STATE: {
  [key: string]: unknown;
  type: string;
  data: CurrentStateData;
} = {
  type: 'current-state',
  data: {
    state: IdeationState.WaitingForStart,
  },
  visibility: AppDataVisibility.Item,
};

export const IDEA_MAXIMUM_LENGTH = 500;
export const NUMBER_OF_IDEAS_TO_SHOW = 3;
export const REFRESH_INTERVAL_MS = 5000;
