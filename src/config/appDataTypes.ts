import { AppData, AppDataVisibility } from '@graasp/sdk';

import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';

export enum AppDataTypes {
  Response = 'response',
  ResponsesSet = 'responses-set',
  CurrentState = 'current-state',
  Ratings = 'ratings',
}

export type ResponseData<T = NoveltyRelevanceRatings> = {
  response: string;
  round?: number;
  bot?: boolean;
  parentId?: string;
  encoding?: 'text' | 'markdown';
  ratings?: T;
};

export type AnonymousResponseData<RatingsT = NoveltyRelevanceRatings> =
  ResponseData<RatingsT> & { id: string };

export type ResponsesData<RatingsT = NoveltyRelevanceRatings> =
  AnonymousResponseData<RatingsT>[];

export type ResponseAppData = AppData & {
  type: AppDataTypes.Response;
  data: ResponseData;
};

export type ResponsesSetAppData = AppData & {
  type: AppDataTypes.ResponsesSet;
  data: {
    responses: ResponsesData;
  };
};

export type CurrentStateData = {
  round?: number;
  status: ActivityStatus;
  activity: ActivityType;
};

export type CurrentStateAppData = AppData & {
  type: AppDataTypes.CurrentState;
  data: CurrentStateData;
};

export type RatingsData<T> = {
  ideaRef: string;
  ratings: T;
};

export type RatingsAppData<T> = AppData & {
  type: AppDataTypes.Ratings;
  data: RatingsData<T>;
  visibility: AppDataVisibility.Member;
};
