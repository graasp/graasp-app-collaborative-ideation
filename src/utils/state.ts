import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { AppDataTypes, CurrentStateAppData } from '@/config/appDataTypes';
import { ActivityStatus } from '@/interfaces/interactionProcess';

export const getCurrentState = (
  appData: List<AppDataRecord>,
  orchestratorId: string,
): CurrentStateAppData | undefined =>
  appData.find(
    ({ type, creator }) =>
      type === AppDataTypes.CurrentState && creator?.id === orchestratorId,
  ) as CurrentStateAppData;

export const getCurrentStatus = (
  appData: List<AppDataRecord>,
  orchestratorId: string,
): ActivityStatus | undefined =>
  appData.find(
    ({ type, creator }) =>
      type === AppDataTypes.CurrentState && creator?.id === orchestratorId,
  )?.data?.status as ActivityStatus;

export const getCurrentActivity = (
  appData: List<AppDataRecord>,
  orchestratorId: string,
): CurrentStateAppData | undefined =>
  appData.find(
    ({ type, creator }) =>
      type === AppDataTypes.CurrentState && creator?.id === orchestratorId,
  ) as CurrentStateAppData;
