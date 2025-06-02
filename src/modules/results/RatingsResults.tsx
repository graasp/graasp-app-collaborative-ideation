import { FC } from 'react';

import Stack from '@mui/material/Stack';

import Response from '@/modules/common/response/Response';

import ExportResponsesButton from '../common/ExportRepsonsesButton';
import ResponsesGridContainer, {
  ResponseGridItem,
} from '../common/ResponsesGrid';
import { useActivityContext } from '../context/ActivityContext';

type RatingsResultsProps = unknown;

const RatingsResults: FC<RatingsResultsProps> = () => {
  const { allResponses } = useActivityContext();

  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <ResponsesGridContainer>
        {allResponses.map((response) => (
          <ResponseGridItem key={response.id}>
            <Response response={response} showRatings />
          </ResponseGridItem>
        ))}
      </ResponsesGridContainer>
      <ExportResponsesButton responses={allResponses} />
    </Stack>
  );
};

export default RatingsResults;
