import { AppData } from '@graasp/sdk';

import { AppDataTypes, CurrentStateAppData } from '@/config/appDataTypes';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import { sortAppDataByMostRecentlyUpdated } from './utils';

export const getAllStates = (appData: AppData[]): CurrentStateAppData[] =>
  appData.filter(
    ({ type }) => type === AppDataTypes.CurrentState,
  ) as CurrentStateAppData[];

export const getCurrentState = (
  appData: AppData[],
  orchestratorId: string,
): {
  currentState: CurrentStateAppData | undefined;
  multipleStatesFound?: boolean;
} => {
  const states = getAllStates(appData);
  const multipleStatesFound = states.length > 1;
  const currentState = states
    .sort(sortAppDataByMostRecentlyUpdated)
    .find(({ creator }) => creator?.id === orchestratorId);
  return { currentState, multipleStatesFound };
};

export const getCurrentStatus = (
  appData: AppData[],
  orchestratorId: string,
): ActivityStatus | undefined =>
  appData.find(
    ({ type, creator }) =>
      type === AppDataTypes.CurrentState && creator?.id === orchestratorId,
  )?.data?.status as ActivityStatus;

export const getCurrentActivity = (
  appData: AppData[],
  orchestratorId: string,
): ActivityType | undefined =>
  appData.find(
    ({ type, creator }) =>
      type === AppDataTypes.CurrentState && creator?.id === orchestratorId,
  )?.data?.activity as ActivityType;

export const getCurrentRound = (
  appData: AppData[],
  orchestratorId: string,
): number | undefined =>
  getCurrentState(appData, orchestratorId)?.currentState?.data?.round;
