import { FC, ReactElement } from 'react';

import { ActivityStatus } from '@/interfaces/interactionProcess';
import WaitingScreen from '@/modules/common/WaitingScreen';

import { useActivityContext } from '../context/ActivityContext';

const Pausable: FC<{ children: ReactElement }> = ({ children }) => {
  const { activityState } = useActivityContext();
  const status = activityState?.data?.status || ActivityStatus.WaitingForStart;

  if (status === ActivityStatus.Play) {
    return children;
  }
  return <WaitingScreen state={status} />;
};

export default Pausable;
