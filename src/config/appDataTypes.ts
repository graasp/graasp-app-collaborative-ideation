import { AppData, AppDataVisibility } from '@graasp/sdk';

import { AssistantId } from '@/interfaces/assistant';
import { ChatbotResponseData } from '@/interfaces/chatbot';
import { EvaluationType } from '@/interfaces/evaluationType';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { UsefulnessNoveltyRatings } from '@/interfaces/ratings';

export enum AppDataTypes {
  Response = 'response',
  ResponsesSet = 'responses-set',
  CurrentState = 'current-state',
  Ratings = 'ratings',
  ChatbotResponse = 'chatbot-response',
}

export type ResponseData<T = UsefulnessNoveltyRatings> = {
  response: string;
  round?: number;
  bot?: boolean;
  parentId?: string;
  encoding?: 'text' | 'markdown';
  ratings?: T;
};

export type AnonymousResponseData<RatingsT = UsefulnessNoveltyRatings> =
  ResponseData<RatingsT> & { id: string };

export type ResponsesData<RatingsT = UsefulnessNoveltyRatings> =
  AnonymousResponseData<RatingsT>[];

export type ResponseAppData = AppData & {
  type: AppDataTypes.Response;
  data: ResponseData;
};

export type ResponsesSetAppData = AppData & {
  type: AppDataTypes.ResponsesSet;
  data: {
    round: number;
    responses: ResponsesData;
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
