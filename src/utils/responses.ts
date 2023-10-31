import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { AppDataTypes, IdeaAppData } from '@/config/appDataTypes';

export const getMyResponses = (
  appData: List<AppDataRecord>,
  memberId: string | undefined,
): List<IdeaAppData> => {
  const responses = appData.filter(
    ({ creator, type }) =>
      creator?.id === memberId && type === AppDataTypes.Idea,
  ) as List<IdeaAppData>;
  return responses;
};
