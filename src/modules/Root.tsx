import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';

import { CssBaseline, ThemeProvider, createTheme, styled } from '@mui/material';
import { grey, orange, pink } from '@mui/material/colors';
import { StyledEngineProvider } from '@mui/material/styles';

import { withContext, withToken } from '@graasp/apps-query-client';

import Loader from '@/modules/common/Loader';

import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import App from './main/App';

// declare the module to enable theme modification
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: { background: string; color: string };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: { background: string; color: string };
    };
  }

  interface PaletteOptions {
    default: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      light: '#5091d2',
      main: '#5050d2',
    },
    secondary: {
      main: '#d250d2',
    },
    default: grey['500'],
    background: {
      paper: '#fff',
    },
  },
  status: {
    danger: {
      background: orange['400'],
      color: '#fff',
    },
  },
});

const RootDiv = styled('div')({
  flexGrow: 1,
  height: '100%',
  width: '100%',
});

const Root: FC = () => {
  const AppWithContext = withToken(App, {
    LoadingComponent: <Loader />,
    useAuthToken: hooks.useAuthToken,
    onError:
      /* istanbul ignore next */
      () => {
        // eslint-disable-next-line no-console
        console.error('An error occurred while requesting the token.');
      },
  });
  const AppWithContextAndToken = withContext(AppWithContext, {
    LoadingComponent: <Loader />,
    useGetLocalContext: hooks.useGetLocalContext,
    useAutoResize: hooks.useAutoResize,
    onError:
      /* istanbul ignore next */
      () => {
        // eslint-disable-next-line no-console
        console.error('An error occurred while fetching the context.');
      },
  });
  return (
    <RootDiv>
      {/* Used to define the order of injected properties between JSS and emotion */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <I18nextProvider i18n={i18nConfig}>
            <QueryClientProvider client={queryClient}>
              <AppWithContextAndToken />
              {import.meta.env.MODE === 'development' && (
                <ReactQueryDevtools position="bottom-left" />
              )}
            </QueryClientProvider>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </RootDiv>
  );
};

export default Root;
