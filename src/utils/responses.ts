import { Member } from '@graasp/sdk';

import { ResponseAppData } from '@/config/appDataTypes';

export const extractNResponsesThatDontHaveMemberAsCreator = (
  responses: Map<string, ResponseAppData>,
  n: number,
  memberId: Member['id'],
): [ResponseAppData[], Map<string, ResponseAppData>] => {
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
  const checkDeletion = toDelete.map((id) => responses.delete(id));
  if (!checkDeletion.every(Boolean)) {
    throw new Error('Problem in deleting elements from the map.');
  }

  return [responsesArray, responses];
};
