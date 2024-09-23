import { FC } from 'react';

import { ActivityType } from '@/interfaces/interactionProcess';

import { useLocalContext } from '@graasp/apps-query-client';
import { useActivityContext } from '../context/ActivityContext';
import ResponseCollection from '../responseCollection/ResponseCollection';
import ResponseEvaluation from '../responseEvaluation/ResponseEvaluation';
import OrchestrationBar from '../orchestration/OrchestrationBar';
import { useSettings } from '../context/SettingsContext';
import ResultsView from '../results/ResultsView';

const getActivityComponent = (activity: ActivityType): JSX.Element => {
  switch (activity) {
    case ActivityType.Evaluation:
      return <ResponseEvaluation />;
    case ActivityType.Results:
      return <ResultsView />;
    default:
      return <ResponseCollection />;
  }
};

const Activity: FC = () => {
  const { activityState } = useActivityContext();
  const { accountId } = useLocalContext();
  const { orchestrator } = useSettings();

  const { activity } = activityState.data;
  return (
    <>
      {orchestrator.id === accountId && <OrchestrationBar />}
      {getActivityComponent(activity)}
    </>
  );
};

export default Activity;
