import { AppDataVisibility } from '@graasp/sdk';

import { ActivityState, ActivityStatus } from '@/interfaces/activity_state';
import { EvaluationType } from '@/interfaces/evaluation';

import { AppDataTypes, ChatbotResponseAppData } from './appDataTypes';

export const SMALL_BORDER_RADIUS = 4;

export const DEFAULT_ACTIVITY_STATE: ActivityState = {
  status: ActivityStatus.WaitingForStart,
  startTime: new Date(),
  stepIndex: 0,
};

export const RESPONSE_MAXIMUM_LENGTH = 2000; // characters
export const NUMBER_OF_IDEAS_TO_SHOW = 3;
export const REFRESH_INTERVAL_MS = 5000;

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

export const WAITING_TIME_FEEDBACK_GENERATION_S = 60;

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
