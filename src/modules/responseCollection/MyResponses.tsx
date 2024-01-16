import { FC } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useLocalContext } from '@graasp/apps-query-client';

import useResponses from '@/hooks/useResponses';
import Response from '@/modules/common/response/Response';

const MyResponses: FC = () => {
  const { memberId } = useLocalContext();
  const { myResponses } = useResponses();
  if (memberId) {
    return (
      <>
        <Typography sx={{ fontSize: '18pt' }} variant="h4">
          My responses
        </Typography>
        <Grid container spacing={2}>
          {myResponses ? (
            myResponses.map((response) => (
              <Grid key={response.id} item xl={6} sm={6} xs={12}>
                <Response
                  key={response.id}
                  response={response.data}
                  responseId={response.id}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1">
              You have not submitted any response yet.
            </Typography>
          )}
        </Grid>
      </>
    );
  }
  return null;
};

export default MyResponses;
