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

import useActions from './useActions';

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
  playActivity: (step?: ActivityStep, stepIndex?: number) => void;
  pauseActivity: () => void;
  updateActivityState: (
    newActivityStateData: Partial<CurrentStateData>,
  ) => void;
}

const useActivityState = (): UseActivityStateValues => {
  const [stateWarning, setStateWarning] = useState(false);

  const { postPlayActivityAction, postPauseActivityAction } = useActions();

  const { appData, postAppData, patchAppData, deleteAppData } =
    useAppDataContext();
  const { orchestrator } = useSettings();
  const { permission } = useLocalContext();

  const activityState = useMemo(() => {
    const state = getCurrentState(appData, orchestrator.id);
    setStateWarning(state?.multipleStatesFound === true);
    return state.currentState;
  }, [appData, orchestrator]);

  const round = useMemo(() => activityState?.data.round || 0, [activityState]);

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
          ...INITIAL_STATE.data,
          ...newActivityStateData,
        },
      });
    }
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

  const playActivity = (step?: ActivityStep, stepIndex?: number): void => {
    if (typeof step !== 'undefined') {
      updateActivityState({
        activity: step.type,
        round: step.round,
        startTime: new Date(),
        stepIndex: stepIndex || 0,
        status: ActivityStatus.Play,
      });
    } else {
      changeActivityStatus(ActivityStatus.Play);
    }
    postPlayActivityAction();
  };

  const pauseActivity = (): void => {
    changeActivityStatus(ActivityStatus.Pause);
    postPauseActivityAction();
  };

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
    updateActivityState,
  };
};

export default useActivityState;
