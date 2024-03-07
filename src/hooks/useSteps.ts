import { ActivityStep, ActivityType } from '@/interfaces/interactionProcess';
import { useActivityContext } from '@/modules/context/ActivityContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useMemo } from 'react';
import useActions from './useActions';

interface UseStepsValues {
  changeStep: (newStep: ActivityStep, index: number) => void;
  currentStep: ActivityStep | undefined;
  nextStep: ActivityStep | undefined;
  previousStep: ActivityStep | undefined;
  stepIndex: number | undefined;
  nbrOfSteps: number;
  moveToNextStep: () => Promise<void>;
}

const useSteps = (): UseStepsValues => {
  const { updateActivityState, activityState, createAllResponsesSet, round } =
    useActivityContext();

  const { postNextStepAction } = useActions();
  const { activity } = useSettings();
  const { steps } = activity;
  const stepIndex = useMemo(
    () => activityState?.data.stepIndex || 0,
    [activityState],
  );

  // At runtime, steps may be undefined.
  const nbrOfSteps = steps?.length || 0;

  const { currentStep, nextStep, previousStep } = useMemo(() => {
    if (typeof stepIndex !== 'undefined' && stepIndex < nbrOfSteps) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const currentStep = steps[stepIndex];
      const nextStepIndex = stepIndex + 1;
      const previousStepIndex = stepIndex - 1;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const nextStep =
        nextStepIndex < nbrOfSteps ? steps[nextStepIndex] : undefined;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const previousStep =
        previousStepIndex >= 0 ? steps[previousStepIndex] : undefined;
      return { currentStep, nextStep, previousStep };
    }
    return {
      currentStep: undefined,
      nextStep: undefined,
      previousStep: undefined,
    };
  }, [nbrOfSteps, stepIndex, steps]);

  const changeStep = (newStep: ActivityStep, index: number): void => {
    updateActivityState({
      activity: newStep.type,
      round: newStep.round,
      startTime: new Date(),
      stepIndex: index,
    });
  };

  const moveToNextStep = async (): Promise<void> => {
    if (typeof nextStep === 'undefined') {
      return;
    }

    const nextStepIndex = (stepIndex ?? 0) + 1;

    if (
      nextStep.type === ActivityType.Collection &&
      (nextStep?.round || 0) > round
    ) {
      await createAllResponsesSet().then(() => {
        changeStep(nextStep, nextStepIndex);
      });
    } else {
      // TODO: Fix this
      changeStep(nextStep, nextStepIndex);
    }
    postNextStepAction(nextStep, nextStepIndex);
  };

  return {
    changeStep,
    currentStep,
    nextStep,
    previousStep,
    nbrOfSteps,
    stepIndex,
    moveToNextStep,
  };
};

export default useSteps;
