import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';

import { CssBaseline, ThemeProvider, createTheme, styled } from '@mui/material';
import { grey, orange, pink } from '@mui/material/colors';
import {
  StyledEngineProvider,
  responsiveFontSizes,
} from '@mui/material/styles';

import {
  GraaspContextDevTool,
  WithLocalContext,
  WithTokenContext,
  useObjectState,
} from '@graasp/apps-query-client';

import { defaultMockContext, mockMembers } from '@/mocks/db';
import { Loader } from '@graasp/ui';

import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import App from './main/App';
import ErrorBoundary from './ErrorBoundary';

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

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#5050d2',
      },
      secondary: pink,
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
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h2',
            h2: 'h3',
            h3: 'h4',
            h4: 'h5',
            h5: 'h6',
            h6: 'h6',
            subtitle1: 'h3',
            subtitle2: 'h3',
          },
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.8rem',
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
      },
      h3: {
        fontSize: '1.5rem',
      },
    },
  }),
);

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
            <ErrorBoundary>
              <QueryClientProvider client={queryClient}>
                <WithLocalContext
                  defaultValue={
                    window.Cypress ? window.appContext : mockContext
                  }
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
            </ErrorBoundary>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </RootDiv>
  );
};

export default Root;
