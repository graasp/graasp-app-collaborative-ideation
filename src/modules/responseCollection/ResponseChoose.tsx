import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { ResponseAppData } from '@/config/appDataTypes';
import { PROPOSE_NEW_RESPONSE_BTN } from '@/config/selectors';
import Response from '@/modules/common/response/Response';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import Loader from '../common/Loader';
import { useSettings } from '../context/SettingsContext';

interface ResponseChooseProps {
  responses: ResponseAppData[];
  onChoose: (id?: string) => void;
}

const ResponseChoose: FC<ResponseChooseProps> = ({ responses, onChoose }) => {
  const { t } = useTranslation();
  const { isLoading, invalidateAppData, deleteAppData } = useAppDataContext();
  const { instructions } = useSettings();
  const chooseInstructions = useMemo(
    () =>
      typeof instructions?.collection?.choose !== 'undefined' &&
      instructions.collection.choose.content.length > 0 &&
      instructions.collection.choose,
    [instructions],
  );

  const handleChoose = (id?: string): void => {
    onChoose(id);
  };

  const renderPlaceHolderForNoIdeas = (): JSX.Element => {
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
    <>
      {chooseInstructions && (
        <Alert severity="info">{chooseInstructions.content}</Alert>
      )}
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleChoose()}
        data-cy={PROPOSE_NEW_RESPONSE_BTN}
      >
        {t('PROPOSE_NEW_RESPONSE')}
      </Button>
      <Grid container spacing={2}>
        {responses
          ? responses.map((response) => (
              <Grid key={response.id} item xl={6} lg={6} xs={12}>
                <Response
                  key={response.id}
                  response={response}
                  onSelect={handleChoose}
                  onDelete={() => deleteAppData({ id: response.id })}
                />
              </Grid>
            ))
          : renderPlaceHolderForNoIdeas()}
      </Grid>
    </>
  );
};

export default ResponseChoose;
