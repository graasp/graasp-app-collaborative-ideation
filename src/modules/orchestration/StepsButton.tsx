import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ORCHESTRATION_BAR_CY } from '@/config/selectors';
import {
  ActivityStatus,
  ActivityStep,
  ActivityType,
} from '@/interfaces/activity_state';
import useActivityState from '@/state/useActivityState';

import useStepTimer from '../common/stepTimer/useStepTimer';
import CommandButton from './CommandButton';
import WarningNextStepDialog from './WarningNextStepDialog';
import WarningPreviousStepDialog from './WarningPreviousStepDialog';

interface StepsButtonProps {
  enable: boolean;
}

const StepsButton: FC<StepsButtonProps> = ({ enable }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR.NEXT_STEP_BTN',
  });
  const [isChangingStep, setIsChangingStep] = useState(false);
  const [openWarningPreviousStepDialog, setOpenWarningPreviousStepDialog] =
    useState(false);
  const [openWarningNextStepDialog, setOpenWarningNextStepDialog] =
    useState(false);

  const {
    activityState,
    moveToPreviousStep,
    nextStep,
    currentStep,
    nbrOfSteps,
    previousStep,
    moveToNextStep,
  } = useActivityState();
  const { status, stepIndex } = activityState;

  const stepHasTimeout = useStepTimer();
  // const promise = useRef<Promise<void>>();

  const progress = useMemo(() => {
    if (typeof stepIndex !== 'undefined') {
      return (100 * (stepIndex + 1)) / nbrOfSteps;
    }
    return 0;
  }, [nbrOfSteps, stepIndex]);

  const disablePreviousStep = useMemo(
    () =>
      typeof previousStep === 'undefined' ||
      isChangingStep ||
      status !== ActivityStatus.Play,
    [isChangingStep, previousStep, status],
  );

  const disableNextStep = useMemo(
    () =>
      typeof nextStep === 'undefined' ||
      isChangingStep ||
      status !== ActivityStatus.Play,
    [isChangingStep, nextStep, status],
  );

  const nextStepColor = useMemo(() => {
    if (stepHasTimeout) {
      return 'success';
    }
    return 'error';
  }, [stepHasTimeout]);

  const handleNextStep = (): void => {
    setIsChangingStep(true);
    setOpenWarningNextStepDialog(false);
    moveToNextStep().then(() => setIsChangingStep(false));
  };

  const tryToMoveToNextStep = (): void => {
    if (stepHasTimeout) {
      handleNextStep();
    } else {
      setOpenWarningNextStepDialog(true);
    }
  };

  const goToPreviousStep = async (): Promise<void> => {
    setIsChangingStep(true);
    setOpenWarningPreviousStepDialog(false);
    moveToPreviousStep().then(() => {
      setIsChangingStep(false);
    });
  };

  const getLabelStep = (step: ActivityStep): string => {
    switch (step.type) {
      case ActivityType.Collection:
        return t('LABEL_STEP_COLLECTION', { round: step.round });
      case ActivityType.Evaluation:
        return t('LABEL_STEP_EVALUATION');
      case ActivityType.Results:
        return t('LABEL_STEP_RESULTS');
      default:
        return t('NO_STEP');
    }
  };

  return (
    <>
      <CommandButton
        startIcon={<NavigateBeforeIcon />}
        onClick={() => setOpenWarningPreviousStepDialog(true)}
        disabled={!enable || disablePreviousStep}
        data-cy={ORCHESTRATION_BAR_CY.PREVIOUS_STEP_BTN}
        variant="contained"
      >
        {t('PREVIOUS_STEP')}
      </CommandButton>
      <Stack sx={{ minWidth: '10%' }}>
        {currentStep && (
          <Typography variant="body1">{getLabelStep(currentStep)}</Typography>
        )}
        <LinearProgress variant="determinate" value={progress} />
      </Stack>
      <Tooltip title={nextStep ? getLabelStep(nextStep) : t('NO_STEP')}>
        <CommandButton
          endIcon={<NavigateNextIcon />}
          onClick={tryToMoveToNextStep}
          disabled={!enable || disableNextStep}
          data-cy={ORCHESTRATION_BAR_CY.NEXT_STEP_BTN}
          variant="contained"
          color={nextStepColor}
        >
          {t('NEXT_STEP')}
        </CommandButton>
      </Tooltip>
      <Collapse in={isChangingStep}>
        <CircularProgress />
      </Collapse>
      <WarningPreviousStepDialog
        open={openWarningPreviousStepDialog}
        onConfirm={goToPreviousStep}
        onCancel={() => setOpenWarningPreviousStepDialog(false)}
      />
      <WarningNextStepDialog
        open={openWarningNextStepDialog}
        onCancel={() => setOpenWarningNextStepDialog(false)}
        onConfirm={handleNextStep}
      />
    </>
  );
};

export default StepsButton;
