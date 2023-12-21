import { AppData } from '@graasp/sdk';

export const appDataArrayToMap = <AppDataType>(
  appDataArray: (AppDataType & { id: AppData['id'] })[],
): Map<string, AppDataType> =>
  new Map(appDataArray.map((appData) => [appData.id, appData]));
