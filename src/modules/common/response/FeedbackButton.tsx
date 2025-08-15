import { FC } from 'react';

import Button from '@mui/material/Button';

import useAI from '@/hooks/useAI';
import { ResponseData, ResponseEvaluation } from '@/interfaces/response';

const FeedbackButton: FC<{ response: ResponseData<ResponseEvaluation> }> = ({
  response,
}) => {
  const { getFeedback } = useAI();

  return (
    <Button
      onClick={() => {
        getFeedback(response.id);
      }}
    >
      Get Feedback
    </Button>
  );
};

export default FeedbackButton;
