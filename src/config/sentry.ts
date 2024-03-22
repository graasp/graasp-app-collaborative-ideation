import { SENTRY_DSN, SENTRY_ENV, VERSION } from './env';

type SentryConfigType = {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  release: string;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
};

export const generateSentryConfig = (): SentryConfigType => {
  let SENTRY_ENVIRONMENT = SENTRY_ENV || 'development';
  let SENTRY_TRACE_SAMPLE_RATE = 1.0;
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  let SENTRY_REPLAY_SAMPLE_RATE = 0.1;
  switch (process.env.NODE_ENV) {
    case 'production':
      SENTRY_ENVIRONMENT = 'production';
      SENTRY_TRACE_SAMPLE_RATE = 0.1;
      SENTRY_REPLAY_SAMPLE_RATE = 0.1;
      break;
    case 'test':
      SENTRY_TRACE_SAMPLE_RATE = 0.0;
      SENTRY_REPLAY_SAMPLE_RATE = 0.0;
      break;
    case 'development':
      SENTRY_TRACE_SAMPLE_RATE = 1.0;
      SENTRY_REPLAY_SAMPLE_RATE = 1.0;
      break;
    default:
  }

  return {
    // dsn is set only when not running inside cypress
    dsn: (!window.Cypress && SENTRY_DSN) || '',
    environment: SENTRY_ENV || SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
    // release is set only when building for production
    release: SENTRY_ENVIRONMENT === 'production' ? VERSION : '',

    replaysSessionSampleRate: SENTRY_REPLAY_SAMPLE_RATE,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
  };
};
