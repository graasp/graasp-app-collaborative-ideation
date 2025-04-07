import { LoroDoc, LoroList } from 'loro-crdt';

import { ResponseData } from '@/interfaces/response';

export const getResponsesList = (doc: LoroDoc): LoroList<ResponseData> =>
  doc.getList('responses') as LoroList<ResponseData>;
