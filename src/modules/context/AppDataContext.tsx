import React, { createContext, useMemo } from 'react';

import { AppData } from '@graasp/sdk';
import { AppDataRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import Loader from '../common/Loader';

type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
  visibility?: AppData['visibility'];
};

type PatchAppDataType = {
  data: { [key: string]: unknown };
  id: string;
};

type DeleteAppDataType = {
  id: string;
};

export type AppDataContextType = {
  postAppData: (payload: PostAppDataType) => void;
  postAppDataAsync: (payload: PostAppDataType) => Promise<AppData> | undefined;
  patchAppData: (payload: PatchAppDataType) => void;
  deleteAppData: (payload: DeleteAppDataType) => void;
  appData: List<AppDataRecord>;
};

const defaultContextValue = {
  postAppData: () => null,
  postAppDataAsync: () => undefined,
  patchAppData: () => null,
  deleteAppData: () => null,
  appData: List([]),
};

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

type Props = {
  children: JSX.Element;
};

export const AppDataProvider = ({ children }: Props): JSX.Element => {
  const { data: appData, isLoading } = hooks.useAppData();

  const { mutate: postAppData, mutateAsync: postAppDataAsync } = useMutation<
    AppData,
    unknown,
    PostAppDataType
  >(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation<
    unknown,
    unknown,
    PatchAppDataType
  >(MUTATION_KEYS.PATCH_APP_DATA);
  const { mutate: deleteAppData } = useMutation<
    unknown,
    unknown,
    DeleteAppDataType
  >(MUTATION_KEYS.DELETE_APP_DATA);

  const contextValue = useMemo(
    () => ({
      patchAppData,
      postAppData,
      postAppDataAsync,
      deleteAppData,
      appData: appData || List<AppDataRecord>([]),
    }),
    [patchAppData, postAppData, postAppDataAsync, deleteAppData, appData],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = (): AppDataContextType =>
  React.useContext<AppDataContextType>(AppDataContext);
