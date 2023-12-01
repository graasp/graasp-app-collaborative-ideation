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
    const [id, response] = responsesIterator.next().value;
    if (response.creator.id !== memberId) {
      toDelete.push(id);
      responsesArray.push(response);
      i += 1;
    }
  }
  toDelete.forEach((id) => responses.delete(id));

  return [responsesArray, responses];
};
