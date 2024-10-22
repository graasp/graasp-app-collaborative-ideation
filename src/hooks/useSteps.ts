import { useMemo } from 'react';

import {
  ActivityStep,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';
import { useActivityStateContext } from '@/modules/context/ActivityStateContext';
import { useResponses } from '@/modules/context/ResponsesContext';
import { useSettings } from '@/modules/context/SettingsContext';

import useActions from './useActions';
import useAssistants from './useAssistants';

interface UseStepsValues {
  changeStep: (newStep: ActivityStep, index: number) => void;
  currentStep: ActivityStep | undefined;
  nextStep: ActivityStep | undefined;
  previousStep: ActivityStep | undefined;
  stepIndex: number | undefined;
  nbrOfSteps: number;
  moveToNextStep: () => Promise<void>;
  moveToPreviousStep: () => Promise<void>;
}

const useSteps = (): UseStepsValues => {
  const { updateActivityState, activityState, round } =
    useActivityStateContext();

  const { createAllResponsesSet, deleteResponsesSetsForRound } = useResponses();

  const { generateResponsesWithEachAssistant } = useAssistants();

  const { postNextStepAction, postPreviousStepAction } = useActions();
  const { activity } = useSettings();
  const { steps, mode } = activity;

  const stepIndex = useMemo(
    () => activityState?.data.stepIndex,
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
      nextStep:
        typeof steps !== 'undefined' && nbrOfSteps > 0 ? steps[0] : undefined,
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
      (nextStep?.round || 0) > round &&
      mode !== ResponseVisibilityMode.OpenLive
    ) {
      // TODO: Insane amount of work here. REFACTOR!
      await generateResponsesWithEachAssistant()
        .then((p) => Promise.all(p))
        .then(() =>
          createAllResponsesSet().then(() => {
            changeStep(nextStep, nextStepIndex);
          }),
        );
    } else {
      changeStep(nextStep, nextStepIndex);
    }
    postNextStepAction(nextStep, nextStepIndex);
  };

  const moveToPreviousStep = async (): Promise<void> => {
    if (typeof previousStep !== 'undefined') {
      if (typeof previousStep?.round !== 'undefined') {
        deleteResponsesSetsForRound(previousStep.round);
      }
      const previousStepIndex = (stepIndex ?? 1) - 1;
      changeStep(previousStep, previousStepIndex);
      postPreviousStepAction(previousStep, previousStepIndex);
    }
  };

  return {
    changeStep,
    currentStep,
    nextStep,
    previousStep,
    nbrOfSteps,
    stepIndex,
    moveToNextStep,
    moveToPreviousStep,
  };
};

export default useSteps;
