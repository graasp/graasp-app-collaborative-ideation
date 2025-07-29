import { FC, JSX, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { HIGHLIGHT_RESPONSE_TIME_MS } from '@/config/constants';
import { PROPOSE_NEW_RESPONSE_BTN_CY } from '@/config/selectors';
import { ResponseData } from '@/interfaces/response';
import Response from '@/modules/common/response/Response';
import { useResponsesContext } from '@/state/ResponsesContext';

import Loader from '../common/Loader';
import ResponsesGridContainer, {
  ResponseGridItem,
} from '../common/ResponsesGrid';
import { useSettings } from '../context/SettingsContext';

interface ResponseChooseProps {
  responses: ResponseData<undefined>[];
  onChoose: (id?: string) => void;
}

const ResponseChoose: FC<ResponseChooseProps> = ({ responses, onChoose }) => {
  const { t } = useTranslation();

  const [highlightId, setHighlightId] = useState<string>();
  const highlightTimeout = useRef<NodeJS.Timeout>(undefined);
  const { deleteResponseById } = useResponsesContext();

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

  const renderPlaceHolderForNoIdeas = (): JSX.Element => <Loader />;
  // if (isLoading) {
  //   return <Loader />;
  // }
  // return (
  //   <>
  //     <Alert sx={{ m: 1 }} severity="info">
  //       {t('NO_IDEAS_TO_SHOW_TEXT')}
  //     </Alert>
  //     <Button onClick={() => invalidateAppData()}>
  //       {t('CHECK_FOR_NEW_RESPONSES')}
  //     </Button>
  //   </>
  // );
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
      <ResponsesGridContainer>
        {responses
          ? responses.map((response) => (
              <ResponseGridItem key={response.id}>
                <Response
                  key={response.id}
                  response={response}
                  onSelect={handleChoose}
                  onDelete={() => deleteResponseById(response.id)}
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
              </ResponseGridItem>
            ))
          : renderPlaceHolderForNoIdeas()}
      </ResponsesGridContainer>
    </>
  );
};

export default ResponseChoose;
