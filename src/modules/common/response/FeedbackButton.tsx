import { FC, useEffect, useState } from 'react';

import Button from '@mui/material/Button';

import useFeedback from '@/hooks/feedback/useFeedback';
import { ResponseData } from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';
import { useLoroContext } from '@/state/LoroContext';
import { FEEDBACK_PROCESSING_IDS_KEY } from '@/state/TmpState';

const FeedbackButton: FC<{ thread: Thread }> = ({ thread }) => {
  const { generateFeedback } = useFeedback();
  const { tmpState } = useLoroContext();

  const [isBeingProcessed, setIsBeingProcessed] = useState(false);

  const lastResponse = thread.responses[thread.responses.length - 1];

  useEffect(() => {
    const unsubscribe = tmpState.subscribe(() => {
      const processingIds = tmpState.get(FEEDBACK_PROCESSING_IDS_KEY);

      if (Array.isArray(processingIds)) {
        setIsBeingProcessed(processingIds.includes(lastResponse.id));
      }
    });
    return () => unsubscribe();
  }, [isBeingProcessed, lastResponse.id, tmpState]);

  const handleFeedback = (): void => {
    generateFeedback(lastResponse as ResponseData, thread);
    const processingIds = tmpState.get(FEEDBACK_PROCESSING_IDS_KEY);
    if (Array.isArray(processingIds)) {
      tmpState.set(FEEDBACK_PROCESSING_IDS_KEY, [
        ...processingIds,
        lastResponse.id,
      ]);
    } else {
      tmpState.set(FEEDBACK_PROCESSING_IDS_KEY, [lastResponse.id]);
    }
  };

  return (
    <Button
      onClick={handleFeedback}
      disabled={isBeingProcessed}
      loading={isBeingProcessed}
    >
      Get Feedback
    </Button>
  );
};

export default FeedbackButton;
