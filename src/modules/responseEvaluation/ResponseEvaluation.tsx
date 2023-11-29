import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { ResponsesData } from '@/config/appDataTypes';
import { RESPONSE_EVALUATION_VIEW_CY } from '@/config/selectors';
import Pausable from '@/modules/common/Pausable';
import Response from '@/modules/common/response/Response';
import { getAllVisibleResponses } from '@/utils/responses';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';

const ResponseEvaluation: FC = () => {
  const { t } = useTranslation();
  const [responses, setResponses] = useState<ResponsesData>([]);
  const { orchestrator } = useSettings();
  const { appData } = useAppDataContext();

  useEffect(() => {
    const r = getAllVisibleResponses(appData, orchestrator.id);
    if (r) {
      setResponses(r.data.responses);
    } else {
      setResponses([]);
    }
  }, [appData, orchestrator.id]);

  const handleChoose = (id: string): void => {
    throw new Error(`Function not implemented. Chose ${id}`);
  };
  const renderPlaceHolderForNoIdeas = (): ReactNode => {
    throw new Error('Function not implemented.');
  };

  return (
    <Pausable>
      <Container data-cy={RESPONSE_EVALUATION_VIEW_CY}>
        {t('RESPONSE_EVALUATION.TITLE')}
        <Grid container spacing={2}>
          {responses
            ? responses.map((response) => (
                <Grid key={response.id} md={4} sm={6} xs={12}>
                  <Response
                    key={response.id}
                    response={response}
                    responseId={response.id}
                    onSelect={handleChoose}
                  />
                </Grid>
              ))
            : renderPlaceHolderForNoIdeas()}
        </Grid>
      </Container>
    </Pausable>
  );
};

export default ResponseEvaluation;
