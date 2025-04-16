import { FC, ReactElement } from 'react';

import { ActivityStatus } from '@/interfaces/activity_state';
import WaitingScreen from '@/modules/common/WaitingScreen';
import useActivityState from '@/state/useActivityState';

const Pausable: FC<{ children: ReactElement }> = ({ children }) => {
  const { activityState } = useActivityState();
  const status = activityState?.status || ActivityStatus.WaitingForStart;

  if (status === ActivityStatus.Play) {
    return children;
  }
  return <WaitingScreen state={status} />;
};

export default Pausable;
