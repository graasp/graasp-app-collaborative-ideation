import { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { RESPONSE_EVALUATION_VIEW_CY } from '@/config/selectors';
import Pausable from '@/modules/common/Pausable';
import Response from '@/modules/common/response/Response';

import Loader from '../common/Loader';
import { useActivityContext } from '../context/ActivityContext';
import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';

const ResponseEvaluation: FC = () => {
  const { t } = useTranslation();
  const { myResponsesSets } = useActivityContext();
  const { evaluation } = useSettings();
  const responses = useMemo(
    () => myResponsesSets.flatMap((set) => set.data.responses),
    [myResponsesSets],
  );

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
          {t('CHECK_FOR_NEW_IDEAS')}
        </Button>
      </>
    );
  };

  return (
    <Pausable>
      <Container data-cy={RESPONSE_EVALUATION_VIEW_CY}>
        {t('RESPONSE_EVALUATION.TITLE')}
        <Grid container spacing={2}>
          {responses
            ? responses.map((response) => (
                <Grid item key={response.id} md={6} sm={12} xs={12}>
                  <Response
                    key={response.id}
                    response={response}
                    responseId={response.id}
                    evaluationType={evaluation.type}
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
