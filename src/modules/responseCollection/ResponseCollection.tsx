import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { RESPONSE_COLLECTION_VIEW_CY } from '@/config/selectors';
import useActions from '@/hooks/useActions';
import useSteps from '@/hooks/useSteps';
import { IdeationPhases } from '@/interfaces/interactionProcess';
import { ResponseData } from '@/interfaces/response';
import Instructions from '@/modules/common/Instructions';
import Pausable from '@/modules/common/Pausable';

import { useResponsesContext } from '@/state/ResponsesContext';
import useActivityState from '@/state/useActivityState';
import Round from '../common/Round';
import Timer from '../common/Timer';
import IdeaChoose from './ResponseChoose';
import IdeaInput from './ResponseInput';

const ResponseCollection: FC = () => {
  const { t } = useTranslation('translations');
  const { round, activityState } = useActivityState();

  const { allResponses } = useResponsesContext();
  const availableResponses = allResponses;
  const { currentStep } = useSteps();
  const { postChooseResponseAction } = useActions();
  const [chosenIdea, setChosenIdea] = useState<ResponseData<undefined>>();
  const [phase, setPhase] = useState<number>(IdeationPhases.Choose);

  const { startTime } = activityState.data;

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
      setChosenIdea(undefined);
    }
  }, [phase]);

  const handleChoose = (id?: string): void => {
    const idea = availableResponses?.find((i) => i.id === id);
    if (typeof idea !== 'undefined') {
      setChosenIdea(idea);
      postChooseResponseAction(idea);
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
        <IdeaChoose responses={availableResponses} onChoose={handleChoose} />
      );
    }
    return (
      <IdeaInput
        currentRound={round}
        parent={chosenIdea}
        onSubmitted={handleSubmission}
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
            {currentStep?.time && (
              <Timer startTime={startTime} time={currentStep.time} />
            )}
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
