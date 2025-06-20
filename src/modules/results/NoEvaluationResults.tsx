import { FC } from 'react';

import Stack from '@mui/material/Stack';

import Response from '@/modules/common/response/Response';

import ExportResponsesButton from '../common/ExportRepsonsesButton';
import ResponsesGridContainer, {
  ResponseGridItem,
} from '../common/ResponsesGrid';
import { useActivityContext } from '../context/ActivityContext';

type NoEvaluationResultsProps = unknown;

const NoEvaluationResults: FC<NoEvaluationResultsProps> = () => {
  const { allResponses } = useActivityContext();
  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <ResponsesGridContainer>
        {allResponses ? (
          allResponses.map((response) => (
            <ResponseGridItem key={response.id}>
              <Response response={response} />
            </ResponseGridItem>
          ))
        ) : (
          // TODO: translate and improve this message
          <p>Nothing to show.</p>
        )}
      </ResponsesGridContainer>
      <ExportResponsesButton responses={allResponses} />
    </Stack>
  );
};

export default NoEvaluationResults;
