import { AppDataVisibility } from '@graasp/sdk';

import { EvaluationType } from '@/interfaces/evaluation';
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

export const RESPONSE_MAXIMUM_LENGTH = 800;
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

export const LAST_RECORDED_NUMBER_OF_RESPONSES_SESSION_STORE_KEY = (
  itemId: string,
): string => `last-recorded-number-of-responses-for-${itemId}`;

export const DEFAULT_BOT_USERNAME = 'GraaspBot';
export const SHORT_TIME_LIMIT = 10; // seconds
export const DEFAULT_LANG = 'en';

export const DEFAULT_EVALUATION_TYPE = EvaluationType.None;

export const HIGHLIGHT_RESPONSE_TIME_MS = 2000;

export const CATEGORY_COLORS = [
  '#ffadad',
  '#ffd6a5',
  '#fdffb6',
  '#caffbf',
  '#9bf6ff',
  '#a0c4ff',
  '#bdb2ff',
  '#ffc6ff',
];

export const RESPONSES_TOP_COLORS = [
  '#DBF9E7',
  '#E8C9FA',
  '#EFE9B7',
  '#F6CCB0',
  '#B0E1FA',
];
