import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { useActivityContext } from '../context/ActivityContext';

const ResponsesSetsView = (): JSX.Element => {
  const { allResponsesSets } = useActivityContext();

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
