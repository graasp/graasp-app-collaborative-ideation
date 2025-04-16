import Container from '@mui/material/Container';

import { DEFAULT_EVALUATION_TYPE } from '@/config/constants';
import { RESPONSE_RESULTS_VIEW_CY } from '@/config/selectors';
import { EvaluationType } from '@/interfaces/evaluation';

import { JSX } from 'react';
import useActivityState from '@/state/useActivityState';
import Instructions from '../common/Instructions';
import Pausable from '../common/Pausable';
import { RatingsProvider } from '../context/RatingsContext';
import { VoteProvider } from '../context/VoteContext';
import NoEvaluationResults from './NoEvaluationResults';
import RatingsResults from './RatingsResults';
import VoteResults from './VoteResults';

type ResultsViewProps = unknown;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResultsView = (props: ResultsViewProps): JSX.Element => {
  const { currentStep, previousStep } = useActivityState();
  const resultsType = currentStep?.resultsType ?? DEFAULT_EVALUATION_TYPE;
  /**
   * With this mechanism, bear in mind that the configuration of
   * the previous step is used to determine the evaluation parameters.
   * Therefore, one need to have the results step immediately after
   * the evaluation step.
   */
  const evaluationParameters = previousStep?.evaluationParameters;

  const renderResultsContext = (): JSX.Element | null => {
    switch (resultsType) {
      case EvaluationType.Vote:
        return (
          <VoteProvider>
            <VoteResults />
          </VoteProvider>
        );
      case EvaluationType.Rate:
        if (evaluationParameters) {
          return (
            <RatingsProvider evaluationParameters={evaluationParameters}>
              <RatingsResults />
            </RatingsProvider>
          );
        }
        return <NoEvaluationResults />;

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
