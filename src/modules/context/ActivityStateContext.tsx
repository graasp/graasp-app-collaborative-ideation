import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import isEqual from 'lodash.isequal';

import {
  AppDataTypes,
  CurrentStateAppData,
  CurrentStateData,
} from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';
import useActions from '@/hooks/useActions';
import {
  ActivityStatus,
  ActivityStep,
  ActivityType,
} from '@/interfaces/interactionProcess';
import { useSettings } from '@/modules/context/SettingsContext';
import { getAllStates, getCurrentState } from '@/utils/state';

export interface ActivityStateContextType {
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

const defaultValue: ActivityStateContextType = {
  round: 0,
  nextRound: () => undefined,
  activityState: INITIAL_STATE,
  resetActivityState: () => undefined,
  stateWarning: false,
  changeActivity: () => undefined,
  playActivity: () => undefined,
  pauseActivity: () => undefined,
  updateActivityState: () => undefined,
};

const ActivityStateContext =
  createContext<ActivityStateContextType>(defaultValue);

type Props = {
  children: JSX.Element;
};

const useActivityStateAppData = (): CurrentStateAppData[] | undefined => {
  const { data: appData } = hooks.useAppData({
    type: AppDataTypes.CurrentState,
  });
  const [activityStateAppData, setActivityStateAppData] = useState<
    CurrentStateAppData[] | undefined
  >(undefined);

  useEffect(() => {
    if (!isEqual(activityStateAppData, appData)) {
      setActivityStateAppData(appData as CurrentStateAppData[]);
    }
  }, [activityStateAppData, appData]);

  return activityStateAppData;
};

export const ActivityStateProvider = ({ children }: Props): JSX.Element => {
  const [stateWarning, setStateWarning] = useState(false);

  const { postPlayActivityAction, postPauseActivityAction } = useActions();

  const activityStateAppData = useActivityStateAppData();

  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();

  const { orchestrator } = useSettings();
  const { permission } = useLocalContext();

  const activityState = useMemo(() => {
    const state = getCurrentState(activityStateAppData ?? [], orchestrator.id);
    setStateWarning(state?.multipleStatesFound === true);
    return state.currentState;
  }, [activityStateAppData, orchestrator]);

  const round = useMemo(() => activityState?.data.round || 0, [activityState]);

  const postDefaultActivityState = useCallback((): void => {
    if (permission === PermissionLevel.Admin) {
      postAppData(INITIAL_STATE);
    }
  }, [permission, postAppData]);

  const updateActivityState = useCallback(
    (newActivityStateData: Partial<CurrentStateData>): void => {
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
    },
    [activityState, patchAppData, postAppData],
  );

  const nextRound = useCallback((): void => {
    const newRound = round + 1;
    updateActivityState({
      round: newRound,
    });
  }, [round, updateActivityState]);

  const changeActivity = useCallback(
    (newActivity: ActivityType): void => {
      updateActivityState({ activity: newActivity });
    },
    [updateActivityState],
  );

  const changeActivityStatus = useCallback(
    (newStatus: ActivityStatus): void => {
      updateActivityState({ status: newStatus });
    },
    [updateActivityState],
  );

  const playActivity = useCallback(
    (step?: ActivityStep, stepIndex?: number): void => {
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
    },
    [changeActivityStatus, postPlayActivityAction, updateActivityState],
  );

  const pauseActivity = useCallback((): void => {
    changeActivityStatus(ActivityStatus.Pause);
    postPauseActivityAction();
  }, [changeActivityStatus, postPauseActivityAction]);

  const resetActivityState = useCallback((): void => {
    const states = getAllStates(activityStateAppData ?? []);
    states.forEach(({ id }) => deleteAppData({ id }));
    postDefaultActivityState();
  }, [activityStateAppData, deleteAppData, postDefaultActivityState]);

  const contextValue = useMemo(
    () => ({
      activityState: activityState || INITIAL_STATE,
      round,
      nextRound,
      resetActivityState,
      stateWarning,
      changeActivity,
      playActivity,
      pauseActivity,
      updateActivityState,
    }),
    [
      activityState,
      changeActivity,
      nextRound,
      pauseActivity,
      playActivity,
      resetActivityState,
      round,
      stateWarning,
      updateActivityState,
    ],
  );

  return (
    <ActivityStateContext.Provider value={contextValue}>
      {children}
    </ActivityStateContext.Provider>
  );
};

export const useActivityStateContext = (): ActivityStateContextType =>
  useContext(ActivityStateContext);
