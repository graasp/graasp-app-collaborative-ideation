import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { ActivityStep, ActivityType } from '@/interfaces/interactionProcess';
import Typography from '@mui/material/Typography';
import { NEXT_STEP_BTN_CY, PREVIOUS_STEP_BTN_CY } from '@/config/selectors';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useActivityContext } from '../context/ActivityContext';
import CommandButton from './CommandButton';

interface StepsButtonProps {
  enable: boolean;
}

const StepsButton: FC<StepsButtonProps> = ({ enable }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR.NEXT_STEP_BTN',
  });
  const [isPreparingNextRound, setIsPreparingNextRound] = useState(false);
  // TODO: Implement refetch of the data before preparing next round!
  const {
    createAllResponsesSet,
    changeStep,
    round,
    nextStep,
    currentStep,
    nbrOfSteps,
    stepIndex,
    previousStep,
  } = useActivityContext();
  const promise = useRef<Promise<void>>();

  const progress = useMemo(() => {
    if (typeof stepIndex !== 'undefined') {
      return (100 * (stepIndex + 1)) / nbrOfSteps;
    }
    return 0;
  }, [nbrOfSteps, stepIndex]);

  const disablePreviousStep = useMemo(
    () => typeof previousStep === 'undefined',
    [previousStep],
  );

  const disableNextStep = useMemo(
    () => typeof nextStep === 'undefined',
    [nextStep],
  );

  const prepareNextStep = async (): Promise<void> => {
    if (!isPreparingNextRound) {
      if (typeof nextStep === 'undefined') {
        return;
      }
      setIsPreparingNextRound(true);

      if (
        nextStep.type === ActivityType.Collection &&
        (nextStep?.round || 0) > round
      ) {
        promise.current = createAllResponsesSet().then(() => {
          // TODO: Fix this
          changeStep(nextStep, (stepIndex ?? 0) + 1);
          setIsPreparingNextRound(false);
        });
      } else {
        // TODO: Fix this
        changeStep(nextStep, (stepIndex ?? 0) + 1);
      }
    }
  };

  const goToPreviousStep = async (): Promise<void> => {
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
        onClick={goToPreviousStep}
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
          onClick={prepareNextStep}
          disabled={!enable || disableNextStep}
          data-cy={NEXT_STEP_BTN_CY}
          variant="contained"
        >
          {t('NEXT_STEP')}
        </CommandButton>
      </Tooltip>
    </>
  );
};

export default StepsButton;
