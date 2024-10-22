// import { FC, createContext, useContext, useMemo } from 'react';

// import { INITIAL_STATE } from '@/config/constants';
// import useParticipants, { UseParticipantsValue } from '@/hooks/useParticipants';

// type ActivityContextType = UseActivityStateValues & {
//   participants: UseParticipantsValue;
// };
// const defaultContextValue: ActivityContextType = {
//   round: 0,
//   nextRound: () => undefined,
//   activityState: INITIAL_STATE,
//   resetActivityState: () => undefined,
//   participants: { members: [], assistants: [] },
//   stateWarning: false,
//   changeActivity: () => undefined,
//   playActivity: () => undefined,
//   pauseActivity: () => undefined,
//   updateActivityState: () => undefined,
// };

// const ActivityContext = createContext<ActivityContextType>(defaultContextValue);

// type ActivityContextProps = {
//   children: JSX.Element;
// };

// export const ActivityProvider: FC<ActivityContextProps> = ({ children }) => {
//   console.log('Activity context is rendering');
//   const participants = useParticipants();
//   const activityState = useActivityState();
//   const contextValue = useMemo(
//     () => ({
//       ...activityState,
//       participants,
//     }),
//     [activityState, participants],
//   );
//   return (
//     <ActivityContext.Provider value={contextValue}>
//       {children}
//     </ActivityContext.Provider>
//   );
// };

// export const useActivityContext = (): ActivityContextType =>
//   useContext(ActivityContext);
