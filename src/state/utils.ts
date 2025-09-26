import { LoroDoc, LoroList } from 'loro-crdt';

import { ResponseData } from '@/interfaces/response';

import { THREADS_LORO_KEY } from './keys';
import { LoroThread } from './loro_types';

export const getResponsesList = (doc: LoroDoc): LoroList<ResponseData> =>
  doc.getList('responses') as LoroList<ResponseData>;

export const getThreadsList = (doc: LoroDoc): LoroList<LoroThread> =>
  doc.getList(THREADS_LORO_KEY) as LoroList<LoroThread>;

export const getThreadById = (
  threads: LoroList<LoroThread>,
  id: string,
): LoroThread => {
  const index = threads.toArray().findIndex((t) => t.get('id') === id);
  if (index > -1) {
    return threads.get(index);
  }
  throw new Error(`Thread with id ${id} not found`);
};

export const toWebSocketUrl = (httpUrl: string): URL => {
  const url = new URL(httpUrl);

  if (url.protocol === 'http:') {
    url.protocol = 'ws:';
  } else if (url.protocol === 'https:') {
    url.protocol = 'wss:';
  } else {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }

  return url;
};
