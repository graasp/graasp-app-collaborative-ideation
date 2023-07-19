import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

export type IdeaData = {
  idea: string;
  round: number;
};

export type IdeasData = List<IdeaData & { id: string }>;

export type IdeaAppData = AppDataRecord & {
  type: 'idea';
  data: IdeaData;
};

export type IdeaSetAppData = AppDataRecord & {
  type: 'idea-set';
  data: {
    round: number;
    ideas: IdeasData;
  };
};

export type CurrentStateAppData = AppDataRecord & {
  type: 'current-state';
  data: {
    round: number;
  };
};
