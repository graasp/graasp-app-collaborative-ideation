import { AppData } from '@graasp/sdk';

import { compareDesc } from 'date-fns/fp';

export const appDataArrayToMap = <AppDataType>(
  appDataArray: (AppDataType & { id: AppData['id'] })[],
): Map<string, AppDataType> =>
  new Map(appDataArray.map((appData) => [appData.id, appData]));

export const sortAppDataByMostRecentlyUpdated = <T extends AppData>(
  a: T,
  b: T,
): number => compareDesc(a.updatedAt, b.updatedAt);
