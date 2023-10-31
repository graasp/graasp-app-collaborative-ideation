import { FC, ReactElement, useEffect, useState } from 'react';

import { ProcessStatus } from '@/interfaces/interactionProcess';
import WaitingScreen from '@/modules/common/WaitingScreen';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getCurrentStatus } from '@/utils/state';

const Pausable: FC<{ children: ReactElement }> = ({ children }) => {
  const { appData } = useAppDataContext();
  const [state, setState] = useState(ProcessStatus.WaitingForStart);
  const { orchestrator } = useSettings();

  useEffect(() => {
    setState(
      getCurrentStatus(appData, orchestrator.id) ||
        ProcessStatus.WaitingForStart,
    );
  }, [appData, orchestrator.id]);

  if (state === ProcessStatus.Play) {
    return children;
  }
  return <WaitingScreen state={state} />;
};

export default Pausable;
