import { useMemo } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, Member, PermissionLevel } from '@graasp/sdk';

import shuffle from 'lodash.shuffle';

import {
  AppDataTypes,
  ResponseAppData,
  ResponsesData,
  ResponsesSetAppData,
} from '@/config/appDataTypes';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { appDataArrayToMap } from '@/utils/utils';

import useActivityState from './useActivityState';
import useParticipants from './useParticipants';
import {
  filterBotResponses,
  recursivelyCreateAllOpenSets,
  recursivelyCreateAllPartiallyBlindSets,
} from './utils/responses';

interface UseResponsesValues {
  allResponses: ResponseAppData[];
  myResponses: ResponseAppData[];
  allResponsesSets: ResponsesSetAppData[];
  myResponsesSets: ResponsesSetAppData[];
  createAllResponsesSet: () => Promise<void>;
  deleteAllResponsesSet: () => Promise<void>;
}

const useResponses = (): UseResponsesValues => {
  const { appData, postAppDataAsync, deleteAppData } = useAppDataContext();
  const { memberId, permission } = useLocalContext();
  const { orchestrator, mode } = useSettings();
  const participants = useParticipants();
  const {
    mode: visibilityMode,
    numberOfResponsesPerSet,
    numberOfBotResponsesPerSet,
    exclusiveResponseDistribution,
  } = mode;

  const myResponses = useMemo((): ResponseAppData[] => {
    const responses = appData.filter(
      ({ creator, type }) =>
        creator?.id === memberId && type === AppDataTypes.Response,
    ) as ResponseAppData[];
    return responses;
  }, [appData, memberId]);

  const { round } = useActivityState();

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
      ({ creator, type, member }) =>
        creator?.id === orchestrator.id &&
        type === AppDataTypes.ResponsesSet &&
        member.id === memberId,
    ) as ResponsesSetAppData[];
    return responses;
  }, [appData, memberId, orchestrator]);

  const postResponsesSet = async (
    member: Member['id'],
    responsesSet: ResponsesData,
  ): Promise<ResponsesSetAppData> => {
    const payload = {
      data: {
        round,
        responses: responsesSet,
      },
      member: { id: member },
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
    const participantIterator = participants.entries();
    if (visibilityMode === ResponseVisibilityMode.PartiallyBlind) {
      const participantsRepsonses = appDataArrayToMap(
        shuffle(filterBotResponses(roundResponses, false)),
      );
      const botResponses = appDataArrayToMap(
        shuffle(filterBotResponses(roundResponses, true)),
      );

      sets = recursivelyCreateAllPartiallyBlindSets(
        participantIterator,
        participantsRepsonses,
        botResponses,
        numberOfResponsesPerSet,
        numberOfBotResponsesPerSet,
        exclusiveResponseDistribution,
      );
    } else {
      const responses = appDataArrayToMap(shuffle(roundResponses));
      sets = recursivelyCreateAllOpenSets(participantIterator, responses);
    }
    sets.forEach((responsesSet, participantId) => {
      const responsesSetDataWithId = responsesSet.map(({ id, data }) => ({
        id,
        ...data,
      }));
      postResponsesSet(participantId, responsesSetDataWithId);
    });
  };

  const deleteAllResponsesSet = async (): Promise<void> => {
    myResponsesSets.forEach(({ id }) => {
      deleteAppData({ id });
    });
  };

  return {
    allResponses,
    myResponses,
    allResponsesSets,
    myResponsesSets,
    createAllResponsesSet,
    deleteAllResponsesSet,
  };
};

export default useResponses;
