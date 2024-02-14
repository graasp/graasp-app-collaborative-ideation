import { FC, createContext, useContext, useMemo } from 'react';

import { INITIAL_STATE } from '@/config/constants';
import useActivityState, {
  UseActivityStateValues,
} from '@/hooks/useActivityState';
import useParticipants, { UseParticipantsValue } from '@/hooks/useParticipants';
import useResponses, { UseResponsesValues } from '@/hooks/useResponses';

type ActivityContextType = UseActivityStateValues &
  UseResponsesValues & { participants: UseParticipantsValue };
const defaultContextValue: ActivityContextType = {
  round: 0, // INITIAL_STATE.data.round,
  nextRound: () => undefined,
  activityState: INITIAL_STATE,
  resetActivityState: () => undefined,
  allResponses: [],
  myResponses: [],
  postResponse: () => undefined,
  allResponsesSets: [],
  myResponsesSets: [],
  assistantsResponsesSets: [],
  createAllResponsesSet: async () => undefined,
  deleteAllResponsesSet: async () => undefined,
  participants: { members: [], assistants: [] },
  deleteResponse: async () => undefined,
  stateWarning: false,
  changeActivity: () => undefined,
  playActivity: () => undefined,
  pauseActivity: () => undefined,
};

const ActivityContext = createContext<ActivityContextType>(defaultContextValue);

type ActivityContextProps = {
  children: JSX.Element;
};

export const ActivityProvider: FC<ActivityContextProps> = ({ children }) => {
  const participants = useParticipants();
  const activityState = useActivityState();
  const { round } = activityState;
  const responses = useResponses({ participants, round });
  const contextValue = useMemo(
    () => ({
      ...activityState,
      ...responses,
      participants,
    }),
    [activityState, participants, responses],
  );
  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityContext = (): ActivityContextType =>
  useContext(ActivityContext);
