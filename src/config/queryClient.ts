import {
  buildMockLocalContext,
  buildMockParentWindow,
  configureQueryClient,
} from '@graasp/apps-query-client';

import { mockContext } from '@/mocks/db';

import { API_HOST, GRAASP_APP_KEY, MOCK_API, WS_HOST } from './env';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  QUERY_KEYS,
} = configureQueryClient({
  notifier: (data) => {
    // eslint-disable-next-line no-console
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY,
  targetWindow: MOCK_API
    ? // build mock parent window given cypress (app) context or mock data
      (buildMockParentWindow(
        buildMockLocalContext(window.Cypress ? window.appContext : mockContext),
      ) as Window)
    : window.parent,
  enableWebsocket: Boolean(WS_HOST),
  WS_HOST,
  API_HOST, // Technically, this is useless as the API_HOST is given by the parent window
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  QUERY_KEYS,
};
