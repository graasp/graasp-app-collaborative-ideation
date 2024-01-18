import React, { createContext, useMemo } from 'react';

import { AppData } from '@graasp/sdk';

import {
  QUERY_KEYS,
  hooks,
  mutations,
  queryClient,
} from '../../config/queryClient';
import Loader from '../common/Loader';

type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
  visibility?: AppData['visibility'];
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
  postAppDataAsync: (payload: PostAppDataType) => Promise<AppData> | undefined;
  patchAppData: (payload: PatchAppDataType) => void;
  deleteAppData: (payload: DeleteAppDataType) => void;
  appData: AppData[];
  isSuccess: boolean;
  isLoading: boolean;
  invalidateAppData: () => Promise<void>;
};

const defaultContextValue = {
  postAppData: () => null,
  postAppDataAsync: () => undefined,
  patchAppData: () => null,
  deleteAppData: () => null,
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
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  const contextValue = useMemo(
    () => ({
      patchAppData,
      postAppData,
      postAppDataAsync,
      deleteAppData,
      appData: appData || [],
      isSuccess,
      isLoading,
      invalidateAppData,
    }),
    [
      patchAppData,
      postAppData,
      postAppDataAsync,
      deleteAppData,
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
