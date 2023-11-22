import { AppData } from '@graasp/sdk';

import { AppDataTypes, IdeaAppData } from '@/config/appDataTypes';

export const getMyResponses = (
  appData: AppData[],
  memberId: string | undefined,
): IdeaAppData[] => {
  const responses = appData.filter(
    ({ creator, type }) =>
      creator?.id === memberId && type === AppDataTypes.Idea,
  ) as IdeaAppData[];
  return responses;
};
