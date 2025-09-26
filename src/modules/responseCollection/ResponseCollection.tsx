import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { RESPONSE_COLLECTION_VIEW_CY } from '@/config/selectors';
import { IdeationPhases } from '@/interfaces/activity_state';
import Instructions from '@/modules/common/Instructions';
import Pausable from '@/modules/common/Pausable';
import { useThreadsContext } from '@/state/ThreadsContext';
import useActivityState from '@/state/useActivityState';

import RoomIndicator from '../common/RoomIndicator';
import Round from '../common/Round';
import Timer from '../common/Timer';
import IdeaChoose from './ResponseChoose';
import IdeaInput from './ResponseInput';

const ResponseCollection: FC = () => {
  const { t } = useTranslation('translations');
  const { round, activityState, currentStep } = useActivityState();

  const { availableResponses } = useThreadsContext();
  const [chosenThread, setChosenThread] = useState<string>();
  const [phase, setPhase] = useState<number>(IdeationPhases.Choose);

  const { startTime } = activityState;

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ): void => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (phase === IdeationPhases.Choose) {
      setChosenThread(undefined);
    }
  }, [phase]);

  const handleChoose = (id?: string): void => {
    const threadId = availableResponses?.find((i) => i.id === id)?.id;
    if (typeof threadId !== 'undefined') {
      setChosenThread(threadId);
      // TODO: Implement postChooseThreadAction
      // postChooseThreadAction(threadId);
    }
    setPhase(IdeationPhases.Input);
  };

  const handleSubmission = (): void => {
    // Ideation done!
    setOpenSnackbar(true);
    setPhase(IdeationPhases.Choose);
  };

  const renderPhaseOfIdeation = (): React.JSX.Element | null => {
    if (phase === IdeationPhases.Choose) {
      return (
        <IdeaChoose threads={availableResponses} onChoose={handleChoose} />
      );
    }
    return (
      <IdeaInput
        currentRound={round}
        onSubmitted={handleSubmission}
        threadId={chosenThread}
        onCancel={() => setPhase(IdeationPhases.Choose)}
      />
    );
  };

  return (
    <Pausable>
      <Container data-cy={RESPONSE_COLLECTION_VIEW_CY}>
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="space-between"
          height="100%"
          spacing={4}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Round round={round} />
            {currentStep?.time && startTime && (
              <Timer startTime={startTime} time={currentStep.time} />
            )}
            <RoomIndicator />
          </Stack>
          <Instructions />
          {renderPhaseOfIdeation()}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: '100%' }}
            >
              {t('RESPONSE_SUBMITTED_SUCCESS')}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </Pausable>
  );
};

export default ResponseCollection;
