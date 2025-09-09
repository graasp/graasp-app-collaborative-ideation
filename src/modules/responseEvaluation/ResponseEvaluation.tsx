import { FC, JSX } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { RESPONSE_EVALUATION_VIEW_CY } from '@/config/selectors';
import { EvaluationType } from '@/interfaces/evaluation';
import Pausable from '@/modules/common/Pausable';
import { useThreadsContext } from '@/state/ThreadsContext';
import useActivityState from '@/state/useActivityState';

import Instructions from '../common/Instructions';
import ThreadsGridContainer, { ThreadsGridItem } from '../common/ThreadsGrid';
import Thread from '../common/response/Thread';
import { useAppDataContext } from '../context/AppDataContext';
import { RatingsProvider } from '../context/RatingsContext';
import { VoteProvider } from '../context/VoteContext';
import VoteToolbar from './VoteToolbar';

const ResponseEvaluation: FC = () => {
  const { t } = useTranslation();
  const { allThreads } = useThreadsContext();
  const { currentStep } = useActivityState();
  const evaluationType = currentStep?.evaluationType;
  const evaluationParameters = currentStep?.evaluationParameters ?? {};

  const { invalidateAppData } = useAppDataContext();

  const renderPlaceHolderForNoResponses = (): JSX.Element => (
    <>
      <Alert sx={{ m: 1 }} severity="info">
        {t('NO_IDEAS_TO_SHOW_TEXT')}
      </Alert>
      <Button onClick={() => invalidateAppData()}>
        {t('CHECK_FOR_NEW_RESPONSES')}
      </Button>
    </>
  );

  const renderEvaluationContext = (children: JSX.Element): JSX.Element => {
    switch (evaluationType) {
      case EvaluationType.Vote:
        return (
          <VoteProvider evaluationParameters={evaluationParameters}>
            {children}
          </VoteProvider>
        );
      case EvaluationType.Rate:
        return (
          <RatingsProvider evaluationParameters={evaluationParameters}>
            {children}
          </RatingsProvider>
        );
      default:
        return children;
    }
  };

  const renderEvaluationToolbar = (): JSX.Element | null => {
    switch (evaluationType) {
      case EvaluationType.Vote:
        return <VoteToolbar />;
      default:
        return null;
    }
  };

  return (
    <Pausable>
      <Container data-cy={RESPONSE_EVALUATION_VIEW_CY}>
        {renderEvaluationContext(
          <>
            <Instructions />
            {renderEvaluationToolbar()}
            <ThreadsGridContainer>
              {allThreads
                ? allThreads.map((thread) => (
                    <ThreadsGridItem key={thread.id}>
                      <Thread
                        key={thread.id}
                        thread={thread}
                        evaluationType={evaluationType}
                      />
                    </ThreadsGridItem>
                  ))
                : renderPlaceHolderForNoResponses()}
            </ThreadsGridContainer>
          </>,
        )}
      </Container>
    </Pausable>
  );
};

export default ResponseEvaluation;
