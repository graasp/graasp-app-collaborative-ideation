import { FC } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Response from '@/modules/common/response/Response';

import { useAppStateWorkerContext } from '../appStateWorker/AppStateContext';

type RatingsResultsProps = unknown;

const RatingsResults: FC<RatingsResultsProps> = () => {
  const { responses } = useAppStateWorkerContext();
  const { allResponses } = responses;

  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <Grid container spacing={2}>
        {allResponses.map((response) => (
          <Grid item key={response.id} xl={2} sm={4} xs={6}>
            <Response response={response} showRatings />
          </Grid>
        ))}
      </Grid>
      {/* <ExportResponsesButton responses={allResponses} /> */}
    </Stack>
  );
};

export default RatingsResults;
