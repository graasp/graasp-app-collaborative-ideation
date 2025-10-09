import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import { WAITING_TIME_FEEDBACK_GENERATION_S } from '@/config/constants';
import useFeedback from '@/hooks/feedback/useFeedback';
import { ResponseData } from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';
import { useLoroContext } from '@/state/LoroContext';
import { FEEDBACK_PROCESSING_IDS_KEY } from '@/state/TmpState';

const LINEAR_PROGRESS_PERIOD_MS = 200;
const LINEAR_PROGRESS_INCREMENT =
  (100 * LINEAR_PROGRESS_PERIOD_MS) /
  (1000 * WAITING_TIME_FEEDBACK_GENERATION_S);

const FeedbackButton: FC<{ response: ResponseData; thread: Thread }> = ({
  response,
  thread,
}) => {
  const { t } = useTranslation('translations', { keyPrefix: 'RESPONSE_CARD' });
  const { generateFeedback } = useFeedback();
  const { tmpState } = useLoroContext();

  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorGettingFeedback, setErrorGettingFeedback] = useState(false);
  const timer = useRef<NodeJS.Timeout>(null);

  const startLinearProgress = (): void => {
    timer.current = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
          }
          setErrorGettingFeedback(true);
          return 100;
        }
        return oldProgress + LINEAR_PROGRESS_INCREMENT;
      });
    }, LINEAR_PROGRESS_PERIOD_MS);
  };

  useEffect(() => {
    const unsubscribe = tmpState.subscribe(() => {
      const processingIds = tmpState.get(FEEDBACK_PROCESSING_IDS_KEY);

      if (Array.isArray(processingIds)) {
        setIsBeingProcessed(processingIds.includes(response.id));
      }
    });
    return () => unsubscribe();
  }, [isBeingProcessed, response.id, tmpState]);

  const handleFeedback = (): void => {
    startLinearProgress();
    generateFeedback(response as ResponseData, thread);
    const processingIds = tmpState.get(FEEDBACK_PROCESSING_IDS_KEY);
    if (Array.isArray(processingIds)) {
      tmpState.set(FEEDBACK_PROCESSING_IDS_KEY, [
        ...processingIds,
        response.id,
      ]);
    } else {
      tmpState.set(FEEDBACK_PROCESSING_IDS_KEY, [response.id]);
    }
  };

  return isBeingProcessed ? (
    <>
      {timer.current ? (
        <LinearProgress variant="determinate" value={progress} />
      ) : (
        <LinearProgress variant="indeterminate" />
      )}
      {errorGettingFeedback && (
        <Alert severity="error">{t('ERROR_GETTING_FEEDBACK')}</Alert>
      )}
    </>
  ) : (
    <Button
      size="small"
      onClick={handleFeedback}
      disabled={isBeingProcessed}
      loading={isBeingProcessed}
    >
      {t('GET_FEEDBACK')}
    </Button>
  );
};

export default FeedbackButton;
