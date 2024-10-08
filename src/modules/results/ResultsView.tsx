import Container from '@mui/material/Container';

import { DEFAULT_EVALUATION_TYPE } from '@/config/constants';
import { RESPONSE_RESULTS_VIEW_CY } from '@/config/selectors';
import useSteps from '@/hooks/useSteps';
import { EvaluationType } from '@/interfaces/evaluation';

import Instructions from '../common/Instructions';
import Pausable from '../common/Pausable';
import { RatingsProvider } from '../context/RatingsContext';
import { VoteProvider } from '../context/VoteContext';
import NoEvaluationResults from './NoEvaluationResults';
import VoteResults from './VoteResults';

type ResultsViewProps = unknown;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResultsView = (props: ResultsViewProps): JSX.Element => {
  const { currentStep } = useSteps();
  const resultsType = currentStep?.resultsType ?? DEFAULT_EVALUATION_TYPE;

  const renderResultsContext = (): JSX.Element | null => {
    switch (resultsType) {
      case EvaluationType.Vote:
        return (
          <VoteProvider>
            <VoteResults />
          </VoteProvider>
        );
      case EvaluationType.Rate:
        return (
          <RatingsProvider>
            <p>Nothing.</p>
          </RatingsProvider>
        );
      default:
        return <NoEvaluationResults />;
    }
  };

  return (
    <Pausable>
      <Container data-cy={RESPONSE_RESULTS_VIEW_CY}>
        <Instructions />
        {renderResultsContext()}
      </Container>
    </Pausable>
  );
};

export default ResultsView;
