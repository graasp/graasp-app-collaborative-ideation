import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { RESPONSE_EVALUATION_VIEW_CY } from '@/config/selectors';
import Pausable from '@/modules/common/Pausable';
import Response from '@/modules/common/response/Response';

import { Loader } from '@graasp/ui';
import useSteps from '@/hooks/useSteps';
import { EvaluationType } from '@/interfaces/evaluation';
import { useActivityContext } from '../context/ActivityContext';
import { useAppDataContext } from '../context/AppDataContext';
import Instructions from '../common/Instructions';
import { VoteProvider } from '../context/VoteContext';
import VoteToolbar from './VoteToolbar';
import { RatingsProvider } from '../context/RatingsContext';

const ResponseEvaluation: FC = () => {
  const { t } = useTranslation();
  const { availableResponses } = useActivityContext();
  const { currentStep } = useSteps();
  const evaluationType = currentStep?.evaluationType;
  const evaluationParameters = currentStep?.evaluationParameters ?? {};
  const responses = availableResponses;

  const { invalidateAppData, isLoading } = useAppDataContext();

  const renderPlaceHolderForNoResponses = (): ReactNode => {
    if (isLoading) {
      return <Loader />;
    }
    return (
      <>
        <Alert sx={{ m: 1 }} severity="info">
          {t('NO_IDEAS_TO_SHOW_TEXT')}
        </Alert>
        <Button onClick={() => invalidateAppData()}>
          {t('CHECK_FOR_NEW_RESPONSES')}
        </Button>
      </>
    );
  };

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
            <Grid container spacing={2}>
              {responses
                ? responses.map((response) => (
                    <Grid item key={response.id} md={6} sm={12} xs={12}>
                      <Response
                        key={response.id}
                        response={response}
                        evaluationType={evaluationType}
                      />
                    </Grid>
                  ))
                : renderPlaceHolderForNoResponses()}
            </Grid>
          </>,
        )}
      </Container>
    </Pausable>
  );
};

export default ResponseEvaluation;
