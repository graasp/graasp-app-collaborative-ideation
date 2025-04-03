import { LoroList } from 'loro-crdt';

import { Author } from '@/interfaces/author';
import {
  InputResponseData,
  ResponseData,
  responseDataFactory,
} from '@/interfaces/response';

import {
  AppStateEventType,
  AppStateWorkerResponse,
} from '../appStateWorkerConfig';

export const postResponse = (
  inputResponse: InputResponseData,
  author: Author,
  responsesList: LoroList,
): AppStateWorkerResponse<ResponseData> => {
  console.debug('Preparing response', inputResponse);
  const response = responseDataFactory(inputResponse, author);
  console.debug('Inserting response', response);
  responsesList.push(response);
  return {
    type: AppStateEventType.POST_RESPONSE,
    isResponse: true,
    data: response,
  };
};
