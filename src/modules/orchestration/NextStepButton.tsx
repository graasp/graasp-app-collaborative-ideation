import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

import { NEXT_ROUND_BTN_CY } from '@/config/selectors';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ActivityType } from '@/interfaces/interactionProcess';
import { useActivityContext } from '../context/ActivityContext';
import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';

interface NextRoundButtonProps {
  enable: boolean;
}

const NextRoundButton: FC<NextRoundButtonProps> = ({ enable }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR.NEXT_STEP_BTN',
  });
  const [isPreparingNextRound, setIsPreparingNextRound] = useState(false);
  const { invalidateAppData } = useAppDataContext();
  const {
    createAllResponsesSet,
    nextStep: startNextStep,
    activityState,
    round,
  } = useActivityContext();
  const promise = useRef<Promise<void>>();

  const { activity } = useSettings();
  const { stepIndex } = activityState.data;

  const { steps } = activity;

  const prepareNextStep = async (): Promise<void> => {
    if (!isPreparingNextRound) {
      const nextStepIndex = (stepIndex || 0) + 1;
      if (steps.length >= nextStepIndex) {
        return;
      }
      setIsPreparingNextRound(true);
      const nextStep = steps[nextStepIndex];

      if (
        nextStep.type === ActivityType.Collection &&
        (nextStep?.round || 0) > round
      ) {
        promise.current = createAllResponsesSet().then(() => {
          startNextStep(nextStep, nextStepIndex);
          setIsPreparingNextRound(false);
        });
      }
    }
  };

  return (
    <>
      <Button
        startIcon={<NavigateNextIcon />}
        onClick={prepareNextStep}
        disabled={!enable}
        data-cy={NEXT_ROUND_BTN_CY}
        variant="contained"
      >
        {t('NEXT_STEP')}
      </Button>
      {/* TODO: Remove and make refresh automatic */}
      <Button onClick={() => invalidateAppData()}>{t('REFRESH_DATA')}</Button>
    </>
  );
};

export default NextRoundButton;
