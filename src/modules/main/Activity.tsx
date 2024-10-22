import { FC, Suspense, SuspenseProps, lazy } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';

import { ActivityType } from '@/interfaces/interactionProcess';
import { useActivityStateContext } from '@/modules/context/ActivityStateContext';

import Loader from '../common/Loader';
import { ResponsesProvider } from '../context/ResponsesContext';
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
  console.log('Activity is rendering.');
  const { activityState } = useActivityStateContext();
  const { accountId } = useLocalContext();
  const { orchestrator } = useSettings();

  const { activity } = activityState.data;
  return (
    <ResponsesProvider>
      <>
        {orchestrator.id === accountId && <OrchestrationBar />}
        {getActivityComponent(activity)}
      </>
    </ResponsesProvider>
  );
};

export default Activity;
