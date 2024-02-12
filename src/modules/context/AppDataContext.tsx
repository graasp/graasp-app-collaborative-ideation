import React, { createContext, useMemo } from 'react';

import { Data } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import {
  QUERY_KEYS,
  hooks,
  mutations,
  queryClient,
} from '../../config/queryClient';
import Loader from '../common/Loader';

type PostAppDataType = {
  data: Data;
  type: string;
  visibility?: AppData<Data>['visibility'];
  memberId?: string;
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
  postAppDataAsync: (payload: PostAppDataType) => Promise<AppData<Data> | void>;
  patchAppData: (payload: PatchAppDataType) => void;
  patchAppDataAsync: (
    payload: PatchAppDataType,
  ) => Promise<AppData<Data> | void>;
  deleteAppData: (payload: DeleteAppDataType) => void;
  deleteAppDataAsync: (
    payload: DeleteAppDataType,
  ) => Promise<AppData<Data> | void>;
  appData: AppData<Data>[];
  isSuccess: boolean;
  isLoading: boolean;
  invalidateAppData: () => Promise<void>;
};

const defaultContextValue = {
  postAppData: () => null,
  postAppDataAsync: () => Promise.resolve(),
  patchAppData: () => null,
  patchAppDataAsync: () => Promise.resolve(),
  deleteAppData: () => null,
  deleteAppDataAsync: () => Promise.resolve(),
  appData: [],
  isSuccess: false,
  isLoading: true,
  invalidateAppData: () => Promise.resolve(),
};

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

type Props = {
  children: JSX.Element;
};

export const AppDataProvider = ({ children }: Props): JSX.Element => {
  const { data: appData, isLoading, isSuccess } = hooks.useAppData();
  const invalidateAppData = useMemo(
    () => () => queryClient.invalidateQueries(QUERY_KEYS.appDataKeys.all),
    [],
  );

  const { mutate: postAppData, mutateAsync: postAppDataAsync } =
    mutations.usePostAppData();
  const { mutate: patchAppData, mutateAsync: patchAppDataAsync } =
    mutations.usePatchAppData();
  const { mutate: deleteAppData, mutateAsync: deleteAppDataAsync } =
    mutations.useDeleteAppData();

  const contextValue = useMemo(
    () => ({
      patchAppData,
      patchAppDataAsync,
      postAppData,
      postAppDataAsync,
      deleteAppData,
      deleteAppDataAsync,
      appData: appData || [],
      isSuccess,
      isLoading,
      invalidateAppData,
    }),
    [
      patchAppData,
      patchAppDataAsync,
      postAppData,
      postAppDataAsync,
      deleteAppData,
      deleteAppDataAsync,
      appData,
      isSuccess,
      isLoading,
      invalidateAppData,
    ],
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
