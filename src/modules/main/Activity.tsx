import { FC, useEffect } from 'react';

import { getCurrentActivity } from '@/utils/state';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';

const Activity: FC = () => {
  const { appData } = useAppDataContext();
  const { orchestrator } = useSettings();

  useEffect(() => {
    getCurrentActivity(appData, orchestrator.id);
  });

  return <p>Hi</p>;
};

export default Activity;
