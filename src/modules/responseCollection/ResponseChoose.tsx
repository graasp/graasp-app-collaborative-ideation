import { FC, JSX, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { PROPOSE_NEW_RESPONSE_BTN_CY } from '@/config/selectors';
import { Threads } from '@/interfaces/threads';
import Thread from '@/modules/common/response/Thread';

import Loader from '../common/Loader';
import ThreadsGridContainer, { ThreadsGridItem } from '../common/ThreadsGrid';
import { useSettings } from '../context/SettingsContext';

interface ResponseChooseProps {
  threads: Threads;
  onChoose: (id?: string) => void;
}

const ResponseChoose: FC<ResponseChooseProps> = ({ threads, onChoose }) => {
  const { t } = useTranslation();

  // const [highlightId, setHighlightId] = useState<string>();
  // const highlightTimeout = useRef<NodeJS.Timeout>(undefined);

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
      <ThreadsGridContainer>
        {threads
          ? threads.map((thread) => (
              <ThreadsGridItem key={thread.id}>
                <Thread
                  key={thread.id}
                  thread={thread}
                  onSelect={handleChoose}
                  // highlight={highlightId === thread.id}
                  // onParentIdeaClick={(id: string) => {
                  //   setHighlightId(id);
                  //   highlightTimeout.current = setTimeout(() => {
                  //     setHighlightId(undefined);
                  //     if (highlightTimeout?.current) {
                  //       clearTimeout(highlightTimeout.current);
                  //     }
                  //   }, HIGHLIGHT_RESPONSE_TIME_MS);
                  // }}
                />
              </ThreadsGridItem>
            ))
          : renderPlaceHolderForNoIdeas()}
      </ThreadsGridContainer>
    </>
  );
};

export default ResponseChoose;
