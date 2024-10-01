import { FC, lazy, Suspense, SuspenseProps } from 'react';

import { ActivityType } from '@/interfaces/interactionProcess';

import { useLocalContext } from '@graasp/apps-query-client';
import { useActivityContext } from '../context/ActivityContext';
import OrchestrationBar from '../orchestration/OrchestrationBar';
import { useSettings } from '../context/SettingsContext';
import Loader from '../common/Loader';

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
