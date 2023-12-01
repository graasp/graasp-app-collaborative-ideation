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
import { extractNResponsesThatDontHaveMemberAsCreator } from '@/utils/responses';
import { appDataArrayToMap } from '@/utils/utils';

import useActivityState from './useActivityState';
import useParticipants from './useParticipants';

interface UseResponsesValues {
  myResponses: ResponseAppData[];
  myResponsesSets: ResponsesSetAppData[];
  createAllResponsesSet: () => Promise<void>;
}

const useResponses = (): UseResponsesValues => {
  const { appData, postAppDataAsync } = useAppDataContext();
  const { memberId, permission } = useLocalContext();
  const { orchestrator, mode } = useSettings();
  const participants = useParticipants();
  const { numberOfResponsesPerSet, numberOfBotResponsesPerSet } = mode;

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
      shuffle(roundResponses.filter(({ data }) => !data.bot)),
    );
    const botResponses = appDataArrayToMap(
      shuffle(roundResponses.filter(({ data }) => data?.bot)),
    );

    const sets = new Map<string, ResponseAppData[]>();
    const participantIterator = participants.entries();

    const recursivelyCreateAllSets = (
      participantIteratorLocal: IterableIterator<[number, Member]>,
      participantsRepsonsesLocal: Map<string, ResponseAppData>,
      botResponsesLocal: Map<string, ResponseAppData>,
    ): void => {
      const iterRes = participantIteratorLocal.next();
      if (!iterRes.done) {
        const [, participant] = iterRes.value;
        const { id: participantId } = participant;
        const [botResponsesForMember, newBotResponses] =
          extractNResponsesThatDontHaveMemberAsCreator(
            botResponsesLocal,
            numberOfBotResponsesPerSet,
            participantId,
          );
        const [participantsResponsesForMember, newParticipantsResponses] =
          extractNResponsesThatDontHaveMemberAsCreator(
            participantsRepsonsesLocal,
            numberOfResponsesPerSet,
            participantId,
          );

        const mergedResponsesForMember = shuffle(
          participantsResponsesForMember.concat(botResponsesForMember),
        );
        sets.set(memberId, mergedResponsesForMember);
        recursivelyCreateAllSets(
          participantIteratorLocal,
          newParticipantsResponses,
          newBotResponses,
        );
      }
    };

    recursivelyCreateAllSets(
      participantIterator,
      participantsRepsonses,
      botResponses,
    );

    sets.forEach((responsesSet, participantId) => {
      const responsesSetDataWithId = responsesSet.map(({ id, data }) => ({
        id,
        ...data,
      }));
      postResponsesSet(participantId, responsesSetDataWithId);
    });
  };

  return { myResponses, myResponsesSets, createAllResponsesSet };
};

export default useResponses;
