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

export const recursivelyCreateAllSets = (
  participantIteratorLocal: IterableIterator<[number, Member]>,
  participantsRepsonsesLocal: Map<string, ResponseAppData>,
  botResponsesLocal: Map<string, ResponseAppData>,
  numberOfResponsesPerSet: number,
  numberOfBotResponsesPerSet: number,
  exclusiveResponseDistribution = true,
): Map<string, ResponseAppData[]> => {
  const iterRes = participantIteratorLocal.next();
  if (!iterRes.done) {
    const [, participant] = iterRes.value;
    console.log('Preparing for: ', participant);
    console.log('With responses:', participantsRepsonsesLocal);
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
    console.log('Bot responses: ', botResponsesForMember);
    console.log('Participants responses:', participantsResponsesForMember);

    const mergedResponsesForMember = shuffle(
      participantsResponsesForMember.concat(botResponsesForMember),
    );
    return new Map([
      [participantId, mergedResponsesForMember],
      ...recursivelyCreateAllSets(
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

export const filterBotResponses = (
  responses: ResponseAppData[],
  bot: boolean = false,
): ResponseAppData[] =>
  responses.filter(({ data }) => (bot ? data.bot : !data?.bot));

// export const transformMapOfResponseAppDataToResponseSets = (
//   mapOfResponsesAppData: Map<string, ResponseAppData[]>,
// ): { id: ResponsesSetAppData['id']; data: ResponsesSetAppData['data'] } => {
//   mapOfResponsesAppData.forEach((responsesSet, participantId) => {
//     const responsesSetDataWithId = responsesSet.map(({ id, data }) => ({
//       id,
//       ...data,
//     }));
//   });
// };
