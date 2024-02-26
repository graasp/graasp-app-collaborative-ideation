import { AppData, AppDataVisibility, Member } from '@graasp/sdk';

import { AppDataTypes } from '@/config/appDataTypes';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import { MEMBERS } from './members';
import { MOCK_SERVER_DISCRIMINATED_ITEM } from './mockItem';

let appDataCounter = 0;

const appDataFactory = (
  type: AppDataTypes,
  data: AppData['data'],
  visibility: AppDataVisibility,
  member: Member,
  creator: Member,
): AppData => {
  const id = appDataCounter.toString();
  appDataCounter += 1;
  return {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    item: MOCK_SERVER_DISCRIMINATED_ITEM,
    data,
    type,
    visibility,
    member,
    creator,
  };
};

export const currentState = appDataFactory(
  AppDataTypes.CurrentState,
  {
    round: 0,
    status: ActivityStatus.Play,
    activity: ActivityType.Collection,
  },
  AppDataVisibility.Item,
  // Check that orchestrator is set to ANNA for this to apply.
  MEMBERS.ANNA,
  MEMBERS.ANNA,
);
