import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Loader } from '@graasp/ui';

import { HIGHLIGHT_RESPONSE_TIME_MS } from '@/config/constants';
import { PROPOSE_NEW_RESPONSE_BTN_CY } from '@/config/selectors';
import { ResponseData } from '@/interfaces/response';
import Response from '@/modules/common/response/Response';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import { useSettings } from '../context/SettingsContext';

interface ResponseChooseProps {
  responses: ResponseData<undefined>[];
  onChoose: (id?: string) => void;
}

const ResponseChoose: FC<ResponseChooseProps> = ({ responses, onChoose }) => {
  const { t } = useTranslation();

  const [highlightId, setHighlightId] = useState<string>();
  const highlightTimeout = useRef<NodeJS.Timeout>();

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
        data-cy={PROPOSE_NEW_RESPONSE_BTN_CY}
      >
        {t('PROPOSE_NEW_RESPONSE')}
      </Button>
      <Grid container spacing={2}>
        {responses
          ? responses.map((response) => (
              <Grid key={response.id} item xl={2} sm={4} xs={6}>
                <Response
                  key={response.id}
                  response={response}
                  onSelect={handleChoose}
                  onDelete={() => deleteAppData({ id: response.id })}
                  highlight={highlightId === response.id}
                  onParentIdeaClick={(id: string) => {
                    setHighlightId(id);
                    highlightTimeout.current = setTimeout(() => {
                      setHighlightId(undefined);
                      if (highlightTimeout?.current) {
                        clearTimeout(highlightTimeout.current);
                      }
                    }, HIGHLIGHT_RESPONSE_TIME_MS);
                  }}
                />
              </Grid>
            ))
          : renderPlaceHolderForNoIdeas()}
      </Grid>
    </>
  );
};

export default ResponseChoose;
