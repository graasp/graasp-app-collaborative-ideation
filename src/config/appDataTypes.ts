import { AppData, AppDataVisibility } from '@graasp/sdk';

import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';

export enum AppDataTypes {
  Idea = 'idea',
  IdeaSet = 'idea-set',
  CurrentState = 'current-state',
  Ratings = 'ratings',
}

export type IdeaData<T = NoveltyRelevanceRatings> = {
  idea: string;
  round?: number;
  bot?: boolean;
  parentId?: string;
  encoding?: 'text' | 'markdown';
  ratings?: T;
};

export type AnonymousIdeaData<RatingsT = NoveltyRelevanceRatings> =
  IdeaData<RatingsT> & { id: string };

export type IdeasData<RatingsT = NoveltyRelevanceRatings> =
  AnonymousIdeaData<RatingsT>[];

export type IdeaAppData = AppData & {
  type: AppDataTypes.Idea;
  data: IdeaData;
};

export type IdeaSetAppData = AppData & {
  type: AppDataTypes.IdeaSet;
  data: {
    ideas: IdeasData;
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
