import { FC, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WarningIcon from '@mui/icons-material/WarningAmber';

interface ErrorFallbackProps {
  error: Error;
  componentStack: string;
  eventId: string;
  // resetError(): void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  componentStack,
  eventId /* , resetError */,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ERROR_BOUNDARY.FALLBACK',
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const theme = useTheme();

  const sendUserFeedback = (): void => {
    const userFeedback = {
      event_id: eventId,
      name,
      email,
      comments: comment,
    };
    Sentry.captureUserFeedback(userFeedback);
    setFeedbackGiven(true);
  };
  return (
    <Container>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={2}>
            <WarningIcon sx={{ color: theme.palette.error.main }} />
            <Typography variant="h2" color={theme.palette.error.dark}>
              {t('MESSAGE_TITLE')}
            </Typography>
          </Stack>
          {feedbackGiven ? (
            <Alert severity="success">{t('THANKS_FOR_FEEDBACK')}</Alert>
          ) : (
            <Box id="user-feedback">
              <Stack direction="column" spacing={1} maxWidth="82rem">
                <Typography variant="body1">{t('MESSAGE_FEEDBACK')}</Typography>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label={t('NAME_LABEL')}
                  helperText={t('NAME_HELPER')}
                />
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label={t('EMAIL_LABEL')}
                  helperText={t('EMAIL_HELPER')}
                />
                <TextField
                  multiline
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  label={t('COMMENT_LABEL')}
                  helperText={t('COMMENT_HELPER')}
                />
                <Box>
                  <Button startIcon={<SendIcon />} onClick={sendUserFeedback}>
                    {t('SEND')}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="error-details"
              id="error-details"
            >
              {t('ERROR_DETAILS')}
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">{error.toString()}</Typography>
              <Typography variant="caption">{componentStack}</Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Paper>
    </Container>
  );
};

const ErrorBoundary: FC<{ children?: ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    // fallback={({ error, componentStack, eventId }) => (
    //   <ErrorFallback
    //     error={error}
    //     componentStack={componentStack}
    //     eventId={eventId}
    //   />
    // )}
    // eslint-disable-next-line react/no-unstable-nested-components
    fallback={({ error, componentStack, eventId }) => (
      <ErrorFallback
        error={error}
        componentStack={componentStack}
        eventId={eventId}
      />
    )}
  >
    {children}
  </Sentry.ErrorBoundary>
);

export default ErrorBoundary;
