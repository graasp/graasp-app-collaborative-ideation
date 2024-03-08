import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { ActivityStep, ActivityType } from '@/interfaces/interactionProcess';
import Typography from '@mui/material/Typography';
import { NEXT_STEP_BTN_CY, PREVIOUS_STEP_BTN_CY } from '@/config/selectors';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import useSteps from '@/hooks/useSteps';
import CommandButton from './CommandButton';
import WarningPreviousStepDialog from './WarningPreviousStepDialog';
import useStepTimer from '../common/stepTimer/useStepTimer';
import WarningNextStepDialog from './WarningNextStepDialog';

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
    moveToPreviousStep,
    nextStep,
    currentStep,
    nbrOfSteps,
    stepIndex,
    previousStep,
    moveToNextStep,
  } = useSteps();

  const stepHasTimeout = useStepTimer();
  // const promise = useRef<Promise<void>>();

  const progress = useMemo(() => {
    if (typeof stepIndex !== 'undefined') {
      return (100 * (stepIndex + 1)) / nbrOfSteps;
    }
    return 0;
  }, [nbrOfSteps, stepIndex]);

  const disablePreviousStep = useMemo(
    () => typeof previousStep === 'undefined' || isChangingStep,
    [isChangingStep, previousStep],
  );

  const disableNextStep = useMemo(
    () => typeof nextStep === 'undefined' || isChangingStep,
    [isChangingStep, nextStep],
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
        data-cy={PREVIOUS_STEP_BTN_CY}
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
          data-cy={NEXT_STEP_BTN_CY}
          variant="contained"
          color={nextStepColor}
        >
          {t('NEXT_STEP')}
        </CommandButton>
      </Tooltip>
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
