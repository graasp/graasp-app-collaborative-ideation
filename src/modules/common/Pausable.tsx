import { FC, ReactElement } from 'react';

import { ActivityStatus } from '@/interfaces/interactionProcess';
import WaitingScreen from '@/modules/common/WaitingScreen';
import { useActivityStateContext } from '@/modules/context/ActivityStateContext';

const Pausable: FC<{ children: ReactElement }> = ({ children }) => {
  const { activityState } = useActivityStateContext();
  const status = activityState?.data?.status || ActivityStatus.WaitingForStart;

  if (status === ActivityStatus.Play) {
    return children;
  }
  return <WaitingScreen state={status} />;
};

export default Pausable;
