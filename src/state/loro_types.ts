import { LoroList, LoroMap } from 'loro-crdt';

import { ResponseData } from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';

export type LoroThread = LoroMap<
  {
    [K in keyof Thread]: Thread[K];
  } & {
    responses: LoroList<ResponseData>;
  }
>;
