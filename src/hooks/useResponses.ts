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
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { appDataArrayToMap } from '@/utils/utils';

import useActivityState from './useActivityState';
import useParticipants from './useParticipants';
import {
  filterBotResponses,
  recursivelyCreateAllSets,
} from './utils/responses';

interface UseResponsesValues {
  myResponses: ResponseAppData[];
  myResponsesSets: ResponsesSetAppData[];
  createAllResponsesSet: () => Promise<void>;
  deleteAllResponsesSet: () => Promise<void>;
}

const useResponses = (): UseResponsesValues => {
  const { appData, postAppDataAsync, deleteAppData } = useAppDataContext();
  const { memberId, permission } = useLocalContext();
  const { orchestrator, mode } = useSettings();
  const participants = useParticipants();
  console.log('Participants: ', participants);
  const {
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

  const myResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = appData.filter(
      ({ creator, type, member }) =>
        creator?.id === orchestrator.id &&
        type === AppDataTypes.ResponsesSet &&
        member.id === memberId,
    ) as ResponsesSetAppData[];
    return responses;
  }, [appData, memberId, orchestrator.id]);

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
    const participantsRepsonses = appDataArrayToMap(
      shuffle(filterBotResponses(roundResponses, false)),
    );
    console.log('🏡 Participant responses: ', participantsRepsonses);
    const botResponses = appDataArrayToMap(
      shuffle(filterBotResponses(roundResponses, true)),
    );
    const participantIterator = participants.entries();

    const sets = recursivelyCreateAllSets(
      participantIterator,
      participantsRepsonses,
      botResponses,
      numberOfResponsesPerSet,
      numberOfBotResponsesPerSet,
      exclusiveResponseDistribution,
    );
    console.log('Sets: ', sets);
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
    myResponses,
    myResponsesSets,
    createAllResponsesSet,
    deleteAllResponsesSet,
  };
};

export default useResponses;
