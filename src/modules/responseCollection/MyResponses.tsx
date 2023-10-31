import { FC } from 'react';

import { Grid, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import Response from '@/modules/common/response/Response';
import { getMyResponses } from '@/utils/responses';

import { useAppDataContext } from '../context/AppDataContext';

const MyResponses: FC = () => {
  const { memberId } = useLocalContext();
  const { appData } = useAppDataContext();
  if (memberId) {
    const myResponses = getMyResponses(appData, memberId);
    return (
      <>
        <Typography sx={{ fontSize: '18pt' }} variant="h4">
          My responses
        </Typography>
        <Grid container spacing={2}>
          {myResponses ? (
            myResponses.map((response) => (
              <Grid key={response.id} item md={4} sm={6} xs={12}>
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
