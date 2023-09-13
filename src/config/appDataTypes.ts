import { AppDataVisibility } from '@graasp/sdk';
import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { IdeationState } from '@/interfaces/ideation';

export type IdeaData = {
  idea: string;
  round?: number;
  bot?: boolean;
  parentId?: string;
  encoding?: 'text' | 'markdown';
};

export type AnonymousIdeaData = IdeaData & { id: string };

export type IdeasData = List<AnonymousIdeaData>;

export type IdeaAppData = AppDataRecord & {
  type: 'idea';
  data: IdeaData;
};

export type IdeaSetAppData = AppDataRecord & {
  type: 'idea-set';
  data: {
    ideas: IdeasData;
  };
};

export type CurrentStateData = {
  // round: number;
  state: IdeationState;
};

export type CurrentStateAppData = AppDataRecord & {
  type: 'current-state';
  data: CurrentStateData;
};

export type RatingsData<T> = {
  ideaRef: string;
  ratings: T;
};

export type RatingsAppData<T> = AppDataRecord & {
  type: 'ratings';
  data: RatingsData<T>;
  visibility: AppDataVisibility.Member;
};
