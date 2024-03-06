import { useMemo } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, Member } from '@graasp/sdk';

import cloneDeep from 'lodash.clonedeep';
import shuffle from 'lodash.shuffle';

import {
  AppDataTypes,
  ResponseAppData,
  ResponseData,
  ResponsesSetAppData,
} from '@/config/appDataTypes';
import { AssistantId } from '@/interfaces/assistant';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { appDataArrayToMap } from '@/utils/utils';

import useActions from './useActions';
import { UseParticipantsValue } from './useParticipants';
import {
  filterBotResponses,
  getResponses,
  getRoundResponses,
  isOwnResponse,
  recursivelyCreateAllOpenSets,
  recursivelyCreateAllPartiallyBlindSets,
} from './utils/responses';

export interface UseResponsesValues {
  allResponses: ResponseAppData[];
  myResponses: ResponseAppData[];
  allResponsesSets: ResponsesSetAppData[];
  myResponsesSets: ResponsesSetAppData[];
  assistantsResponsesSets: ResponsesSetAppData[];
  availableResponses: ResponseAppData[];
  // availableResponsesWithoutOwn: ResponseAppData[];
  postResponse: (
    data: ResponseData,
    invalidateAll?: boolean,
  ) => Promise<ResponseAppData> | undefined;
  createAllResponsesSet: () => Promise<void>;
  deleteAllResponsesSet: () => Promise<void>;
  deleteResponse: (id: ResponseAppData['id']) => Promise<void>;
}

interface UseResponsesProps {
  participants: UseParticipantsValue;
  round: number;
}

const useResponses = ({
  participants,
  round,
}: UseResponsesProps): UseResponsesValues => {
  const {
    appData,
    postAppDataAsync,
    deleteAppData,
    deleteAppDataAsync,
    invalidateAppData,
    refetchAppData,
  } = useAppDataContext();
  const { memberId } = useLocalContext();
  const { orchestrator, activity } = useSettings();
  const { postSubmitNewResponseAction, postDeleteResponseAction } =
    useActions();
  const {
    mode: visibilityMode,
    numberOfResponsesPerSet,
    numberOfBotResponsesPerSet,
    exclusiveResponseDistribution,
  } = activity;

  const myResponses = useMemo((): ResponseAppData[] => {
    const responses = appData.filter(
      ({ creator, type }) =>
        creator?.id === memberId && type === AppDataTypes.Response,
    ) as ResponseAppData[];
    return responses;
  }, [appData, memberId]);

  const allResponses = useMemo(
    (): ResponseAppData[] => getResponses(appData),
    [appData],
  );

  const roundResponses = useMemo(
    (): ResponseAppData[] => getRoundResponses(allResponses, round),
    [allResponses, round],
  );

  const allResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = appData.filter(
      ({ creator, type }) =>
        creator?.id === orchestrator.id && type === AppDataTypes.ResponsesSet,
    ) as ResponsesSetAppData[];
    return responses;
  }, [appData, orchestrator]);

  const myResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = appData.filter(
      ({ creator, type, member, data }) =>
        creator?.id === orchestrator.id &&
        type === AppDataTypes.ResponsesSet &&
        member.id === memberId &&
        typeof data?.assistant === 'undefined',
    ) as ResponsesSetAppData[];
    return responses;
  }, [appData, memberId, orchestrator]);

  const assistantsResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = appData.filter(
      ({ creator, type, data }) =>
        creator?.id === orchestrator.id &&
        type === AppDataTypes.ResponsesSet &&
        typeof data?.assistant !== 'undefined',
    ) as ResponsesSetAppData[];
    return responses;
  }, [appData, orchestrator]);

  const availableResponses = useMemo((): ResponseAppData[] => {
    const responses = getResponses(appData).filter((r) => {
      const { id } = r;
      let okay = false;
      // Checks that the response has been assigned to the user.
      myResponsesSets.forEach((s) => {
        if (s.data.responses.includes(id)) {
          okay = true;
        }
      });
      return okay || isOwnResponse(r as ResponseAppData, memberId);
    }) as ResponseAppData[];
    return responses;
  }, [appData, memberId, myResponsesSets]);

  // const availableResponsesWithoutOwn = useMemo((): ResponseAppData[] => {
  //   const responses = appData.filter(({ type, id, creator, data }) => {
  //     if (type === AppDataTypes.Response) {
  //       if (
  //         creator?.id === memberId &&
  //         typeof data?.assistantId === 'undefined'
  //       ) {
  //         return false;
  //       }
  //       let okay = true;
  //       // Checks that the response has been assigned to the user.
  //       myResponsesSets.forEach((s) => {
  //         if (!s.data.responses.includes(id)) {
  //           okay = false;
  //         }
  //       });
  //       if (!okay) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }) as ResponseAppData[];
  //   return responses;
  // }, [appData, memberId, myResponsesSets]);

  const postResponse = (
    data: ResponseData,
    invalidateAll: boolean = false,
  ): Promise<ResponseAppData> | undefined =>
    postAppDataAsync({
      type: AppDataTypes.Response,
      visibility: AppDataVisibility.Item,
      data,
    })?.then((postedResponse) => {
      const response = postedResponse as ResponseAppData;
      postSubmitNewResponseAction(response);
      if (invalidateAll) {
        invalidateAppData();
      }
      return response;
    });

  const postResponsesSet = async (
    id: Member['id'] | AssistantId,
    responsesSet: Array<ResponseAppData['id']>,
    forAssistant: boolean = false,
  ): Promise<ResponsesSetAppData> => {
    const payload = {
      data: {
        round,
        responses: responsesSet,
        assistant: forAssistant ? id : undefined,
      },
      memberId: forAssistant ? memberId : id,
      type: AppDataTypes.ResponsesSet,
      visibility: AppDataVisibility.Item,
    };
    const promise = postAppDataAsync(payload) as Promise<ResponsesSetAppData>;
    if (promise) {
      return promise;
    }
    throw Error('Something went wrong with the request.'); // TODO: change
  };

  const createAllResponsesSetWorker = (
    responsePool: ResponseAppData[],
  ): void => {
    let sets: Map<string, ResponseAppData[]>;
    let assistantSets: Map<string, ResponseAppData[]>;
    const participantIterator = participants.members.entries();
    const assistantsIterator = participants.assistants.entries();
    if (visibilityMode === ResponseVisibilityMode.PartiallyBlind) {
      const participantsRepsonses = appDataArrayToMap(
        shuffle(filterBotResponses(responsePool, false)),
      );
      const botResponses = appDataArrayToMap(
        shuffle(filterBotResponses(responsePool, true)),
      );

      const participantRCopy = cloneDeep(participantsRepsonses);
      const botRCopy = cloneDeep(botResponses);

      sets = recursivelyCreateAllPartiallyBlindSets(
        participantIterator,
        participantsRepsonses,
        botResponses,
        numberOfResponsesPerSet,
        numberOfBotResponsesPerSet,
        exclusiveResponseDistribution,
      );
      assistantSets = recursivelyCreateAllPartiallyBlindSets(
        assistantsIterator,
        participantRCopy,
        botRCopy,
        numberOfResponsesPerSet,
        numberOfBotResponsesPerSet,
        exclusiveResponseDistribution,
      );
    } else {
      const responses = appDataArrayToMap(shuffle(roundResponses));
      const responsesCopy = cloneDeep(responses);
      sets = recursivelyCreateAllOpenSets(participantIterator, responses);
      assistantSets = recursivelyCreateAllOpenSets(
        assistantsIterator,
        responsesCopy,
      );
    }
    sets.forEach((responsesSet, participantId) => {
      const responsesSetDataWithId = responsesSet.map(({ id }) => id);
      postResponsesSet(participantId, responsesSetDataWithId);
    });
    assistantSets.forEach((responsesSet, assistantId) => {
      const responsesSetDataWithId = responsesSet.map(({ id }) => id);
      postResponsesSet(assistantId, responsesSetDataWithId, true);
    });
  };

  const createAllResponsesSet = async (): Promise<void> => {
    refetchAppData().then((result) => {
      if (result) {
        const { data, isSuccess } = result;
        if (isSuccess) {
          const responsePool = getRoundResponses(getResponses(data), round);
          createAllResponsesSetWorker(responsePool);
        }
      } else {
        // TODO: Change error message
        throw new Error('Failed to refetch app data.');
      }
    });
  };

  const deleteAllResponsesSet = async (): Promise<void> => {
    allResponsesSets.forEach(({ id }) => {
      deleteAppData({ id });
    });
  };

  const deleteResponse = async (id: ResponseAppData['id']): Promise<void> =>
    deleteAppDataAsync({ id })?.then(() => {
      postDeleteResponseAction(id);
    });

  return {
    availableResponses,
    allResponses,
    myResponses,
    postResponse,
    allResponsesSets,
    myResponsesSets,
    assistantsResponsesSets,
    createAllResponsesSet,
    deleteAllResponsesSet,
    deleteResponse,
    // availableResponsesWithoutOwn,
  };
};

export default useResponses;
