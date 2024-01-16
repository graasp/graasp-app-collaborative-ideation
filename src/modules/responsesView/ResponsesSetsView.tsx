import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import useResponses from '@/hooks/useResponses';

const ResponsesSetsView = (): JSX.Element => {
  const { allResponsesSets } = useResponses();

  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        Tadaam!
      </Grid>
      {allResponsesSets.map((responsesSet) => (
        <Grid key={responsesSet.id} item md={6}>
          <Paper>
            {responsesSet.data.responses.map((response) => (
              <Typography key={response.id}>{response.response}</Typography>
            ))}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsesSetsView;
