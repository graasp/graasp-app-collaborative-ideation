import { AppData, AppDataVisibility, Member } from '@graasp/sdk';

import { AppDataTypes, ResponseData } from '@/config/appDataTypes';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import { MEMBERS } from './members';
import { MOCK_SERVER_DISCRIMINATED_ITEM } from './mockItem';

let appDataCounter = 0;

const appDataFactory = (
  type: AppDataTypes,
  data: AppData['data'],
  visibility: AppDataVisibility,
  account: Member,
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
    account,
    creator,
  };
};

const responseFactory = (
  responseData: ResponseData,
  account: Member,
): AppData =>
  appDataFactory(
    AppDataTypes.Response,
    {},
    AppDataVisibility.Member,
    account,
    account,
  );

export const currentStateInitial = appDataFactory(
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

export const currentStateEvaluation = appDataFactory(
  AppDataTypes.CurrentState,
  {
    round: 5,
    status: ActivityStatus.Play,
    activity: ActivityType.Evaluation,
  },
  AppDataVisibility.Item,
  // Check that orchestrator is set to ANNA for this to apply.
  MEMBERS.ANNA,
  MEMBERS.ANNA,
);

export const endOfActivityResponses = [
  responseFactory(
    {
      response: 'Climbing to the top of the Everest',
      round: 0,
    },
    MEMBERS.ANNA,
  ),
  responseFactory(
    {
      response: 'Going to Thailand.',
      round: 0,
    },
    MEMBERS.ANNA,
  ),
  responseFactory(
    {
      response:
        'Developing an open source and democratic alternative to the multiverse that does not cross the ecological and societal boundaries of the earth while enabling the complete destruction of our capitalist civilization.',
      round: 1,
    },
    MEMBERS.ANNA,
  ),
  responseFactory(
    {
      response: 'Do nothing.',
      round: 1,
    },
    MEMBERS.ANNA,
  ),
  responseFactory(
    {
      response: 'Get trash out.',
      round: 0,
    },
    MEMBERS.BOB,
  ),
  responseFactory(
    {
      response: 'Eat rich people',
      round: 0,
    },
    MEMBERS.BOB,
  ),
  responseFactory(
    {
      response: 'Write borderline text in E2E tests.',
      round: 1,
    },
    MEMBERS.BOB,
  ),
];
