import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Response from '@/modules/common/response/Response';
import { RESULTS_VIEW_CY } from '@/config/selectors';
import Instructions from '../common/Instructions';
import { useActivityContext } from '../context/ActivityContext';
import Pausable from '../common/Pausable';

interface ResultsViewProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResultsView = (props: ResultsViewProps): JSX.Element => {
  const { allResponses } = useActivityContext();
  return (
    <Pausable>
      <Container data-cy={RESULTS_VIEW_CY}>
        <Instructions />
        <Grid container spacing={2}>
          {allResponses
            ? allResponses.map((response) => (
                <Grid item key={response.id} md={6} sm={12} xs={12}>
                  <Response key={response.id} response={response} />
                </Grid>
              ))
            : ''}
          {/* : renderPlaceHolderForNoResponses()} */}
        </Grid>
      </Container>
    </Pausable>
  );
};

export default ResultsView;
