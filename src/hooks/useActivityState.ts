import { useEffect, useState } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, PermissionLevel } from '@graasp/sdk';

import { AppDataTypes, CurrentStateAppData } from '@/config/appDataTypes';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getCurrentRound, getCurrentState } from '@/utils/state';

interface UseActivityStateValues {
  round: number;
  nextRound: () => void;
}

const useActivityState = (): UseActivityStateValues => {
  const [round, setRound] = useState(0);
  const { appData, postAppData, patchAppData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const [activityState, setActivityState] = useState<CurrentStateAppData>();
  const { permission } = useLocalContext();

  useEffect(() => {
    setActivityState(getCurrentState(appData, orchestrator.id));
    const r = getCurrentRound(appData, orchestrator.id);
    if (r) {
      setRound(r);
    }
  }, [appData, orchestrator.id]);

  const postDefaultActivityState = (): void => {
    if (permission === PermissionLevel.Admin) {
      postAppData({
        type: AppDataTypes.CurrentState,
        visibility: AppDataVisibility.Member,
        data: {
          round: 0,
          status: ActivityStatus.WaitingForStart,
          activity: ActivityType.Collection,
        },
      });
    }
  };

  const nextRound = (): void => {
    setRound(round + 1);
    if (activityState?.id) {
      patchAppData({
        ...activityState,
        data: {
          ...activityState.data,
          round,
        },
      });
    } else {
      postDefaultActivityState();
    }
  };
  return { round, nextRound };
};

export default useActivityState;
