import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

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
  round: number;
};

export type CurrentStateAppData = AppDataRecord & {
  type: 'current-state';
  data: CurrentStateData;
};

export type RatingsData = {
  ideaRef: string;
  ratings: {
    [key: string]: number;
  };
};
