import { configureQueryClient } from '@graasp/apps-query-client';
import { ReactQueryDevtools as ReactQueryDevtoolsComponent } from '@tanstack/react-query-devtools';

import notifier from '@/utils/notifier';

import { API_HOST, GRAASP_APP_KEY, MOCK_API, WS_HOST } from './env';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  API_ROUTES,
  mutations,
  ReactQueryDevtools: rqdt,
  QUERY_KEYS,
}: {
  queryClient: ReturnType<typeof configureQueryClient>['queryClient'];
  QueryClientProvider: ReturnType<typeof configureQueryClient>['QueryClientProvider'];
  hooks: ReturnType<typeof configureQueryClient>['hooks'];
  API_ROUTES: ReturnType<typeof configureQueryClient>['API_ROUTES'];
  mutations: ReturnType<typeof configureQueryClient>['mutations'];
  ReactQueryDevtools: typeof ReactQueryDevtoolsComponent;
  QUERY_KEYS: ReturnType<typeof configureQueryClient>['QUERY_KEYS'];
} = configureQueryClient({
  API_HOST,
  notifier,
  refetchOnWindowFocus: !import.meta.env.DEV,
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY,
  isStandalone: MOCK_API,
  WS_HOST,
  enableWebsocket: false,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  mutations,
  API_ROUTES,
  QUERY_KEYS,
};

export const ReactQueryDevtools: typeof ReactQueryDevtoolsComponent = rqdt;
