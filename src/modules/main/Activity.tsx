import { FC, useEffect, useState } from 'react';

import { ActivityType } from '@/interfaces/interactionProcess';
import { getCurrentActivity } from '@/utils/state';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import ResponseCollection from '../responseCollection/ResponseCollection';
import ResponseEvaluation from '../responseEvaluation/ResponseEvaluation';

const Activity: FC = () => {
  const { appData } = useAppDataContext();
  const { orchestrator } = useSettings();

  const [activity, setActivity] = useState<ActivityType>(
    ActivityType.Collection,
  );

  useEffect(() => {
    const a = getCurrentActivity(appData, orchestrator.id);
    if (a) {
      setActivity(a);
    }
  }, [appData, orchestrator.id]);

  switch (activity) {
    case ActivityType.Evaluation:
      return <ResponseEvaluation />;
    case ActivityType.Results:
      return <p>Results</p>;
    default:
      return <ResponseCollection />;
  }
};

export default Activity;
