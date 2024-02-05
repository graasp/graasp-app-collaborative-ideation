import { useMemo } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, Member, PermissionLevel } from '@graasp/sdk';

import cloneDeep from 'lodash.clonedeep';
import shuffle from 'lodash.shuffle';

import {
  AppDataTypes,
  ResponseAppData,
  ResponseData,
  ResponsesData,
  ResponsesSetAppData,
} from '@/config/appDataTypes';
import { AssistantId } from '@/interfaces/assistant';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { appDataArrayToMap } from '@/utils/utils';

import { UseParticipantsValue } from './useParticipants';
import {
  filterBotResponses,
  recursivelyCreateAllOpenSets,
  recursivelyCreateAllPartiallyBlindSets,
} from './utils/responses';

export interface UseResponsesValues {
  allResponses: ResponseAppData[];
  myResponses: ResponseAppData[];
  allResponsesSets: ResponsesSetAppData[];
  myResponsesSets: ResponsesSetAppData[];
  assistantsResponsesSets: ResponsesSetAppData[];
  postResponse: (
    data: ResponseData,
    invalidateAll?: boolean,
  ) => Promise<ResponseAppData> | undefined;
  createAllResponsesSet: () => Promise<void>;
  deleteAllResponsesSet: () => Promise<void>;
}

interface UseResponsesProps {
  participants: UseParticipantsValue;
  round: number;
}

const useResponses = ({
  participants,
  round,
}: UseResponsesProps): UseResponsesValues => {
  const { appData, postAppDataAsync, deleteAppData, invalidateAppData } =
    useAppDataContext();
  const { memberId, permission } = useLocalContext();
  const { orchestrator, activity } = useSettings();
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

  const allResponses = useMemo((): ResponseAppData[] => {
    const responses = appData.filter(
      ({ type }) => type === AppDataTypes.Response,
    ) as ResponseAppData[];
    return responses;
  }, [appData]);

  const roundResponses = useMemo(
    (): ResponseAppData[] =>
      allResponses.filter(({ data }) => data?.round === round),
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

  const postResponse = (
    data: ResponseData,
    invalidateAll: boolean = false,
  ): Promise<ResponseAppData> | undefined =>
    postAppDataAsync({
      type: AppDataTypes.Response,
      visibility: AppDataVisibility.Member,
      data,
    })?.then((postedIdea) => {
      if (invalidateAll) {
        invalidateAppData();
      }
      return postedIdea as ResponseAppData;
    });

  const postResponsesSet = async (
    id: Member['id'] | AssistantId,
    responsesSet: ResponsesData,
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

  const createAllResponsesSet = async (): Promise<void> => {
    if (permission !== PermissionLevel.Admin) throw Error('You are not admin.');
    let sets: Map<string, ResponseAppData[]>;
    let assistantSets: Map<string, ResponseAppData[]>;
    const participantIterator = participants.members.entries();
    const assistantsIterator = participants.assistants.entries();
    if (visibilityMode === ResponseVisibilityMode.PartiallyBlind) {
      const participantsRepsonses = appDataArrayToMap(
        shuffle(filterBotResponses(roundResponses, false)),
      );
      const botResponses = appDataArrayToMap(
        shuffle(filterBotResponses(roundResponses, true)),
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
      const responsesSetDataWithId = responsesSet.map(({ id, data }) => ({
        id,
        ...data,
      }));
      postResponsesSet(participantId, responsesSetDataWithId);
    });
    assistantSets.forEach((responsesSet, assistantId) => {
      const responsesSetDataWithId = responsesSet.map(({ id, data }) => ({
        id,
        ...data,
      }));
      postResponsesSet(assistantId, responsesSetDataWithId, true);
    });
  };

  const deleteAllResponsesSet = async (): Promise<void> => {
    allResponsesSets.forEach(({ id }) => {
      deleteAppData({ id });
    });
  };

  return {
    allResponses,
    myResponses,
    postResponse,
    allResponsesSets,
    myResponsesSets,
    assistantsResponsesSets,
    createAllResponsesSet,
    deleteAllResponsesSet,
  };
};

export default useResponses;
