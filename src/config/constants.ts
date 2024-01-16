import { AppDataVisibility } from '@graasp/sdk';

import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import { AppDataTypes, CurrentStateData } from './appDataTypes';

export const INITIAL_STATE: {
  [key: string]: unknown;
  type: string;
  data: CurrentStateData;
} = {
  type: AppDataTypes.CurrentState,
  data: {
    status: ActivityStatus.WaitingForStart,
    activity: ActivityType.Collection,
    round: 0,
  },
  visibility: AppDataVisibility.Item,
};

export const IDEA_MAXIMUM_LENGTH = 500;
export const NUMBER_OF_IDEAS_TO_SHOW = 3;
export const REFRESH_INTERVAL_MS = 5000;
export const MAX_NUMBER_OF_CHARS_INPUT = 72;
