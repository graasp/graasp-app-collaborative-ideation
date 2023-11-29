import { AppData } from '@graasp/sdk';

import {
  AppDataTypes,
  ResponseAppData,
  ResponsesSetAppData,
} from '@/config/appDataTypes';

export const getMyResponses = (
  appData: AppData[],
  memberId: string | undefined,
): ResponseAppData[] => {
  const responses = appData.filter(
    ({ creator, type }) =>
      creator?.id === memberId && type === AppDataTypes.Response,
  ) as ResponseAppData[];
  return responses;
};

export const getAllVisibleResponses = (
  appData: AppData[],
  orchestratorId: string,
): ResponsesSetAppData | undefined => {
  const responses = appData.find(
    ({ creator, type }) =>
      creator?.id === orchestratorId && type === AppDataTypes.Response,
  ) as ResponsesSetAppData;
  return responses;
};
