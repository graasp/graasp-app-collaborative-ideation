import { FC, ReactElement, useMemo } from 'react';

import { ActivityStatus } from '@/interfaces/activity_state';
import WaitingScreen from '@/modules/common/WaitingScreen';
import useActivityState from '@/state/useActivityState';

const Pausable: FC<{ children: ReactElement }> = ({ children }) => {
  const { activityState } = useActivityState();
  const status = useMemo(
    () => activityState?.status ?? ActivityStatus.WaitingForStart,
    [activityState],
  );

  if (status === ActivityStatus.Play) {
    return children;
  }
  return <WaitingScreen state={status} />;
};

export default Pausable;
