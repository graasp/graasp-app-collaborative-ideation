import { FC } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useLocalContext } from '@graasp/apps-query-client';

import Response from '@/modules/common/response/Response';

import { useActivityContext } from '../context/ActivityContext';

const MyResponses: FC = () => {
  const { accountId } = useLocalContext();
  const { myResponses, deleteResponse, round } = useActivityContext();

  const handleDelete = async (id: string): Promise<void> => deleteResponse(id);
  if (accountId) {
    return (
      <>
        <Typography sx={{ fontSize: '18pt' }} variant="h4">
          My responses
        </Typography>
        <Grid container spacing={2}>
          {myResponses ? (
            myResponses.map((response) => (
              <Grid key={response.id} item xl={2} sm={4} xs={6}>
                <Response
                  key={response.id}
                  response={response}
                  onDelete={
                    response.data.round === round ? handleDelete : undefined
                  }
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
