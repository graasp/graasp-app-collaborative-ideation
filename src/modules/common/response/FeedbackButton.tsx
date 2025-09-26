import { FC, useEffect, useState } from 'react';

import Button from '@mui/material/Button';

import useFeedback from '@/hooks/feedback/useFeedback';
import { ResponseData } from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';
import { useLoroContext } from '@/state/LoroContext';
import { FEEDBACK_PROCESSING_IDS_KEY } from '@/state/TmpState';

const FeedbackButton: FC<{ response: ResponseData; thread: Thread }> = ({
  response,
  thread,
}) => {
  const { generateFeedback } = useFeedback();
  const { tmpState } = useLoroContext();

  const [isBeingProcessed, setIsBeingProcessed] = useState(false);

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

  return (
    <Button
      size="small"
      onClick={handleFeedback}
      disabled={isBeingProcessed}
      loading={isBeingProcessed}
    >
      Get Feedback
    </Button>
  );
};

export default FeedbackButton;
