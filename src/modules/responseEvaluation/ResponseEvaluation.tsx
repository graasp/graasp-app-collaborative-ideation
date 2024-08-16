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
// import { EvaluationType } from '@/interfaces/evaluation';
// import useSteps from '@/hooks/useSteps';
import { useActivityContext } from '../context/ActivityContext';
import { useAppDataContext } from '../context/AppDataContext';
import Instructions from '../common/Instructions';

const ResponseEvaluation: FC = () => {
  const { t } = useTranslation();
  const { availableResponses } = useActivityContext();
  // const { currentStep } = useSteps();
  // const evaluationType = currentStep?.evaluationType ?? EvaluationType.None;
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

  return (
    <Pausable>
      <Container data-cy={RESPONSE_EVALUATION_VIEW_CY}>
        <Instructions />
        <Grid container spacing={2}>
          {responses
            ? responses.map((response) => (
                <Grid item key={response.id} md={6} sm={12} xs={12}>
                  <Response
                    key={response.id}
                    response={response}
                    // evaluationType={evaluationType}
                  />
                </Grid>
              ))
            : renderPlaceHolderForNoResponses()}
        </Grid>
      </Container>
    </Pausable>
  );
};

export default ResponseEvaluation;
