import { Member } from '@graasp/sdk';

import shuffle from 'lodash.shuffle';

import { ResponseAppData } from '@/config/appDataTypes';

export const extractNResponsesThatDontHaveMemberAsCreator = (
  responses: Map<string, ResponseAppData>,
  n: number,
  memberId: Member['id'],
  keepExtracted = false,
): [ResponseAppData[], Map<string, ResponseAppData>] => {
  // console.log('Responses to extract: ', responses);
  // console.log('n: ', n);
  // console.log('memberId: ', memberId);
  const responsesIterator = responses.entries();
  const toDelete: string[] = [];
  const responsesArray = [];
  for (let i = 0; i < n; ) {
    const iterResult = responsesIterator.next();
    if (iterResult.done) {
      break;
    } else {
      const [id, response] = iterResult.value;
      if (response.creator?.id !== memberId) {
        toDelete.push(id);
        responsesArray.push(response);
        i += 1;
      }
    }
  }
  if (!keepExtracted) {
    const checkDeletion = toDelete.map((id) => responses.delete(id));
    if (!checkDeletion.every(Boolean)) {
      throw new Error('Problem in deleting elements from the map.');
    }
  }

  return [responsesArray, responses];
};

export const recursivelyCreateAllPartiallyBlindSets = <
  T extends { id: string },
>(
  participantIteratorLocal: IterableIterator<[number, T]>,
  participantsRepsonsesLocal: Map<string, ResponseAppData>,
  botResponsesLocal: Map<string, ResponseAppData>,
  numberOfResponsesPerSet: number,
  numberOfBotResponsesPerSet: number,
  exclusiveResponseDistribution = true,
): Map<string, ResponseAppData[]> => {
  const iterRes = participantIteratorLocal.next();
  if (!iterRes.done) {
    const [, participant] = iterRes.value;
    const { id: participantId } = participant;
    const [botResponsesForMember, newBotResponses] =
      extractNResponsesThatDontHaveMemberAsCreator(
        botResponsesLocal,
        numberOfBotResponsesPerSet,
        participantId,
        !exclusiveResponseDistribution,
      );
    const [participantsResponsesForMember, newParticipantsResponses] =
      extractNResponsesThatDontHaveMemberAsCreator(
        participantsRepsonsesLocal,
        numberOfResponsesPerSet,
        participantId,
        !exclusiveResponseDistribution,
      );

    const mergedResponsesForMember = shuffle(
      participantsResponsesForMember.concat(botResponsesForMember),
    );
    return new Map([
      [participantId, mergedResponsesForMember],
      ...recursivelyCreateAllPartiallyBlindSets(
        participantIteratorLocal,
        newParticipantsResponses,
        newBotResponses,
        numberOfResponsesPerSet,
        numberOfBotResponsesPerSet,
        exclusiveResponseDistribution,
      ),
    ]);
  }
  return new Map();
};

export const recursivelyCreateAllOpenSets = <T extends { id: string }>(
  participantIteratorLocal: IterableIterator<[number, T]>,
  responsesLocal: Map<string, ResponseAppData>,
): Map<string, ResponseAppData[]> => {
  const iterRes = participantIteratorLocal.next();
  if (!iterRes.done) {
    const [, participant] = iterRes.value;
    const { id: participantId } = participant;
    const r = Array.from(responsesLocal.values());
    return new Map([
      [participantId, r],
      ...recursivelyCreateAllOpenSets(participantIteratorLocal, responsesLocal),
    ]);
  }
  return new Map();
};

export const filterBotResponses = (
  responses: ResponseAppData[],
  bot: boolean = false,
): ResponseAppData[] =>
  responses.filter(({ data }) => (bot ? data.bot : !data?.bot));
