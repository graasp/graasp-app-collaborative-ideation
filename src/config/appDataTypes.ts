import { AppData, AppDataVisibility } from '@graasp/sdk';

import { AssistantId } from '@/interfaces/assistant';
import { ChatbotResponseData } from '@/interfaces/chatbot';
import { EvaluationType } from '@/interfaces/evaluationType';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { UsefulnessNoveltyRatings } from '@/interfaces/ratings';
import { PromptsData } from '@/interfaces/prompt';

export enum AppDataTypes {
  Response = 'response',
  ResponsesSet = 'responses-set',
  CurrentState = 'current-state',
  Ratings = 'ratings',
  ChatbotResponse = 'chatbot-response',
  Prompts = 'prompts',
}

export type ResponseData<T = UsefulnessNoveltyRatings> = {
  response: string | Array<string>;
  round?: number;
  bot?: boolean;
  assistantId?: AssistantId;
  parentId?: string;
  encoding?: 'raw' | 'markdown';
  originalResponse?: string;
  ratings?: T;
  givenPrompt?: string;
};

export type ResponseAppData = AppData & {
  type: AppDataTypes.Response;
  data: ResponseData;
  visibility: AppDataVisibility.Item;
};

export type ResponsesSetAppData = AppData & {
  type: AppDataTypes.ResponsesSet;
  data: {
    round: number;
    responses: Array<ResponseAppData['id']>;
    assistant?: AssistantId;
  };
};

export type CurrentStateData = {
  round?: number;
  status: ActivityStatus;
  activity: ActivityType;
  startTime: Date;
  stepIndex?: number;
};

export type CurrentStateAppData = AppData & {
  type: AppDataTypes.CurrentState;
  data: CurrentStateData;
};

export type RatingsData<T> = {
  ideaRef: string;
  type: EvaluationType;
  ratings: T;
};

export type RatingsAppData<T> = AppData & {
  type: AppDataTypes.Ratings;
  data: RatingsData<T>;
  visibility: AppDataVisibility.Member;
};

export type ChatbotResponseAppData = AppData & {
  type: AppDataTypes.ChatbotResponse;
  data: ChatbotResponseData;
  visibility: AppDataVisibility.Member;
};

export type PromptsAppData = AppData & {
  type: AppDataTypes.Prompts;
  data: PromptsData;
  visibility: AppDataVisibility.Member;
};
