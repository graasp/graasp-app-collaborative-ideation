import { FC, JSX, createContext, useContext, useMemo } from 'react';

import { EvaluationParameters } from '@/interfaces/evaluation';
import { useThreadsContext } from '@/state/ThreadsContext';
import useParticipants from '@/state/useParticipants';

type VoteContextType = {
  maxNumberOfVotes: number;
  availableVotes: number;
};
const defaultContextValue: VoteContextType = {
  availableVotes: 0,
  maxNumberOfVotes: 0,
};

const VoteContext = createContext<VoteContextType>(defaultContextValue);

type VoteContextProps = {
  evaluationParameters?: EvaluationParameters;
  children: JSX.Element;
};

// TODO: Reimplement actions.
export const VoteProvider: FC<VoteContextProps> = ({
  evaluationParameters,
  children,
}) => {
  const { me } = useParticipants();

  const maxNumberOfVotes = useMemo(
    () => evaluationParameters?.maxNumberOfVotes ?? 0,
    [evaluationParameters],
  );

  const { allThreads } = useThreadsContext();

  const nbrOfVotes = useMemo(
    () =>
      allThreads
        .map((t) =>
          t.responses.map((r) => {
            const { evaluation } = r;
            if (evaluation && 'votes' in evaluation) {
              return evaluation.votes ?? [];
            }
            return [];
          }),
        )
        .flat(2)
        .filter((v) => v === me.id).length,
    [allThreads, me],
  );

  const availableVotes = Math.max(maxNumberOfVotes - nbrOfVotes, 0);

  const contextValue = useMemo(
    () => ({
      maxNumberOfVotes,
      availableVotes,
    }),
    [availableVotes, maxNumberOfVotes],
  );
  return (
    <VoteContext.Provider value={contextValue}>{children}</VoteContext.Provider>
  );
};

export const useVoteContext = (): VoteContextType => useContext(VoteContext);
