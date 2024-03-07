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

interface StepsButtonProps {
  enable: boolean;
}

const StepsButton: FC<StepsButtonProps> = ({ enable }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR.NEXT_STEP_BTN',
  });
  const [isPreparingNextStep, setIsPreparingNextStep] = useState(false);
  const [openWarningPreviousStepDialog, setOpenWarningPreviousStepDialog] =
    useState(false);
  // TODO: Implement refetch of the data before preparing next round!
  const {
    changeStep,
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
    () => typeof previousStep === 'undefined' || isPreparingNextStep,
    [isPreparingNextStep, previousStep],
  );

  const disableNextStep = useMemo(
    () => typeof nextStep === 'undefined' || isPreparingNextStep,
    [isPreparingNextStep, nextStep],
  );

  const nextStepColor = useMemo(() => {
    if (stepHasTimeout) {
      return 'success';
    }
    return 'error';
  }, [stepHasTimeout]);

  // const prepareNextStep = async (): Promise<void> => {
  //   if (!isPreparingNextRound) {
  //     if (typeof nextStep === 'undefined') {
  //       return;
  //     }
  //     setIsPreparingNextRound(true);

  //     if (
  //       nextStep.type === ActivityType.Collection &&
  //       (nextStep?.round || 0) > round
  //     ) {
  //       promise.current = createAllResponsesSet().then(() => {
  //         // TODO: Fix this. Logic should be moved to the hook.
  //         changeStep(nextStep, (stepIndex ?? 0) + 1);
  //         setIsPreparingNextRound(false);
  //       });
  //     } else {
  //       // TODO: Fix this
  //       changeStep(nextStep, (stepIndex ?? 0) + 1);
  //     }
  //   }
  // };

  const handleNextStep = (): void => {
    setIsPreparingNextStep(true);
    moveToNextStep().then(() => setIsPreparingNextStep(false));
  };

  const goToPreviousStep = async (): Promise<void> => {
    setOpenWarningPreviousStepDialog(false);
    // TODO: add cleanup of aborted step.
    if (typeof previousStep !== 'undefined') {
      changeStep(previousStep, (stepIndex ?? 0) - 1);
    }
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
          onClick={handleNextStep}
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
    </>
  );
};

export default StepsButton;
