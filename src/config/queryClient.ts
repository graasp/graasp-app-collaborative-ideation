import { configureQueryClient } from '@graasp/apps-query-client';

import notifier from '@/utils/notifier';

import { API_HOST, GRAASP_APP_KEY, MOCK_API } from './env';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  API_ROUTES,
  mutations,
  ReactQueryDevtools,
  QUERY_KEYS,
} = configureQueryClient({
  API_HOST,
  notifier,
  refetchOnWindowFocus: !import.meta.env.DEV,
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY,
  isStandalone: MOCK_API,
});

export {
  ReactQueryDevtools,
  queryClient,
  QueryClientProvider,
  hooks,
  mutations,
  API_ROUTES,
  QUERY_KEYS,
};
