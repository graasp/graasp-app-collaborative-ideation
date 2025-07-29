import { LoroDoc, LoroList } from 'loro-crdt';

import { ResponseData } from '@/interfaces/response';

export const getResponsesList = (doc: LoroDoc): LoroList<ResponseData> =>
  doc.getList('responses') as LoroList<ResponseData>;

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
}
