import { FC, createContext, useCallback, useContext, useMemo } from 'react';

import { EvaluationParameters } from '@/interfaces/evaluation';
import { AppDataTypes, VoteAppData } from '@/config/appDataTypes';
import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';
import { useAppDataContext } from './AppDataContext';

type VoteContextType = {
  allVotes: VoteAppData[];
  maxNumberOfVotes: number;
  availableVotes: number;
  voteFor: (responseId: string) => void;
  removeVoteFor: (responseId: string) => void;
  checkIfHasVote: (responseId: string) => boolean;
};
const defaultContextValue: VoteContextType = {
  allVotes: [],
  maxNumberOfVotes: 0,
  availableVotes: 0,
  voteFor: () => null,
  removeVoteFor: () => null,
  checkIfHasVote: () => false,
};

const VoteContext = createContext<VoteContextType>(defaultContextValue);

type VoteContextProps = {
  evaluationParameters?: EvaluationParameters;
  children: JSX.Element;
};

export const VoteProvider: FC<VoteContextProps> = ({
  evaluationParameters,
  children,
}) => {
  const { accountId } = useLocalContext();

  const maxNumberOfVotes = useMemo(
    () => evaluationParameters?.maxNumberOfVotes ?? 0,
    [evaluationParameters],
  );

  const { appData, postAppData, deleteAppData } = useAppDataContext();

  const allVotes = useMemo(
    () =>
      appData.filter(({ type }) => type === AppDataTypes.Vote) as
        | VoteAppData[]
        | [],
    [appData],
  );

  const votes = useMemo(
    () =>
      allVotes?.filter(({ creator }) => creator?.id === accountId) as
        | VoteAppData[]
        | [],
    [allVotes, accountId],
  );

  const nbrOfVotes = votes?.length ?? 0;
  const availableVotes = Math.max(maxNumberOfVotes - nbrOfVotes, 0);

  const voteFor = useCallback(
    async (responseId: string): Promise<void> => {
      if (availableVotes > 0) {
        const newAppData: Pick<VoteAppData, 'type' | 'visibility' | 'data'> = {
          type: AppDataTypes.Vote,
          visibility: AppDataVisibility.Item,
          data: {
            responseRef: responseId,
          },
        };
        postAppData(newAppData);
      }
    },
    [availableVotes, postAppData],
  );

  const findVoteFor = useCallback(
    (responseId: string): VoteAppData | undefined =>
      votes?.find(({ data }) => data.responseRef === responseId),
    [votes],
  );

  const removeVoteFor = useCallback(
    async (responseId: string): Promise<void> => {
      const voteToRemove = findVoteFor(responseId);
      if (voteToRemove) {
        deleteAppData({ id: voteToRemove?.id });
      } else {
        throw Error(`Response with id ${responseId} not found.`);
      }
    },
    [deleteAppData, findVoteFor],
  );

  const checkIfHasVote = useCallback(
    (responseId: string) => typeof findVoteFor(responseId) !== 'undefined',
    [findVoteFor],
  );

  const contextValue = useMemo(
    () => ({
      allVotes,
      maxNumberOfVotes,
      availableVotes,
      voteFor,
      removeVoteFor,
      checkIfHasVote,
    }),
    [
      allVotes,
      availableVotes,
      checkIfHasVote,
      maxNumberOfVotes,
      removeVoteFor,
      voteFor,
    ],
  );
  return (
    <VoteContext.Provider value={contextValue}>{children}</VoteContext.Provider>
  );
};

export const useVoteContext = (): VoteContextType => useContext(VoteContext);
