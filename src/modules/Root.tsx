import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';

import { CssBaseline, ThemeProvider, createTheme, styled } from '@mui/material';
import { grey, orange } from '@mui/material/colors';
import { StyledEngineProvider } from '@mui/material/styles';

import {
  GraaspContextDevTool,
  WithLocalContext,
  WithTokenContext,
  useObjectState,
} from '@graasp/apps-query-client';

import { defaultMockContext, mockMembers } from '@/mocks/db';
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
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
  },
});

const RootDiv = styled('div')({
  flexGrow: 1,
  height: '100%',
  width: '100%',
});

const Root: FC = () => {
  const [mockContext, setMockContext] = useObjectState(defaultMockContext);

  return (
    <RootDiv>
      {/* Used to define the order of injected properties between JSS and emotion */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <I18nextProvider i18n={i18nConfig}>
            <QueryClientProvider client={queryClient}>
              <WithLocalContext
                defaultValue={window.Cypress ? window.appContext : mockContext}
                LoadingComponent={<Loader />}
                useGetLocalContext={hooks.useGetLocalContext}
                useAutoResize={hooks.useAutoResize}
                onError={() => {
                  // eslint-disable-next-line no-console
                  console.error(
                    'An error occurred while fetching the context.',
                  );
                }}
              >
                <WithTokenContext
                  LoadingComponent={<Loader />}
                  useAuthToken={hooks.useAuthToken}
                  onError={() => {
                    // eslint-disable-next-line no-console
                    console.error(
                      'An error occurred while requesting the token.',
                    );
                  }}
                >
                  <App />
                  {import.meta.env.DEV && (
                    <GraaspContextDevTool
                      members={mockMembers}
                      context={mockContext}
                      setContext={setMockContext}
                    />
                  )}
                </WithTokenContext>
              </WithLocalContext>
              {import.meta.env.DEV && (
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
