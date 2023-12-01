import { useEffect, useState } from 'react';

import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getCurrentRound } from '@/utils/state';

interface UseActivityStateValues {
  round: number;
  nextRound: () => void;
}

const useActivityState = (): UseActivityStateValues => {
  const [round, setRound] = useState(0);
  const { appData } = useAppDataContext();
  const { orchestrator } = useSettings();

  useEffect(() => {
    const r = getCurrentRound(appData, orchestrator.id);
    if (r) {
      setRound(r);
    }
  }, [appData, orchestrator.id]);

  const nextRound = (): void => {
    setRound(round + 1);
    // post new round
  };
  return { round, nextRound };
};

export default useActivityState;
