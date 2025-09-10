import { useEffect, useMemo, useState } from 'react';

import { LoroDoc, LoroMap } from 'loro-crdt';

import { DEFAULT_ACTIVITY_STATE } from '@/config/constants';
import useActions from '@/hooks/useActions';
import {
  ActivityState,
  ActivityStatus,
  ActivityStep,
} from '@/interfaces/activity_state';
import { useSettings } from '@/modules/context/SettingsContext';

import { useLoroContext } from './LoroContext';
import { ACTIVITY_STATE_LORO_KEY } from './keys';

const getActivityState = (doc: LoroDoc): LoroMap => {
  const activityState = doc.getMap(ACTIVITY_STATE_LORO_KEY);
  // if (activityState.get('type'))
  return activityState;
};

const getStateFromLoroMap = (activityState: LoroMap): ActivityState => ({
  status:
    (activityState.get('status') as ActivityStatus) ||
    DEFAULT_ACTIVITY_STATE.status,
  startTime:
    (activityState.get('startTime') as Date) ||
    DEFAULT_ACTIVITY_STATE.startTime,
  stepIndex:
    (activityState.get('stepIndex') as number) ||
    DEFAULT_ACTIVITY_STATE.stepIndex,
});

export interface UseActivityStateValues {
  activityState: ActivityState;
  round: number;
  playActivity: (step?: ActivityStep, stepIndex?: number) => void;
  pauseActivity: () => void;
  currentStep: ActivityStep | undefined;
  nextStep: ActivityStep | undefined;
  previousStep: ActivityStep | undefined;
  nbrOfSteps: number;
  moveToNextStep: () => Promise<void>;
  moveToPreviousStep: () => Promise<void>;
}

const useActivityState = (): UseActivityStateValues => {
  const { postNextStepAction, postPreviousStepAction } = useActions();
  const { activity } = useSettings();
  const { steps } = activity;

  const { postPlayActivityAction, postPauseActivityAction } = useActions();

  const { doc } = useLoroContext();

  const [activityState, setActivityState] = useState<ActivityState>(
    DEFAULT_ACTIVITY_STATE,
  );

  // At runtime, steps may be undefined.
  const nbrOfSteps = steps?.length || 0;
  const { stepIndex } = activityState;

  useEffect(() => {
    const activityStateLoro = getActivityState(doc);
    setActivityState(getStateFromLoroMap(activityStateLoro));
    const unsubscribe = activityStateLoro.subscribe(() => {
      const a = getActivityState(doc);
      const activityStateLocal = getStateFromLoroMap(a);
      setActivityState(activityStateLocal);
    });
    return () => {
      unsubscribe();
    };
  }, [doc]);

  const changeActivityStatus = (
    newStatus: ActivityStatus,
    commit = true,
  ): void => {
    const activityStateLoro = getActivityState(doc);
    activityStateLoro.set('status', newStatus);
    if (commit) {
      doc.commit();
    }
  };

  const playActivity = (): void => {
    changeActivityStatus(ActivityStatus.Play);
    postPlayActivityAction();
  };

  const pauseActivity = (): void => {
    changeActivityStatus(ActivityStatus.Pause);
    postPauseActivityAction();
  };

  const changeStep = (newStepIndex: number, commit = true): void => {
    const activityStateLoro = getActivityState(doc);
    activityStateLoro.set('stepIndex', newStepIndex);
    if (commit) {
      doc.commit();
    }
  };

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

  const round = useMemo(() => currentStep?.round || 0, [currentStep?.round]);

  const moveToNextStep = async (): Promise<void> => {
    if (typeof nextStep === 'undefined') {
      return;
    }

    const nextStepIndex = (stepIndex ?? 0) + 1;

    // if (
    //   (nextStep?.round || 0) > round &&
    //   mode !== ResponseVisibilityMode.Sync
    // ) {
    //   // TODO: Insane amount of work here. REFACTOR!
    //   await generateResponsesWithEachAssistant()
    //     .then((p) => Promise.all(p))
    //     .then(() => {
    //       changeStep(nextStep, nextStepIndex);
    //     });
    // } else {
    //   changeStep(nextStep, nextStepIndex);
    // }
    changeStep(nextStepIndex);
    postNextStepAction(nextStep, nextStepIndex);
  };

  const moveToPreviousStep = async (): Promise<void> => {
    if (typeof previousStep !== 'undefined') {
      const previousStepIndex = (stepIndex ?? 1) - 1;
      changeStep(previousStepIndex);
      postPreviousStepAction(previousStep, previousStepIndex);
    }
  };

  return {
    activityState,
    round,
    playActivity,
    pauseActivity,
    currentStep,
    nextStep,
    previousStep,
    nbrOfSteps,
    moveToNextStep,
    moveToPreviousStep,
  };
};

export default useActivityState;
