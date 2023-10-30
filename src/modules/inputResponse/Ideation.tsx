import { FC, useEffect, useState } from 'react';

import { ProcessState } from '@/interfaces/interactionProcess';
import WaitingScreen from '@/modules/common/WaitingScreen';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getCurrentState } from '@/utils/ideas';

import AnonymousIdeasView from '../ideasView/AnonymousIdeasView';
import IdeationProcess from './IdeationProcess';

const Ideation: FC = () => {
  const { appData } = useAppDataContext();
  const [state, setState] = useState(ProcessState.WaitingForStart);
  const { orchestrator } = useSettings();

  useEffect(() => {
    setState(
      getCurrentState(appData, orchestrator.id)?.data.state ||
        ProcessState.WaitingForStart,
    );
  }, [appData, orchestrator.id]);

  if (state === ProcessState.Play) {
    return <IdeationProcess />;
  }
  if (state === ProcessState.End) {
    return <AnonymousIdeasView />;
  }
  return <WaitingScreen state={state} />;
};

export default Ideation;
