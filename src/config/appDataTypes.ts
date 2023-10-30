import { AppDataVisibility } from '@graasp/sdk';
import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { ProcessState } from '@/interfaces/interactionProcess';
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

export type IdeasData<RatingsT = NoveltyRelevanceRatings> = List<
  AnonymousIdeaData<RatingsT>
>;

export type IdeaAppData = AppDataRecord & {
  type: AppDataTypes.Idea;
  data: IdeaData;
};

export type IdeaSetAppData = AppDataRecord & {
  type: AppDataTypes.IdeaSet;
  data: {
    ideas: IdeasData;
  };
};

export type CurrentStateData = {
  // round: number;
  state: ProcessState;
};

export type CurrentStateAppData = AppDataRecord & {
  type: AppDataTypes.CurrentState;
  data: CurrentStateData;
};

export type RatingsData<T> = {
  ideaRef: string;
  ratings: T;
};

export type RatingsAppData<T> = AppDataRecord & {
  type: AppDataTypes.Ratings;
  data: RatingsData<T>;
  visibility: AppDataVisibility.Member;
};
