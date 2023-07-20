import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

export type Derivation = 'lateral' | 'variation' | 'precision';
// Maybe 'elaboration' instead of 'precision'?

export type IdeaData = {
  idea: string;
  round: number;
  derivation?: Derivation;
  refId: string;
};

export type IdeasData = List<string>;

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
