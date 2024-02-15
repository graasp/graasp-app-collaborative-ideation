import { FC } from 'react';

import { ActivityType } from '@/interfaces/interactionProcess';

import { useActivityContext } from '../context/ActivityContext';
import ResponseCollection from '../responseCollection/ResponseCollection';
import ResponseEvaluation from '../responseEvaluation/ResponseEvaluation';

const Activity: FC = () => {
  const { activityState } = useActivityContext();

  const { activity } = activityState.data;

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
