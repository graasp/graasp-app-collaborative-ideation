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

  // const { appData, postAppDataAsync, deleteAppDataAsync } = useAppDataContext();
  // const { postVoteForAction, postRemoveVoteAction } = useActions();

  // const allVotes = useMemo(
  //   () =>
  //     appData.filter(({ type }) => type === AppDataTypes.Vote) as
  //       | VoteAppData[]
  //       | [],
  //   [appData],
  // );

  // const votes = useMemo(
  //   () =>
  //     allVotes?.filter(({ creator }) => creator?.id === accountId) as
  //       | VoteAppData[]
  //       | [],
  //   [allVotes, accountId],
  // );

  // const nbrOfVotes = votes?.length ?? 0;

  // const voteFor = useCallback(
  //   async (responseId: string): Promise<void> => {
  //     if (availableVotes > 0) {
  //       const newAppData: Pick<VoteAppData, 'type' | 'visibility' | 'data'> = {
  //         type: AppDataTypes.Vote,
  //         visibility: AppDataVisibility.Item,
  //         data: {
  //           responseRef: responseId,
  //         },
  //       };
  //       postAppDataAsync(newAppData).then((recordedAppData) => {
  //         if (recordedAppData) {
  //           postVoteForAction(recordedAppData as VoteAppData);
  //         }
  //       });
  //     }
  //   },
  //   [availableVotes, postAppDataAsync, postVoteForAction],
  // );

  // const findVoteFor = useCallback(
  //   (responseId: string): VoteAppData | undefined =>
  //     votes?.find(({ data }) => data.responseRef === responseId),
  //   [votes],
  // );

  // const removeVoteFor = useCallback(
  //   async (responseId: string): Promise<void> => {
  //     const voteToRemove = findVoteFor(responseId);
  //     if (voteToRemove) {
  //       deleteAppDataAsync({ id: voteToRemove?.id }).then(() => {
  //         postRemoveVoteAction(voteToRemove);
  //       });
  //     } else {
  //       throw Error(`Response with id ${responseId} not found.`);
  //     }
  //   },
  //   [deleteAppDataAsync, findVoteFor, postRemoveVoteAction],
  // );

  // const checkIfHasVote = useCallback(
  //   (responseId: string) => typeof findVoteFor(responseId) !== 'undefined',
  //   [findVoteFor],
  // );

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
