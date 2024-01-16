import { useEffect, useState } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { CurrentStateAppData, CurrentStateData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getCurrentRound, getCurrentState } from '@/utils/state';

interface UseActivityStateValues {
  activityState: {
    [key: string]: unknown;
    type: string;
    data: CurrentStateData;
  };
  round: number;
  nextRound: () => void;
  resetActivityState: () => void;
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
  }, [appData, orchestrator.id, round]);

  const postDefaultActivityState = (): void => {
    if (permission === PermissionLevel.Admin) {
      postAppData(INITIAL_STATE);
    }
  };

  const nextRound = (): void => {
    const newRound = round + 1;
    setRound(newRound);
    if (activityState?.id) {
      patchAppData({
        ...activityState,
        data: {
          ...activityState.data,
          round: newRound,
        },
      });
    } else {
      postDefaultActivityState();
    }
  };
  const resetActivityState = (): void => {
    if (activityState?.id) {
      patchAppData({
        ...INITIAL_STATE,
        id: activityState?.id,
      });
    } else {
      postDefaultActivityState();
    }
    setRound(0);
  };
  return {
    activityState: activityState || INITIAL_STATE,
    round,
    nextRound,
    resetActivityState,
  };
};

export default useActivityState;
