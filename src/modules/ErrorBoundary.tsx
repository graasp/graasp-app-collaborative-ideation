import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorFallback } from '@graasp/ui/apps';

import * as Sentry from '@sentry/react';

const ErrorBoundary: FC<{ children?: ReactNode }> = ({ children }) => {
  const { t: tFallback } = useTranslation('translations', {
    keyPrefix: 'ERROR_BOUNDARY.FALLBACK',
  });
  return (
    <Sentry.ErrorBoundary
      // eslint-disable-next-line react/no-unstable-nested-components
      fallback={({ error, componentStack, eventId }) => (
        <ErrorFallback
          error={error}
          componentStack={componentStack}
          eventId={eventId}
          captureFeedback={Sentry.captureFeedback}
          title={tFallback('MESSAGE_TITLE')}
          formTitle={tFallback('MESSAGE_FEEDBACK')}
          nameLabel={tFallback('NAME_LABEL')}
          nameHelper={tFallback('NAME_HELPER')}
          emailLabel={tFallback('EMAIL_LABEL')}
          emailHelper={tFallback('EMAIL_HELPER')}
          commentLabel={tFallback('COMMENT_LABEL')}
          commentHelper={tFallback('COMMENT_HELPER')}
          thanksMessage={tFallback('THANKS_FOR_FEEDBACK')}
          sendButtonLabel={tFallback('SEND')}
          errorDetailsLabel={tFallback('ERROR_DETAILS')}
        />
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
