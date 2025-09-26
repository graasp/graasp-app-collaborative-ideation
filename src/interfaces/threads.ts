import { Author } from './author';
import { Evaluations } from './evaluation';
import { ResponseData } from './response';

export interface Thread {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  responses: ResponseData[];
  creator: Author;
  evaluations: Evaluations;
}

export type Threads = Thread[];
