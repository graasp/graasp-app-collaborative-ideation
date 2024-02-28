import { AppDataVisibility } from '@graasp/sdk';

import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import {
  AppDataTypes,
  ChatbotResponseAppData,
  CurrentStateData,
} from './appDataTypes';

export const SMALL_BORDER_RADIUS = 4;

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
    startTime: new Date(),
  },
  visibility: AppDataVisibility.Item,
};

export const RESPONSE_MAXIMUM_LENGTH = 200;
export const NUMBER_OF_IDEAS_TO_SHOW = 3;
export const REFRESH_INTERVAL_MS = 5000;
export const MAX_NUMBER_OF_CHARS_INPUT = 72;

export const DEFAULT_CHATBOT_RESPONSE_APP_DATA: Pick<
  ChatbotResponseAppData,
  'type' | 'visibility' | 'data'
> = {
  type: AppDataTypes.ChatbotResponse,
  visibility: AppDataVisibility.Member,
  data: {
    completion: '',
    model: '',
  },
};

export const DEFAULT_BOT_USERNAME = 'GraaspBot';
export const SHORT_TIME_LIMIT = 10; // seconds
