import { AppData } from '@graasp/sdk';

export type IdeaAppData = AppData & {
  type: 'idea';
  data: {
    idea: string;
  };
};
