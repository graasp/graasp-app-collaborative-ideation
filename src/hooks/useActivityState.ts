import { useMemo, useState } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { CurrentStateData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import {
  ActivityStatus,
  ActivityStep,
  ActivityType,
} from '@/interfaces/interactionProcess';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getAllStates, getCurrentState } from '@/utils/state';

export interface UseActivityStateValues {
  activityState: {
    [key: string]: unknown;
    type: string;
    data: CurrentStateData;
  };
  round: number;
  nextRound: () => void;
  resetActivityState: () => void;
  stateWarning: boolean;
  changeActivity: (newActivity: ActivityType) => void;
  playActivity: () => void;
  pauseActivity: () => void;
  changeStep: (newStep: ActivityStep, index: number) => void;
  currentStep: ActivityStep | undefined;
  nextStep: ActivityStep | undefined;
  previousStep: ActivityStep | undefined;
  stepIndex: number | undefined;
  nbrOfSteps: number;
}

const useActivityState = (): UseActivityStateValues => {
  const [stateWarning, setStateWarning] = useState(false);
  const { appData, postAppData, patchAppData, deleteAppData } =
    useAppDataContext();
  const { orchestrator, activity } = useSettings();
  const { permission } = useLocalContext();
  const { steps } = activity;

  const activityState = useMemo(() => {
    const state = getCurrentState(appData, orchestrator.id);
    setStateWarning(state?.multipleStatesFound === true);
    return state.currentState;
  }, [appData, orchestrator]);

  const round = useMemo(() => activityState?.data.round || 0, [activityState]);

  const stepIndex = useMemo(
    () => activityState?.data.stepIndex,
    [activityState],
  );
  const nbrOfSteps = steps.length;

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

  const postDefaultActivityState = (): void => {
    if (permission === PermissionLevel.Admin) {
      postAppData(INITIAL_STATE);
    }
  };

  const updateActivityState = (
    newActivityStateData: Partial<CurrentStateData>,
  ): void => {
    if (activityState?.id) {
      patchAppData({
        id: activityState.id,
        data: {
          ...activityState.data,
          ...newActivityStateData,
        },
      });
    } else {
      postAppData({
        ...INITIAL_STATE,
        data: {
          ...INITIAL_STATE,
          ...newActivityStateData,
        },
      });
    }
  };

  const changeStep = (newStep: ActivityStep, index: number): void => {
    updateActivityState({
      activity: newStep.type,
      round: newStep.round,
      startTime: new Date(),
      stepIndex: index,
    });
  };

  const nextRound = (): void => {
    const newRound = round + 1;
    updateActivityState({
      round: newRound,
    });
  };

  const changeActivity = (newActivity: ActivityType): void => {
    updateActivityState({ activity: newActivity });
  };

  const changeActivityStatus = (newStatus: ActivityStatus): void => {
    updateActivityState({ status: newStatus });
  };

  const playActivity = (): void => {
    if (typeof currentStep === 'undefined' && nbrOfSteps > 0) {
      const firstStep = steps[0];
      updateActivityState({
        activity: firstStep.type,
        round: firstStep.round,
        startTime: new Date(),
        stepIndex: 0,
        status: ActivityStatus.Play,
      });
    } else {
      changeActivityStatus(ActivityStatus.Play);
    }
  };

  const pauseActivity = (): void => changeActivityStatus(ActivityStatus.Pause);

  const resetActivityState = (): void => {
    const states = getAllStates(appData);
    states.forEach(({ id }) => deleteAppData({ id }));
    postDefaultActivityState();
  };

  return {
    activityState: activityState || INITIAL_STATE,
    round,
    nextRound,
    resetActivityState,
    stateWarning,
    changeActivity,
    playActivity,
    pauseActivity,
    changeStep,
    currentStep,
    nextStep,
    previousStep,
    nbrOfSteps,
    stepIndex,
  };
};

export default useActivityState;
