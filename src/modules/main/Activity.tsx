import { FC, JSX, Suspense, SuspenseProps, lazy } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';

import { ActivityType, ResponseVisibilityMode } from '@/interfaces/activity_state';
import useActivityState from '@/state/useActivityState';
import Loader from '../common/Loader';
import { useSettings } from '../context/SettingsContext';
import OrchestrationBar from '../orchestration/OrchestrationBar';

const ActivitySuspense: FC<SuspenseProps> = (props) => (
  <Suspense fallback={<Loader />} {...props}>
    {props.children}
  </Suspense>
);

const getResponseEvaluation = (): JSX.Element => {
  const ResponseEvaluation = lazy(
    () => import('../responseEvaluation/ResponseEvaluation.js'),
  );
  return (
    <ActivitySuspense>
      <ResponseEvaluation />
    </ActivitySuspense>
  );
};

const getResultsView = (): JSX.Element => {
  const ResultsView = lazy(() => import('../results/ResultsView.js'));
  return (
    <ActivitySuspense>
      <ResultsView />
    </ActivitySuspense>
  );
};

const getResponseCollection = (): JSX.Element => {
  const ResponseCollection = lazy(
    () => import('../responseCollection/ResponseCollection.js'),
  );
  return (
    <ActivitySuspense>
      <ResponseCollection />
    </ActivitySuspense>
  );
};

const getActivityComponent = (activity: ActivityType): JSX.Element => {
  switch (activity) {
    case ActivityType.Evaluation:
      return getResponseEvaluation();
    case ActivityType.Results:
      return getResultsView();
    default:
      return getResponseCollection();
  }
};

const Activity: FC = () => {
  const { currentStep } = useActivityState();
  const { accountId } = useLocalContext();
  const { orchestrator, activity: activitySettings } = useSettings();
  const { mode } = activitySettings;
  const showOrchestrationBar =
    orchestrator.id === accountId || mode === ResponseVisibilityMode.Individual;

  const { type } = currentStep || { type: ActivityType.Collection };
  return (
    <>
      {showOrchestrationBar && <OrchestrationBar />}
      {getActivityComponent(type)}
    </>
  );
};

export default Activity;
