import { FC } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Response from '@/modules/common/response/Response';

import ExportResponsesButton from '../common/ExportRepsonsesButton';
import { useResponses } from '../context/ResponsesContext';

type NoEvaluationResultsProps = unknown;

const NoEvaluationResults: FC<NoEvaluationResultsProps> = () => {
  const { allResponses } = useResponses();
  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <Grid container spacing={2}>
        {allResponses
          ? allResponses.map((response) => (
              <Grid item key={response.id} xl={2} sm={4} xs={6}>
                <Response response={response} />
              </Grid>
            ))
          : ''}
      </Grid>
      <ExportResponsesButton responses={allResponses} />
    </Stack>
  );
};

export default NoEvaluationResults;
