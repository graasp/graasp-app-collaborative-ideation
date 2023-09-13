import { FC, useEffect, useState } from 'react';

import { IdeationState } from '@/interfaces/ideation';
import WaitingScreen from '@/modules/common/WaitingScreen';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getCurrentState } from '@/utils/ideas';

import AnonymousIdeasView from '../ideasView/AnonymousIdeasView';
import IdeationProcess from './IdeationProcess';

const Ideation: FC = () => {
  const { appData } = useAppDataContext();
  const [state, setState] = useState(IdeationState.WaitingForStart);
  const { orchestrator } = useSettings();

  useEffect(() => {
    setState(
      getCurrentState(appData, orchestrator.id)?.data.state ||
        IdeationState.WaitingForStart,
    );
  }, [appData, orchestrator.id]);

  if (state === IdeationState.Play) {
    return <IdeationProcess />;
  }
  if (state === IdeationState.End) {
    return <AnonymousIdeasView />;
  }
  return <WaitingScreen state={state} />;
};

export default Ideation;
