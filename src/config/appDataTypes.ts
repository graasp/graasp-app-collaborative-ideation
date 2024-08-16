import { AppData, AppDataVisibility } from '@graasp/sdk';

import { AssistantId } from '@/interfaces/assistant';
import { ChatbotResponseData } from '@/interfaces/chatbot';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { UsefulnessNoveltyRatings } from '@/interfaces/ratings';
import { PromptsData } from '@/interfaces/prompt';
import { EvaluationParameters } from '@/interfaces/evaluation';

export enum AppDataTypes {
  Response = 'response',
  ResponsesSet = 'responses-set',
  CurrentState = 'current-state',
  Evaluation = 'evaluation',
  Ranking = 'ranking',
  Rating = 'rating',
  Vote = 'Vote',
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

export type RatingData = {
  responseRef: string;
  name: EvaluationParameters['ratingsName'];
  ratings: Array<{
    name: string;
    value: number;
  }>;
};

export type RatingAppData = AppData & {
  type: AppDataTypes.Rating;
  data: RatingData;
  visibility: AppDataVisibility.Item;
};

export type VoteAppData = AppData & {
  type: AppDataTypes.Vote;
  data: { responseRef: string };
  visibility: AppDataVisibility.Item;
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
